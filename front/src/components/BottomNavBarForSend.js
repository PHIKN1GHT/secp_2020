import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DehazeIcon from '@material-ui/icons/Dehaze';
import HomeIcon from '@material-ui/icons/Home';
import BottomNavBar from './BottomNavBar';

export default function BottomNavBarForSend(props) {
    return (
        <BottomNavBar props={[
            { text: '上一个 ', url: '/' },
            { text: '发货 ', url: '/' },
            { text: '下一个 ', url: '/' }
        ]} />
    )
}