import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DehazeIcon from '@material-ui/icons/Dehaze';
import HomeIcon from '@material-ui/icons/Home';
import BottomNavBar from './BottomNavBar';

export default function BottomNavBarForManager(props) {
    return (
        <BottomNavBar props={[
            { icon: <HomeIcon />, text: '销售统计 ', url: '/salesStatistics' },
            { icon: <DehazeIcon />, text: '本地库存 ', url: '/localInventory' },
            { icon: <DehazeIcon />, text: '进货 ', url: '/purchase' },
            { icon: <DehazeIcon />, text: '我的 ', url: '/manager-info' }
        ]} />
    )
}