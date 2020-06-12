import React from 'react';
import { Link } from "react-router-dom";

export default function BottomNavBar(props) {
    return (
        <div className='bottom-nav-bar'>
            <div className='items-con'>
                {
                    props['props'].map(val =>
                        <div className='item'>
                            <Link className='link' to={val['url']}>
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