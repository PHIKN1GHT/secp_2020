import React from 'react';


export default function BottomNavBar(props) {
    return (
        <div className='bottom-nav-bar'>
            <div className='items-con'>
                <div className='item'>
                    <div className='icon'></div>
                    <div className='text'>首页</div>
                </div>
                <div className='item'>
                    <div className='icon'></div>
                    <div className='text'>分类</div>
                </div>
                <div className='item'>
                    <div className='icon'></div>
                    <div className='text'>购物车</div>
                </div>
                <div className='item'>
                    <div className='icon'></div>
                    <div className='text'>我的</div>
                </div>
            </div>
        </div>
    )
}