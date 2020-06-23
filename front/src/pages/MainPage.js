import { server } from './Const'
import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'
import TopBar from '../components/TopBar';
import {handleToCart} from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'
import Toast from '../components/Toast'
import { IsLoggedIn} from './Const'

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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

    },
    shoppingIcon: {
        color:'deepskyblue',
    }
});


class MainPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categories: [],
            products: [],
            totalPage: 0,
        }
    }
    componentWillMount() {
        this.fetchAndInitial()
    }
    fetchAndInitial() {
        // totalPage: number,
        // categories: [id: number, name: str],
        // products: [number: [id: number, name: str, price: number, unit: str, cover: '']]
        const url = server + '/api/mall/homepage'
        fetch(url, {
            // body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                //'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
            .then(response => { console.log(response); return response.json() }) // parses response to JSON 
            .then(json => {
                console.log(json)
                const categories = json['categories']
                const products = json['products']
                const totalPage = json['totalPage']
                this.setState({
                    categories,
                    products,
                    totalPage,
                    nowPage:1,
                }, () => {
                    if (this.props.location.state != undefined) {
                        const record = this.props.location.state['record']
                        if (record != undefined) {
                            const productArea = document.getElementsByName('productArea')[0]
                            productArea.scrollTop = record.scrollTop
                        }
                    }
                }
                )
            })
    }
    handleSearch(e) {
        //const searchInput = document.getElementsByName('searchInput')[0]
        //const keyword = searchInput.value
        const backUrl = '/'
        this.props.history.push({ pathname: '/product/search', state: { backUrl } })
    }
    handleAddToCart(e, productId) { 
        e.stopPropagation()
        handleToCart(e, productId)

        // IsLoggedIn(['customer'], () => {
        // }, () => {
        //         Toast("请先登陆")
        //         return
               
        // })
        
    }
    handleClickProduct(productId) { 

        const productArea = document.getElementsByName('productArea')[0]
        const scrollTop = productArea.scrollTop
        
        
        const backUrl = '/'
        
        const record = { scrollTop }
        this.props.history.push({ 
            pathname: '/product/detail/'+productId, 
            state: {productId, record, backUrl}})
  
    }
    handleClickCatalog(selectedCatalogId) {
        const scrollTop = 0
        const record = { selectedCatalogId, scrollTop }
        this.props.history.push({
            pathname: '/product/catalogs',
            state: { record },
        })
    
    }
    handleMore() { 
        if (this.state.nowPage == this.state.totalPage) { 
            Toast("没有更多商品")
            return
        }
        this.setState((preState) => { 
            let nowPage = preState.nowPage+1
            return {nowPage}
        }, () => {
                const url = server + '/api/mall/homepage'
                const page = this.state.nowPage
                const bodyData = JSON.stringify({
                    page
                })
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
                .then(response => { console.log(response); return response.json() }) // parses response to JSON 
                .then(json => {
                    console.log(json)
                    const categories = json['categories']
                    let products = JSON.parse(JSON.stringify(this.state.products)) 
                    products = products.concat(json['products'])
                    const totalPage = json['totalPage']
                    this.setState({
                        categories,
                        products,
                        totalPage,
                        nowPage:1,
                    }, () => {
                        if (this.props.location.state != undefined) {
                            const record = this.props.location.state['record']
                            if (record != undefined) {
                                const productArea = document.getElementsByName('productArea')[0]
                                productArea.scrollTop = record.scrollTop
                            }
                        }
                    }
                    )
                })    
                
        })

    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
            <JumpToCart />
            {/* 搜索框 */}
            <TopBar
                backIconHidden={true}
                fakeSearch={true}
                cartHidden={true}
                onSearch={this.handleSearch.bind(this)} />
            {/* <div className={classes.searchBar}>
                <ArrowBackIosIcon style={{visibility:'hidden', margin: '0 2vw',justifySelf:"flex-start", cursor:'pointer'}} />
                <input className={classes.input} onClick={this.handleSearch.bind(this)} readonly="readOnly" style={{}} />
                <div style={{ margin: '0 2vw', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <SearchIcon style={{cursor:'pointer'}} onClick={this.handleSearch.bind(this)} />
                </div>
            </div> */}
            <div name={'productArea'} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', }}>
                {/* 目录展示 */}
                <div className={classes.rowBox} style={{ flexWrap: 'wrap',justifyContent: 'center' }}>
                    {this.state.categories.map((catalog) => {
                        return (
                            <div onClick={() => { this.handleClickCatalog.bind(this)(catalog.id) }} style={{ cursor:'pointer', width: '18vw', height: '18vw', display: 'flex', flexDirection: 'column', alignItems: 'center', margin:'0 10px 10px 10px' }}>
                                <img style={{ borderRadius: '80%', width: '80%', height: '80%' }} src={catalog.image} />
                                <span>
                                    {catalog.name}
                                </span>
                            </div>
                        )
                    })}
                </div>
                {/* 推荐商品 */}
                <div  className={classes.rowBox} style={{ justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {this.state.products.map((product) => {
                        return (
                            <div onClick={(e) => { this.handleClickProduct.bind(this)(product.id)}} style={{ cursor:'pointer', borderRadius: '5px', border: "1px solid", margin: '2vh 0 0 0', width: '48vw', display: 'flex', flexDirection: 'column', alignItems: 'center', borderColor: 'thistle', }}>
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
                                <div style={{ alignSelf: 'flex-end' }} >
                                    <AddShoppingCartIcon onClick={(e) => { this.handleAddToCart.bind(this)(e, product.id) }} className={classes.shoppingIcon} />
                                </div>
                            </div>

                        )
                    })}
                </div>
                <div onClick={this.handleMore.bind(this)}
                    style={{
                        width: '100vw',
                        textAlign: 'center',
                        backgroundColor: 'thistle',
                        cursor: 'pointer',
                    }}
                >
                    <font style={{color:'white'}}>加载更多</font>
                </div>

            </div>
            <BottomNavBarForCustomer />
            
            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(MainPage);