import React from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { Tab, Tabs } from '@material-ui/core';
import OrderCards from '../components/OrderCards';


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
    let defaultType = props.location.state['type']
    const [value, setValue] = React.useState(defaultType);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleGoBack = (event) => {
        props.history.go(-1)
    }
    return (<>
        <div className='orders'>
            <div className='head'>
                <div className='search-bar'>
                    <ArrowBackIosIcon className='backicon' onClick={handleGoBack} />
                    <div className='input-box'><input className='search-input' /></div>
                </div>
                <div className='baseline'></div>
                <Tabs className='tabs'
                    value={value}
                    onChange={handleChange}
                    centered
                    variant='fullWidth'
                    indicatorColor='primary'
                >
                    <Tab value='all' label='全部' className='item'></Tab>
                    <Tab value='topay' label='待付款' className='item'></Tab>
                    <Tab value='tosend' label='待发货' className='item'></Tab>
                    <Tab value='torec' label='待收货' className='item'></Tab>
                </Tabs>
            </div>
            <TabPanel value={value} index='all' className='card-wrapper'><OrderCards type={'all'} /></TabPanel>
            <TabPanel value={value} index='topay' className='card-wrapper'><OrderCards type={'topay'} /></TabPanel>
            <TabPanel value={value} index='tosend' className='card-wrapper'><OrderCards type={'tosend'} /></TabPanel>
            <TabPanel value={value} index='torec' className='card-wrapper'><OrderCards type={'torec'} /></TabPanel>
        </div>
    </>)
}