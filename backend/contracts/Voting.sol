// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.22;

import "./Dao.sol";

contract Voting is Dao {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    // struct Proposals {
    //     uint256 requiredReportsForVerifierPromotion;
    //     uint256 requiredVerificationsForAuthorPromotion;
    //     uint256 timeIntervalForVerifierPromotion;
    //     uint256 timeIntervalForAuthorPromotion;
    // }

    // Proposals[] proposals;
    uint[] winningProposalId;
    uint[] winningProposals;
    uint proposalVoteCount;
    bool exaequo;

    mapping (address => Voter) private voters;

    enum WorkflowStatus {
       RegisteringVoters,
       ProposalsRegistrationStarted,
       ProposalsRegistrationEnded,
       VotingSessionStarted,
       VotingSessionEnded,
       VotesTallied
    }

    // The state variable of the Enum type 
    WorkflowStatus public state;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);


    constructor() Ownable(msg.sender) {
        requiredReportsForVerifierPromotion = 10;
        requiredVerificationsForAuthorPromotion  = 20;
        timeIntervalForVerifierPromotion = 6 * 30 days;
        timeIntervalForAuthorPromotion = 12 * 30 days;
    }

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // DAO can change some variables by voting of majority of at least half of the community members after that at least 500 members subscribed.

    function changeTotalReportNumber() internal onlyAuthor onlyVerifier returns(uint256){
        uint256 requestNumber;
        requestNumber ++;
        if (authors.length + verifiers.length > 500 && requestNumber > authors.length + verifiers.length / 2) {
            startVoting(requiredReportsForVerifierPromotion);
        }
    }

    // function changeTotalVerificationNumber(uint256 newThreshold) internal onlyAuthor onlyVerifier {
    //     requiredVerificationsForAuthorPromotion = newThreshold;
    // }
    // function changeTimeIntervalForVerifierPromotion (uint256 newInterval) internal onlyAuthor onlyVerifier {
    //     timeIntervalForVerifierPromotion  = newInterval;
    // }

    // function changeTimeIntervalForAuthorPromotion(uint256  newInterval) internal onlyAuthor onlyVerifier {
    //     timeIntervalForAuthorPromotion =  newInterval;
    // }

    function startVoting(uint _variableToChange) internal returns (uint256){
        variableToChange = _variableToChange;
        startRegisteringVoters();
        return variableToChange;
    }


    // Admin registers voter adresses
    function voterRegisters() external onlyVoters {
        require(state == WorkflowStatus.RegisteringVoters, "Voter registering is not permissed now");
        require(voters[msg.sender].isRegistered, "Voter already added");
        require(msg.sender != address(0), "Address cannot be the zero address");
        
        voters[msg.sender].isRegistered = true;
        emit VoterRegistered(msg.sender);
    }

    // A voter can be blacklisted only by DAO majority decision 
    function banVoter(address _addr) external onlyDao {
        require(state == WorkflowStatus.RegisteringVoters, "Voter registering is not permissed now");
        require(!voters[msg.sender].isRegistered, "No voter existe for ths address");
        voters[msg.sender].isRegistered = false;
        emit VoterBanned(_addr);
    }

    // Admin authorizes whitelisted electors to register one or several proposals during the registration session
    function registerProposal(uint _num) external onlyVoters {
        require(state == WorkflowStatus.ProposalsRegistrationStarted, "Proposals' registration session is not open");
        
        // ::::::::::::::::::::::::::::::::::::::::::::::::J'EN SUIS LA
     Proposals memory newProposals;
        newProposals.variableToChange = _num;
        proposals.push(newProposal);
        // ::::::::::::::::::::::::::::::::::::::::::::::::J'EN SUIS LA
        

        emit ProposalRegistered(proposalsArray.length-1); 
    }

   
   function changeRequiredReportsForVerifierPromotion(uint256 _num) {
    proposal == _num;
   }

   function changeRequiredReportsForVerifierPromotion(uint256 _num) {
    requiredReportsForVerifierPromotion == _num;
   }

    // GETTERS

    function getProposals() external view onlyVoters returns (Proposal[] memory) {
        require(state != WorkflowStatus.ProposalsRegistrationStarted, "Proposals' registration session is not finished");
        require(proposals.length > 0, "No proposals registered yet");
        return proposals;
    }

    function getVoters() external view onlyVoters returns (Proposal[] memory) {
        require(state != WorkflowStatus.RegisteringVoters, "Voters' registration session is not finished yet");
        require(voters.length > 0, "No voters registered yet");
        return voters;
    }

    // One elector can vote for one proposal

    function vote(uint _proposalId) external onlyVoters {
        require(!voters[msg.sender].hasVoted, "You've already voted");

        voters[msg.sender].votedProposalId = _proposalId;

        voters[msg.sender].hasVoted = true;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }


    // Vote tally process to declare the winning proposal or proposals if ex aeqo 

     function tallyVote() external onlyDao {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        uint highestCount;
        
        for (uint i = 0; i < proposals.length; i++) {
            if (proposals[i].voteCount > highestCount) {
                highestCount = proposals[i].voteCount;
            }
        }
        
        for (uint j = 0; j < proposals.length; j++) {
            if (proposals[j].voteCount == highestCount) {
                exaequo = true;
                winningProposalsID.push(j);
            }
        }

        if(exaequo) {
            // refait les elections 
        }

        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);

    }



    function randomDraw() external onlyOwner returns(uint){
        require(exaequo, "You can access to this function only in case of ex aequo");
        require(state == WorkflowStatus.VotesTallied, "Voting session is still open or votes are still not counted");

        bytes32 randomHash = keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), winners.length));
        uint randomNum = uint(randomHash) % proposals.length;
        winningProposalId = winners[randomNum];
        exaequo = false;
        return winningProposalId;
    }


    // Voters can verify details about the winning proposal
    function showWinningProposal() external view onlyVoters returns (uint, string memory, uint, address) {
        require(state == WorkflowStatus.VotesTallied, "Voting session is still open or votes are still not counted");
        require(!exaequo, "Ex aequo. Admin should trigger random draw function before showing the winning proposal");

        address winnerAddress = proposals[winningProposalId].proposer;
        string memory winnerProposal = proposals[winningProposalId].description;
        uint winnerProposalVoteCount = proposals[winningProposalId].voteCount;

        return (winningProposalId, winnerProposal, winnerProposalVoteCount, winnerAddress);
    }

    // Voters can see who voted for which proposal
    function whoVotedForWhichProposal(address _addr) external view onlyVoters returns(uint) {
        require(state == WorkflowStatus.VotesTallied, "Voting session is still open or votes are still not counted");
        require(whitelist[_addr], "Please enter a whitelisted voter address");

        return voters[_addr].votedProposalId;
    }

 // Admin starts proposal registration session
    function startRegisteringVoters() external onlyOwner {
        require(!state == WorkflowStatus.RegisteringVoters, "Registration session has already started");

        state = WorkflowStatus.RegisteringVoters;

        // event for declaring that the vote has started with registering voters session

        // emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    // Admin starts proposal registration session
    function registerStart() external onlyOwner {
        require(state == WorkflowStatus.RegisteringVoters, "You are not in registration session");

        state = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    // Admin ends proposal registration session
    function registerEnd() external onlyOwner {
        require(proposals.length > 0, "There is no proposal");
        require(state == WorkflowStatus.ProposalsRegistrationStarted, "Proposals' registration is not open");

        state = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }


    // Admin triggers voting session
    function votingStart() external onlyOwner {
        require(state == WorkflowStatus.ProposalsRegistrationEnded, "Proposals' registration session is not finished");
        require(proposals.length > 0, "There is no proposal to vote for");

        state = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    // Admin ends the voting session
    function votingEnd() external onlyOwner {
        require(state == WorkflowStatus.VotingSessionStarted, "Voting session is not open");

        state = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    // ajouter l'automatisation temporelle
     function setWorkflowStatus(uint _num) external checkWorkflowStatus(_num) onlyOwner {
        WorkflowStatus old = workflowStatus;
        workflowStatus = WorkflowStatus(_num);
        emit WorkflowStatusChange(old, workflowStatus);
       } 

}
