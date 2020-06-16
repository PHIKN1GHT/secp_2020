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
        margin: '0 5vw 0 5vw',
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
        paddingLeft: '10px',
    }
});


class SearchResultPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            products: [],
            totalPage: 0,
        }
    }
    componentWillMount() { 
       this.fetchAndInitial()
        // let products = []
        // for (let i = 1; i <= 20; ++i){
        //     products.push({id:i, name:'products-'+i, price:'price-'+i, unit:'unit-'+i,cover:'cover-'+i})
        // }
        // this.setState({
        //     products,

        // })
    }
    fetchAndInitial() { 
        const filter = this.props.location.state['keyword']
        const page = 1
        const url = 'http://localhost:2333/api/mall/search'
        fetch(url, {
            // body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const products = json['products']
            const totalPage = json['totalPage']
            this.setState({
                products,
                totalPage,
            })
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
                <ArrowBackIosIcon onClick={this.handleGoBack.bind(this)} style={{ margin: '0 2vw',justifySelf:"flex-start", cursor:'pointer'}} />
                <input className={classes.input} onClick={this.handleSearch.bind(this)} readonly="readOnly" style={{}} />
                <div style={{ margin: '0 2vw', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <SearchIcon style={{cursor:'pointer'}} onClick={this.handleSearch.bind(this)} />
                </div>
            </div>
            {/* <div className={classes.searchBar}>
                <IconButton style={{'justifySelf':"flex-start"}} >
                    <ArrowBackIosIcon onClick={this.handleGoBack.bind(this)} />
                </IconButton>
                <input onClick={this.handleSearch.bind(this)} readonly="readonly" style={{ width: '60%', height: '70%', }} />
                <div style={{ margin: '0' }}>
                    <IconButton onClick={this.handleSearch.bind(this)} >
                        <SearchIcon />
                    </IconButton>
                </div>
            </div> */}
            {this.props.location.state['keyword']}

            <div style={{overflowY:'auto', flex:'1'}}>
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