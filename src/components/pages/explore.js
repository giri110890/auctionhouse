import React from 'react';
import Select from 'react-select'
import ColumnNew from '../components/ColumnNew';
import Footer from '../components/footer';
import { createGlobalStyle } from 'styled-components';

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


const explore= () => (
<div>
<GlobalStyles/>

<br/>
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
                <div className='dropdownSelect two'><Select styles={customStyles} defaultValue={options1[0]} options={options1} /></div>
                <div className='dropdownSelect three'><Select styles={customStyles} defaultValue={options2[0]} options={options2} /></div>
            </div>
          </div>
        </div>
       <ColumnNew/>
      </section>


  <Footer />
</div>

);
export default explore;