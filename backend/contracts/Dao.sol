// SPDX-License-Identifier: MIT

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.22;

/**
 * @title Dao
 * @dev This contract represents a DAO (Decentralized Autonomous Organization) with rules for promotion.
 * @dev The eligible community can change values by voting on certain rules.
 */

contract Dao is Ownable {

    // DAO rules for promotion that the elligible community can change values by voting
    uint256 public VrequiredReportsForVerifierPromotion = 10;
    uint256 public VrequiredVerificationsForAuthorPromotion = 20;
    uint256 public VtimeIntervalForVerifierPromotion = 6 * 30 * 24 * 60 * 60; // 6 months in seconds;
    uint256 public VtimeIntervalForAuthorPromotion = 12 * 30 * 24 * 60 * 60; // 12 months in seconds

    uint256 public numberOfAuthors;
    uint256 public numberOfVerifiers;
    

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

   
    // Mappings
    mapping(address => Author) public authors;
    mapping(address => Verifier) public verifiers;
    mapping(address => RegisteredReader) public readers;


    // Events
    event AuthorCreated(address indexed _author, uint256 date);
    event VerifierCreated(address indexed _verifier, uint256 date);
    event AuthorBanned(address _author);
    event VerifierBanned(address _verifier);
    event RegisteredReaderBanned(address _registeredReaderBanned);

    constructor() Ownable(msg.sender) {
      
    }

    modifier onlyAuthorOrVerifier() {
        require(authors[msg.sender].isAuthor || verifiers[msg.sender].isVerifier, "Only authors or verifiers can access!");
    _;
}
    /**
     * @dev Whitelisted members - Create an author with the specified address.
     * @notice Only the owner can create an author.
     * @param _author The address of the author to be created.
     */
    function createAuthor(address _author) external onlyOwner {
        require(!authors[_author].isAuthor, "Author already exists");
        require(!verifiers[_author].isVerifier, "Verifiers can not be author at the same time");
        authors[_author] = Author(true, 0);
        numberOfAuthors++;
        emit AuthorCreated(_author, block.timestamp);
    }

    /**
     * @dev Whitelisted members - Create a verifier with the specified address.
     * @notice Only the owner can create a verifier.
     * @param _verifier The address of the verifier to be created.
     */
    function createVerifier(address _verifier) external onlyOwner {
        require(!verifiers[_verifier].isVerifier, "Verifier already exists");
        require(!authors[_verifier].isAuthor, "Verifier already exists");
        verifiers[_verifier] = Verifier(true, block.timestamp, 0);
        numberOfVerifiers++;
        emit VerifierCreated(_verifier, block.timestamp);
    }

     /**
     * @dev Whitelisted members - Ban an author with the specified address.
     * @notice Only the owner can ban an author.
     * @param _author The address of the author to be banned.
     */
    function banAuthor(address _author) external onlyOwner{
        require(authors[_author].isAuthor, "Author not found");
        authors[_author].isAuthor = false; 
        numberOfAuthors--;
        emit AuthorBanned(_author);
    }

    /**
     * @dev Whitelisted members - Ban a verifier with the specified address.
     * @notice Only the owner can ban a verifier.
     * @param _verifier The address of the verifier to be banned.
     */
    function banVerifier(address _verifier) external onlyOwner{
        require(verifiers[_verifier].isVerifier, "Verifier not found");
        verifiers[_verifier].isVerifier = false; 
        numberOfVerifiers--;
        emit VerifierBanned(_verifier);
    }
}

