// SPDX-License-Identifier: MIT

pragma solidity 0.8.22;


contract DAO {

    address public owner;
    uint256 requiredReportsForVerifierPromotion = 10;
    uint256 requiredVerificationsForAuthorPromotion  = 20;

    struct Author {
        bool isAuthor;
        uint256 firstParticipationDate;
    }

    struct Verifier {
        bool isVerifier;
        uint256 firstParticipationDate;
        uint256 totalVerificationDoneNumber;
    }

    struct Reader {
        bool isReader;
        uint256 firstReportDate;
        uint256 totalReportNumber;
    }

    struct Donator {
        bool isDonator;
        uint256 donateAmount;
        uint256 donateDate;
    }
    

    mapping(address => Author) public authors;
    mapping(address => Verifier) public verifiers;
    mapping(address => Reader) public readers;
    mapping(address => Donator) public donators;


    address[] public articles;
    address[] public reports;


    // EVENTS

    event AuthorCreated(address indexed author, bool isAuthor, uint256 date);
    event VerifierCreated(address indexed verifier, bool isVerier, uint256 date);
    event HasDonated(address indexed donator, bool isDonator, uint256 donateAmount, uint256 donateDate);
    // event ReportSubmitted(address indexed reporter, address indexed subject, bool isVerifier);
    // event RolePromotion(address indexed member, bool isAuthor, bool isVerifier);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyAuthor() {
        require(authors[msg.sender].isAuthor, "Only authors can access!");
        
        _;
    }
    modifier onlyVerifier() {
        require(verifiers[msg.sender].isVerifier, "Only verifier can access!");
        _;
    }

    modifier onlyDAO() {
        require(isDAO(msg.sender), "Only DAO vote decision can access");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Initial DAO commuty selection



    // Whitelisted members
    function createAuthor(address member, bool isAuthor, bool isVerifier) external onlyOwner {
        require(!authors[msg.sender].isRegistered, "Author's already whitelisted");
        authors[msg.sender] = Author(isAuthor, 0);
        emit AuthorCreated(msg.sender, true, block.timestamp);
    }
    function createVerifier(address member, bool isAuthor, bool isVerifier) external onlyOwner {
        require(!verifiers(msg.sender), "Verifier's already whitelisted");
        verifiers[msg.sender] = Verifier(isVerifier, 0);
        emit VerifierCreated(msg.sender, true, block.timestamp);
    }

    // Promotion functions
    // function promotVerifier()

    // DAO can change some variables by voting of majority

    function setTotalReportNumber(uint256 newThresold) external onlyDao {
        requiredReportsForVerifierPromotion = newThreshold;
    }

    function setParticipantThreshold(uint256 newThreshold) external onlyOwner {
        requiredVerificationForAuthorPromotion = newThreshold;
    }



    function submitVerifierReport(address report, bool isVerifier) external onlyMember {
        require(isVerifier(msg.sender), "You are not a verifier");
        reports[msg.sender][report]++;
        emit ReportSubmitted(msg.sender, subject, isVerifier);

        if (isVerifier && reports[msg.sender][subject] >= reportNumToBeVerifier) {
            promoteToVerifier(msg.sender);
        }
    }

    function promoteToVerifier(address member) internal {
        require(members[member].isAuthor, "Only authors can be promoted to verifiers");
        require(block.timestamp - members[member].lastParticipationDate >= 6 * 30 days, "Not eligible for promotion yet");

        members[member].isVerifier = true;
        members[member].lastParticipationDate = block.timestamp;
        emit RolePromotion(member, false, true);
    }

    function isMember(address member) public view returns (bool) {
        return members[member].lastParticipationDate > 0;
    }

    function canVote(address member) public view returns (bool) {
        return isMember(member) && block.timestamp - members[member].lastParticipationDate >= 12 * 30 days;
    }

    function conductVote(uint256[] calldata votes, uint256 changeThreshold, uint256 newValue) external onlyMember returns (bool) {
        require(votes.length >= PARTICIPANT_THRESHOLD, "Not enough participants for the vote");
        
        uint256 totalVotes = 0;
        for (uint256 i = 0; i < votes.length; i++) {
            if (canVote(address(i))) {
                totalVotes += votes[i];
            }
        }

        if (totalVotes >= changeThreshold) {
            // Execute the change
            // For simplicity, this contract assumes a simple boolean state change.
            // You would need to adapt this part based on your actual voting mechanism.
            // newValue represents the new boolean state after the vote.
            // For example, if newValue is 1, it means "true", and if newValue is 0, it means "false".
            // You might need to change this logic based on your specific use case.
            return newValue == 1;
        }

        return false;
    }
}

