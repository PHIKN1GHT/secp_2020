import React, { useState, useEffect } from 'react';
import { ListItem, List, IconButton } from '@material-ui/core';
import { server } from '../pages/Const';
import Toast from '../components/Toast';

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
                json.map((val, ind) => {
                    const ar = val.create_time.split(',')[1].split(' ')
                    val.create_time = ar[3] + '-' + ar[2] + '-' + ar[1] + ' ' + ar[4]
                    if (props.type === val.status || props.type === '全部') {
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
            setInit(false)
        } else {

        }
    }, [])
    const handleChangeOrderStatus = (event) => {
        event.stopPropagation()
        const status = event.currentTarget.getAttribute('status')
        const actid = Number(event.currentTarget.getAttribute('actid'))
        const actIndex = GetOrderIndex(actid)
        const bodyData = JSON.stringify({ orderid: actid })
        if (status === '已创建') {
            //支付订单
            if (event.currentTarget.getAttribute('act') === 'pay') {
                const url = server + '/api/order/pay'
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
                                prevState[actIndex].status = '待发货'
                                let tmp = []
                                for (let i in prevState) {
                                    tmp.push(prevState[i])
                                }
                                return tmp
                            })
                            Toast('付款成功', 500)
                        } else {
                            Toast('付款失败', 500)
                        }
                    })

            } else {
                //取消订单
                const url = server + '/api/order/cancel'
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
                                prevState[actIndex].status = '已撤销'
                                let tmp = []
                                for (let i in prevState) {
                                    tmp.push(prevState[i])
                                }
                                return tmp
                            })
                            Toast('取消成功', 500)
                        } else {
                            Toast('取消失败', 500)
                        }
                    })
            }
        } else if (status === '待发货') {
            Toast('催货成功！', 500)
        } else if (status === '待收货') {
            //确认收货
            const url = server + '/api/order/cancel'
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
                            prevState[actIndex].status = '已收货'
                            let tmp = []
                            for (let i in prevState) {
                                tmp.push(prevState[i])
                            }
                            return tmp
                        })
                        Toast('收货成功', 500)
                    } else {
                        Toast('收货失败', 500)
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
    return (<>
        <div className='order-cards'>
            <List className='order-list'>
                {ordersInfo.map((val, ind) =>
                    <ListItem className='item' id={val.orderID}
                        onClick={handleJumptoOrderDetail}>
                        <div className='order-card'>
                            <div className='head'>
                                <div className='head-text'>订单号:{val.orderID}</div>
                                <div className='head-text'>{val.status}</div>
                                <div className='head-text'>￥{val.price}</div>
                                {
                                    ['已创建', '待发货', '待收货'].includes(val.status) ?
                                        <>
                                            <div className='button-box'>
                                                <IconButton className='button'
                                                    variant='text' size='small'
                                                    status={val.status}
                                                    onClick={handleChangeOrderStatus}
                                                    act='pay'
                                                    actid={val.orderID}
                                                >
                                                    {
                                                        val.status === '已创建' ?
                                                            '立即付款' : val.status === '待发货' ?
                                                                '催催发货' : '确认收货'
                                                    }
                                                </IconButton>

                                            </div>{val.status === '已创建' ?
                                                <div className='button-box'>
                                                    <IconButton
                                                        className='button'
                                                        variant='text' size='small'
                                                        status={val.status}
                                                        onClick={handleChangeOrderStatus}
                                                        act='cancel'
                                                        actid={val.orderID}
                                                    >
                                                        取消
                                                </IconButton> </div> : null
                                            }
                                        </>
                                        :
                                        <div className='button-box'></div>
                                }
                            </div>
                            <div className='baseline'></div>
                            <div className='content'>
                                <div className='text-add'>
                                    创建时间: {val.create_time}
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
        </div>
    </>)
}