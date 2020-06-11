import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
import ProductContainer from '../components/ProductContainer';
import ProductSideBar from '../components/ProductSideBar';
import ProductDetail from './ProductDetail';
import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer';
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
import { Grid, Container } from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import DehazeIcon from '@material-ui/icons/Dehaze';
import HomeIcon from '@material-ui/icons/Home';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
//--
//--样式--
const styles = theme => ({
    root: {
      //backgroundColor: "red"
    },
    phoneArea: {
        borderColor: '#0063cc',
        border: '2px solid',
        borderRadius: '10px',
        //display: 'flex',
        //flexDirection:'row',
        height: String((100 / 3 * 10 / 12) * 16/9) + 'vw',
        width:  String (100 / 3 * 10 / 12) + 'vw',
    }
});
//--

/*
props:

status:
catalogs:[{id:int, name:string}, ]
products:[{id:int, name:string, price:float, unit:str}]

selectedCatalog: int
productContainerPosion: int
selectedProduct: int
*/
class ProductView extends Component { 
    //静态内容
    // static propTypes = {
    //     receivedProps: PropTypes.object.isRequired,
    // }
    // static defaultProps = {
    //     key:value,
    // }
    //

    //构造函数
    constructor() {
        super()
        this.state = {
            selectedCatalog: 0,
            productContainerPosion: null,
            selectedProduct: null,
            catalogs: [
                { id: 0, name: '好货推荐' }, { id: 1, name: '肉类' }
            ],
            products: {
                0: [
                    { id: 0, name: '山东莱阳秋月梨', price: 25.9, unit: '箱', cover:''},
                    { id: 1, name: '云南红心木瓜', price: 29.9, unit: '箱', cover:'' },
                ],
                1: [
                    { id: 2, name: '西班牙伊比利亚黑猪猪颈肉', price: 105, unit: '件', cover:'' },
                    { id: 3, name: '御牛满地澳洲肥牛卷火锅食材牛肉片', price: 178, unit: '件', cover:'' },
                ],
                
            }
            
        }
    }
    //

    //组件生命周期
    // componentWillMount() { 
    //     this._getCatalogs().then(data => { 
    //         console.log(data);
    //         let selectedCatalog = this.state.selectedCatalog;
    //         //selectedProduct = this.state.selectedProduct;
    //         //productContainerPosion = this.state.productContainerPosion;
    //         if (selectedCatalog === null) { 
    //             selectedCatalog = data[0].id;
    //         }
        
    //         this.setState({
    //             catalogs: data,
    //             selectedCatalog: selectedCatalog,
    //         })
    //     }).then(() => { 
    //         this._getProducts().then(data => { 
    //             console.log(data)
    //             let productContainerPosion = this.state.productContainerPosion;
    //             if (productContainerPosion === null) { 
    //                 productContainerPosion = data[this.state.selectedCatalog][0].id;
    //             }
    //             this.setState({
    //                 products: data,
    //                 productContainerPosion: productContainerPosion,
    //             })
    //         })
    //         }
    //     )
        
    // }
    componentDidMount() {
        
        

    }
    componentWillUnmount() { 

    }
    //

    //私有方法,使用较少,使用_开头，ES6没有实现私有方法，所以这里的函数和别的成员函数没有性质上的区别
    _privateFunc() { 

    }
    _getCatalogs() {
        /*
            data = [{id:int, name:string}, ]
        */
        // Default options are marked with *
        let url = "www.example.com";
        let bodyData = {

        };
        return fetch(url, {
          body: JSON.stringify(bodyData), // must match 'Content-Type' header
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, same-origin, *omit
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          redirect: 'follow', // manual, *follow, error
          referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON
    }
    _getProducts() {
        /*
            data = {catalog_id:[{id:int, name:string, price:float, unit:string}...]}
        */
        // Default options are marked with *
        let url = "www.example.com";
        let bodyData = {

        };
        return fetch(url, {
          body: JSON.stringify(bodyData), // must match 'Content-Type' header
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, same-origin, *omit
          headers: {
            'user-agent': 'Mozilla/4.0 MDN Example',
            'content-type': 'application/json'
          },
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          redirect: 'follow', // manual, *follow, error
          referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON
      }
    //
    
    //事件监听
    handleSideBarClick(catalog_id) { 
        this.setState({
            selectedCatalog:catalog_id,
        })

    }
    handleContainerClick(product_id) { 
        this.setState({
            selectedProduct:product_id,
        })
    }
    handleBackClick(product_id) { 
        this.setState({
            selectedProduct:null,
        })
    }
    handleBar() { 

    }
    //


    //子渲染函数，有时候总渲染函数包含不同内容，建议分类渲染
    renderFoo() { 

    }
    renderBar() { 

    }
    //

    //渲染函数
    render() { 
        const { classes } = this.props;

        return (
            <>
            <Grid container spacing={30}>
            <Grid item xs={0}>
            </Grid>
                        <Grid  item container xs={12}>
                            {
                                this.state.selectedProduct === null?
                                        <>
                                            <Grid item xs={3}>
                                                <ProductSideBar
                                                    selectedCatalog={this.state.selectedCatalog}
                                                    catalogs={this.state.catalogs}
                                                    onClick={this.handleSideBarClick.bind(this)}
                                                />
                                            </Grid>
                                            <Grid item xs={9}>
                                                <ProductContainer
                                                    products={this.state.products[this.state.selectedCatalog]}
                                                    onClick={this.handleContainerClick.bind(this)}
                                                />
                                            </Grid>
                                    </>
                                    :
                                    <>
                                        <ProductDetail onClick={this.handleBackClick.bind(this)}/>
                                    </>
                        }
                        <BottomNavBarForCustomer />
                        
                        </Grid>
          
            <Grid item xs={0}>
            </Grid>
        </Grid>
            </>
        );
    }
    //


}
export default withStyles(styles, { withTheme: true })(ProductView);