import React, { useEffect, useState } from 'react';
import { server } from '../pages/Const'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    functionBar: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: '100vw',
        height: '5vh',
        backgroundColor: 'ghostwhite',
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
            {
                props.renderDelete ?
                    <>
                    
            <div onClick={handlePay}
                style={{
                    backgroundColor: 'deepskyblue',
                    borderRadius: '5px',
                    height: '90%',
                    width: '20%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 0 0 2vw',
                    cursor:'pointer'
                    
                }}
            >
                <font style={{color:'white'}}>去结算</font>
            </div>
            
                    <div onClick={handleDelete}
                        style={{
                            backgroundColor: 'red',
                            borderRadius: '5px',
                            height: '90%',
                            width: '20%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor:'pointer'
                        }}
                    >
                        <font style={{color:'white'}}>删除</font>
                        </div>
                        </>
                    : null
            }
            <div style={{
                marginRight:'auto',
            }}>
                <input 
                    type="checkbox"
                    // defaultChecked={(() => { return false })()}
                    //value={this.state.reRenderCheckBox}
                    disableRipple={true}
                    onClick={props.handleSelectAll}
                    name='selectAll'
                    style={{
                        color:'#f50057',
                    }}
                    />
            </div>
            
        </div >
    )
}