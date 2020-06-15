import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from './BottomNavBarForCustomer'

import { withStyles } from "@material-ui/core/styles";
import { IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

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
    topBar: {
        width:'100vw',
        height: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


class TopBar extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            products:[],
        }
    }
    componentWillMount() { 
       
        let products = []
        for (let i = 1; i <= 20; ++i){
            products.push({id:i, name:'products-'+i, price:'price-'+i, unit:'unit-'+i,cover:'cover-'+i})
        }
        this.setState({
            products,

        })
    }
    handleGoBack(){
        this.props.history.push({ pathname: this.props.backUrl,})
    }
    handleSearch(e) { 
        this.props.history.push({ pathname: '/product/search',})
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.topBar}>
                {
                    this.props.backUrl != undefined ?
                    <IconButton style={{'justifySelf':"flex-start"}} >
                        <ArrowBackIosIcon onClick={this.handleGoBack.bind(this)} />
                    </IconButton>
                        :null
                }
                {
                    this.props.canSearch ?
                        <>
                            <input onClick={this.handleSearch.bind(this)} readonly="readonly" style={{ width: '60%', height: '70%', }} />
                            <div style={{ margin: '0' }}>
                                <IconButton onClick={this.handleSearch.bind(this)} >
                                    <SearchIcon />
                                </IconButton>
                            </div>
                        </>
                        :null
                }
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(TopBar);