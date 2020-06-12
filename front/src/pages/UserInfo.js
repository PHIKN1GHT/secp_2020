import React from 'react';
import { useState } from 'react';
import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import AirportShuttleIcon from '@material-ui/icons/AirportShuttle';
import AllInboxIcon from '@material-ui/icons/AllInbox';
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
                    <div className='order-entry' type='all' onClick={handleJumptoOrdersPage}>
                        <div className='head'>
                            <div className='main'>我的订单</div>
                            <ChevronRightIcon className='icon' />
                        </div>
                        <div className='baseline'></div>
                        <div className='body'>
                            <div className='item' type='topay' onClick={handleJumptoOrdersPage}>
                                <ShoppingBasketIcon className='icon' />
                                <div className='text'>待付款</div>
                            </div>
                            <div className='item' type='tosend' onClick={handleJumptoOrdersPage}>
                                <AllInboxIcon className='icon' />
                                <div className='text'>待发货</div>
                            </div>
                            <div className='item' type='torec' onClick={handleJumptoOrdersPage}>
                                <AirportShuttleIcon className='icon' />
                                <div className='text'>待收货</div>
                            </div>
                        </div>
                    </div>
                    <div className='address-entry'>
                        <div className='main'>收货地址</div>
                        <ChevronRightIcon className='icon' />
                    </div>
                </div>
            </div>
            <div className='bottom'><BottomNavBarForCustomer /></div>
        </div>
    </>)
}