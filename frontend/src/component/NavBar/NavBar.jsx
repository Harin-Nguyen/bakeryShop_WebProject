import React from 'react'
import './NavBar.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'
import { Link } from 'react-router-dom';

const NavBar = ({ setShowLogin }) => {

    const [menu, setMenu] = useState("home");


  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className="logo" />
        <ul className="navbar-menu">
            <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
            <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</a>
            <a href='#footer' onClick={()=>setMenu("about-us")} className={menu==="about-us"?"active":""}>About us</a>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <img src={assets.basket_icon} alt="" />
                <div className="dot"></div>
            </div>
            <button onClick={()=>setShowLogin(true)}>Sign In</button>
        </div>
    </div>
  )
}

export default NavBar
