import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
import { server } from './Const'

import BottomNavBarForMMQuery from '../components/BottomNavBarForMMQuery'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import {handleToCart} from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'

import LensIcon from '@material-ui/icons/Lens';
import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Checkbox, Button } from '@material-ui/core';
const styles = theme => ({
    productCard: {
        cursor: 'pointer',
        width: '100%',
        height: '15vh',
        display: 'flex',
        backgroundColor: 'white',
        "&:hover": {
            backgroundColor:'lavender',
            // "&>*": {
            //     backgroundColor:'lavender',
            // },
            "& span": {
                backgroundColor:'lavender',
            },
            "& div": {
                backgroundColor:'lavender',
            }
            
        },
        webkitBoxSizing: 'border-box',
        mozBoxSizing: 'border-box',
        boxSizing: 'border-box',


        
    },
    colBox: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column', 
        backgroundColor: 'lavender',
    },
    rowBox: {
        overflowY:'auto',
        flex:'1',
        width: '100vw',
        display: 'flex',
        backgroundColor: 'lavender',

    },
    searchBar: {
        width:'100vw',
        height: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        // width: String(16) + 'vh',
        // height: String(16) + 'vh',
        width: 'auto',
        height: '80%',
        margin: 'auto 0 auto 10px',
        borderRadius:'5px',
    },
    card: {
        display: 'flex',
        boxShadow: '1px 1px 1px #CCCCCC',
        backgroundColor: 'ghostwhite',
        flexGrow:'1',
        //borderRadius:'5px',
        height: '15vh',
        margin: '1px 1px 1px 1px',
        // backgroundColor: '#fff',
        // boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    },
    marginAround: {
        margin:'auto 10px auto 10px',
    },
    rbCorner: {
        display: 'flex',
        flexDirection:'row-reverse',
        // marginLeft: 'auto',
        marginTop: 'auto',
    },
    shoppingIcon: {
        color:'deepskyblue',
    },
    
});


class MarketManagerQueryPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            selectedCatalogId: -1,
            products: {},
            catalogs:[],
        }
    }
    componentDidMount() { 
        this.fetchAndInitial()
        
    }
    fetchProducts(catalogId) { 
        const url = server + '/api/mall/category'
            const id = catalogId
            const page = 1
            const bodyData = JSON.stringify({
                id,
                page,
            })
            fetch(url, {
                body: bodyData, // must match 'Content-Type' header
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            })
            .then(response => response.json()) // parses response to JSON 
            .then(json => {
                const totalPage = json['totalPage']
                const products = json['products']
                this.setState({ 
                    totalPage,
                    products
                })
            })
    }
    fetchAndInitial() { 
        let promise = []
        let tmpSelectedCatalogId = 0
        const p1 = new Promise((resolve, reject) => {
            const url = server + '/api/mall/catalogs'
            fetch(url, {
                credentials: 'include', // include, same-origin, *omit
                headers: {
                },
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            })
                .then(response => response.json()) // parses response to JSON 
                .then((json) => {
                    const catalogs = json['catalogs']
                    let record = undefined
                    if (this.props.location.state != undefined) {
                        record = this.props.location.state['record']
                    }
                    console.log(111)
                    console.log(record)

                    const selectedCatalogId = record == undefined ? catalogs[0].id : record.selectedCatalogId
                    tmpSelectedCatalogId = selectedCatalogId
                    return { catalogs, selectedCatalogId }
                }).then(data => { resolve(data) })
        })
        promise.push(p1)
        const p2 = new Promise((resolve, reject) => {
            const url = server + '/api/mall/category'
            const catalog = tmpSelectedCatalogId
            const page = 1
            const bodyData = JSON.stringify({
                catalog,
                page,
            })
            fetch(url, {
                body: bodyData, // must match 'Content-Type' header
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            })
            .then(response => response.json()) // parses response to JSON 
            .then(json => {
                const totalPage = json['totalPage']
                const products = json['products']
                return {totalPage, products}
            }).then(data => { resolve(data) })
        })
        promise.push(p2)
        Promise.all(promise).then((values) => {
            const selectedCatalogId = values[0].selectedCatalogId
            const catalogs = values[0].catalogs
            const products = values[1].products
            const totalPage = values[1].totalPage
            this.setState({
                selectedCatalogId,
                catalogs,
                products,
                totalPage,
                nowPage:1,
            }, () => { 
                    let record = undefined
                    if (this.props.location.state != undefined) { 
                        record = this.props.location.state['record']
                    }
                if (record != undefined) { 
                    const productArea = document.getElementsByName('productArea')[0]
                    productArea.scrollTop = record.scrollTop
                }
            })
        })
            
        
    }
    
    

    
    handleSelectCatalog(e) { 
        this.setState({
            selectedCatalogId: e.target.id,
            nowPage:1,
        }, this.fetchProducts(this.state.selectedCatalogId))
        const productArea = document.getElementsByName('productArea')[0]
        productArea.scrollTop = 0
    }
    
    handleSearch(e) { 
        const productArea = document.getElementsByName('productArea')[0]

        const selectedCatalogId = this.state.selectedCatalogId
        const scrollTop = productArea.scrollTop
        const record = {selectedCatalogId, scrollTop}
        const backUrl = '/mm/query'
        this.props.history.push({ pathname: '/product/search', state: {backUrl, record}})
    }
    handleClick(productId) {
        const productArea = document.getElementsByName('productArea')[0]
        const selectedCatalogId = this.state.selectedCatalogId
        const scrollTop = productArea.scrollTop
        const record = { selectedCatalogId, scrollTop }
        const mm = true
        const backUrl = '/mm/query'
        this.props.history.push({ pathname: '/product/detail/'+productId, state: {productId, mm, record, backUrl}})
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
            const url = server + '/api/mall/category'
            const catalog = this.state.selectedCatalogId
            const page = this.state.nowPage+1
            const bodyData = JSON.stringify({
                catalog,
                page,
            })
            fetch(url, {
                body: bodyData, // must match 'Content-Type' header
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json'
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            })
            .then(response => response.json()) // parses response to JSON 
            .then(json => {
                const totalPage = json['totalPage']
                let products = JSON.parse(JSON.stringify(this.state.products))
                products = products.concat(json['products'])
                this.setState((preState) => { 
                    return {
                        nowPage: preState.nowPage + 1,
                        products,
                        totalPage,
                    }
                })  
            })    
        })
    }
    render() {
        const { classes } = this.props;
        return (
        <div className={classes.colBox} style={{}}>
           
                
            <TopBar
                backIconHidden={true}
                fakeSearch={true}
                cartHidden={true}
                
                onSearch={this.handleSearch.bind(this)} />
            {
            this.state.selectedCatalogId == -1 ?
            <div className={classes.rowBox} style={{ overflow: 'hidden' }}></div>
                    :
                        
            <div className={classes.rowBox} style={{overflow:'hidden'}}>
                {/* 商品目录 */}
                <div style={{ overflowY: 'auto',scrollbarWidth:'none' }}>
                    {
                        this.state.catalogs.map((catalog) => { 
                            return (
                                <div style={{width:'20vw', height:'6vh'}}>
                                    <button onClick={this.handleSelectCatalog.bind(this)} id={catalog.id}
                                        style={{
                                            width: '100%',
                                            height: "100%",
                                            borderStyle: 'hidden',
                                            cursor: 'pointer',
                                            backgroundColor: this.state.selectedCatalogId == catalog.id ? 'white' : 'lavender',
                                        }}>
                                        {catalog.name}
                                    </button>    
                                </div>
                            )
                        })
                    }
                </div>
                {/* 目录下所有商品 */}
                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    overflowY: 'auto',
                    justifyContent: 'space-between',
                    scrollbarWidth: 'none',
     
                }} name="productArea">
                    {this.state.products.map((product) => { 
                        return (
                            //商品卡片
                            <div style={{
                            }}
                                onClick={(e) => { this.handleClick(product.id) }}
                                className={classes.productCard}
                            >
                        
                                <img className={classes.image} src={product.images[0]} />
                                <div style={{
                                    flex:'1',
                                    display: 'flex',
                                    flexDirection: 'column', 
                                    backgroundColor: 'white',
                                }} className={classes.marginAround}>
                                <span>{product.name}</span>
                                <div>
                                    <span>￥{product.price}</span>
                                    <span>/{product.unit}</span>
                                    </div>
                               
                                    </div>

                        </div>
                        )
                    })}
                <div onClick={this.handleMore.bind(this)}
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        backgroundColor: 'thistle',
                        cursor: 'pointer',
                    }}
                >
                    <font style={{color:'white'}}>加载更多</font>
                </div>
                </div>
            </div>    
            }
            
                        <BottomNavBarForMMQuery />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(MarketManagerQueryPage);