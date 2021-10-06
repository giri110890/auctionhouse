//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract AuctionHouseBidding is ERC721URIStorage, IERC721Receiver {

    event Sent(address indexed payee, uint256 amount, uint256 balance);
    event Received(address indexed payer, uint tokenId, uint256 amount, uint256 balance);
    event TokenTransferred(address indexed owner, address indexed receiver, uint256 tokenId);
    event Minted(address, string, uint256);
    
    enum TokenStatus {
        MINTED,
        AUCTION,
        SALE,
        SOLD
    }

    struct Token {
        uint256 id;
        uint256 salePrice;
        bool active;
        uint256 votes;
        TokenStatus status;
        
    }
    
    
    /**
    * ERC721 - Eth contract to create NFTs
    */
    //500000000000000000
    //0x4b8a65c8ef37430edFaaD1B61Dba2D680f56FFd7
    
    ERC721 public nftAddress;
    address payable public platformOwner;
    mapping(uint256 => uint256) private salePrice;
    mapping(uint256 => Token) public auctionTokens;
    mapping(uint256 => address) public originalOwner;
    
    
    using Counters for Counters.Counter;
    Counters.Counter public _tokenIds;
    
    uint256[] public allTokens;
    //Holds a mapping between the tokenId and the bidding contract
    mapping(uint256 => Bidding) tokenBids;
    
    
    
    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {

        platformOwner = payable(msg.sender);
        
    }

    
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public pure override returns (bytes4) {
        return(bytes4(keccak256("onERC721Received(address,address,uint256,bytes)")));
    }
    
    
    function mintWithIndex(address to, string memory tokenURI, uint256 price) public  returns(uint256) {
       
           
            _tokenIds.increment();
            uint256 tokenId = _tokenIds.current();
        
            _mint(to, tokenId);
            _setTokenURI(tokenId, tokenURI);
            salePrice[tokenId] = price;
            
            Token memory token;
		    token.id = tokenId;
		    token.active = true;
		    token.salePrice = price;
		    token.votes = 0;
		    
		    
		    originalOwner[tokenId] = to; 
            
            auctionTokens[tokenId] = token;
            allTokens.push(tokenId);
            
            emit Minted(msg.sender, tokenURI, tokenId);
        
            return tokenId;
	}
	
	function moveToAuction(uint _tokenId, address _nftAddress) public {
	    
	    ERC721 nftAddress1 = ERC721(_nftAddress);
	    Token memory token = auctionTokens[_tokenId];
	    require(msg.sender == nftAddress1.ownerOf(_tokenId), "Only the owner can transfer the NFT to the Auction House");
	    
	    token.status = TokenStatus.AUCTION;
            
        auctionTokens[_tokenId] = token;
	    nftAddress1.safeTransferFrom(msg.sender, address(this), _tokenId);
	}
	
	
	function vote(uint tokenId) public returns(uint) {
	    Token memory token = auctionTokens[tokenId];
	    token.votes = token.votes + 1;
	    
	    auctionTokens[tokenId] = token;
	    
	    return token.votes;
	}
	
	function highestVotedToken() public returns(Token memory) {
	    uint maxVotes = 0;
	    uint maxToken = 0;
	    for(uint i = 0; i< allTokens.length; i++) {
	        
	        Token memory token = auctionTokens[allTokens[i]];
	        if(token.status == TokenStatus.AUCTION){
	            uint256 tokenVote = token.votes;
	            if(tokenVote > maxVotes){
	                maxVotes = tokenVote;
	                maxToken = token.id;
	                
	            }
	        }
	    }
	    
	    Token memory maxTokenDetails = auctionTokens[maxToken];
	    
	    //Settnig the token for Sale here - need to change biddingTime
	    Bidding placeBids = new Bidding(maxTokenDetails.id, 60*5 , maxTokenDetails.salePrice, payable(originalOwner[maxTokenDetails.id]), platformOwner);
		tokenBids[maxTokenDetails.id] = placeBids;
		
		maxTokenDetails.status = TokenStatus.SALE;
		auctionTokens[maxTokenDetails.id] = maxTokenDetails;
    
	    return maxTokenDetails;
	    
	}
	
	function getBiddingContractAddress(uint256 _tokenId) public view returns(address){
        return(address(tokenBids[_tokenId]));
    }
	
// 	function getTokenOnSale() public returns(Token memory) {
// 	    for(uint i = 0; i< allTokens.length; i++) {
	    
// 	         Token memory token = auctionTokens[allTokens[i]];
// 	         if(token.status == TokenStatus.SALE){
// 	             return token;
// 	         }
// 	    }
	   
