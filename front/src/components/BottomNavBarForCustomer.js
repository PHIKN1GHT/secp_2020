import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DehazeIcon from '@material-ui/icons/Dehaze';
import HomeIcon from '@material-ui/icons/Home';
import BottomNavBar from './BottomNavBar';

export default function BottomNavBarForCustomer(props) {
    return (
        <BottomNavBar props={[
            { icon: <HomeIcon />, text: '首页', url: '/mainpage' },
            { icon: <DehazeIcon />, text: '分类 ', url: '/product/catalogs' },
            { icon: <ShoppingCartIcon />, text: ' 购物车 ', url: '/shoppingCart' },
            { icon: <AccountCircleIcon />, text: '我的', url: '/user-info' }
        ]} />
    )
}