import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Tab, Tabs, IconButton } from '@material-ui/core';
import OrderCards from '../components/OrderCards';
import BottomNavBarForOrderManager from '../components/BottomNavBarForOrderManage';
import SearchIcon from '@material-ui/icons/Search';

/*******
 * 待完成
 *
 *******/

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <div className='fuck-it-donot-use-a-named-css-like-this'>{children}</div>
            )}
        </div>
    );
}

export default function OrderManagement(props) {
    let defaultType = props.location.state['type']
    const [value, setValue] = React.useState(defaultType);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleJumptoOrdersPage = (event) => {
        let tmpTarget = Object.assign(event.target)
        let type = tmpTarget.getAttribute('type')
        while (type === null || type === undefined) {
            tmpTarget = tmpTarget.parentNode
            type = tmpTarget.getAttribute('type')
        }
        props.history.push({ pathname: '/orderManagementDetail', state: { type: type } })
        //event.cancelBubble = true
        event.stopPropagation()
    }   
    const handleGoBack = (event) => {
        props.history.go(-1)
    }

    return (<>
        <div className='colBox'>
            <div className='orders'>
                <div className='head'>
                    
                    <div className='baseline'></div>
                    <Tabs className='tabs'
                        value={value}
                        onChange={handleChange}
                        centered
                        variant='fullWidth'
                        indicatorColor='primary'
                    >
                        <Tab value='全部' label='全部' className='item'></Tab>
                        <Tab value='待付款' label='待付款' className='item'></Tab>
                        <Tab value='待发货' label='待发货' className='item'></Tab>
                        <Tab value='待收货' label='待收货' className='item'></Tab>
                        <Tab value='已收货' label='已收货' className='item'></Tab>
                    </Tabs>
                </div>
                <TabPanel value={value} index='全部' className='card-wrapper'>
                    <OrderCards type='全部' history={props.history} />
                </TabPanel>
                <TabPanel value={value} index='待付款' className='card-wrapper'>
                    <OrderCards type='待付款' history={props.history} />
                </TabPanel>
                <TabPanel value={value} index='待发货' className='card-wrapper'>
                    <OrderCards type='待发货' history={props.history} />
                </TabPanel>
                <TabPanel value={value} index='待收货' className='card-wrapper'>
                    <OrderCards type='待收货' history={props.history} />
                </TabPanel>
                <TabPanel value={value} index='已收货' className='card-wrapper'>
                    <OrderCards type='已收货' history={props.history} />
                </TabPanel>
            </div>
            <BottomNavBarForOrderManager />
        </div>
    </>)
}