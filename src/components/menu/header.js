import React, { useEffect, useState } from "react";
import Breakpoint, { BreakpointProvider, setDefaultBreakpoints } from "react-socks";
import { header } from 'react-bootstrap';
import { Link } from '@reach/router';
import useOnclickOutside from "react-cool-onclickoutside";
import { useMoralis } from 'react-moralis';
import Moralis from 'moralis';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const { AuctionHouseAbi } = require('../../services/AuctionHouseAbi');
const contractAddress = '0xb129723d3e67ea7aeae04f1d2f4a401892a8c3c1';

setDefaultBreakpoints([
  { xs: 0 },
  { l: 1199 },
  { xl: 1200 }
]);

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? 'active' : 'non-active',
      };
    }}
  />
);



const Header =  function () {

  const { authenticate, isAuthenticated, authError, user, logout } = useMoralis();

  if(!window._moralis){
    const web3 = Moralis.enable().then(function (d){
      window._moralis = d;
      window.auctionContract = new window._moralis.eth.Contract(AuctionHouseAbi, contractAddress);
    });
  }

 
  if (authError) {
    toast.error(authError.message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }


  if (isAuthenticated) {

    localStorage.setItem('walletAddress', user.get("ethAddress"));

    // toast.success('Authentication successful', {
    //   position: "top-right",
    //   autoClose: 5000,
    //   hideProgressBar: false,
    //   closeOnClick: true,
    //   pauseOnHover: true,
    //   draggable: true,
    //   progress: undefined,
    //   });
  }
  else {
    localStorage.removeItem("walletAddress");
  }

  const [openMenu, setOpenMenu] = React.useState(false);
  const [openMenu1, setOpenMenu1] = React.useState(false);
  const [openMenu2, setOpenMenu2] = React.useState(false);
  const [openMenu3, setOpenMenu3] = React.useState(false);
  const handleBtnClick = (): void => {
    setOpenMenu(!openMenu);
  };
  const handleBtnClick1 = (): void => {
    setOpenMenu1(!openMenu1);
  };
  const handleBtnClick2 = (): void => {
    setOpenMenu2(!openMenu2);
  };
  const handleBtnClick3 = (): void => {
    setOpenMenu3(!openMenu3);
  };
  const closeMenu = (): void => {
    setOpenMenu(false);
  };
  const closeMenu1 = (): void => {
    setOpenMenu1(false);
  };
  const closeMenu2 = (): void => {
    setOpenMenu2(false);
  };
  const closeMenu3 = (): void => {
    setOpenMenu3(false);
  };
  const ref = useOnclickOutside(() => {
    closeMenu();
  });
  const ref1 = useOnclickOutside(() => {
    closeMenu1();
  });
  const ref2 = useOnclickOutside(() => {
    closeMenu2();
  });
  const ref3 = useOnclickOutside(() => {
    closeMenu3();
  });

  const [showmenu, btn_icon] = useState(false);
  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");

      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      } if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);
  return (
    <>
      <header id="myHeader" className='navbar white'>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <div className='container'>
          <div className='row w-100-nav'>
            <div className='logo px-0'>
              <div className='navbar-title navbar-item'>
                <NavLink to="/">
                  <img
                    src="./img/logo.png"
                    className="img-fluid d-block"
                    alt="#" style={{ height: '35px', paddingTop: '-105px' }}
                  />
                  <img
                    src="./img/logo.png"
                    className="img-fluid d-3"
                    alt="#"
                  />
                  <img
                    src="./img/logo.png"
                    className="img-fluid d-none"
                    alt="#" style={{ height: '35px', paddingTop: '-105px' }}
                  />
                </NavLink>
              </div>
            </div>

            {/* <div className='search'>
            <input id="quick_search" className="xs-hide" name="quick_search" placeholder="search item here..." type="text" />
          </div> */}

            <BreakpointProvider>
              <Breakpoint l down>
                {showmenu &&
                  <div className='menu'>
                    <div className='navbar-item'>
                      <NavLink to="/">
                        Home
                        <span className='lines'></span>
                      </NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/explore">
                        Upcoming Auctions
                        <span className='lines'></span>
                      </NavLink>
                    </div>
                    <div className='navbar-item'>
                      <NavLink to="/ItemDetail">
                        Live Auction
                        <span className='lines'></span>
                      </NavLink>
                    </div>
                    {isAuthenticated && (
                      <div className='navbar-item'>
                        <NavLink to="/Author">
                          Profile
                          <span className='lines'></span>
                        </NavLink>
                      </div>
                    )}

                    <div className='navbar-item'>
                      <NavLink to="/create">
                        Mint NFT
                        <span className='lines'></span>
                      </NavLink>
                    </div>
                  </div>
                }
              </Breakpoint>

              <Breakpoint xl>
                <div className='menu'>
                  <div className='navbar-item'>
                    <NavLink to="/">
                      Home
                      <span className='lines'></span>
                    </NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to="/upcomingauctions">
                      Upcoming Auctions
                      <span className='lines'></span>
                    </NavLink>
                  </div>
                  <div className='navbar-item'>
                    <NavLink to="/ItemDetail">
                      Live Auction
                      <span className='lines'></span>
                    </NavLink>
                  </div>
                  {isAuthenticated && (
                    <div className='navbar-item'>
                      <NavLink to="/Author">
                        Profile
                        <span className='lines'></span>
                      </NavLink>
                    </div>
                  )}


                  {isAuthenticated && (
                    <div className='navbar-item'>
                      <NavLink to="/create">
                        Mint NFT
                        <span className='lines'></span>
                      </NavLink>
                    </div>
                  )}


                </div>
              </Breakpoint>
            </BreakpointProvider>

            {isAuthenticated && (
              <div className='mainside'>
                <button onClick={() => logout()} className="btn-main"> Logout</button>

              </div>
            )}

            {!isAuthenticated && (
              <div className='mainside'>
                <button onClick={() => authenticate()} className="btn-main"> Connect Wallet</button>

              </div>
            )}

          </div>

          <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
            <div className="menu-line white"></div>
            <div className="menu-line1 white"></div>
            <div className="menu-line2 white"></div>
          </button>

        </div>


      </header>
    </>

  );
}
export default Header;