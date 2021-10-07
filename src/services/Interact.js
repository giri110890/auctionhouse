import {UploadFilesWeb3} from './Web3Storage';
import { AuctionHouseAbi } from './AuctionHouseAbi';
import Moralis from 'moralis';
import { globalConstant } from '../constants/global';


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

    

    //Execute
    let auctionContractAddress = globalConstant.contractAddress;
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