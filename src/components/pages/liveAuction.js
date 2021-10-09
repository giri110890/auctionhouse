import React, { Component } from 'react';
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import Moralis from 'moralis';
import {AuctionHouseAbi} from '../../services/AuctionHouseAbi';
import {BiddingAbi} from "../../services/BiddingAbi";
import { ToastContainer, toast } from 'react-toastify';
import { hideLoader, showLoader } from "../../services/loaderservice";
import {getMaxToken} from '../../services/Interact';

import {globalConstant} from '../../constants/global';
const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;


export default class LiveAuction extends Component{
   
    constructor(){
        super();
        this.state = {
          files: [],
          title: " ",
          description: " ",
          price: 0,
          imageUrl: "",
          tokenInfo: {},
          tokenID: "",
          biddingContractAddress: "",
          openMenu: true,
          highestBidder: "",
          highestBid: "",
          NoBids : true,
          openMenu1: false,
          tokenLoaded : false
        };

       

       
        

        showLoader();
        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleBtnClick1 = this.handleBtnClick1.bind(this);
        this.getBiddingContractAddress = this.getBiddingContractAddress.bind(this);
        this.getHighestBid = this.getHighestBid.bind(this);
        this.getHighestBidder = this.getHighestBidder.bind(this);
        this.placeBid = this.placeBid.bind(this);
        // this.getHighestVotedToken = this.getHighestVotedToken.bind(this);

         this.getMaxVotedTokenId = this.getMaxVotedTokenId.bind(this);
         this.getTokenInfo = this.getTokenInfo.bind(this);

         this.getMaxVotedTokenId(this);
       
    }



    getBiddingContractAddress = async function(){
        let accountAddress = globalConstant.contractAddress;
        const getHighestVotedOptions = {
          contractAddress: accountAddress,
          functionName: "getBiddingContractAddress",
          abi: AuctionHouseAbi,
          params: {
            _tokenId : this.state.tokenID,
          },
        };
       
        const biddingContractAddress = await Moralis.executeFunction(getHighestVotedOptions);

        this.setState({
            biddingContractAddress: biddingContractAddress
        });
        console.log("Bidding contract:" + biddingContractAddress);
        window.biddingContract = new window._moralis.eth.Contract(BiddingAbi, biddingContractAddress);
        this.getHighestBid(biddingContractAddress,this);
        this.getHighestBidder(biddingContractAddress, this);
        
    }

    getHighestBid(biddingContractAddress, thiscontext)
    {
        const options = {
            contractAddress: biddingContractAddress,
            functionName: "highestBidAmount",
            abi: BiddingAbi,
            params: {
                
            },
        };

        try{
            let receipt = Moralis.executeFunction(options).then( function(d) { 
                debugger;
                console.log("Highest Bid" + d);
                thiscontext.setState({
                    highestBid: d,
                    NoBids : true
                });
               
              
                });
        }
        catch(err){

            debugger;
            thiscontext.setState({
                NoBids: true
            });
        }
        
    }

    getHighestBidder(biddingContractAddress, thiscontext)
    {
        const options = {
            contractAddress: biddingContractAddress,
            functionName: "highestBidder",
            abi: BiddingAbi,
            params: {
                
            },
        };


        try{
            let receipt = Moralis.executeFunction(options).then( function(d) { 
                debugger;
                console.log("Highest Bidder" + d);
                thiscontext.setState({
                    highestBidder: d,
                    NoBids : true
                });
                
              
            });
        }
        catch(err)
        {
            debugger;
            thiscontext.setState({
                NoBids : false
            });
        }
        
    }

    getMaxVotedTokenId(thiscontext)
    {
        const options = {
            contractAddress: globalConstant.contractAddress,
            functionName: "getMaxVotedToken",
            abi: AuctionHouseAbi,
            params: {
                
            },
        };
        if(!window._moralis){
            const web3 = Moralis.enable().then(function (d){
              window._moralis = d;
              window.auctionContract = new window._moralis.eth.Contract(AuctionHouseAbi, globalConstant.contractAddress);

              let receipt = Moralis.executeFunction(options).then( function(d) { 
                console.log(d);
                thiscontext.setState({
                    tokenID: d
                });
                
                thiscontext.getTokenInfo();
                thiscontext.getBiddingContractAddress(thiscontext);
                
              
                });
            });
          }
        else{

            let receipt = Moralis.executeFunction(options).then( function(d) { 
                debugger;
                console.log(d);
                thiscontext.setState({
                    tokenID: d
                });
                thiscontext.getTokenInfo();
                thiscontext.getBiddingContractAddress();
            });
        }
        
          

        
    }
    getTokenInfo = async function()
    {
        let accountAddress = globalConstant.contractAddress;
        let options = { address:accountAddress , chain: "mumbai" };
        
        let NFTs = await Moralis.Web3API.account.getNFTs(options);
        if(NFTs != null)
        {
            NFTs.result.forEach(element => {
                if(element.token_id == this.state.tokenID)
                {
                    this.setState({
                        tokenInfo: element,
                        tokenLoaded : true
                    });
                    console.log(this.state.tokenLoaded);
                    hideLoader();
                }
            });
        }
    }

    getHighestVotedToken = async function() {
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
            debugger;
    }

