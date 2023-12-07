// pragma solidity ^0.8.22;

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// import "./Dao.sol";

// /**
//  * @title Voting
//  * @dev Manages a voting system where users can register, propose, vote, and tallies the votes.
//  *      Inherits from Ownable and Dao for access control and additional functionality.
//  */
// contract Voting is Ownable, Dao {
//     // Struct to represent information about each voter
//     struct Voter {
//         bool isRegistered;
//         bool hasProposed;
//         bool hasVoted;
//         uint votedProposalId;
//     }

//     // Struct to represent information about each proposal
//     struct Proposal {
//         uint num;
//         uint voteCount;
//     }

//     // Array to store winning proposal(s) in case of a tie
//     uint256[] winningProposalId;

//     // Counter for the winning proposal (in case of no tie)
//     uint256 winningProposal;

//     // Counter for the total number of registered voters
//     uint256 public numberOfVoters;

//     // Flag indicating if there's a tie in the voting results
//     bool exaequo;

//     // Array to store all proposals
//     Proposal[] proposals;

//     // Mapping to track voter information using their address
//     mapping (address => Voter) private voters;

//     // Mapping to track whether an address has already requested a change in specific parameters
//     mapping (address => bool) private alreadyIncrementedRN;
//     mapping (address => bool) private alreadyIncrementedVN;
//     mapping (address => bool) private alreadyIncrementedIV;
//     mapping (address => bool) private alreadyIncrementedIA;

//     // Enum representing the workflow status of the voting system
//     enum WorkflowStatus {
//         NeutralStatus,
//         RegisteringVoters,
//         RegisteringProposals,
//         VotingSessionOpen,
//         VotesTallied
//     }

//     // Current status of the workflow
//     WorkflowStatus public workflowStatus;

//     // Events to log important state changes
//     event VoterRegistered(address voterAddress);
//     event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
//     event ProposalRegistered(uint proposalId);
//     event Voted(address voter, uint proposalId);
//     event VotingEnded(uint256 _winningProposal);

//     // Variable that can be changed through voting
//     string variableToChange;

//     // Counter for the total number of requests for a new minimum report number
//     uint256 public requestNumberRN;

//     // Counter for the total number of requests for a new minimum verification number
//     uint256 public requestNumberVN;

//     // Counter for the total number of requests for a new time interval for verifier promotion
//     uint256 public requestNumberIV;

//     // Counter for the total number of requests for a new time interval for author promotion
//     uint256 public requestNumberIA;

//     // Timestamp to track the time of workflow status changes
//     uint256 workflowChangeTime;

//     /**
//      * @dev Constructor to initialize the contract with an initial value for the variable that can be changed.
//      * @param _variableToChange The initial value for the variable that can be changed through voting.
//      */
//     constructor(string memory _variableToChange) {
//         variableToChange = _variableToChange;
//     }

//     // Modifier to restrict access to only registered voters
//     modifier onlyVoters() {
//         require(voters[msg.sender].isRegistered, "You're not a voter");
//         _;
//     }

//     /**
//      * @dev Allows the owner to register a new voter.
//      * @param _addr The address of the voter to be registered.
//      */
//     function voterRegisters(address _addr) external onlyOwner {
//         require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voter registering is not permitted now");
//         require(!voters[_addr].isRegistered, "Voter already added");
//         require(_addr != address(0), "Address cannot be the zero address");
        
//         voters[_addr].isRegistered = true;
//         numberOfVoters++;
//         emit VoterRegistered(_addr);
//     }

//     /**
//      * @dev Allows a registered voter to propose a new vote.
//      * @param _num The proposed vote number.
//      */
//     function registerProposal(uint256 _num) external onlyVoters {
//         require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposal registration session is not open");
//         require(!voters[msg.sender].hasProposed, "You've already made a proposal");
//         require(proposals.length < 1000, "The maximum proposal amount is reached");
//         require(_num != 0, 'Proposal should not be 0');

