import React, { useEffect, useState, Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import BottomNavBarForManager from '../components/BottomNavBarForManager';
import TopBar from '../components/TopBar';
import { server } from './Const'
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import {handleToPurchaseOrder} from '../components/JumpToPurchaseOrder';

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


class Purchase extends Component {
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
        // let categories = []
        // for (let i = 1; i <= 10; ++i){
        //     categories.push({id:i, name:'catalog-'+i})
        // }
        // let products = []
        // for (let i = 1; i <= 20; ++i){
        //     products.push({id:i, name:'products-'+i, price:'price-'+i, unit:'unit-'+i,cover:'cover-'+i})
        // }
        // this.setState({
        //     categories,
        //     products,

        // })
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
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
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
        const searchInput = document.getElementsByName('searchInput')[0]
        const keyword = searchInput.value
        const backUrl = '/purchase'
        this.props.history.push({ pathname: '/product/search', state: { backUrl } })
    }
    handleAddPurchaseOrder(e, productId) { 
        e.stopPropagation()
        handleToPurchaseOrder(e, productId)
    }
    handleClickProduct(productName, productPrice, productUnit) { 

        const productArea = document.getElementsByName('productArea')[0]
        const scrollTop = productArea.scrollTop
        
        
        const backUrl = '/purchase'
        
        const record = { scrollTop }
        this.props.history.push({ 
            pathname: '/purchase-order', 
            state: {productName, productPrice, productUnit, record, backUrl}})
    }

    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
            {/* 搜索框 */}
             <TopBar
                backIconHidden={true}
                fakeSearch={true}
                cartHidden={true}
                onSearch={this.handleSearch.bind(this)} 
            />
            <div name={'productArea'} style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', }}>
                {/* 进货商品展示 */}
                <div  className={classes.rowBox} style={{ justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                    {this.state.products.map((product) => {
                        return (
                            <div onClick={(e) => { this.handleClickProduct.bind(this)(product.name, product.price, product.unit)}} style={{ cursor:'pointer', borderRadius: '5px', border: "1px solid", margin: '2vh 0 0 0', width: '48vw', display: 'flex', flexDirection: 'column', alignItems: 'center', borderColor: 'thistle', }}>
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
                            </div>

                        )
                    })}
                </div>
            </div>
            <BottomNavBarForManager />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(Purchase);