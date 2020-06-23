import React, { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { server, IsLoggedIn } from './Const';

export default function OrderDetailPage(props) {

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
                                id: val.id,
                                name: json.product.name,
                                count: val.count,
                                unit: json.product.unit,
                                unitprice: json.product.price,
                                price: (val.count * json.product.price).toFixed(2),
                                img: json.images,
                                dimg: json.detailImages
                            }
                        }).then(data => { resolve(data) })
                })
            )
        })
        Promise.all(funcs).then((values) => {
            orderDataFromPrev.products = values
            setOrderData(orderDataFromPrev)
        }).then(() => {
            setTimeout(() => { }, 200)
        })
    }
    const [backFlag, setB] = useState(false)
    useEffect(() => {
        if (props.location.state !== undefined) {
            if (props.location.state.record !== undefined) {
                const data = props.location.state.record.orderData
                if (data !== undefined) {
                    setOrderData(data)
                    setB(true)
                }
            } else {
                GetProducts(props.location.state['order'])
            }
        }
        else {
            directly = true
        }

    }, [])
    const handleGoBack = (event) => {
        if (backFlag) {
            props.history.go(-3)
            // console.log('as')
            // switch (usertype) {
            //     case 'operator':
            //         props.history.push({ pathname: '/operator-customer-order' })
            //         break;
            //     case 'customer':
            //         props.history.go(-3)
            //         //props.history.push({ pathname: '/orders', state: { type: '全部' } })
            //         break;
            // }
        } else {
            props.history.goBack()
        }
    }
    const handleJumpToProductDetail = (event) => {
        const id = Number(event.currentTarget.getAttribute('id'))
        props.history.push({
            pathname: '/product/detail/' + String(id),
            state: {
                backUrl: '/order-detail',
                record: {
                    orderData: orderData,
                },
            }
        })
    }
    const [loggedIn, setL] = useState(false)
    useEffect(() => {

        IsLoggedIn(['customer', 'operator'], () => {
            setL(true)
        }, () => {
            setL(false)
            props.history.push({ pathname: '/login' })
        })
    }, [])
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
                            <div className='text-add'>
                                创建时间:{orderData.create_time}
                                {/* {orderData.create_time.split(',')[1].split(' ')[3]}-
                                {orderData.create_time.split(',')[1].split(' ')[2]}-
                                {orderData.create_time.split(',')[1].split(' ')[1]}&nbsp;
                                {orderData.create_time.split(',')[1].split(' ')[4]} */}
                            </div>
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
                        <div className='text'>缩略图</div>
                        <div className='text'>商品名</div>
                        <div className='text'>数量</div>
                        <div className='text'>单位</div>
                        <div className='text'>单价</div>
                        <div className='text'>总价</div>
                    </div>

                    <div className='products'>
                        {
                            orderData.products !== undefined ?
                                orderData.products.map((val, ind) =>
                                    <>
                                        <div className='product' id={val.id} onClick={handleJumpToProductDetail}>
                                            <img className='prod-img' src={val.img}></img>
                                            <div className='text'>{val.name}</div>
                                            <div className='text'>{val.count}</div>
                                            <div className='text'>{val.unit}</div>
                                            <div className='text'>{val.unitprice}</div>
                                            <div className='text'>{val.price}</div>
                                        </div>

                                    </>
                                ) : null
                        }
                    </div>
                </div> : null
        }
    </>)
}