// SPDX-License-Identifier: GPL-3.0

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

import "./Dao.sol";

pragma solidity ^0.8.22;

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

    // Voting newVoting;
    Voting[] public votings;

  

    string variableToChange;
  
    uint256 public requestNumberRN;
    uint256 public requestNumberVN;
    uint256 public requestNumberIV;
    uint256 public requestNumberIA;


    uint256 workflowChangeTime;
    uint256[] winningProposalId;
    uint256 winningProposal;
    uint256 public numberOfVoters;

    bool exaequo;

    Proposal[] proposals;
    mapping (address => Voter) private voters;

    mapping (address => bool) private alreadyIncrementedRN;
    mapping (address => bool) private alreadyIncrementedVN;
    mapping (address => bool) private alreadyIncrementedIV;
    mapping (address => bool) private alreadyIncrementedIA;

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


    constructor(string memory _variableToChange) {
        variableToChange = _variableToChange;
    }
    

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    function voterRegisters(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter registering is not permissed now");
        require(!voters[_addr].isRegistered, "Voter already added");
        require(_addr != address(0), "Address cannot be the zero address");
        
        voters[_addr].isRegistered = true;
        numberOfVoters++;
        emit VoterRegistered(_addr);
    }

    //Registering Proposals
    function registerProposal(uint256 _num) external onlyVoters {
        require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposal registration session is not open");
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

    function getProposals(uint256 _id) external view onlyVoters returns (Proposal memory) {
        require(proposals.length > 0, "No proposals registered yet");
        return proposals[_id];
    }

    function getVoter(address _addr) external onlyOwner view returns (Voter memory) {
        require(numberOfVoters > 0, "No voters registered yet");
        return voters[_addr];
    }


    // Set Vote
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
    // Votes Count
     function tallyVote() public onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionOpen, "Voting session should be open");
        uint highestCount;
        
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > highestCount) {
                highestCount = proposals[i].voteCount;
            }
        }
        
        for (uint j = 0; j < proposals.length; j++) {
            if (proposals[j].voteCount == highestCount) {
                exaequo = true;
                winningProposalId.push(j);
            }
        }

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionOpen, WorkflowStatus.VotesTallied);
    }
   
    // Workflowstatus

    function startRegisteringVoters() public onlyOwner {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "Registration session has already started");

        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);
    }

    function startProposalRegister() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "You are not in registration session");

        workflowStatus = WorkflowStatus.RegisteringProposals;
        workflowChangeTime = block.timestamp;

        // Genesis proposal for blank votes
        Proposal memory newProposal;
        newProposal.num = 1234567890;
        proposals.push(newProposal);

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringProposals);
    }

     function startVotingSession() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposals' registration session is not finished");
        require(proposals.length > 0, "There is no proposal to vote for");

        workflowStatus = WorkflowStatus.VotingSessionOpen;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringProposals, WorkflowStatus.VotingSessionOpen);
    }

    function changeTotalReportNumber() external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(!alreadyIncrementedRN[msg.sender], "You've already asked for a new min report number for promotion");
        alreadyIncrementedRN[msg.sender] = true;
        requestNumberRN ++;
    }

    function changeTotalVerificationNumber() external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(!alreadyIncrementedVN[msg.sender], "You've already asked for a new min verification number for promotion");
        alreadyIncrementedVN[msg.sender] = true;
        requestNumberVN ++;
    }
    function changeTimeIntervalForVerifierPromotion () external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(!alreadyIncrementedIV[msg.sender], "You've already asked for a new time interval for verifier promotion");
        alreadyIncrementedIV[msg.sender] = true;
        requestNumberIV ++;
    }
    
    function changeTimeIntervalForAuthorPromotion() external onlyAuthorOrVerifier {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(!alreadyIncrementedIA[msg.sender], "You've already asked for a new time interval for author promotion");
        alreadyIncrementedIA[msg.sender] = true;
        requestNumberIA ++;
    }


    function startVotingForReportNumber() external onlyOwner {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberRN > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author et verifier numbers" );
        variableToChange = "requiredReportsForVerifierPromotion"; 
        startRegisteringVoters();
    }
    function startVotingForVerificationNumber() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberVN > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        variableToChange = "requiredVerificationsForAuthorPromotion"; 
        startRegisteringVoters();
    }
    function startVotingForVerifierPromotionInterval() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberIV > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        variableToChange = "timeIntervalForVerifierPromotion"; 
        startRegisteringVoters();
    }
    function startVotingForAuthorPromotionInterval() external onlyOwner {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberIA > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        variableToChange = "timeIntervalForAuthorPromotion"; 
        startRegisteringVoters();
    }
}


