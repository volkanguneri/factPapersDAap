// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.22;

import "./Dao.sol";

contract Voting is Dao {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        uint num;
        uint voteCount;
    }

    uint256 variableToChange;
    uint256 public requestNumberRN;
    uint256 public requestNumberVN;
    uint256 public requestNumberIV;
    uint256 public requestNumberIA;
    uint256 public workflowChangeTime;
    uint256[] winningProposalId;
    uint256 winningProposal;
    bool exaequo;

    uint256 public numberOfVoters;
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
    event votingStarted(WorkflowStatus workflowStatus);
    event votingEnded(uint256 _winningProposal);
    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(
        WorkflowStatus previousStatus,
        WorkflowStatus newStatus
    );
    event ProposalRegistered(uint proposalId);
    event Voted(address voter, uint proposalId);
    event VoterBanned(address voter);


    constructor() {}

    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    // DAO can change some variables by voting of majority of at least half of the community members after that at least 500 members subscribed.

    function changeTotalReportNumber() external onlyAuthorOrVerifier returns(uint256){
        require(!alreadyIncrementedRN[msg.sender], "You've already asked for a new min report number for promotion");
        alreadyIncrementedRN[msg.sender] = true;
        requestNumberRN ++;
    }

    function changeTotalVerificationNumber() external onlyAuthorOrVerifier {
        require(!alreadyIncrementedVN[msg.sender], "You've already asked for a new min verification number for promotion");
        alreadyIncrementedVN[msg.sender] = true;
        requestNumberVN ++;
    }
    function changeTimeIntervalForVerifierPromotion () external onlyAuthorOrVerifier {
         require(!alreadyIncrementedIV[msg.sender], "You've already asked for a new time interval for verifier promotion");
        alreadyIncrementedIV[msg.sender] = true;
        requestNumberIV ++;
    }
    

    function changeTimeIntervalForAuthorPromotion() external onlyAuthorOrVerifier {
         require(!alreadyIncrementedIA[msg.sender], "You've already asked for a new time interval for author promotion");
        alreadyIncrementedIA[msg.sender] = true;
        requestNumberIA ++;
    }


    

    function startVoting() external onlyOwner returns (uint256){
        startRegisteringVoters();
    }

    // function reStartVoting(uint _variableToChange, uint values) internal returns (uint256){
    //     variableToChange = _variableToChange;
    //     startRegisteringVoters;
    //     return variableToChange;
    // }


    // function voterRegisters() external onlyOwner {
    //     require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter registering is not permissed now");
    //     require(voters[msg.sender].isRegistered, "Voter already added");
    //     require(msg.sender != address(0), "Address cannot be the zero address");
        
    //     voters[msg.sender].isRegistered = true;
    //     numberOfVoters++;
    //     emit VoterRegistered(msg.sender);
    // }

    function voterRegisters(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter registering is not permissed now");
        require(!voters[_addr].isRegistered, "Voter already added");
        require(_addr != address(0), "Address cannot be the zero address");
        
        voters[_addr].isRegistered = true;
        numberOfVoters++;
        emit VoterRegistered(_addr);
    }

    // function banVoter(address _addr) external {
    //     require(WorkflowStatus == WorkflowStatus.RegisteringVoters, "Voter registering is not permissed now");
    //     require(!voters[msg.sender].isRegistered, "No voter existe for ths address");
    //     voters[msg.sender].isRegistered = false;
    //     numberOfVoters--;
    //     emit VoterBanned(_addr);
    // }

    function registerProposal(uint _num) external onlyVoters {
        require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposals' registration session is not open");
        
        Proposal memory newProposal;
        newProposal.num = _num;
        proposals.push(newProposal);
        
        
        emit ProposalRegistered(proposals.length-1); 
    }

   
   function changeRequiredReportsForVerifierPromotion (uint256 _winningProposal) public {
    variableToChange == _winningProposal;
   }

//    function changeRequiredReportsForVerifierPromotion(uint256 _winningProposal) public {
//     requiredReportsForVerifierPromotion == _winningProposal;
//    }

    // GETTERS

    function getProposals() external view onlyVoters returns (Proposal[] memory) {
        require(workflowStatus != WorkflowStatus.RegisteringProposals, "Proposals' registration session is not finished");
        require(proposals.length > 0, "No proposals registered yet");
        return proposals;
    }

    function getVoter(address _addr) external onlyOwner view returns (Voter memory) {
        require(numberOfVoters > 0, "No voters registered yet");
        return voters[_addr];
    }


    function vote(uint _proposalId) external onlyVoters {

        voters[msg.sender].votedProposalId = _proposalId;

        voters[msg.sender].hasVoted = true;
        proposals[_proposalId].voteCount++;

        emit Voted(msg.sender, _proposalId);
    }


     function tallyVote() public {
       require(workflowStatus == WorkflowStatus.VotingSessionOpen, "Current status is not voting session ended");
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


        // if(!exaequo) {
        //   emit votingEnded(winningProposalId);
        // } else {
        //     // reStartVoting(uint _variableToChange, uint values);
        // }

    }



    // function randomDraw() external onlyOwner returns(uint){
    //     require(exaequo, "You can access to this function only in case of ex aequo");
    //     require(workflowStatus == WorkflowStatus.VotesTallied, "Voting session is still open or votes are still not counted");

    //     bytes32 randomHash = keccak256(abi.encodePacked(block.timestamp, blockhash(block.number - 1), winningProposals.length));
    //     uint randomNum = uint(randomHash) % proposals.length;
    //     winningProposalId = winningProposals[randomNum];
    //     exaequo = false;
    //     return winningProposalId;
    // }


    // function showWinningProposal() external view onlyVoters returns (uint, string memory, uint, address) {
    //     require(workflowStatus == WorkflowStatus.VotesTallied, "Voting session is still open or votes are still not counted");
    //     require(!exaequo, "Ex aequo. Admin should trigger random draw function before showing the winning proposal");

    //     address winnerAddress = proposals[winningProposalId].proposer;
    //     string memory winnerProposal = proposals[winningProposalId].description;
    //     uint winnerProposalVoteCount = proposals[winningProposalId].voteCount;

    //     return (winningProposalId, winnerProposal, winnerProposalVoteCount, winnerAddress);
    // }

    // function whoVotedForWhichProposal(address _addr) external view onlyVoters returns(uint) {
    //     require(workflowStatus == WorkflowStatus.VotesTallied, "Voting session is still open or votes are still not counted");
    //     require(voters[_addr].isRegistered, "Please enter a registered voter address");

    //     return voters[_addr].votedProposalId;
    // }

    function startRegisteringVoters() public onlyOwner {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "Registration session has already started");

        workflowStatus = WorkflowStatus.RegisteringVoters;
        workflowChangeTime = block.timestamp;

        emit votingStarted(WorkflowStatus.RegisteringVoters);
        emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);

        // if (workflowChangeTime >= 7 days) {
        //     proposalRegisterStart();
        // }
    }

    function proposalRegisterStart() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "You are not in registration session");

        workflowStatus = WorkflowStatus.RegisteringProposals;
        workflowChangeTime = block.timestamp;

        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringProposals);

       
    }

  
    function votingStart() public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposals' registration session is not finished");
        require(proposals.length > 0, "There is no proposal to vote for");

        workflowStatus = WorkflowStatus.VotingSessionOpen;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringProposals, WorkflowStatus.VotingSessionOpen);
    }

   

    // ajouter l'automatisation temporelle
     function setWorkflowStatusAutomation(uint _num) external {
        WorkflowStatus old_WorkflowStatus = workflowStatus;
}
}