// 	}
	
    /**
     * @dev check the owner of a Token
     * @param _tokenId uint256 token representing an Object
     * Test function to check if the token address can be retrieved.
     */
    function getTokenSellerAddress(uint256 _tokenId) internal view returns(address) {
        address tokenSeller = nftAddress.ownerOf(_tokenId);
        return tokenSeller;
    }

    /**
    * @dev Purchase _tokenId
    * @param _tokenId uint256 token ID representing an Object
    */
    function transferToken(uint256 _tokenId, address _nftAddress) public {
        ERC721 userNftAddress = ERC721(_nftAddress);
        //require(msg.sender != address(0) && msg.sender != address(this));
        require(userNftAddress.ownerOf(_tokenId) != address(0));
        require(auctionTokens[_tokenId].status == TokenStatus.SALE, "Token is not registered for sale!");
        
        /*
        De-registering the token once it's purchased.
        */
        Token memory sellingToken = auctionTokens[_tokenId];
        sellingToken.status = TokenStatus.SOLD;
        sellingToken.votes = 0;
        auctionTokens[_tokenId] = sellingToken;
        
                
        address tokenSeller = userNftAddress.ownerOf(_tokenId);
        address highestBidder = tokenBids[_tokenId].highestBidder();
        userNftAddress.safeTransferFrom(tokenSeller, highestBidder, _tokenId);
        
        originalOwner[_tokenId] = highestBidder;
        
        emit TokenTransferred(tokenSeller, highestBidder, _tokenId);
        
    }
    

}

/* 
* This is the bidding contract 
*/

contract Bidding {
    // Parameters of the auction. Times are either
    // absolute unix timestamps (seconds since 1970-01-01)
    // or time periods in seconds.

    uint public auctionEnd;
    uint public tokenId;
    uint public reservePrice;
    uint bidCounter;
    address public highestBid;
    address payable public owner;
    address payable public platformOwner;
    uint public bidAmountHighest;
    
    uint[] public sortedBids;
    address[] public sortedBidders;
    
    struct Bid {
        address payable bidder;
        uint bidAmount;
    }
   
    // Set to true at the end, disallows any change
    bool ended;
    
    // Recording all the bids
    mapping(uint => Bid) bids;


    // Events that  will be fired on changes.
    //event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    /*
    * Create a simple bidding contract
    * @param _tokenId: tokenId for which the bid is created
    * @param _biddingTime: Time period for the bidding to be kept open
    * @param _reservePrice: Minimum price set for the token
    */
    constructor(
       
        uint256 _tokenId,
        uint _biddingTime,
        uint _reservePrice,
        address payable _owner,
        address payable _platformOwner
    ) {
        reservePrice = _reservePrice;
        tokenId = _tokenId;
        bidCounter = 0;
        auctionEnd = block.timestamp + _biddingTime;
        //Explicitly setting the owner to our address for now
        // msg.sender is coming as the address of the contract
        owner = _owner;
        platformOwner = _platformOwner;
        
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }
    
    //ONLY FOR TESTING
    function getOwner() public view returns(address){
      return owner;
    }

    /// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    function bid() public payable {
        // No arguments are necessary, all
        // information is already part of
        // the transaction. The keyword payable
        // is required for the function to
        // be able to receive Ether.

        // Revert the call if the bidding
        // period is over.
        // require(
        //     block.timestamp <= auctionEnd,
        //     "Auction already ended."
        // );
        
           // If the bid is not higher than 0, no bidding happens
        require(
            msg.value > 0,
            "The bid value should be greater than 0."
        );

        if(sortedBids.length != 0) {
            require(msg.value > sortedBids[sortedBids.length -1], "Bid value should be greeater than current highest bid");
        }
        

       Bid storage newBid = bids[bidCounter+1];
       newBid.bidder = payable(msg.sender);
       newBid.bidAmount = msg.value;
       
       sortedBids.push(msg.value);
       sortedBidders.push(msg.sender);
       
       bidCounter = bidCounter+1;
    }
    
    /*
    * Get the address of the highest bidder
    */
    function highestBidder() public view returns(address) {
        
        require(sortedBidders.length > 0, "No bids yet");
        return sortedBidders[sortedBidders.length - 1];
        
    }
    
    
    /*
    * Get the highest bid amount
    * @param _highestBidder address of the highest bidder
    */
    function highestBidAmount() public view returns(uint)  {
        
        require(sortedBids.length > 0, "No bids yet");
        return sortedBids[sortedBids.length - 1];
    }
    
    /*
    * Function to send the bidAmount to the NFT owner
    * @param _nftOwner: address of the NFT Owner
    */
     function closeAuction() public {
        // require(block.timestamp >= auctionEnd, "Auction not yet ended.");
        //require(ended, "Auction end has not been called.");
        //require(ownerShare < bidAmountHighest, "Royalties are not being given to the artist!");
        //Send the money to the nftOwner
        uint platformShare = highestBidAmount()*5/100;
        uint ownerShare = highestBidAmount() - platformShare;
        
        platformOwner.transfer(platformShare);
        owner.transfer(ownerShare);
        
        disperseFunds();
        
    }

    
    function geReservePrice() onlyOwner public view returns(uint){
      return reservePrice;
    }

    /*
    * Withdraw bids that were not the winners.
    */
    function disperseFunds() public returns (bool) {
        uint amount = 0;
        address highestBidderUser = highestBidder();
        for(uint i = 0; i <= bidCounter; i ++){
            amount = bids[i].bidAmount;
            
            if(amount < 0){
                return false;
            }
          
            if(bids[i].bidder != highestBidderUser){
                
                bids[i].bidder.transfer(amount);
            }
            
        }
        return true;
    }
    
    /*
    * In case of an emergency, this function can be called to send all
    * the funds from the contract to the owner address.
    */
    function finalize() public {
        selfdestruct(platformOwner);
    }
    
}
