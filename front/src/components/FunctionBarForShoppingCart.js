import React from 'react';
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
        //res提交给后端
        console.log(res)
    }
    return (
        <div className={classes.functionBar}>
            <button onClick={handlePay}>去结算</button>
        </div >
    )
}