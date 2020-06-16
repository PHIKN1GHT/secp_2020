import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
import { server } from './Const'

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'

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
});


class CatalogsPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            selectedCatalogId: 1,
            products: {},
            catalogs:[],
        }
    }
    componentWillMount() { 
        //this.fetchAndInitial()
        let catalogs = []
        for (let i = 1; i <= 10; ++i){
            catalogs.push({id:i, name:'catalog-'+i})
        }
        let products = {}
        for (let catalog = 1; catalog <= 15; ++catalog){
            for (let i = 1; i <= 20; ++i){
                if (products[catalog] == undefined) {
                    products[catalog] = []
                }
                products[catalog].push({id:catalog*100+i, name:'products-'+catalog*100+i, price:'price-'+catalog*100+i, unit:'unit-'+catalog*100+i,cover:'cover-'+catalog*100+i})
            }
        }
        
        this.setState({
            catalogs,
            products,
        })
        if (this.props.location.state != undefined) { 
            const record = this.props.location.state['record']
            if (record != undefined) { 
                this.setState(
                    { selectedCatalogId: record.selectedCatalogId },
                    () => { 
                        const productArea = document.getElementsByName('productArea')[0]
                        productArea.scrollTop = record.scrollTop
                    }
                )
            }
        }
    }
    fetchProducts(catalogId) { 
        const url = server + '/api/mall/catalog'
        const catalog = catalogId
        const page = 1
        const bodyData = JSON.stringify({
            catalog,
            page,
        })
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const totalPage = json['totalPage']
            const products = json['products']
            this.setState({
                totalPage,
                products,
            }, () => { 
                    const record = this.props.location.state['record']
                    if (record != undefined) { 
                        const productArea = document.getElementsByName('productArea')[0]
                        productArea.scrollTop = record.scrollTop
                    }
            })
        })
    }
    fetchAndInitial() { 
        const url = server + '/api/mall/catalogs'
        // const bodyData = JSON.stringify({
        // })
        fetch(url, {
            //body: bodyData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'no-cors', // no-cors, cors, *same-origin
            // redirect: 'follow', // manual, *follow, error
            // referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const catalogs = json['catalogs']
            const record = this.props.location.state['record']
            this.setState({
                selectedCatalogId: record == undefined?catalogs[0]:record.selectedCatalogId,
                catalogs,
            }, () => { 
                this.fetchProducts(this.state.selectedCatalogId)
            })
        })
    }
    elementJump(element) { 
        let cloneElement = element.cloneNode(true)
        //
        //取得底端购物车的元素，然后使用top, left, position确定最后的位置
        //
        //WebkitTransition:'marginleft 1s', transition:'margin-left 1s'
        // cloneElement.style.WebkitTransition = 
        // cloneElement.style.transition = 
        console.log(cloneElement)
    }


    handleSearch(e) { 
        this.props.history.push({ pathname: '/product/search',})
    }
    handleSelectCatalog(e) { 
        this.setState({
            selectedCatalogId: e.target.id,
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
        const record = {selectedCatalogId, scrollTop}
        this.props.history.push({ pathname: '/product/detail/'+productId, state: {productId, record}})

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

    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
            <TopBar
                backIconHidden={true}
                fakeSearch={true}
                onGoBack={this.handleGoBack.bind(this)}
                onSearch={this.handleSearch.bind(this)} />
            <div className={classes.rowBox} style={{overflow:'hidden'}}>
                {/* 商品目录 */}
                <div style={{ overflowY: 'auto',scrollbarWidth:'none' }}>
                    {
                        this.state.catalogs.map((catalog) => { 
                            return (
                                <div style={{width:'15vw', height:'6vh'}}>
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
                    {this.state.products[this.state.selectedCatalogId].map((product) => { 
                        return (
                            //商品卡片
                            <div style={{
                            }}
                                onClick={(e) => { this.handleClick(product.id) }}
                                className={classes.productCard}
                            >
                        
                            <img className={classes.image} src="https://material-ui.com/static/images/cards/live-from-space.jpg" />
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
                                        <AddShoppingCartIcon onClick={(e) => { this.handleAddShoppingCart(e, product.id) }} className={classes.shoppingIcon}/>

                                </div>
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
export default withStyles(styles, { withTheme: true })(CatalogsPage);