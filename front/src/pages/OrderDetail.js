import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

export default function OrderDetailPage(props) {
    const orderData = props.location.state['order']
    const handleGoBack = (event) => {
        props.history.goBack()
    }
    return (<>
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
            <div className='products'>

            </div>
        </div>
    </>);
}