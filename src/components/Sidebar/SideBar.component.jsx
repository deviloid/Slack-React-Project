import React from 'react';
import { Menu } from 'semantic-ui-react';
import UserInfo from "./UserInfo/UserInfo.component";
import Channels from "./Channels/Channels.component";
import PrivateChat from "./PrivateChat/PrivateChat.component";
import FavoriteChannels from "./FavoriteChannels/FavoriteChannels.component";

import './SideBar.css'

export const SideBar = () => {
    return (
        <Menu vertical fixed='left' borderless size='large' className='side_bar'>
            <UserInfo />
            <div id="seperator"></div>
            <Channels />
            <div id="seperator"></div>
            <PrivateChat />
            <div id="seperator"></div>
            <FavoriteChannels />
        </Menu>
    )
}