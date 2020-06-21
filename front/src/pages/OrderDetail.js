import React, { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { server, IsLoggedIn } from './Const';

export default function OrderDetailPage(props) {

    let loggedIn = true
    IsLoggedIn(() => {
    }, () => {
        loggedIn = false
        props.history.push({ pathname: '/login' })
    })
    let directly = false
    let ordersFromPrev
    const _token = 'Bearer ' + localStorage.getItem('access_token')
    const [orderData, setOrderData] = useState({})
    // 获取货品信息
    const GetProducts = (orderDataFromPrev) => {
        let funcs = []
        orderDataFromPrev.products.map((val, ind) => {
            const url = server + '/api/product/detail'
            const bodyData = JSON.stringify({ id: Number(val.id) })
            funcs.push(
                new Promise((resolve, reject) => {
                    fetch(url, {
                        body: bodyData,
                        credentials: 'include', // include, same-origin, *omit
                        headers: {
                            'content-type': 'application/json',
                            'Authorization': _token
                        },
                        method: 'POST', // *GET, POST, PUT, DELETE, etc.
                        mode: 'cors', // no-cors, cors, *same-origin
                    }).then(response => response.json())
                        .then(json => {
                            
                            return {
                                name: json.name,
                                count: val.count,
                                unit: json.unit,
                                unitprice: json.price,
                                price: (val.count * json.price).toFixed(2)
                            }
                        }).then(data => { resolve(data) })
                })
            )
        })
        Promise.all(funcs).then((values) => {
            orderDataFromPrev.products = values
            setOrderData(prevState => {
                return orderDataFromPrev
            })
        })
    }
    useEffect(() => {
        if (props.location.state !== undefined)
            GetProducts(ordersFromPrev)
    }, [])
    // 从入口进入不是直接访问，合法
    if (props.location.state !== undefined) {
        ordersFromPrev = props.location.state['order']

    }
    //登陆后不能直接访问该页面，必须有入口
    else {
        directly = true
    }

    const handleGoBack = (event) => {
        props.history.goBack()
    }
    return (<>
        {loggedIn ?
            directly ? props.history.goBack() :
                <div className='order-detail' name={`item-${orderData.orderID}`}>
                    <div className='backicon-con'>
                        <ArrowBackIosIcon className='backicon' onClick={handleGoBack} />
                        <div className='head'>订单详情</div>
                    </div>
                    <div className='order-card'>
                        <div className='head'>
                            <div className='head-text'>订单号:{orderData.orderID}</div>
                            <div className='head-text'>{orderData.status}</div>
                            <div className='head-text'>￥{orderData.price}</div>
                        </div>
                        <div className='baseline'></div>
                        <div className='content'>
                            <div className='text-add'>收货地:{orderData.address}</div>
                            <div className='line2'>
                                <div className='text-rec'>收货人:{orderData.receiver}</div>
                                <div className='text-phone'>手机:{orderData.phone}</div>
                            </div>
                        </div>
                    </div>
                    <div className='header'>
                        <div className='text'>商品</div>
                        <div className='text'>数量</div>
                        <div className='text'>单位</div>
                        <div className='text'>单价</div>
                        <div className='text'>总价</div>
                    </div>
                    <div className='products'>
                        {
                            orderData.products !== undefined ?
                                orderData.products.map((val, ind) =>
                                    <div className='product'>
                                        <div className='text'>{val.name}</div>
                                        <div className='text'>{val.count}</div>
                                        <div className='text'>{val.unit}</div>
                                        <div className='text'>{val.unitprice}</div>
                                        <div className='text'>{val.price}</div>
                                        {/* <div className='name'>{val.name}</div>
                            <div className='count'>{val.count}</div>
                            <div className='unit'>{val.unit}</div>
                            <div className='unitprice'>{val.unitprice}</div>
                            <div className='price'>{val.price}</div> */}
                                    </div>
                                ) : null
                        }
                    </div>
                </div> : null
        }
    </>)
}