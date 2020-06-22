import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
                                name: json.product.name,
                                count: val.count,
                                unit: json.product.unit,
                                unitprice: json.product.price,
                                price: (val.count * json.product.price).toFixed(2)
                            }
                        }).then(data => { resolve(data) })
                })
            )
        })
        Promise.all(funcs).then((values) => {
            orderDataFromPrev.products = values
            const ar = orderDataFromPrev.create_time.split(',')[1].split(' ')
            orderDataFromPrev.create_time = ar[3] + '-' + ar[2] + '-' + ar[1] + ' ' + ar[4]
            setOrderData(prevState => {
                return orderDataFromPrev
            })
        }).then(() => {
            setTimeout(() => { }, 200)
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
    const [loggedIn, setL] = useState(false)
    useEffect(() => {

        IsLoggedIn(['customer', 'operator'], () => {
            setL(true)
        }, () => {
            setL(false)
            props.history.push({ pathname: '/login' })
        })
    }, [])
    return (
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
                    )
                }
            </div>
        </div>
    );
}