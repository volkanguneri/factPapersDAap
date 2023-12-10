// SPDX-License-Identifier: GPL-3.0

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

import "./Dao.sol";

pragma solidity ^0.8.22;

error ExaequoNoWinner();
error NoWinner();

contract Voting is Ownable, Dao {

    struct Voter {
        bool isRegistered;
        bool hasProposed;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        uint num;
        uint voteCount;
    }
  
    // Request numbers will be incremented enouphe to trigger a voting
    uint256 public requestNumberRN;
    uint256 public requestNumberVN;
    uint256 public requestNumberIV;
    uint256 public requestNumberIA;

    
    uint256 workflowChangeTime;
    uint256 public winningProposalId;
    uint256 public numberOfVoters;
    uint256 public votingId;

    Proposal public winningProposal;
    Proposal[] public proposals;
    mapping (address => Voter) private voters;

    // Mapping to track if a request has already been incremented
    mapping (address => bool) private alreadyIncrementedRN;
    mapping (address => bool) private alreadyIncrementedVN;
    mapping (address => bool) private alreadyIncrementedIV;
    mapping (address => bool) private alreadyIncrementedIA;

    // Enum defining workflow statuses
    enum WorkflowStatus {
       NeutralStatus,
       RegisteringVoters,
       RegisteringProposals,
       VotingSessionOpen,
       VotesTallied
    }

    // The state variable of the Enum type 
    WorkflowStatus public workflowStatus;

    // Events
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    event votingEnded(uint256 _winningProposal);


    constructor() {
    }
    

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /**
    * @dev Function for the owner to register a voter.
    * @param _addr The address of the voter to be registered.
    */

    function voterRegisters(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter register session is not open or already finished");
        require(!voters[_addr].isRegistered, "Voter already added");
        require(_addr != address(0), "Address cannot be the zero address");
        
        voters[_addr].isRegistered = true;
        numberOfVoters++;
        emit VoterRegistered(_addr);
    }


    /**
     * @dev Function to register proposals.
     * @param _num The number associated with the proposal.
     */

    function registerProposal(uint256 _num) external onlyVoters {
        require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposal registration session is not open or already finished");
        require(!voters[msg.sender].hasProposed, "You've already made a proposal");
        require(proposals.length < 1000, "The maximum proposal amount is reached");
        require(_num != 0, 'Proposal should not be 0');

        voters[msg.sender].hasProposed = true;

        Proposal memory newProposal = Proposal({
        num: _num,
        voteCount: 0
        });

        proposals.push(newProposal);
              
        emit ProposalRegistered(proposals.length-1); 
    }

    // GETTERS

    function getProposals(uint256 _id) public view onlyVoters returns (Proposal memory) {
        require(proposals.length > 0, "No proposals registered yet");
        return proposals[_id];
    }

    function getVoter(address _addr) external view  onlyVoters returns (Voter memory) {
        require(numberOfVoters > 0, "No voters registered yet");
        return voters[_addr];
    }


    /**
     * @dev Function to vote on a proposal.
     * @param _proposalId The ID of the proposal to vote for.
     */
    function vote(uint _proposalId) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionOpen,
            "Voting session havent started yet");
        require(voters[msg.sender].isRegistered, "You are not voter");
        require(!voters[msg.sender].hasVoted, "You have already voted");
        
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _proposalId;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }
    
    /**
     * @dev Function to tally the votes and determine the winning proposal.
     */
     function tallyVote() external onlyOwner {
         require(workflowStatus == WorkflowStatus.VotingSessionOpen, "Voting session should be open before talling votes");

         uint _winningProposalId;
         bool exaequo = false;
         
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > proposals[_winningProposalId].voteCount) {
            _winningProposalId = i;

            exaequo = false;

        } else if (proposals[i].voteCount == proposals[_winningProposalId].voteCount && proposals[_winningProposalId].voteCount > 0) {
            exaequo = true;
        }
        }
        if (exaequo) {
            //  startRevoting(proposals[_winningProposalId].voteCount);
            revert ExaequoNoWinner();
        } else {
             winningProposalId = _winningProposalId;
            //  _changeStatus(WorkflowStatus.VotesTallied);
        }

        // Reinitialize the voting process
         // Reinitialize the voting process
    // voters = new mapping(address => Voter)();
    // proposals = new Proposal[](0);

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionOpen, WorkflowStatus.VotesTallied);
    }


   
    /**
    * @dev Start the process of registering voters. Only the owner can initiate this process.
    * @notice This function transitions the workflow status from NeutralStatus to RegisteringVoters.
    */
    function startRegisteringVoters() public onlyOwner {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "Registration session has already started");
        require(requestNumberRN > (numberOfAuthors + numberOfVerifiers) / 2, "The request number should be more than the half of the total of author et verifier numbers" );

        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);
    }

    /**
    * @dev Start the process of registering proposals. Only the owner can initiate this process.
    * @notice This function transitions the workflow status from RegisteringVoters to RegisteringProposals.
    */
    function startProposalRegister() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "You are not in registration session");

        workflowStatus = WorkflowStatus.RegisteringProposals;
        workflowChangeTime = block.timestamp;

        // Genesis proposal for blank votes
        Proposal memory newProposal;
        newProposal.num = 0;
        proposals.push(newProposal);

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringProposals);
    }

    /**
    * @dev Start the voting session. Only the owner can initiate this process.
    * @notice This function transitions the workflow status from RegisteringProposals to VotingSessionOpen.
    */
     function startVotingSession() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposals' registration session is not finished");
        require(proposals.length > 0, "There is no proposal to vote for");

        workflowStatus = WorkflowStatus.VotingSessionOpen;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringProposals, WorkflowStatus.VotingSessionOpen);
    }

    /**
    * @dev Change the total report number. Only authors or verifiers can request this change.
    * @notice This function increments the request number for a new minimum report number required for promotion.
    * @notice The workflow status must be in NeutralStatus, and the requester must not have already made this request.
    */
    function changeTotalReportNumber() external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(!alreadyIncrementedRN[msg.sender], "You've already asked for a new min report number for promotion");
        alreadyIncrementedRN[msg.sender] = true;
        requestNumberRN ++;
    }


    /**
    * @dev Change the total verification number. Only authors or verifiers can request this change.
    * @notice This function increments the request number for a new minimum verification number required for promotion.
    * @notice The workflow status must be in NeutralStatus, and the requester must not have already made this request.
    */
    function changeTotalVerificationNumber() external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(!alreadyIncrementedVN[msg.sender], "You've already asked for a new min verification number for promotion");
        alreadyIncrementedVN[msg.sender] = true;
        requestNumberVN ++;
    }

    /**
    * @dev Change the time interval for verifier promotion. Only authors or verifiers can request this change.
    * @notice This function increments the request number for a new time interval required for verifier promotion.
    * @notice The workflow status must be in NeutralStatus, and the requester must not have already made this request.
    */
    function changeTimeIntervalForVerifierPromotion () external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(!alreadyIncrementedIV[msg.sender], "You've already asked for a new time interval for verifier promotion");
        alreadyIncrementedIV[msg.sender] = true;
        requestNumberIV ++;
    }
    
    /**
    * @dev Change the time interval for author promotion. Only authors or verifiers can request this change.
    * @notice This function increments the request number for a new time interval required for author promotion.
    * @notice The workflow status must be in NeutralStatus, and the requester must not have already made this request.
    */
    function changeTimeIntervalForAuthorPromotion() external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(!alreadyIncrementedIA[msg.sender], "You've already asked for a new time interval for author promotion");
        alreadyIncrementedIA[msg.sender] = true;
        requestNumberIA ++;
    }

    /**
    * @dev Start the voting process for changing the required reports for verifier promotion.
    * @notice Only the owner can initiate this voting process.
    * @notice The workflow status must be in NeutralStatus or VotesTallied, and the request number for reports must be more than half of the total of authors and verifiers.
    * @notice This function sets the variableToChange to "requiredReportsForVerifierPromotion" and starts the RegisteringVoters workflow status.
    */
    function startVotingForReportNumber() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(requestNumberRN > (numberOfAuthors + numberOfVerifiers) / 2, "The request number should be more than the half of the total of author et verifier numbers" );
        
        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);
        votingId = 1;
    }
    
    /**
    * @dev Start the voting process for changing the required verifications for author promotion.
    * @notice Only the owner can initiate this voting process.
    * @notice The workflow status must be in NeutralStatus or VotesTallied, and the request number for verifications must be more than half of the total of authors and verifiers.
    * @notice This function sets the variableToChange to "requiredVerificationsForAuthorPromotion" and starts the RegisteringVoters workflow status.
    */
    function startVotingForVerificationNumber() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(requestNumberVN > (numberOfAuthors + numberOfVerifiers) / 2, "The request number should be more than the half of the total of author and verifier numbers" ); 
        
        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);
        votingId = 2;
    }

    /**
    * @dev Start the voting process for changing the time interval for verifier promotion.
    * @notice Only the owner can initiate this voting process.
    * @notice The workflow status must be in NeutralStatus or VotesTallied, and the request number for the time interval must be more than half of the total of authors and verifiers.
    * @notice This function sets the variableToChange to "timeIntervalForVerifierPromotion" and starts the RegisteringVoters workflow status.
    */
    function startVotingForVerifierPromotionInterval() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(requestNumberIV > (numberOfAuthors + numberOfVerifiers) / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        
        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);

        votingId = 3;
    }

    /**
    * @dev Start the voting process for changing the time interval for author promotion.
    * @notice Only the owner can initiate this voting process.
    * @notice The workflow status must be in NeutralStatus or VotesTallied, and the request number for the time interval must be more than half of the total of authors and verifiers.
    * @notice This function sets the variableToChange to "timeIntervalForAuthorPromotion" and starts the RegisteringVoters workflow status.
    */
    function startVotingForAuthorPromotionInterval() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus || workflowStatus == WorkflowStatus.VotesTallied, "There is already a voting going on");
        require(requestNumberIA > (numberOfAuthors + numberOfVerifiers) / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        
        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);

        votingId = 4;
    }
}


