import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';


import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import {handleToCart} from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'
import FunctionBarForShoppingCart from '../components/FunctionBarForShoppingCart';
import { server,IsLoggedIn } from './Const'

import LensIcon from '@material-ui/icons/Lens';
import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import { Checkbox, Button } from '@material-ui/core';


import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from '@material-ui/core/TextField';
// import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
    page: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lavender',
        flex: '1',
        overflowY: 'auto',
    },
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
        height: '100%',
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
    input: {
        height: '18px',
        width: '18px',
        textAlign: 'center',
        borderStyle: 'solid',
        borderWidth: '1px',
        display: 'inline-block',
        borderRadius:'2px',
        
    },
    removePadding: {
        padding:"0",
    },
    shoppingIcon: {
       
       

    },
    
});


class ShoppingCartPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            products: [],
            renderDelte:false,
            
        }
        this.selected = 0
        //this.record=undefined
    }
    componentWillMount() { 
        this._initial()
       
    }
    _initial() {
        IsLoggedIn(['customer'], () => {
        }, () => {
                const backUrl = '/shoppingCart'
                this.props.history.push({ pathname: '/login', state: {backUrl} })
        })
        const _token = 'Bearer ' + localStorage.getItem('access_token')
        const url = server+'/api/cart/all'
        fetch(url, {
            //body: bodyData,
            credentials: 'include', // include, same-origin, *omit
            headers: {
                //'content-type': 'application/json',
                'Authorization': _token
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        }).then(response => response.json())
            .then(json => {
                //console.log(json)
                const products = json
                //console.log(products)
            this.setState({
                products,
            }, () => { 
                if (this.props.location.state != undefined) { 
                    const record = this.props.location.state['record']
                    const productArea = document.getElementsByName('productArea')[0]
                    const scrollTop = record['scrollTop']
                    productArea.scrollTop = scrollTop
                }
                
            })   
                
        })
        
    }
    
    _changeQuantity(productId, quantity) { 
        const url = server+'/api/cart/add'
        const id = productId
        const count = quantity
        const bodyData = JSON.stringify({
            id,
            count,

        })
        const _token = 'Bearer ' + localStorage.getItem('access_token')
            fetch(url, {
                body: bodyData, // must match 'Content-Type' header
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                    'Authorization': _token
                },
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
            })
            .then(response => response.json()) // parses response to JSON 
            .then(json => {
                const result = json['result']
                if (!result) {
                    Toast('修改失败', 403)
                    
                } else {
                    //this.props.history.go(0)
                    // this.props.history.push({pathname:'/shoppingCart'})
                    this.setState((preState) => { 
                        let products = JSON.parse(JSON.stringify(preState.products));
                        for (let i = 0; i < products.length; ++i) { 
                            if (products[i].id == productId) { 
                                products[i].count += quantity
                                if (products[i].count <= 0) { 
                                    products.splice(i, 1)
                                }
                                break
                            }
                        }
                        return {products}
                    })
                }
            })

    }
    
    
    handleClickProduct(productId) {
        const productArea = document.getElementsByName('productArea')[0]
        const scrollTop = productArea.scrollTop
        const record = { scrollTop }
        const backUrl = '/shoppingCart'
        this.props.history.push({ pathname: '/product/detail/'+productId, state: {productId, record, backUrl}})
    }
    handleAdd(e, productId) { 
        e.stopPropagation()
        this._changeQuantity(productId, 1)

    }
    handleSub(e, productId) { 
        e.stopPropagation()
        this._changeQuantity(productId, -1)

    }
    handleCheck(e) { 
        const delta = e.target.checked ? 1 : -1
        this.selected += delta
        if (this.selected <= 0) {
            this.setState({
                renderDelete: false,
            })
        } else { 
            this.setState({
                renderDelete: true,
            })
        }
    }
    handleDelete() { 
        const _token = 'Bearer ' + localStorage.getItem('access_token')

        const checks = document.getElementsByName('checkbox')
        let res = []
        checks.forEach(check => {
            if (check.checked) { 
                //如果选中，添加商品id到res, 后台根据商品id比对用户购物车得到数量
                res.push(Number(check.id))
            }
            
           
        })
        const url = server + '/api/cart/del'
        const bodyData = {
            ids: res,
        }
        console.log(bodyData)
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json',
                'Authorization': _token
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const result = json['result']
            if (result) { 
                this._initial()
            }
            
        })
        //res提交给后端
        //console.log(res)
    }
    handlePay() { 
        const _token = 'Bearer ' + localStorage.getItem('access_token')

        const checks = document.getElementsByName('checkbox')
        let res = []
        checks.forEach(check => {
            if (check.checked) { 
                //如果选中，添加商品id到res, 后台根据商品id比对用户购物车得到数量
                res.push({
                    id: check.id,
                })
            }
        })
        
        const url = server + '/api/order/create'
        const bodyData = {
            ids: res,
        }
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json',
                'Authorization': _token

            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const result = json['result']
            
        })
        
        //res提交给后端
        //console.log(res)
    }

    render() {
        const { classes } = this.props;
        return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            {/* 页面 */}
            <div name="productArea" className={classes.page} style={{ flex:1, backgroundColor: 'lavender', borderStyle:'none'}}>
                    {
                        this.state.products.map((product) => {
                            return (
                                <div className={classes.card}>
                                    <div className={classes.rowBox} >
                                        <Checkbox
                                            disableRipple={true}
                                            onClick={this.handleCheck.bind(this)}
                                            name='checkbox'
                                            id={product.id} />
                                        <div onClick={() => { this.handleClickProduct.bind(this)(product.id)}} style={{display:'flex', flex:1,cursor:'pointer'}}>
                                            <img className={classes.image} src={product.image} />
                                            <div style={{flex:1}} className={classes.colBox + " " + classes.marginAround}>
                                                <span>{product.name}</span>
                                                <div>
                                                    <span>￥{product.price}</span>
                                                    <span>/{product.count}{product.unit}</span>
                                                </div>
                                                {/* 改变数量 */}
                                                <div className={classes.rbCorner}>
                                                            
                                                        {/* <Dialog
                                                            open={this.state.open}
                                                            onClose={this.handleClose}
                                                            aria-labelledby="alert-dialog-title"
                                                            aria-describedby="alert-dialog-description"
                                                        >
                                                            <DialogTitle id="alert-dialog-title"></DialogTitle>
                                                            <DialogContent>
                                                                <TextField onChange={this.handleChange.bind(this)} InputLabelProps={{ shrink: true }} value={this.state.quantity}/>
                                                            </DialogContent>
                                                            <DialogActions>
                                                            <Button onClick={this.handleClose.bind(this)} color="primary">
                                                                取消
                                                            </Button>
                                                            <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>
                                                                确认
                                                            </Button>
                                                            </DialogActions>
                                                        </Dialog> */}
                                                    <div style={{display:'flex', alignItems:'center'}}>
                                                            <IconButton className={classes.removePadding}>
                                                                        
                                                            <AddIcon disableRipple={true} onClick={(e) => { this.handleAdd.bind(this)(e, product.id) }}/>
                                                            </IconButton>
                                                            
                                                                {/* <input onChange={this.handleChange.bind(this)} value={this.state.quantity} className={classes.input}/> */}
                                                                <font className={classes.input} >
                                                                    {product.count}
                                                                </font>
                                                            <IconButton className={classes.removePadding}>
                                                            <RemoveIcon disableRipple={true} onClick={(e) => { this.handleSub.bind(this)(e, product.id) }}/>
                                                            </IconButton>
                                                        </div>
                                                            
                                                    </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            {/* 功能条 */}
            <div style={{ backgroundColor: 'lavender', borderStyle: 'none' }}>
                    <FunctionBarForShoppingCart handleDelete={this.handleDelete.bind(this)} handlePay={this.handlePay.bind(this)} renderDelete={this.state.renderDelete} />
            </div>
            {/* 底部栏     */}
            <BottomNavBarForCustomer/>
        </div>
        )
    }
}
export default withStyles(styles, { withTheme: true })(ShoppingCartPage);

