import React from 'react';
import { useState } from 'react';
import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
export default function UserInfoCard(props) {
    const [username, setUsername] = useState('default')
    const [avaterURL, setAvaterURL] = useState(
        'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture')
    const handleJumptoOrdersPage = (event) => {
        let tmpTarget = Object.assign(event.target)
        let type = tmpTarget.getAttribute('type')
        while (type === null || type === undefined) {
            tmpTarget = tmpTarget.parentNode
            type = tmpTarget.getAttribute('type')
        }
        props.history.push({ pathname: '/orders', state: { type: type } })
        //event.cancelBubble = true
        event.stopPropagation()
    }
    const handleJumptoAddressPage = (event) => {
        props.history.push({ pathname: '/address', state: { mes: 'a' } })
    }
    const handleLogout = () => {
        localStorage.removeItem('access_token')
        props.history.push({ pathname: '/login' })
    }
    return (<>
        <div className='user-info'>
            <div className='user-info-card'>
                <div className='header'>
                    <div className='user-information'>
                        <div className='avater-con'>
                            <img className='avater' src={avaterURL} />
                        </div>
                        <div className='username'>{username}</div>
                    </div>
                </div>
                <div className='cards'>
                    <div className='order-entry' type='全部' onClick={handleJumptoOrdersPage}>
                        <div className='head'>
                            <div className='main'>我的订单</div>
                            <ChevronRightIcon className='icon' />
                        </div>
                        <div className='baseline'></div>
                        <div className='body'>
                            <div className='item' type='待付款' onClick={handleJumptoOrdersPage}>
                                <ShoppingBasketIcon className='icon' />
                                <div className='text'>待付款</div>
                            </div>
                            <div className='item' type='待发货' onClick={handleJumptoOrdersPage}>
                                <AllInboxIcon className='icon' />
                                <div className='text'>待发货</div>
                            </div>
                            <div className='item' type='待收货' onClick={handleJumptoOrdersPage}>
                                <AirportShuttleIcon className='icon' />
                                <div className='text'>待收货</div>
                            </div>
                            <div className='item' type='已收货' onClick={handleJumptoOrdersPage}>
                                <CheckCircleRoundedIcon className='icon' />
                                <div className='text'>已收货</div>
                            </div>
                        </div>
                    </div>
                    <div className='address-entry' onClick={handleJumptoAddressPage}>
                        <div className='main'>收货地址</div>
                        <ChevronRightIcon className='icon' />
                    </div>
                    <div className='log-out' onClick={handleLogout}>
                        <PowerSettingsNewIcon className='icon' />
                        <div className='text'>退出登录</div>
                    </div>
                </div>
            </div>
            <div className='bottom'><BottomNavBarForCustomer />
            </div>
        </div>
    </>)
}