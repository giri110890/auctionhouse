import React, { Component } from "react";
import Clock from "../components/Clock";
import Footer from '../components/footer';
import { mintNFT } from '../../services/Interact';

import { createGlobalStyle } from 'styled-components';
import { hideLoader, showLoader } from "../../services/loaderservice";

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

const customStyles = {
  option: (base, state) => ({
    ...base,
    background: "#fff",
    color: "#333",
    borderRadius: state.isFocused ? "0" : 0,
    "&:hover": {
      background: "#eee",
    }
  }),
  menu: base => ({
    ...base,
    borderRadius: 0,
    marginTop: 0
  }),
  menuList: base => ({
    ...base,
    padding: 0
  }),
  control: (base, state) => ({
    ...base,
    padding: 2
  })
};
export default class Createpage extends Component {

  constructor() {
    super();
    this.onChange = this.onChange.bind(this);
    this.state = {
      files: [],
      title: " ",
      description: " ",
      price: 0,
      imageUrl: ""
    };
  }

  handleTitleChange = (event) => {
    var newTitle = document.getElementById("item_title").value;
    document.getElementById("nft_item_title").innerHTML = newTitle;
    this.setState({
      title: newTitle
    })
  }

  handleDescriptionChange = (event) => {
    var newDescription = document.getElementById("item_desc").value;
    this.setState({
      description: newDescription
    })
  }

  handlePriceChange = (event) => {
    var newPrice = document.getElementById("item_price").value;
    document.getElementById("nft_item_price_info").innerHTML = newPrice + " MATIC";
    this.setState({
      price: newPrice
    })
  }

  handleImageChange = (event) => {
    var newImageItem = document.getElementById("image_url").value;
    document.getElementById("get_file_2").src = newImageItem;
    this.setState({
      imageUrl: newImageItem
    })
  }

  onChange = async (e) => {
    var files = e.target.files;
    console.log(files);
    var filesArr = Array.prototype.slice.call(files);
    console.log(filesArr);
    document.getElementById("file_name").style.display = "none";
    this.setState({ files: [...this.state.files, ...filesArr] });
  }


  onMintSubmit = async (e) => {
    showLoader();
    document.getElementById("mint").disabled = true;
    await mintNFT(localStorage.getItem("walletAddress"), this.state.imageUrl, this.state.title, this.state.description, this.state.price);
    document.getElementById("mint").disabled = false;
    hideLoader()
  }

  render() {
    return (
      <div>
        <GlobalStyles />

        <section className='jumbotron breadcumb no-bg' style={{ backgroundImage: `url(${'./img/background/subheader.jpg'})` }}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Mint NFT</h1>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className='container'>

          <div className="row">
            <div className="col-lg-7 offset-lg-1 mb-5">
              <form id="form-create-item" className="form-border" action="#">
                <div className="field-set">
                  <h5>Image Url</h5>
                  <input type="text" onChange={this.handleImageChange} name="image_url" id="image_url" className="form-control" placeholder="e.g. 'Image Url" />

                  {/* <div className="d-create-file">
                          <p id="file_name">PNG, JPG, GIF, WEBP or MP4. Max 200mb.</p>
                          {this.state.files.map(x => 
                          <p key="{index}">PNG, JPG, GIF, WEBP or MP4. Max 200mb.{x.name}</p>
                          )}
                          <div className='browse'>
                            <input type="button" id="get_file" className="btn-main" value="Browse"/>
                            <input id='upload_file' type="file" multiple onChange={this.onChange} />
                          </div>
                          
                      </div> */}



                  <h5>Title</h5>
                  <input type="text" onChange={this.handleTitleChange} name="item_title" id="item_title" className="form-control" placeholder="e.g. 'Crypto Funk" />

                  <div className="spacer-10"></div>

                  <h5>Description</h5>
                  <textarea data-autoresize onChange={this.handleDescriptionChange} name="item_desc" id="item_desc" className="form-control" placeholder="e.g. 'This is very limited item'"></textarea>

                  <div className="spacer-10"></div>

                  <h5>Price</h5>
                  <input type="text" onChange={this.handlePriceChange} name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (MATIC)" />

                  <div className="spacer-10"></div>

                  {/* <h5>Royalties</h5>
                      <input type="text" name="item_royalties" id="item_royalties" className="form-control" placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%" /> */}

                  <div className="spacer-10"></div>

                  <input type="button" onClick={this.onMintSubmit} id="mint" className="btn-main" value="Mint NFT" />
                </div>
              </form>
            </div>

            <div className="col-lg-3 col-sm-6 col-xs-12">
              <h5>Preview item</h5>
              <div className="nft__item m-0">


                <div className="nft__item_wrap">
                  <span>
                    <img src="./img/collections/coll-item-3.jpg" id="get_file_2" className="lazy nft__item_preview" alt="" />
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
          </div>

        </section>

        <Footer />
      </div>
    );
  }
}