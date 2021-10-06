import {UploadFilesWeb3} from './Web3Storage';
import { AuctionHouseAbi } from './AuctionHouseAbi';
import Moralis from 'moralis';

const auctionContractAddress = '0x8E4e3b0CC00Ca0855EE88aCF0aDB80F968FC531d';

export const connectWallet = async () => {

   
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
            method: "eth_requestAccounts",
            params: [
              {
                eth_accounts: {},
              },
            ],
          });
        console.log(addressArray);
        const obj = {
          status: "Connected",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const mintNFT = async (accountAddress, imageUrl, title, description, price) => {

    //Call web3storage - return tokenURI
    const tokenURI = await UploadFilesWeb3(imageUrl, title, description, accountAddress);
    //Call Mint
    debugger;
    // const transactionParameters = {
    //   to: auctionContractAddress, // Required except during contract publications.
    //   from: accountAddress, // must match user's active address.
    //   data: window.auctionContract.methods
    //     .mintWithIndex(accountAddress, tokenURI, price)
    //     .encodeABI(),
    // };

    // try {
    //   const txHash = await window._moralis.eth.call({
    //     to: auctionContractAddress,
    //     data: window.auctionContract.methods
    //     .mintWithIndex(accountAddress, tokenURI, price)
    //     .encodeABI()
    //   })
    //   console.log("Transaction Hash", txHash);
    // } catch (error) {
    //   return {
    //     success: false,
    //     status: "😥 Something went wrong: " + error.message,
    //   };
    // }

    //Execute
    const options = {
      contractAddress: auctionContractAddress,
      functionName: "mintWithIndex",
      abi: AuctionHouseAbi,
      params: {
        to : accountAddress,
        tokenURI : tokenURI,
        price: price
      },
    };
    
    let receipt = await Moralis.executeFunction(options);
    console.log(receipt.events.Minted.returnValues[2]);

    const tokenId = receipt.events.Minted.returnValues[2];


    if(tokenId != 0) {
      const approveOptions = {
        contractAddress: auctionContractAddress,
        functionName: "approve",
        abi: AuctionHouseAbi,
        params: {
          to : auctionContractAddress,
          tokenId : tokenId,
        },
      };
      
      receipt = await Moralis.executeFunction(approveOptions);
      console.log(receipt)

      if(receipt.status){
        const auctionOptions = {
          contractAddress: auctionContractAddress,
          functionName: "moveToAuction",
          abi: AuctionHouseAbi,
          params: {
            _tokenId : tokenId,
            _nftAddress : auctionContractAddress,
          },
        };
        
        receipt = await Moralis.executeFunction(auctionOptions);
        console.log(receipt)
      }
    }
    

  }