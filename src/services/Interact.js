import {UploadFilesWeb3} from './Web3Storage';
import { AuctionHouseAbi } from './AuctionHouseAbi';
import Moralis from 'moralis';
import { globalConstant } from '../constants/global';
import { ToastContainer, toast } from 'react-toastify';


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

    toast.info("Please wait while we mint the token", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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

    toast.success("Minting is successful", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    toast.info("Please approve Auction house to handle transfer of the NFT", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

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
      toast.success("Approval is successful, Head over to Profile to move it to Auction house", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    }
    

  }

  export const getMaxToken = async () => {
    let accountAddress = globalConstant.contractAddress;
            const getHighestVotedOptions = {
              contractAddress: accountAddress,
              functionName: "getMaxVotedToken",
              abi: AuctionHouseAbi,
              params: {
                to : accountAddress,
              },
            };
           
            const receipt = await Moralis.executeFunction(getHighestVotedOptions);
            console.log(receipt);
            debugger;
  }