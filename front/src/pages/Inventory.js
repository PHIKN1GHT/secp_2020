import React, { useEffect, useState, Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import BottomNavBarForManager from '../components/BottomNavBarForManager';
import TopBar from '../components/TopBar';

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


class Inventory extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inventory: [
                { id: 0, name: '山东莱阳秋月梨', unit: '箱', cover:'', quantity:12},
                { id: 1, name: '云南红心木瓜', unit: '箱', cover:'',qauntity:1 },
                { id: 2, name: '西班牙伊比利亚黑猪猪颈肉', unit: '件', cover:'',quantity:7 },
                { id: 3, name: '御牛满地澳洲肥牛卷火锅食材牛肉片', unit: '件', cover:'',quantity:15},
            ]
        }
    }
    handleClickProduct() { 

        const productArea = document.getElements('ProductArea')[0]
        const scrollTop = productArea.scrollTop
        
        const backUrl = '/'
        
        const record = { scrollTop }
        this.props.history.push({ 
            pathname: '/', 
            state: {record, backUrl}})
  
    }

    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
            <div name={'ProductArea'} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', }}>
                {/* 库存展示 */}
                {this.state.inventory.map((inventory)=>{return(
                    <div>{inventory.id}</div>
                )})}
            </div>
            <BottomNavBarForManager />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(Inventory);