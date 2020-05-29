import React from 'react';
import history from 'react-router-pro/lib/public/history';

export default function PicTxtSquare(props) {
    const handleClick = () => {
        history.push(props.to)
    }
    return (
        <div className='pic-txt-square' onClick={handleClick}>
            <img className='img' src={props.imgSrc} />
            <div className='txt'>{props.txt}</div>
        </div>
    )
}