//         voters[msg.sender].hasProposed = true;

//         Proposal memory newProposal = Proposal({
//             num: _num,
//             voteCount: 0
//         });

//         proposals.push(newProposal);
              
//         emit ProposalRegistered(proposals.length-1); 
//     }

//     /**
//      * @dev Gets the details of a specific proposal.
//      * @param _id The index of the proposal in the array.
//      * @return Proposal details (num, voteCount).
//      */
//     function getProposals(uint256 _id) external view onlyVoters returns (Proposal memory) {
//         require(proposals.length > 0, "No proposals registered yet");
//         return proposals[_id];
//     }

//     /**
//      * @dev Gets the details of a specific voter.
//      * @param _addr The address of the voter.
//      * @return Voter details (isRegistered, hasProposed, hasVoted, votedProposalId).
//      */
//     function getVoter(address _addr) external onlyOwner view returns (Voter memory) {
//         require(numberOfVoters > 0, "No voters registered yet");
//         return voters[_addr];
//     }

//     /**
//      * @dev Allows a registered voter to cast a vote.
//      * @param _proposalId The index of the proposal to vote for.
//      */
//     function vote(uint _proposalId) external onlyVoters {
//         require(workflowStatus == WorkflowStatus.VotingSessionOpen,
//             "Voting session hasn't started yet");
//         require(voters[msg.sender].isRegistered, "You are not a registered voter");
//         require(!voters[msg.sender].hasVoted, "You have already voted");
        
//         voters[msg.sender].hasVoted = true;
//         voters[msg.sender].votedProposalId = _proposalId;
//         proposals[_proposalId].voteCount++;

//         emit Voted(msg.sender, _proposalId);
//     }

//     /**
//      * @dev Counts the votes for each proposal and determines the winning proposal(s).
//      */
//     function tallyVote() public onlyOwner {
//         require(workflowStatus == WorkflowStatus.VotingSessionOpen, "Voting session should be open");
//         uint highestCount;
        
//         // Find the proposal with the highest vote count
//         for (uint i = 0; i < proposals.length; i++) {
//             if (proposals[i].voteCount > highestCount) {
//                 highestCount = proposals[i].voteCount;
//             }
//         }
        
//         // Check for ties and record winning proposals
//         for (uint j = 0; j < proposals.length; j++) {
//             if (proposals[j].voteCount == highestCount) {
//                 exaequo = true;
//                 winningProposalId.push(j);
//             }
//         }

//         // Update workflow status to indicate that votes have been tallied
//         workflowStatus = WorkflowStatus.VotesTallied;
//         emit WorkflowStatusChange(WorkflowStatus.VotingSessionOpen, WorkflowStatus.VotesTallied);
//     }
   
//     /**
//      * @dev Starts the process of registering voters.
//      */
//     function startRegisteringVoters() public onlyOwner {
//         require(workflowStatus == WorkflowStatus.NeutralStatus, "Registration session has already started");

//         workflowStatus = WorkflowStatus.RegisteringVoters;
//         workflowChangeTime = block.timestamp;

//         emit WorkflowStatusChange(WorkflowStatus.NeutralStatus, WorkflowStatus.RegisteringVoters);
//     }

//     /**
//      * @dev Starts the process of registering proposals.
//      */
//     function startProposalRegister() public onlyOwner {
//         require(workflowStatus == WorkflowStatus.RegisteringVoters, "You are not in the registration session");

//         workflowStatus = WorkflowStatus.RegisteringProposals;
//         workflowChangeTime = block.timestamp;

//         // Create a genesis proposal for blank votes
//         Proposal memory newProposal;
//         newProposal.num = 1234567890;
//         proposals.push(newProposal);

//         emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.RegisteringProposals);
//     }

//     /**
//      * @dev Starts the voting session.
//      */
//     function startVotingSession() public onlyOwner {
//         require(workflowStatus == WorkflowStatus.RegisteringProposals, "Proposals' registration session is not finished");
//         require(proposals.length > 0, "There is no proposal to vote for");

