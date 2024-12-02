import React from 'react'
import './NavBar.css'
import { assets } from '../../assets/assets'
import { useState } from 'react'

const NavBar = () => {

    const [menu, setMenu] = useState("home");


  return (
    <div className='navbar'>
        <img src={assets.logo} alt="" className="logo" />
        <ul className="navbar-menu">
            <li onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</li>
            <li onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</li>
            <li onClick={()=>setMenu("about-us")} className={menu==="about-us"?"active":""}>About us</li>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <img src={assets.basket_icon} alt="" />
                <div className="dot"></div>
            </div>
            <button>Sign In</button>
        </div>
    </div>
  )
}

export default NavBar