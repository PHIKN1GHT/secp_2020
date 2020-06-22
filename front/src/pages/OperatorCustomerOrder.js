import React, { useState, useEffect } from 'react';
import { ListItem, List, IconButton } from '@material-ui/core';
import { server, IsLoggedIn } from '../pages/Const';
import Toast from '../components/Toast';
import BottomNavBarForOperator from '../components/BottomNavBarForOperator';

export default function OrderCards(props) {
    const [ordersInfo, setOrderInfo] = useState([])
    const [init, setInit] = useState(true)
    const _token = 'Bearer ' + localStorage.getItem('access_token')
    const GetOrderIndex = (id) => {
        let i = 0
        for (i = 0; i < ordersInfo.length; ++i) {
            if (ordersInfo[i].orderID === id)
                return i
        }
        return -1
    }
    const GetOrdersInfo = () => {

        const url = server + '/api/order/all'
        fetch(url, {
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json',
                'Authorization': _token
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        }).then(response => response.json())
            .then(json => {
                let tmp = []
                //console.log(json)
                json.map((val, ind) => {
                    // 这里过滤
                    // || val.status === '已创建'
                    if (val.status === '待发货') {
                        tmp.push({
                            orderID: val.orderid,
                            receiver: val.receiver,
                            phone: val.phonenumber,
                            address: val.address,
                            status: val.status,
                            products: val.products,
                            price: val.total_cost,
                            create_time: val.create_time
                        })
                    }
                })
                setOrderInfo(prevState => {
                    if (tmp.length !== prevState.length) {
                        return tmp
                    }
                    for (let i in tmp) {
                        if (tmp[i] instanceof Array) {
                            for (let j in tmp[i]) {
                                if (tmp[i][j] !== prevState[i][j]) {
                                    return tmp
                                }
                            }
                        } else {
                            if (tmp[i] !== prevState[i]) {
                                return tmp
                            }
                        }
                    }
                    return prevState
                })
            })
    }
    useEffect(() => {
        if (init) {
            GetOrdersInfo()
            //console.log(ordersInfo)
            setInit(false)
        } else {

        }
    }, [])
    const handleChangeOrderStatus = (event) => {
        event.stopPropagation()
        const status = event.currentTarget.getAttribute('status')
        const actid = Number(event.currentTarget.getAttribute('actid'))
        const actIndex = GetOrderIndex(actid)
        const bodyData = JSON.stringify({ order_id: actid })
        if (status === '已创建') {
            //接受订单
            const url = server + '/api/order/accept'
            fetch(url, {
                body: bodyData,
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                    'Authorization': _token
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            }).then(res => res.json())
                .then(json => {
                    if (json.result) {
                        setOrderInfo(prevState => {
                            // 后端没有返回指定订单号的订单接口，自己编码吧
                            prevState[actIndex].status = '待接受'
                            let tmp = []
                            for (let i in prevState) {
                                tmp.push(prevState[i])
                            }
                            return tmp
                        })
                        Toast('接受成功', 500)
                    } else {
                        Toast('接受失败', 500)
                    }
                })

        } else if (status === '待发货') {
            //派送订单
            const url = server + '/api/order/deliver'
            fetch(url, {
                body: bodyData,
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                    'Authorization': _token
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            }).then(res => res.json())
                .then(json => {
                    if (json.result) {
                        setOrderInfo(prevState => {
                            // 后端没有返回指定订单号的订单接口，自己编码吧
                            prevState[actIndex].status = '待收货'
                            let tmp = []
                            for (let i in prevState) {
                                tmp.push(prevState[i])
                            }
                            return tmp
                        })
                        Toast('配货状态改变成功', 500)
                    } else {
                        Toast('配货状态改变失败', 500)
                    }
                })
        }
    }
    const handleJumptoOrderDetail = (event) => {
        const i = GetOrderIndex(Number(event.currentTarget.getAttribute('id')))
        props.history.push({
            pathname: '/order-detail',
            state: { order: ordersInfo[i] }
        })
    }
    const [isLoggedIn, setL] = useState(false)
    useEffect(() => {
        IsLoggedIn(['operator'], () => {
            setL(true)
        }, () => {
            setL(false)
            props.history.push({ pathname: '/login' })
        })
    }, [])
    return (<>{
        isLoggedIn ?
            <div className='operator-customer-order'>
                <List className='order-list'>
                    {ordersInfo.map((val, ind) =>
                        <ListItem className='item' id={val.orderID}
                            onClick={handleJumptoOrderDetail}>
                            <div className='order-card'>
                                <div className='head'>
                                    <div className='head-text'>订单号:{val.orderID}</div>
                                    <div className='head-text'>{val.status}</div>
                                    <div className='head-text'>￥{val.price}</div>
                                    <div className='button-box'>
                                        <IconButton className='button'
                                            variant='text' size='small'
                                            status={val.status}
                                            onClick={handleChangeOrderStatus}
                                            actid={val.orderID}
                                        >
                                            {val.status === '待发货' ?
                                                '接受' : '配送'
                                            }
                                        </IconButton>
                                    </div>
                                </div>
                                <div className='baseline'></div>
                                <div className='content'>
                                    <div className='text-add'>
                                        创建时间: {val.create_time.split(',')[1].split(' ')[3]}-
                                        {val.create_time.split(',')[1].split(' ')[2]}-
                                        {val.create_time.split(',')[1].split(' ')[1]}&nbsp;
                                        {val.create_time.split(',')[1].split(' ')[4]}
                                    </div>
                                </div>
                                <div className='baseline'></div>
                                <div className='content'>
                                    <div className='text-add'>收货地:{val.address}</div>
                                    <div className='line2'>
                                        <div className='text-rec'>收货人:{val.receiver}</div>
                                        <div className='text-phone'>手机:{val.phone}</div>
                                    </div>
                                </div>
                            </div>
                        </ListItem>
                    )}
                </List>
                <BottomNavBarForOperator />
            </div> : null
    }
    </>)
}