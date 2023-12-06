// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.22;


import "./Voting.sol";

contract VotingManagement is Voting { 
  
    uint256 public requestNumberRN;
    uint256 public requestNumberVN;
    uint256 public requestNumberIV;
    uint256 public requestNumberIA;

    Voting[] public votings;
    
    mapping (address => bool) private alreadyIncrementedRN;
    mapping (address => bool) private alreadyIncrementedVN;
    mapping (address => bool) private alreadyIncrementedIV;
    mapping (address => bool) private alreadyIncrementedIA;

    constructor() {
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
        Voting newVoting = new Voting(reportNumber);
        voting.push(address(newVoting));
        startRegisteringVoters();
    }
    function startVotingForVerificationNumber() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberVN > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        startRegisteringVoters();
    }
    function startVotingForVerifierPromotionInterval() external onlyOwner{
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberIV > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        startRegisteringVoters();
    }
    function startVotingForAuthorPromotionInterval() external onlyOwner {
        require(workflowStatus == WorkflowStatus.NeutralStatus, "There is already a voting going on");
        require(requestNumberIA > numberOfAuthors + numberOfVerifiers / 2, "The request number should be more than the half of the total of author and verifier numbers" );
        startRegisteringVoters();
    }
}