//         workflowStatus = WorkflowStatus.VotingSessionOpen;
//         emit WorkflowStatusChange(WorkflowStatus.RegisteringProposals, WorkflowStatus.VotingSessionOpen);
//     }

//     /**
//      * @dev Allows an author or verifier to request a change in the total report number.
//      */
//     function changeTotalReportNumber() external onlyAuthorOrVerifier {
//         require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
//         require(!alreadyIncrementedRN[msg.sender], "You've already asked for a new minimum report number for promotion");
//         alreadyIncrementedRN[msg.sender] = true;
//         requestNumberRN ++;
//     }

//     /**
//      * @dev Allows an author or verifier to request a change in the total verification number.
//      */
//     function changeTotalVerificationNumber() external onlyAuthorOrVerifier {
//         require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
//         require(!alreadyIncrementedVN[msg.sender], "You've already asked for a new minimum verification number for promotion");
//         alreadyIncrementedVN[msg.sender] = true;
//         requestNumberVN ++;
//     }

//     /**
//      * @dev Allows an author or verifier to request a change in the time interval for verifier promotion.
//      */
//     function changeTimeIntervalForVerifierPromotion() external onlyAuthorOrVerifier {
//         require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
//         require(!alreadyIncrementedIV[msg.sender], "You've already asked for a new time interval for verifier promotion");
//         alreadyIncrementedIV[msg.sender] = true;
//         requestNumberIV ++;
//     }

//     /**
//      * @dev Allows an author or verifier to request a change in the time interval for author promotion.
//      */
//     function changeTimeIntervalForAuthorPromotion() external onlyAuthorOrVerifier {
//         require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
//         require(!alreadyIncrementedIA[msg.sender], "You've already asked for a new time interval for author promotion");
//         alreadyIncremented


// // ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::



// pragma solidity ^0.8.22;

// import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
// import "./Dao.sol";

// /**
//  * @title Voting
//  * @dev This contract manages a voting system.
//  * It allows users to register, propose, vote, and tallies the votes.
//  * The contract is Ownable, meaning that only the owner (presumably the creator) has certain privileges.
//  * It also incorporates functionality from the Dao contract.
//  */
// contract Voting is Ownable, Dao {
//     // State variables

//     // Struct to represent a voter's status
//     struct Voter {
//         bool isRegistered;
//         bool hasProposed;
//         bool hasVoted;
//         uint votedProposalId;
//     }

//     // Struct to represent a proposal
//     struct Proposal {
//         uint num;
//         uint voteCount;
//     }

//     // Array to store winning proposal IDs in case of a tie
//     uint256[] winningProposalId;

//     // Variables to store various request numbers
//     uint256 public requestNumberRN;
//     uint256 public requestNumberVN;
//     uint256 public requestNumberIV;
//     uint256 public requestNumberIA;

//     // Time when the workflow status changes
//     uint256 workflowChangeTime;

//     // Flag to track if there is a tie in the voting
//     bool exaequo;

//     // Array to store proposals
//     Proposal[] proposals;

//     // Mapping to track voters' status
//     mapping (address => Voter) private voters;

//     // Mapping to track if requests are already incremented
//     mapping (address => bool) private alreadyIncrementedRN;
//     mapping (address => bool) private alreadyIncrementedVN;
//     mapping (address => bool) private alreadyIncrementedIV;
//     mapping (address => bool) private alreadyIncrementedIA;

//     // Enum to represent the workflow status
//     enum WorkflowStatus {
//         NeutralStatus,
//         RegisteringVoters,
//         RegisteringProposals,
//         VotingSessionOpen,
//         VotesTallied
//     }

//     // The state variable of the Enum type 
//     WorkflowStatus public workflowStatus;

