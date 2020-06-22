import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
import { server } from './Const'

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'
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


class CatalogsPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            selectedCatalogId: -1,
            products: {},
            catalogs:[],
        }
        //this.record=undefined
    }
    componentDidMount() { 
        this.fetchAndInitial()
        //console.log(data)
        // this.setState({
        //     selectedCatalogId,
        //     catalogs,
        //     products,
        //     totalPage
        // })
        // let catalogs = []
        // for (let i = 1; i <= 10; ++i){
        //     catalogs.push({id:i, name:'catalog-'+i})
        // }
        // let products = {}
        // for (let catalog = 1; catalog <= 15; ++catalog){
        //     for (let i = 1; i <= 20; ++i){
        //         if (products[catalog] == undefined) {
        //             products[catalog] = []
        //         }
        //         products[catalog].push({id:catalog*100+i, name:'products-'+catalog*100+i, price:'price-'+catalog*100+i, unit:'unit-'+catalog*100+i,cover:'cover-'+catalog*100+i})
        //     }
        // }
        
        // this.setState({
        //     catalogs,
        //     products,
        // })
        
        // if (this.props.location.state != undefined) { 
        //     const record = this.props.location.state['record']
        //     if (record != undefined) { 
        //         this.setState(
        //             { selectedCatalogId: record.selectedCatalogId },
        //             () => { 
        //                 const productArea = document.getElementsByName('productArea')[0]
        //                 productArea.scrollTop = record.scrollTop
        //             }
        //         )
        //     }
        // }
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
        //this.record = this.props.location.state['record']
        // const bodyData = JSON.stringify({
        // })
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

                // this.setState({
                //     selectedCatalogId: data.selectedCatalogId,
                //     catalogs:data.catalogs,
                //     totalPage,
                //     products,
                // }, () => { 
                //         const record = this.props.location.state['record']
                //         if (record != undefined) { 
                //             const productArea = document.getElementsByName('productArea')[0]
                //             productArea.scrollTop = record.scrollTop
                //         }
                // })
            }).then(data => { resolve(data) })
        })
        promise.push(p2)
        Promise.all(promise).then((values) => {
            const selectedCatalogId = values[0].selectedCatalogId
            const catalogs = values[0].catalogs
            const products = values[1].products
            const totalPage = values[1].totalPage
            //console.log(products)
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
    calAbsPosition(element) { 
        let actualLeft = element.offsetLeft;
        let current = element.offsetParent;

　　　　while (current != undefined){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
        }
        let actualTop = element.offsetTop;
        current = element.offsetParent;

　　　　while (current != undefined){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
        }
        return {left: actualLeft, top: actualTop}
        
    }
    elementJump(element) { 
        //let cloneElement = element.cloneNode(true)
        //
        //取得底端购物车的元素，然后使用top, left, position确定最后的位置
        //
       
        
        let cloneElement = document.getElementsByName('circle')[0].cloneNode(true)
        console.log(cloneElement)
        cloneElement.style.position = 'absolute'
        cloneElement.style.zIndex = '99'
        cloneElement.style.display = 'initial'
        
        const nowPosition = element.getBoundingClientRect()
        cloneElement.style.left = nowPosition.left+'px'
        cloneElement.style.top = nowPosition.top + 'px'
        cloneElement.style.WebkitTransition ='top 1s, left 0.8s, width 1s, height 1s'
        cloneElement.style.transition = 'top 1s, left 0.8s, width 1s, height 1s'
        cloneElement.style.width = '2vh'
        cloneElement.style.height = '2vh'

        document.body.appendChild(cloneElement)
        setTimeout(
            () => { 
                const cart = document.getElementsByName('cart')[0]
                const cartPosition = this.calAbsPosition(cart)
                console.log(cartPosition)
                cloneElement.style.left = cartPosition.left+cart.offsetWidth/3+'px'
                cloneElement.style.top = cartPosition.top+cart.offsetHeight/6 + 'px'
                // cloneElement.style.width = 0+'px'
                // cloneElement.style.height = 0+'px'
                setTimeout(() => { document.body.removeChild(cloneElement) }, 1000)
            },
            0);
    }


    // handleSearch(e) { 
    //     this.props.history.push({ pathname: '/product/search',})
    // }
    handleSelectCatalog(e) { 
        this.setState({
            selectedCatalogId: e.target.id,
            nowPage:1,
        }, this.fetchProducts(this.state.selectedCatalogId))
        const productArea = document.getElementsByName('productArea')[0]
        productArea.scrollTop = 0
    }
    handleGoBack(){
        this.props.history.go(-1)
    }
    handleSearch(e) { 
        const productArea = document.getElementsByName('productArea')[0]

        const selectedCatalogId = this.state.selectedCatalogId
        const scrollTop = productArea.scrollTop
        const record = {selectedCatalogId, scrollTop}
        const backUrl = '/product/catalogs'
        this.props.history.push({ pathname: '/product/search', state: {backUrl, record}})

        // const searchInput = document.getElementsByName('searchInput')[0]
        // const keyword = searchInput.value
        // this.props.history.push({ pathname: '/product/search/'+keyword, state: { keyword } })
    
    }
    handleClick(productId) {
        const productArea = document.getElementsByName('productArea')[0]

        const selectedCatalogId = this.state.selectedCatalogId
        const scrollTop = productArea.scrollTop
        const record = { selectedCatalogId, scrollTop }
        const backUrl = '/product/catalogs'
        this.props.history.push({ pathname: '/product/detail/'+productId, state: {productId, record, backUrl}})

    }
    handleAddShoppingCart(e, productId) { 
        e.stopPropagation()
        const url = server+'/api/cart/add'
        const id = productId
        const count = 1
        const bodyData = JSON.stringify({
            id,
            count,

        })


        /*
        网络
        */
        // fetch(url, {
        //     body: bodyData, // must match 'Content-Type' header
        //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        //     credentials: 'include', // include, same-origin, *omit
        //     headers: {
        //         'content-type': 'application/json'
        //     },
        //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //     mode: 'no-cors', // no-cors, cors, *same-origin
        //     //redirect: 'follow', // manual, *follow, error
        //     //referrer: 'no-referrer', // *client, no-referrer
        // })
        // .then(response => response.json()) // parses response to JSON 
        // .then(json => {
        //     const result = json['result']
        //     if (!result) { 
        //         Toast('添加购物车失败', 403)
                
        //     }
        // }).catch(Toast('网络故障', 403))
        let element = e.target
        console.log(element.tagName)
        if (element.tagName == 'path') { 
            element = element.parentNode
        }
        this.elementJump(element)
    }
    handleAddToCart(e, productId) { 
        e.stopPropagation()
        handleToCart(e, productId)
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
            {/* document.getElementsByNames不识别svg元素？Yes */}
            {/* <div name='circle' style={{display:'none'}}>
                <LensIcon name='circleSVG' style={{height:'100%', width:'100%'}}  />
                </div> */}
            <JumpToCart />
                
            <TopBar
                backIconHidden={true}
                fakeSearch={true}
                cartHidden={true}
                onGoBack={this.handleGoBack.bind(this)}
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
                                <div className={classes.rbCorner}>
                                        <AddShoppingCartIcon  onClick={(e) => { this.handleAddToCart(e, product.id) }} className={classes.shoppingIcon}/>

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
            
                        <BottomNavBarForCustomer />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(CatalogsPage);