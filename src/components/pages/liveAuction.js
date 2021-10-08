import React, { Component } from 'react';
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';
import Moralis from 'moralis';
import {AuctionHouseAbi} from '../../services/AuctionHouseAbi';
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
          tokenID: 0,
          openMenu: true,
          openMenu1: false
        };

        let fragmentArray = window.location.href.split('/');
        this.state.tokenID = fragmentArray[fragmentArray.length-1];

        if(!window._moralis){
            const web3 = Moralis.enable().then(function (d){
              window._moralis = d;
              window.auctionContract = new window._moralis.eth.Contract(AuctionHouseAbi, globalConstant.contractAddress);
            });
          }
        

        this.handleBtnClick = this.handleBtnClick.bind(this);
        this.handleBtnClick1 = this.handleBtnClick1.bind(this);
        // this.getHighestVotedToken = this.getHighestVotedToken.bind(this);

        // this.getTokenInfo = this.getTokenInfo.bind(this);

        // this.getTokenInfo();
        getMaxToken();
    }

    // getTokenInfo = async function()
    // {
    //     let accountAddress = globalConstant.contractAddress;
    //     let options = { address:accountAddress , chain: "mumbai" };
    //     debugger;
    //     let NFTs = await Moralis.Web3API.account.getNFTs(options);
    //     if(NFTs != null)
    //     {
    //         NFTs.forEach(element => {
    //             if(element.token_id == this.state.tokenID)
    //             {
    //                 this.state.tokenInfo = element;
    //             }
    //         });
    //     }
    // }

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
        this.state.openMenu = !(this.state.openMenu);
        this.state.openMenu1 = false;
        document.getElementById("Mainbtn").classList.add("active");
        document.getElementById("Mainbtn1").classList.remove("active");
      };


       handleBtnClick1 = () => {

        this.state.openMenu1= !(this.state.openMenu1);
        this.state.openMenu = false;
        document.getElementById("Mainbtn1").classList.add("active");
        document.getElementById("Mainbtn").classList.remove("active");
      };

      
 getMetadataFromString = function(metadataString, fieldName) {
    let jsonObject = JSON.parse(metadataString);
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
        else 
        {
            return jsonObject.timestamp;
        }
    }

    return "";
    
}




render(){
    return (
             <div>
        {/* <GlobalStyles/> */}
          {this.state.tokenInfo && (
              <>
          <section className='container'>
          <div className='row mt-md-5 pt-md-4'>
          <div className="col-lg-3 col-sm-6 col-xs-12">
                  <h5>Preview item</h5>
                  <div className="nft__item m-0">
                     
                     
                      <div className="nft__item_wrap">
                          <span>
                              <img src="./img/collections/coll-item-3.jpg" id="get_file_2" className="lazy nft__item_preview" alt=""/>
                          </span>
                      </div>
                      <div className="nft__item_info">
                          <span >
                              <h4 id="nft_item_title">Pinky Ocean</h4>
                          </span>
                          <div className="nft__item_price" id="nft_item_price_info">
                              0.08 MATIC
                          </div>
                          <div className="nft__item_action">
                              <span>Place a bid</span>
                          </div>
                          <div className="nft__item_like">
                              <i className="fa fa-heart"></i><span>1</span>
                          </div>                            
                      </div> 
                  </div>
              </div> 
          {/* <div className="col-md-6 text-center">
                                  <img src={this.getMetadataFromStringgetMetadataFromString(this.state.tokenInfo?.metadata, "image")} className="img-fluid img-rounded mb-sm-30" alt=""/>
        </div> */}
                              <div className="col-md-6">
                                  <div className="item_info">
                                      Auctions ends in 
                                      <div className="de_countdown">
                                        <Clock deadline={new Date().toString("DD MM YYYYY")} />
                                      </div>
                                      <h2>Pinky Ocean</h2>
                                      <div className="item_info_counts">
                                          <div className="item_info_type"><i className="fa fa-image"></i>Art</div>
                                          <div className="item_info_views"><i className="fa fa-eye"></i>250</div>
                                          <div className="item_info_like"><i className="fa fa-heart"></i>18</div>
                                      </div>
                                      <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        
                                      <h6>Creator</h6>
                                      <div className="item_author">                                    
                                          <div className="author_list_pp">
                                              <span>
                                                  <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                                                  <i className="fa fa-check"></i>
                                              </span>
                                          </div>                                    
                                          <div className="author_list_info">
                                              <span>Monica Lucas</span>
                                          </div>
                                      </div>
        
                                      <div className="spacer-40"></div>
        
                                      <div className="de_tab">
          
                                      <ul className="de_nav">
                                          <li id='Mainbtn' className="active"><span onClick={this.handleBtnClick}>Bids</span></li>
                                          <li id='Mainbtn1' className=''><span onClick={this.handleBtnClick1}>History</span></li>
                                      </ul>
                                      
                                      <div className="de_tab_content">
                                          {this.state.openMenu && (  
                                          <div className="tab-1 onStep fadeIn">
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid accepted <b>0.005 ETH</b>
                                                      <span>by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-2.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.005 ETH</b>
                                                      <span>by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-3.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.004 ETH</b>
                                                      <span>by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-4.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.003 ETH</b>
                                                      <span>by <b>Lori Hart</b> at 6/12/2021, 12:57 AM</span>
                                                  </div>
                                              </div>
                                          </div>
                                          )}
        
                                          {this.state.openMenu1 && ( 
                                          <div className="tab-2 onStep fadeIn">
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-5.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.005 ETH</b>
                                                      <span>by <b>Jimmy Wright</b> at 6/14/2021, 6:40 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-1.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid accepted <b>0.005 ETH</b>
                                                      <span>by <b>Monica Lucas</b> at 6/15/2021, 3:20 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-2.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.005 ETH</b>
                                                      <span>by <b>Mamie Barnett</b> at 6/14/2021, 5:40 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-3.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.004 ETH</b>
                                                      <span>by <b>Nicholas Daniels</b> at 6/13/2021, 5:03 AM</span>
                                                  </div>
                                              </div>
        
                                              <div className="p_list">
                                                  <div className="p_list_pp">
                                                      <span>
                                                          <img className="lazy" src="./img/author/author-4.jpg" alt=""/>
                                                          <i className="fa fa-check"></i>
                                                      </span>
                                                  </div>                                    
                                                  <div className="p_list_info">
                                                      Bid <b>0.003 ETH</b>
                                                      <span>by <b>Lori Hart</b> at 6/12/2021, 12:57 AM</span>
                                                  </div>
                                              </div>
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