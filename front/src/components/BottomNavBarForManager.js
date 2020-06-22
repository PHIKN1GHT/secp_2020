import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DehazeIcon from '@material-ui/icons/Dehaze';
import HomeIcon from '@material-ui/icons/Home';
import BottomNavBar from './BottomNavBar';

export default function BottomNavBarForCustomer(props) {
    return (
        <BottomNavBar props={[
            { icon: <HomeIcon />, text: '订单 ', url: '/OrderManagement' },
            { icon: <DehazeIcon />, text: '我的 ', url: '/' }
        ]} />
    )
}