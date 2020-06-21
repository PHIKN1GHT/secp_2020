import React from 'react';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TocIcon from '@material-ui/icons/Toc';
import BottomNavBar from './BottomNavBar';

export default function BottomNavBarForOperator(props) {
    return (
        <BottomNavBar props={[
            { icon: <TocIcon />, text: '顾客订单', url: '/operator-customer-order' },
            { icon: <TocIcon />, text: '供货商订单', url: '/operator-supplier-order' },
            { icon: <AccountCircleIcon />, text: '我的 ', url: '/operator-info' }
        ]} />
    )
}