import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'
import TopBar from '../components/TopBar'
import {handleToCart} from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'
import { server } from './Const'


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
        //console.log(this.props.location)
        const filter = this.props.match.params.keyword

        // const filter = this.props.location.state['keyword'] == undefined ?
        //     this.props.location.state['record'].keyword :
        //     this.props.location.state['keyword']
        const page = 1
        const bodyData = JSON.stringify({
            filter,
            page,
        })
        const url = server + '/api/mall/search'
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
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
            }, () => { 
                if (this.props.location.state != undefined) { 
                    const record = this.props.location.state['record']
                    if (record != undefined ) { 
                        const productArea = document.getElementsByName('productArea')[0]
                        productArea.scrollTop = record.scrollTop
                    }
                }
            })
        })
    }
    handleGoBack() {
        let backUrl = this.props.location.state['backUrl']
        if (this.props.location.state['record'] != undefined) {
            backUrl = this.props.location.state['record']['backUrl']
        }
        const record = this.props.location.state['record']

        this.props.history.push({ pathname: backUrl, state: {record}})
    }
    handleSearch(e) { 
        let backUrl = this.props.location.state['backUrl']
        if (this.props.location.state['record'] != undefined) {
            backUrl = this.props.location.state['record']['backUrl']
        }
        const record = this.props.location.state['record']

        this.props.history.push({ pathname: '/product/search', state:{backUrl, record}})
    }
    handleClick(productId) { 

        const productArea = document.getElementsByName('productArea')[0]
       
        const scrollTop = productArea.scrollTop
        
        const keyword = this.props.match.params.keyword
        const backUrl = '/product/search/' + keyword
        const preBackUrl = this.props.location.state['backUrl']
        const record = { scrollTop, backUrl:preBackUrl }
        this.props.history.push({ pathname: '/product/detail/'+productId, state: {productId, record, backUrl}})
  
    }
    handleAddToCart(e, productId) { 
        e.stopPropagation()
        handleToCart(e, productId)
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>
            <JumpToCart />
            {/* 搜索框 */}
            <TopBar
                backIconHidden={false}
                fakeSearch={true}
                cartHidden={true}
                onGoBack={this.handleGoBack.bind(this)}
                onSearch={this.handleSearch.bind(this)} />
            {/* <div className={classes.searchBar}>
                <ArrowBackIosIcon onClick={this.handleGoBack.bind(this)} style={{ margin: '0 2vw',justifySelf:"flex-start", cursor:'pointer'}} />
                <input className={classes.input} onClick={this.handleSearch.bind(this)} readonly="readOnly" style={{}} />
                <div style={{ margin: '0 2vw', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <SearchIcon style={{cursor:'pointer'}} onClick={this.handleSearch.bind(this)} />
                </div>
            </div> */}
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
            {/* {this.props.location.state['keyword']} */}

            <div name={'productArea'} style={{overflowY:'auto', flex:'1'}}>
            {/* 推荐商品 */}
                <div className={classes.rowBox} style={{justifyContent: 'space-evenly',flexWrap:'wrap'}}>
                {this.state.products.map((product) => { 
                    return (
                        <div onClick={(e) => { this.handleClick.bind(this)(product.id)}} style={{ cursor:'pointer', borderRadius:'5px',  border:"1px solid", margin:'2vh 0 0 0', width: '48vw', height: '64vw', display: 'flex', flexDirection: 'column', alignItems:'center',borderColor: 'thistle',}}>
                            <img style={{ borderRadius: '5px 5px 0 0', width: '100%', maxHeight: (50 * 0.9) + 'vw' }} src={product.images[0]} />
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
                            <div
                                style={{
                                    alignSelf: 'flex-end',
                                    marginTop: 'auto',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                            }}>
                                <AddShoppingCartIcon onClick={(e) => { this.handleAddToCart.bind(this)(e, product.id) }} className={classes.shoppingIcon}/>
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