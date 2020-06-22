import React from 'react';
import { Link } from "react-router-dom";

export default function BottomNavBarForCreateOrder(props) {
    return (
        <div style={{ height: '4vh', width: '100vw', backgroundColor: 'deepskyblue', display: 'flex' }}>
            <div style={{
                backgroundColor: 'ghostwhite',
                width: '60vw',
                padding: '0 2vw 0 0',
                display: 'flex',
                flexDirection:'flex-end',
                alignItems: 'center',
                justifyContent:'flex-end',
            }}>
                <font style={{fontSize:'small'}}>合计:</font>
                <font style={{
                    color: 'deepskyblue',
                }}>￥{props.toPay}</font>
            </div>
            <div style={{ flex: '1', }}>
            <Link style={{ textDecoration: 'none', height: '100%' }} onClick={props.onClick}>
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', }}>
                    <font style={{ color:"white"}}>
                        提交订单
                    </font>
                </div>
                </Link>
            </div>
        </div>
    )
}