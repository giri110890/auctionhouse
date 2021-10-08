import React, { Component } from "react";
import styled from "styled-components";
import Clock from "./Clock";
import Moralis from 'moralis';
import { globalConstant } from '../../constants/global';
import { height } from "dom-helpers";
import { ToastContainer, toast } from 'react-toastify';
import { hideLoader, showLoader } from "../../services/loaderservice";
const { AuctionHouseAbi } = require('../../services/AuctionHouseAbi');

const Outer = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 8px;
`;

export default class Responsive extends Component {
    dummyData = [{
        deadline: "December, 30, 2021",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-1.jpg",
        previewImg: "./img/items/static-1.jpg",
        title: "Pinky Ocean",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-10.jpg",
        previewImg: "./img/items/static-2.jpg",
        title: "Deep Sea Phantasy",
        price: "0.06 ETH",
        bid: "1/22",
        likes: 80
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-11.jpg",
        previewImg: "./img/items/static-3.jpg",
        title: "Rainbow Style",
        price: "0.05 ETH",
        bid: "1/11",
        likes: 97
    },
    {
        deadline: "January, 1, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-12.jpg",
        previewImg: "./img/items/static-4.jpg",
        title: "Two Tigers",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-9.jpg",
        previewImg: "./img/items/anim-4.webp",
        title: "The Truth",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "January, 15, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-2.jpg",
        previewImg: "./img/items/anim-2.webp",
        title: "Running Puppets",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-3.jpg",
        previewImg: "./img/items/anim-1.webp",
        title: "USA Wordmation",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-4.jpg",
        previewImg: "./img/items/anim-5.webp",
        title: "Loop Donut",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "January, 3, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-5.jpg",
        previewImg: "./img/items/anim-3.webp",
        title: "Lady Copter",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-7.jpg",
        previewImg: "./img/items/static-5.jpg",
        title: "Purple Planet",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-6.jpg",
        previewImg: "./img/items/anim-6.webp",
        title: "Oh Yeah!",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "January, 10, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-8.jpg",
        previewImg: "./img/items/anim-7.webp",
        title: "This is Our Story",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-9.jpg",
        previewImg: "./img/items/static-6.jpg",
        title: "Pixel World",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    },
    {
        deadline: "January, 10, 2022",
        authorLink: "#",
        nftLink: "#",
        bidLink: "/ItemDetail",
        authorImg: "./img/author/author-12.jpg",
        previewImg: "./img/items/anim-8.webp",
        title: "I Believe I Can Fly",
        price: "0.08 ETH",
        bid: "1/20",
        likes: 50
    }]

    constructor(props) {
        super(props);
        this.state = {
            nfts: [],
            height: 0,
            total: 0,
            isCalled: false

        };
        this.onImgLoad = this.onImgLoad.bind(this);
        this.loadItems = this.loadItems.bind(this);
        this.loadItems(this);
    }

    loadItems = (thiscontext) => {
        let NFTs = {};
        let options = { address: globalConstant.contractAddress, chain: "mumbai" };
        showLoader();
        const me = this;
        if (!window._moralis) {
            const web3 = Moralis.enable().then(function (d) {
                window._moralis = d;
                window.auctionContract = new window._moralis.eth.Contract(AuctionHouseAbi, globalConstant.contractAddress);


                NFTs = Moralis.Web3API.account.getNFTs(options).then(function (data) {

                    debugger;
                    console.log(data);

                    data.result.map((d, i) => {
                        thiscontext.getTokenDetails(d.token_id).then(d => {
                            data.result[i]._votes = d.votes;
                            thiscontext.setState({
                                total: data.total,
                                nfts: data.result
                            })
                        })
                    })

                    debugger;
                    hideLoader();
                });
            });
        }
        else {
            NFTs = Moralis.Web3API.account.getNFTs(options).then(function (data) {

                console.log(data);

                data.result.map((d, i) => {
                    thiscontext.getTokenDetails(d.token_id).then(d => {
                        data.result[i]._votes = d.votes;
                        thiscontext.setState({
                            total: data.total,
                            nfts: data.result
                        })
                    })

                })

                debugger
                hideLoader();
            });
        }
    }

    voteForToken = async function (tokenID) {
        const options = {
            contractAddress: globalConstant.contractAddress,
            functionName: "vote",
            abi: AuctionHouseAbi,
            params: {
                tokenId: tokenID
            },
        };

        let receipt = await Moralis.executeFunction(options);
        if (receipt.status) {
            toast.success("Voting is successful", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
        debugger;
    }

    getMetadataFromString = function (metadataString, fieldName) {
        let jsonObject = JSON.parse(metadataString);
        if (jsonObject != null) {
            if (fieldName == "title") {
                return jsonObject.title;
            }
            else if (fieldName == "image") {
                return jsonObject.path;
            }
            else if (fieldName == "owner") {
                return jsonObject.owner;
            }
            else {
                return jsonObject.timestamp;
            }
        }

        return "";

    }

    loadMore = () => {
        let nftState = this.state.nfts
        let start = nftState.length
        let end = nftState.length + 4
        this.setState({
            nfts: [...nftState, ...(this.state.nfts.slice(start, end))]
        });
    }
    getTokenDetails = async (tokenID) => {
        const options = {
            contractAddress: globalConstant.contractAddress,
            functionName: "getTokenDetails",
            abi: AuctionHouseAbi,
            params: {
                tokenId: tokenID
            },
        };

        return Moralis.executeFunction(options);
    }
    onImgLoad({ target: img }) {

        let currentHeight = this.state.height;
        if (currentHeight < img.offsetHeight) {
            this.setState({
                height: img.offsetHeight
            })
        }
    }

    render() {
        return (
            <div className='row'>
                {this.state.nfts.map((nft, index) => (
                    <div key={index} className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12 mb-4">
                        <div className="nft__item m-0">

                            <div className="author_list_pp">
                                {/* <span onClick={()=> window.open(nft.authorLink, "_self")}>                                    
                            <img className="lazy" src={nft.authorImg} alt=""/>
                            <i className="fa fa-check"></i>
                        </span> */}
                            </div>
                            <div className="nft__item_wrap" style={{ height: `${this.state.height}px` }}>
                                <Outer>
                                    <span>
                                        <img onLoad={this.onImgLoad} src={this.getMetadataFromString(nft.metadata, "image")} style={{ height: "190px", width: "230px" }} className="lazy nft__item_preview" alt="" />
                                    </span>
                                </Outer>
                            </div>
                            <div className="nft__item_info">
                                <span onClick={() => { window.location.href = "/token/" + nft.token_id }}>
                                    <h4>{this.getMetadataFromString(nft.metadata, "title")}</h4>
                                </span>
                                <div className="nft__item_price">
                                    {nft.amount} MATIC<span>{nft.bid}</span>
                                </div>
                                <div className="nft__item_action">
                                    <span onClick={() => this.voteForToken(nft.token_id)}>Vote</span>
                                </div>
                                <div className="nft__item_like" style={{ color: "#8364E2", fontWeight: 300 }} onClick={() => { window.location.href = "/token/" + nft.token_id }}>
                                    <i className="fa fa-eye" ></i><span style={{ color: "#8364E2", fontWeight: 200 }} >{nft._votes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {this.state.nfts.length !== this.dummyData.length &&
                    <div className='col-lg-12'>
                        <div className="spacer-single"></div>
                        <span onClick={() => this.loadMore()} className="btn-main lead m-auto">Load More</span>
                    </div>
                }
            </div>
        );
    }
}