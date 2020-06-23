import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DehazeIcon from '@material-ui/icons/Dehaze';
import HomeIcon from '@material-ui/icons/Home';
import BottomNavBar from './BottomNavBar';

export default function BottomNavBarForMarketManager(props) {
    return (
        <BottomNavBar props={[
            { icon: <HomeIcon />, text: '统计 ', url: '/mm/statistics' },
            { icon: <DehazeIcon />, text: '查询 ', url: '/mm/' },
            { icon: <DehazeIcon />, text: '协商 ', url: '/' },
            { icon: <DehazeIcon />, text: '我的 ', url: '/' },


        ]} />
    )
}