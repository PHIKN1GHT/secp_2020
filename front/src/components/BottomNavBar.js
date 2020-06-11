import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default function BottomNavBar(props) {
    const tmp = 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture'
    return (
        <div className='bottom-nav-bar'>
            <div className='items-con'>
                {
                    props['props'].map(val =>
                        <div className='item'>
                            <Link to={val['url']}>
                                <div className='icon'>
                                    <div className='img'>{val['icon']}</ div>
                                    <div className='text'>{val['text']}</div>
                                </div>
                            </Link>
                        </div>
                    )
                }
            </div >
        </div >
    )
}