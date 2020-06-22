import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import BottomNavBarForManager from '../components/BottomNavBarForManager';
import BottomNavBarForSend from '../components/BottomNavBarForSend'

/*******
 * 待完成
 * 上一个下一个实际功能实现
 *******/

export default function OrderManagementDetailPage(props) {
    const orderData = props.location.state['order']
    const handleGoBack = (event) => {
        props.history.goBack()
    }
    return (<>
        <div className='colBox'>
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
                        )
                    }
                </div>
            </div>
            <BottomNavBarForSend />
            <BottomNavBarForManager />
        </div>
    </>);
}