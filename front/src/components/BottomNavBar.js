import React from 'react';


export default function BottomNavBar(props) {
    const tmp = 'https://uploadbeta.com/api/pictures/random/?key=BingEverydayWallpaperPicture'
    return (
        <div className='bottom-nav-bar'>
            <div className='items-con'>
                {
                    props['props'].map(val =>
                        <div className='item'>
                            <div className='icon'>
                                <img className='img' src={tmp} /></div>
                            <div className='text'>{val['text']}</div>
                        </div>
                    )
                }
            </div >
        </div >
    )
}