import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'

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
    searchBar: {
        width:'100vw',
        height: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


class SearchResultPage extends Component { 
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
        this.props.history.push({ pathname: '/mainpage',})
    }
    handleSearch(e) { 
        this.props.history.push({ pathname: '/product/search',})
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>
            {/* 搜索框 */}
            <div className={classes.searchBar}>
                <IconButton style={{'justifySelf':"flex-start"}} >
                    <ArrowBackIosIcon onClick={this.handleGoBack.bind(this)} />
                </IconButton>
                <input onClick={this.handleSearch.bind(this)} readonly="readonly" style={{ width: '60%', height: '70%', }} />
                <div style={{ margin: '0' }}>
                    <IconButton onClick={this.handleSearch.bind(this)} >
                        <SearchIcon />
                    </IconButton>
                </div>
                {this.props.location.state['keyword']}
            </div>
            <div style={{overflowY:'auto'}}>
            {/* 推荐商品 */}
                <div className={classes.rowBox} style={{justifyContent: 'space-evenly',flexWrap:'wrap'}}>
                {this.state.products.map((product) => { 
                    return (
                        <div style={{borderRadius:'5px',  border:"1px solid", margin:'2vh 0 0 0', width: '48vw', height: '60vw', display: 'flex', flexDirection: 'column', alignItems:'center',borderColor: 'thistle',}}>
                            <img style={{borderRadius:'5px 5px 0 0', width: '100%', maxHeight: (50 * 0.9) + 'vw' }} src="https://material-ui.com/static/images/cards/live-from-space.jpg" />
                            <span>
                                {product.name}
                            </span>
                            <div>
                                <span>
                                    ￥{product.price}
                                </span>
                                <span>
                                    /{product.unit}
                                </span>
                            </div>
                            <div style={{alignSelf:'flex-end'}} >
                                <AddShoppingCartIcon className={classes.shoppingIcon}/>
                            </div>    
                        </div>
  
                    )
                })}
            </div>
            </div>
            <BottomNavBarForCustomer />
            
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(SearchResultPage);