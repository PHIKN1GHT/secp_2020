import React from 'react';


export default function BottomNavBar(props) {
    const tmp = 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture'
    return (
        <div className='bottom-nav-bar'>
            <div className='items-con'>
                <div className='item'>
                    <div className='icon'>
                        <img className='img' src={tmp} /></div>
                    <div className='text'>首页</div>
                </div>

                <div className='item'>
                    <div className='icon'>
                        <img className='img' src={tmp} /></div>
                    <div className='text'>分类</div>
                </div>

                <div className='item'>
                    <div className='icon'>
                        <img className='img' src={tmp} /></div>
                    <div className='text'>购物车</div>
                </div>

                <div className='item'>
                    <div className='icon'>
                        <img className='img' src={tmp} /></div>
                    <div className='text'>我的</div>
                </div >
            </div >
        </div >
    )
}