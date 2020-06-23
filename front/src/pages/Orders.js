import React, { useState, useEffect } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Tab, Tabs, IconButton } from '@material-ui/core';
import OrderCards from '../components/OrderCards';
import SearchIcon from '@material-ui/icons/Search';
import { IsLoggedIn } from './Const';

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

export default function OrdersPage(props) {

    //直接访问
    let directly = false


    let defaultType = ''
    if (props.location.state != undefined) {
        defaultType = props.location.state['type']
        directly = false
    } else {
        directly = true
    }
    const [value, setValue] = React.useState(defaultType);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleGoBack = (event) => {
        props.history.go(-1)
    }

    const [loggedIn, setL] = useState(false)
    useEffect(() => {
        IsLoggedIn(['customer'], () => {
            setL(true)
        }, () => {
            setL(false)
            props.history.push({ pathname: '/login' })
        })
    }, [])
    return (<>
        {loggedIn ?
            directly ?
                props.history.goBack() :
                <div className='orders'>
                    <div className='head'>
                        <div className='search-bar'>
                            <ArrowBackIosIcon className='backicon' onClick={handleGoBack} />
                            <div className='input-box'><input className='search-input' /></div>
                            <IconButton className='s-btn' color='primary'>
                                <SearchIcon className='btn' />
                            </IconButton>
                        </div>
                        <div className='baseline'></div>
                        <Tabs className='tabs'
                            value={value}
                            onChange={handleChange}
                            centered
                            scrollButtons='on'
                            variant='fullWidth'
                            variant='scrollable'
                            indicatorColor='primary'
                        >
                            <Tab value='全部' label='全部' className='item'></Tab>
                            <Tab value='已创建' label='已创建' className='item'></Tab>
                            <Tab value='待发货' label='待发货' className='item'></Tab>
                            <Tab value='待收货' label='待收货' className='item'></Tab>
                            <Tab value='已收货' label='已收货' className='item'></Tab>
                            <Tab value='已撤销' label='已撤销' className='item'></Tab>
                        </Tabs>
                    </div>
                    <TabPanel value={value} index='全部' className='card-wrapper'>
                        <OrderCards type='全部' history={props.history} />
                    </TabPanel>
                    <TabPanel value={value} index='已创建' className='card-wrapper'>
                        <OrderCards type='已创建' history={props.history} />
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
                    <TabPanel value={value} index='已撤销' className='card-wrapper'>
                        <OrderCards type='已撤销' history={props.history} />
                    </TabPanel>
                </div> : null
        }

    </>)
}