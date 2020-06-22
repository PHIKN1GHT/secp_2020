import React, { useEffect, useState, Component } from 'react';
import { Tab, Tabs, IconButton } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import BottomNavBarForManager from '../components/BottomNavBarForManager';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import OrderCards from '../components/OrderCards';

//待完成
//排序工具条

const styles = theme => ({
    colBox: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lavender',
    },
    rowBox: {
        width: '100vw',
        display: 'flex',
    },
    searchBar: {
        margin: '0 5vw 0 5vw',
        //width:'100vw',
        height: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: '70%',
        flex: '1 1',
        borderRadius: '20px',
        border: 'mediumaquamarine 1px solid',
        overflow: 'hidden',

    }
});



class SalesStatistics extends Component {
    constructor(props) {
        super(props)
        this.state = {
            renderDelete:false,
            sales: [
                { id: 0, date: "2019-5-25", sales: 25.9, unit: '元', cover:''},
                { id: 1, date: "2020-4-25", sales: 45.9, unit: '元', cover:''},
                { id: 2, date: "2020-5-25", sales: 55.9, unit: '元', cover:''},
                { id: 3, date: "2020-6-25", sales: 65.9, unit: '元', cover:''},
            ]
        }
    }
    
    handleClickStatistics() { 

        const statisticsArea = document.getElements('statisticsArea')[0]
        const scrollTop = statisticsArea.scrollTop
        
        const backUrl = '/'
        
        const record = { scrollTop }
        this.props.history.push({ 
            pathname: '/', 
            state: {record, backUrl}})
  
    }
    handleChange(event, newValue){
        
    };
    handleGoBack() {
        this.props.history.go(-1)
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
          
            <div name={'StatisticsArea'} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', }}>
                {/* 销售额展示 */}
                <div className='sales'>
                    <div className='head'>
                        <Tabs className='tabs'
                            value={this.value}
                            onChange={this.handleChange}
                            centered
                            variant='fullWidth'
                            indicatorColor='primary'
                        >
                            <Tab value='年统计' label='年统计' className='item'></Tab>
                            <Tab value='月统计' label='月统计' className='item'></Tab>
                            <Tab value='日统计' label='日统计' className='item'></Tab>
                        </Tabs>
                        {this.state.sales.map((sales)=>{return(
                            <div >
                                <div style={{}}>{sales.id}</div>
                                <div>{sales.date}</div>
                                <span>{sales.sales+sales.unit}</span>
                            </div>
                        )})}
                    </div>
                    
                </div>
            </div>
            <BottomNavBarForManager />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(SalesStatistics);