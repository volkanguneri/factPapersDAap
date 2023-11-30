// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.22;


contract Dao is Ownable {

    // DAO rules for promotion that the elligible community can change values by voting

    uint256 public requiredReportsForVerifierPromotion;
    uint256 public requiredVerificationsForAuthorPromotion;
    uint256 public timeIntervalForVerifierPromotion;
    uint256 public timeIntervalForAuthorPromotion;

    uint public numberOfAuthors;
    uint public numberOfVerifiers;
    

    // DAO roles

    struct Author {
        bool isAuthor;
        uint256 firstParticipationDate;
    }

    struct Verifier {
        bool isVerifier;
        uint256 firstParticipationDate;
        uint256 totalVerificationDoneNumber;
    }

    struct RegisteredReader {
        bool isReader;
        uint256 firstReportDate;
        uint256 totalReportNumber;
    }

    struct Donator {
        bool isDonator;
        uint256 donateAmount;
        uint256[] donateDates;
    }

   
    // Mappings

    mapping(address => Author) public authors;
    mapping(address => Verifier) public verifiers;
    mapping(address => RegisteredReader) public readers;
    mapping(address => Donator) public donators;

    // Author[] public authors;
    // Verifier[] public verifiers;

    string[] public articlesCID;
    address[] public reports;
    address[] public articles;


    // Events

    event AuthorCreated(address indexed author, bool isAuthor, uint256 date);
    event VerifierCreated(address indexed verifier, bool isVerier, uint256 date);
    event HasDonated(address indexed donator, bool isDonator, uint256 donateAmount, uint256 donateDate);
    event ArticlePublished(string _CID);
    event ArticleVerified(address xxx);
    event ReportSubmitted(address xxx);
    event PromotedToAuthor(address _reader, uint256 _time);
    event PromotedToVerifier(address _verifier, uint256 _time);
    event MemberBanned(address xxx);
    event AuthorBanned(address _author);
    event verifierBanned(address _verifier);
    event RegisteredReaderBanned(address _registeredReaderBanned);



    constructor() Ownable(msg.sender) {
        requiredReportsForVerifierPromotion = 10;
        requiredVerificationsForAuthorPromotion  = 20;
        timeIntervalForVerifierPromotion = 6 * 30 * 24 * 60 * 60; // 12 months in seconds
        timeIntervalForAuthorPromotion = 12 * 30 * 24 * 60 * 60; // 12 months in seconds
    }



    modifier onlyAuthor() {
        require(authors[msg.sender].isAuthor, "Only authors can access!");
        
        _;
    }

    modifier onlyReader() {
        require(readers[msg.sender].isReader, "Only readers who has already reported can access!");
        
        _;
    }
    modifier onlyVerifier() {
        require(verifiers[msg.sender].isVerifier, "Only verifier can access!");
        _;
    }


    // Initial DAO commuty selection ? xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx



    // Whitelisted members
    function createAuthor(address author) external onlyOwner {
        require(!authors[author].isAuthor, "Author already exists");
        authors[author] = Author(true, 0);
        numberOfAuthors++;
        emit AuthorCreated(msg.sender, true, block.timestamp);
    }

    function createVerifier(address verifier) external onlyOwner {
        require(!verifiers[verifier].isVerifier, "Verifier already exists");
        verifiers[verifier] = Verifier(true, block.timestamp, 0);
        numberOfVerifiers++;
        emit VerifierCreated(msg.sender, true, block.timestamp);
    }

    // Promotion functions

    // Promoted to verifier
    function fromReaderToVerifier() external {
        require(readers[msg.sender].totalReportNumber >= requiredReportsForVerifierPromotion, "Not enough reports for verifier promotion");
        require(readers[msg.sender].firstReportDate > timeIntervalForVerifierPromotion, "Not eligible for verifier promotion yet");
        verifiers[msg.sender] = Verifier(true, block.timestamp, 0);
        
        emit PromotedToVerifier(msg.sender, block.timestamp);
    }

    // Promoted to author
    function fromVerifierToAuthor() external onlyVerifier {
        require(verifiers[msg.sender].totalVerificationDoneNumber >= requiredVerificationsForAuthorPromotion, "Not enough verifications for author promotion");
        require(readers[msg.sender].firstReportDate > timeIntervalForAuthorPromotion,"Not eligible for author promotion yet" );
        verifiers[msg.sender].isVerifier = false;
        authors[msg.sender] = Author(true, 0);

        emit PromotedToAuthor(msg.sender, block.timestamp);

    }

    // To ban author
    function banAuthor(address _author) external {
        authors[msg.sender].isAuthor = false; 
        numberOfAuthors--;
        emit AuthorBanned(_author);
    }

    
}

