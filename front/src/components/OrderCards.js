import React, { useState, useEffect } from 'react';
import { ListItem, List, IconButton } from '@material-ui/core';
import { server, EQ } from '../pages/Const';
import Toast from '../components/Toast';

export default function OrderCards(props) {
    let orders = []
    let products = []
    for (let i = 0; i < 20; ++i) {
        products.push({
            name: '牛腩',
            count: 4,
            unit: '斤',
            unitprice: 20.4,
            price: 81.6
        })
    }
    for (let i = 0; i < 20; ++i)orders.push({
        orderID: String(i),
        products: products,
        receiver: '张三',
        phone: '12345678910',
        address: '上海市奉贤区xx路xx号',
        status: props['type'] === '全部' ? '' : props['type'],
        price: Math.ceil(Math.random() * 100) * 0.89,
    })
    const [ordersInfo, setOrderInfo] = useState(orders)
    const [init, setInit] = useState(true)
    const _token = 'Bearer ' + localStorage.getItem('access_token')
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
                console.log(json)
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
        if (status === '待付款') {
            Toast('付款！', 500)
        } else if (status === '待发货') {
            Toast('催货成功！', 500)
        } else if (status === '待收货') {
            Toast('收货成功！', 500)
        }
    }
    const handleJumptoOrderDetail = (event) => {
        let i = 0
        for (i = 0; i < orders.length; ++i) {
            if (orders[i].orderID === event.currentTarget.getAttribute('name'))
                break
        }
        props.history.push({
            pathname: '/order-detail',
            state: { order: orders[i] }
        })
    }
    return (<>
        <div className='order-cards'>
            <List className='order-list'>
                {ordersInfo.map((val, ind) =>
                    <ListItem className='item' name={val.orderID}
                        onClick={handleJumptoOrderDetail}>
                        <div className='order-card'>
                            <div className='head'>
                                <div className='head-text'>订单号:{val.orderID}</div>
                                <div className='head-text'>{val.status}</div>
                                <div className='head-text'>￥{val.price}</div>
                                {
                                    ['待付款', '待发货', '待收货'].includes(val.status) ?
                                        <div className='button-box'>
                                            <IconButton className='button'
                                                variant='text' size='small'
                                                status={val.status}
                                                onClick={handleChangeOrderStatus}>
                                                {
                                                    val.status === '待付款' ?
                                                        '立即付款' : val.status === '待发货' ?
                                                            '催催发货' : '确认收货'
                                                }
                                            </IconButton>
                                        </div> :
                                        <div className='button-box'></div>
                                }
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