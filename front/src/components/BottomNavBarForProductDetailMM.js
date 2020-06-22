import React from 'react';
import { Link } from "react-router-dom";

export default function BottomNavBarForProductDetailMM(props) {
    return (
        <div style={{height:'4vh', width:'100vw', backgroundColor:'deepskyblue'}}>
            <Link style={{ textDecoration: 'none', width: '100%', height: '100%' }} onClick={props.onClick}>
                <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
                    <font style={{ color:"white"}}>
                        修改
                    </font>
                </div>
            </Link>
        </div>
    )
}