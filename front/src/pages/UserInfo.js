import React from 'react';
import { useState } from 'react';

export default function UserInfoCard(props) {
    const [username, setUsername] = useState('default')
    const [avaterURL, setAvaterURL] = useState('none')

    return (
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
                <div className='order-entry'>
                    我的订单
                </div>
                <div className='address-entry'>
                    收货地址
                </div>
            </div>
        </div>
    )
}