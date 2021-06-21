import React, { Component } from 'react';

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from '../img/logo.png';
import profile_icon from '../img/profile_icon.png';

class Header extends Component {
    render() {
        return(
            <nav className="flex items-center justify-between flex-wrap w-full px-32 py-5 pb-12 font-all h-header">
                <div className="flex items-center flex-shrink-0 text-white mr-6">
                    <a href="">
                        <img src={logo} alt="logo" className=""/>
                    </a>
                </div>
                <div className="bg-white flex items-center rounded-full shadow-md border-rounded w-search_bar">
                    <input type="text" placeholder="search..." className="w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none border-rounded font-light"/> 
                    <div className="pr-6">
                        <FontAwesomeIcon icon={faSearch} className="w-icon text-grey"/>
                    </div>
                </div>
                <div className="flex  flex-shrink-0">
                    <button className="bg-black text-white px-9 focus:outline-none border-rounded font-medium text-medium">Connect wallet</button>
                    <img src={profile_icon} alt="profile_icon" className="h-xl pl-5"/>
                </div>
            </nav>
        );
    }
}

export { Header };