import React from 'react';
import { Card } from '@material-ui/core';
import { useState } from 'react';

export default function UserInfoCard(props) {
    const [username, setUsername] = useState('default')
    const [avaterURL, setAvaterURL] = useState('none')

    return (
        <div className='user-info'>
            <div className='user-info-card'>
                <div className='header'>
                    <div className='user-information'>
                        <img className='avatar' src={avaterURL} />
                        <div className='username'>{username}</div>
                    </div>
                </div>
                <div className='order-entry'>
                    <Card className='order-entry-'>
                        我的订单
                </Card>
                </div>
                <div className='address-entry'>
                    <Card className='order-entry-'>
                        收货地址
                </Card>
                </div>
            </div>
        </div>
    )
}