//     // Events
//     event VoterRegistered(address voterAddress);
//     event WorkflowStatusChange(
//         WorkflowStatus previousStatus,
//         WorkflowStatus newStatus
//     );
//     event ProposalRegistered(uint proposalId);
//     event Voted(address voter, uint proposalId);
//     event votingEnded(uint256 _winningProposal);

//     // Variable to be changed through voting
//     string variableToChange;

//     /**
//      * @dev Constructor to initialize the contract with a variable to change.
//      * @param _variableToChange The initial value for the variable that can be changed through voting.
//      */
//     constructor(string memory _variableToChange) {
//         variableToChange = _variableToChange;
//     }

//     // Modifiers

//     /**
//      * @dev Modifier to restrict a function to only registered voters.
//      */
//     modifier onlyVoters() {
//         require(voters[msg.sender].isRegistered, "You're not a voter");
//         _;
//     }

//     // External functions

//     /**
//      * @dev External function for the owner to register voters.
//      * @param _addr The address of the voter to be registered.
//      */
//     function voterRegisters(address _addr) external onlyOwner {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for registered voters to propose a new value.
//      * @param _num The proposed value.
//      */
//     function registerProposal(uint256 _num) external onlyVoters {
//         // ... (function details)
//     }

//     // Getter functions

//     /**
//      * @dev Getter function to retrieve proposal details by ID.
//      * @param _id The ID of the proposal.
//      * @return Proposal details.
//      */
//     function getProposals(uint256 _id) external view onlyVoters returns (Proposal memory) {
//         // ... (function details)
//     }

//     /**
//      * @dev Getter function to retrieve voter details by address.
//      * @param _addr The address of the voter.
//      * @return Voter details.
//      */
//     function getVoter(address _addr) external onlyOwner view returns (Voter memory) {
//         // ... (function details)
//     }

//     // External functions

//     /**
//      * @dev External function for registered voters to cast their vote.
//      * @param _proposalId The ID of the proposal being voted on.
//      */
//     function vote(uint _proposalId) external onlyVoters {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner to tally the votes and determine the winning proposal.
//      */
//     function tallyVote() public onlyOwner {
//         // ... (function details)
//     }

//     // Workflow status functions

//     /**
//      * @dev External function for the owner to start the voter registration process.
//      */
//     function startRegisteringVoters() public onlyOwner {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner to start the proposal registration process.
//      */
//     function startProposalRegister() public onlyOwner {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner to start the voting session.
//      */
//     function startVotingSession() public onlyOwner {
//         // ... (function details)
//     }

//     // Functions related to changing parameters

//     /**
//      * @dev External function for the owner or verifier to request a change in the total report number.
//      */
//     function changeTotalReportNumber() external onlyAuthorOrVerifier {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner or verifier to request a change in the total verification number.
//      */
//     function changeTotalVerificationNumber() external onlyAuthorOrVerifier {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner or verifier to request a change in the time interval for verifier promotion.
//      */
//     function changeTimeIntervalForVerifierPromotion () external onlyAuthorOrVerifier {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner or verifier to request a change in the time interval for author promotion.
//      */
//     function changeTimeIntervalForAuthorPromotion() external onlyAuthorOrVerifier {
//         // ... (function details)
//     }

//     // Functions to start voting for different parameters

//     /**
//      * @dev External function for the owner to start the voting process for changing the total report number.
//      */
//     function startVotingForReportNumber() external onlyOwner {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner to start the voting process for changing the total verification number.
//      */
//     function startVotingForVerificationNumber() external onlyOwner {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner to start the voting process for changing the time interval for verifier promotion.
//      */
//     function startVotingForVerifierPromotionInterval() external onlyOwner {
//         // ... (function details)
//     }

//     /**
//      * @dev External function for the owner to start the voting process for changing the time interval for author promotion.
//      */
//     function startVotingForAuthorPromotionInterval() external onlyOwner {
//         // ... (function details)
//     }
// }
