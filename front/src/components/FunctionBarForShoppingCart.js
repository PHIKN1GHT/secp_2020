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
        const checks = document.getElementsByName('checkbox')
        let res = []
        checks.forEach(check => {
            if (check.checked) { 
                //如果选中，添加商品id到res, 后台根据商品id比对用户购物车得到数量
                res.push({
                    id: check.id,
                })
            }
        })
        
        const url = server + '/api/order/create'
        const bodyData = {
            ids: res,

        }
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const result = json['result']
            
        })
        
        //res提交给后端
        //console.log(res)
    }
    const handleDelete = (e) => { 
        const checks = document.getElementsByName('checkbox')
        let res = []
        checks.forEach(check => {
            if (check.checked) { 
                //如果选中，添加商品id到res, 后台根据商品id比对用户购物车得到数量
                res.push({
                    id: check.id,
                })
            }
            
           
        })
        const url = server + '/api/cart/del'
        const bodyData = {
            ids: res,
        }
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const result = json['result']
            
        })
        //res提交给后端
        console.log(res)
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