import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Checkbox, Button } from '@material-ui/core';
const styles = theme => ({
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
        marginLeft: 'auto',
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
        this.fetchAndInitial()
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
    }
    fetchProducts(catalogId) { 
        const url = 'http://localhost:2333//api/mall/catalog'
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
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const totalPage = json['totalPage']
            const products = json['products']
            this.setState({
                totalPage,
                products,
            })
        })
    }
    fetchAndInitial() { 
        const url = 'http://localhost:2333//api/mall/catalog'
        const bodyData = JSON.stringify({
        })
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const images = json['images']
            const detailImages = json['detailImages']
            const name = json['name']
            const price = json['price']
            const unit = json['unit']
            this.setState({
                images,
                detailImages,
                name,
                price,
                unit,
            })
        })
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
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
            <div className={classes.rowBox} style={{overflow:'hidden'}}>
                {/* 商品目录 */}
                <div style={{ overflowY: 'auto',scrollbarWidth:'none' }}>
                    {
                        this.state.catalogs.map((catalog) => { 
                            return (
                                <div style={{width:'15vw', height:'10vh'}}>
                                    <button onClick={this.handleSelectCatalog.bind(this)} id={catalog.id} style={{ width: '100%', height: "100%" }}>
                                        {catalog.name}
                                    </button>    
                                </div>
                            )
                        })
                    }
                </div>
                {/* 推荐商品 */}
                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'lavender',
                    overflowY: 'auto',
                    justifyContent: 'space-between',
                    scrollbarWidth: 'none',
     
                }} name="productArea">
                    {this.state.products[this.state.selectedCatalogId].map((product) => { 
                        return (
                        <div style={{
                                
                                width: '100%',
                                height:'15vh',
                                display: 'flex',
                                backgroundColor: 'lavender',
                            }} onClick={(e) => { this.handleClick(product.id) }}>
                        
                            <img className={classes.image} src="https://material-ui.com/static/images/cards/live-from-space.jpg" />
                                <div style={{
                                    flex:'1',
                                    display: 'flex',
                                    flexDirection: 'column', 
                                    backgroundColor: 'lavender',
                                }} className={classes.marginAround}>
                                <span>{product.name}</span>
                                <div>
                                    <span>￥{product.price}</span>
                                    <span>/{product.unit}</span>
                                    </div>
                                <div className={classes.rbCorner}>
                                    <AddShoppingCartIcon className={classes.shoppingIcon}/>

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