     handleBtnClick = () => {
        this.setState({
            openMenu: !(this.state.openMenu),
            openMenu1 : false
        });
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
      };


       handleBtnClick1 = () => {

        this.setState({
            openMenu1: !(this.state.openMenu1),
            openMenu : false
        });
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
      };


      getPriceFromString = function() {

        var number = this.state.highestBid/Math.pow(10, 18);
        return number.toFixed(4);

      }
      
 getMetadataFromString = function(metadataString, fieldName) {
    let jsonObject = JSON.parse(metadataString);
    console.log(jsonObject);
    if(jsonObject != null)
    {
        if(fieldName == "title")
        {
            return jsonObject.title;
        }
        else if(fieldName == "image")
        {
            return jsonObject.path;
        }
        else if(fieldName == "owner")
        {
            return jsonObject.owner;
        }
        else if(fieldName == "desc")
        {
            return jsonObject.description;
        }
        else 
        {
            return jsonObject.timestamp;
        }
    }

    return "";
    
}


placeBid = async function()
{
   let amount = document.getElementById("biddingAmount").value;

   showLoader();
   let accountAddress = this.state.biddingContractAddress;
            const getHighestVotedOptions = {
              contractAddress: accountAddress,
              functionName: "bid",
              abi: BiddingAbi,
              msgValue: Moralis.Units.ETH(amount)
            };
           
            try{
                const receipt = await Moralis.executeFunction(getHighestVotedOptions);
                toast.success("Placed a Bid successfully", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });

                  hideLoader();
            }
            catch(err)
            {

                toast.error("Bid amount should be higher than the current highest bid amount", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                  });

                  hideLoader();
            }

   console.log(amount);
}



render(){
    return (
             <div>
        {/* <GlobalStyles/> */}
          {this.state.tokenLoaded && (
              <>
          <section className='container'>
          <div className='row mt-md-5 pt-md-4'>
          
          <div className="col-md-6 text-center">
                                  <img src={this.getMetadataFromString(this.state.tokenInfo?.metadata, "image")} className="img-fluid img-rounded mb-sm-30" alt=""/>
        </div>
                              <div className="col-md-6">
                                  <div className="item_info">
                                      Auctions ends in 
                                      <div className="de_countdown">
                                        <Clock deadline={new Date().toString("DD MM YYYYY")} />
                                      </div>
                                      <h2>{this.getMetadataFromString(this.state.tokenInfo?.metadata, "title")}</h2>
                                      <div className="item_info_counts">
                                          <div className="item_info_type"><i className="fa fa-image"></i>Art</div>
                                          <div className="item_info_views"><i className="fa fa-eye"></i>250</div>
                                          <div className="item_info_like"><i className="fa fa-heart"></i>18</div>
                                      </div>
                                      <p>{this.getMetadataFromString(this.state.tokenInfo?.metadata, "desc")}.</p>
        
                                      <h6>Creator</h6>
                                      <div className="item_author">                                    
                                          <div className="author_list_pp">
                                              <span>
                                                  <img className="lazy" src="./img/author/author-6.jpg" alt=""/>
                                                  <i className="fa fa-check"></i>
                                              </span>
                                          </div>                                    
                                          <div className="author_list_info">
                                              <span>{this.getMetadataFromString(this.state.tokenInfo?.metadata, "owner")}</span>
                                          </div>
                                      </div>
        
                                      <div className="spacer-40"></div>
        
                                      <div className="de_tab">
          
                                      <ul className="de_nav">
                                          <li id='Mainbtn' className="active"><span onClick={this.handleBtnClick}>Bids</span></li>
                                          <li id='Mainbtn1' className=''><span onClick={this.handleBtnClick1}>Place a Bid</span></li>
                                      </ul>
                                      
                                      <div className="de_tab_content">
                                          {this.state.openMenu &&  this.state.NoBids &&(  
                                          <div className="tab-1 onStep fadeIn">
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-7.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Highest Bid Amount <b>{this.getPriceFromString()} MATIC</b>
                                                      <span>by <b>{this.state.highestBidder}</b></span>
                                                  </div>
                                              </div>
        
                                          
        
        
                                             
                                          </div>
                                          )}

{this.state.openMenu &&  !this.state.NoBids && (  
                                          <div className="tab-1 onStep fadeIn">
                                              <div className="p_list">
                                              <b>No Bids Yet</b>                                
                                               
                                              </div>
        
                                          
        
        
                                             
                                          </div>
                                          )}
        
                                          {this.state.openMenu1 && ( 
                                          <div className="tab-2 onStep fadeIn">
                                             <form id="form-create-item" className="form-border" action="#">
                                                <div className="field-set">
                                                    <input type="text" name="biddingAmount" id="biddingAmount" className="form-control" placeholder="e.g. 4 MATIC" />
                                                    <input type="button" onClick={this.placeBid} id="mint" className="btn-main" value="Bid" />
                                                </div>
                                             </form>
                                          
                                          </div>
                                          )}
                                          
                                      </div>
                                      
                                  </div>
                                      
                                  </div>
                              </div>
        
          </div>
        </section>
        
        <Footer />
              </>
          )}
        
        </div>
       
        );
}
    
}
;