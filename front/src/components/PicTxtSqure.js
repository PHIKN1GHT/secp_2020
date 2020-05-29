import React from 'react';
import history from 'react-router-pro/lib/public/history';

export default function PicTxtSquare(props) {
    console.log(props)
    const handleClick = () => {
        history.push(props.to)
    }
    return (
        <div className='PicTxtSquare' onClick={handleClick}>
            <img src={props.imgSrc} className='img' />
            <div className='txt'>{props.txt}</div>
        </div>
    )
}