import React, { useEffect, useState } from 'react';
import { server } from '../pages/Const'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    functionBar: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',

    }
}));
export default function FunctionBarForShoppingCart(props) {
    const classes = useStyles();
   
    const handlePay = (e) => {
        props.handlePay()
        
    }
    const handleDelete = (e) => { 
        props.handleDelete()
    }
    return (
        <div className={classes.functionBar}>
            <button onClick={handlePay}>去结算</button>
            {
                props.renderDelete ?
                    <button onClick={handleDelete}>删除</button>
                    : null
            }
            
        </div >
    )
}