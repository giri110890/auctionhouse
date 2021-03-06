import React, { Component } from 'react';
import Select from 'react-select'
import ColumnNew from '../components/ColumnNew';
import Footer from '../components/footer';
import { useMoralis } from 'react-moralis';
import Moralis from 'moralis';
import { createGlobalStyle } from 'styled-components';

import {globalConstant} from '../../constants/global';
const { AuctionHouseAbi } = require('../../services/AuctionHouseAbi');

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


const options = [
  { value: 'All categories', label: 'All categories' },
  { value: 'Art', label: 'Art' },
  { value: 'Music', label: 'Music' },
  { value: 'Domain Names', label: 'Domain Names' }
]
const options1 = [
  { value: 'Buy Now', label: 'Buy Now' },
  { value: 'On Auction', label: 'On Auction' },
  { value: 'Has Offers', label: 'Has Offers' }
]
const options2 = [
  { value: 'All Items', label: 'All Items' },
  { value: 'Single Items', label: 'Single Items' },
  { value: 'Bundles', label: 'Bundles' }
]



export default class explore extends Component{
  constructor() {
    super();
    this.state = {
      nfts: [],
      total: 0
    };


    
   
   
   
  
   
  
  }

 

  render(){
    return(
      <>
  <div>
  <GlobalStyles/>
  
  <br/>
  <section className='jumbotron breadcumb no-bg'  style={{backgroundImage: `url(${'./img/background/subheader.jpg'})`}}>
          <div className='mainbreadcumb'>
            <div className='container'>
              <div className='row m-10-hor'>
                <div className='col-12'>
                  <h1 className='text-center'>Upcoming Auctions</h1>
                </div>
              </div>
            </div>
          </div>
        </section>
    <section className='container'>
      <br/>

    
          <div className='row'>
            <div className='col-lg-12'>
                <div className="items_filter">
                  <form className="row form-dark" id="form_quick_search" name="form_quick_search">
                      <div className="col">
                          <input className="form-control" id="name_1" name="name_1" placeholder="search item here..." type="text" /> <button id="btn-submit"><i className="fa fa-search bg-color-secondary"></i></button>
                          <div className="clearfix"></div>
                      </div>
                  </form>
                  <div className='dropdownSelect one'><Select styles={customStyles} menuContainerStyle={{'zIndex': 999}} defaultValue={options[0]} options={options} /></div>
                               </div>
            </div>
          </div>
         <ColumnNew/>
        </section>
  
  
    <Footer />
  </div>
      </>
    )
  }

 

};