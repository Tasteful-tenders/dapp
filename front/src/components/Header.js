import React, { Component } from 'react';

import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import logo from '../img/logo.png';
import profile_icon from '../img/profile_icon.png';

class Header extends Component {
    render() {
        return(
            <nav class="flex items-center justify-between flex-wrap w-full px-32 py-5 font-all">
                <div class="flex items-center flex-shrink-0 text-white mr-6">
                    <a href="">
                        <img src={logo} alt="logo" class=""/>
                    </a>
                </div>
                <div class="bg-white flex items-center rounded-full shadow-md border-rounded w-search_bar">
                    <input type="text" placeholder="search..." class="w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none border-rounded font-light"/> 
                    <div class="pr-6">
                        <FontAwesomeIcon icon={faSearch} class="w-icon text-grey"/>
                    </div>
                </div>
                <div class="flex  flex-shrink-0">
                    <button class="bg-black text-white px-9 focus:outline-none border-rounded font-medium text-medium">Connect wallet</button>
                    <img src={profile_icon} alt="profile_icon" class="h-xl pl-5" onclick="printMenuDropdown()"/>
                </div>
            </nav>
        );
    }
}

export { Header };