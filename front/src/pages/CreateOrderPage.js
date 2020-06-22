import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';


import BottomNavBarForCreateOrder from '../components/BottomNavBarForCreateOrder'
import TopBar from '../components/TopBar'
import Toast from '../components/Toast'
import {handleToCart} from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'
import FunctionBarForShoppingCart from '../components/FunctionBarForShoppingCart';
import { server, IsLoggedIn } from './Const'

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
        borderRadius: '10px',
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


class CreateOrderPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            isReady:false,
            openDia: false,
            toPay:0,
        }
      
    }
    componentWillMount() { 
        if (this.props.location == undefined || this.props.location.state == undefined) { 
            this.props.history.push({
                pathname:'/',
            })
        }

    }
    componentDidMount() { 
        this._initial()
       
    }
    _fetchData() { 
        //address
        let promise = []
        //this.record = this.props.location.state['record']
        // const bodyData = JSON.stringify({
        // })
        let tmpSelectedCatalogId = 0
        const p1 = new Promise((resolve, reject) => {
            const _token = 'Bearer ' + localStorage.getItem('access_token')
    
            const url = server + '/api/address/all'
            fetch(url, { // must match 'Content-Type' header
                credentials: 'include', // include, same-origin, *omit
                headers: {
                    'content-type': 'application/json',
                    'Authorization': _token
                },
                method: 'GET', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, cors, *same-origin
                }).then(response => {
                    return response.json()
                }).then(json => {
                    //如果是数组
                    const address = json
                    return {address}
                }).then(data => { resolve(data) })
        })
        promise.push(p1)
        // this.ids.map((productId) => { 
        //     let np = new Promise((resolve, reject) => {
        //         const url = server + '/api/product/detail'
        //         const id = productId
        //         const bodyData = JSON.stringify({
        //             id,
        //         })
        //         fetch(url, {
        //             body: bodyData, // must match 'Content-Type' header
        //             credentials: 'include', // include, same-origin, *omit
        //             headers: {
        //                 'content-type': 'application/json'
        //             },
        //             method: 'POST', // *GET, POST, PUT, DELETE, etc.
        //             mode: 'cors', // no-cors, cors, *same-origin
        //         })
        //         .then(response => response.json()) // parses response to JSON 
        //         .then(json => {
        //             const images = json['images']
        //             const product = json['product']
        //             return {images, product}
        //         }).then(data => { resolve(data) })
        //     })
        //     promise.push(np)
        // })
        //同步等待
        Promise.all(promise).then((values) => {
            const address = values[0].address
            if (address.length == 0) { 
                Toast("请创建收货地址")
                setTimeout(() => {
                    this.props.history.push({
                    pathname:'/address',
                })
                    
                }, 2000);
                return
                
            }
            // let products = []
            // for (let i = 1; i < values.length; ++i){
            //     const image = values[i].images[0]
            //     let product = values[i].product
            //     product['image'] = image
            //     products.push(product)
            // }
            
            // //console.log(products)
            this.setState({
                address,
                products:this.products,
                isReady: true,
                selectedAddress:address[0],
            }, () => { 
                //     let record = undefined
                //     if (this.props.location.state != undefined) { 
                //         record = this.props.location.state['record']
                //     }
                // if (record != undefined) { 
                //     const productArea = document.getElementsByName('productArea')[0]
                //     productArea.scrollTop = record.scrollTop
                //}
            })
        })
    
    }
    
    _initial() {
        IsLoggedIn(['customer'], () => {
        }, () => {
                const backUrl = '/shoppingCart'
                this.props.history.push({ pathname: '/login', state: {backUrl} })
        })
        this.backUrl = this.props.location.state['backUrl']
        this.products = this.props.location.state['products']
        if (this.products == undefined || this.products.length == 0) {
            this.props.history.push({ pathname: this.backUrl })
        } else { 
            let toPay = 0
            this.products.map((product) => { 
                toPay+=product.price*product.count
            })
            toPay = toPay.toFixed(2)
            this.setState({toPay})
        }
        this._fetchData()
        return 
        
        const _token = 'Bearer ' + localStorage.getItem('access_token')
        // 获取地址
        const url = server+'/api/address/all'
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
                const address = json
                //console.log(products)
            this.setState({
                //products,
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
    
    _closeDia() { 
        this.setState({
            openDia:false,
        })
    }
    handleCreateOrder() { 
        const _token = 'Bearer ' + localStorage.getItem('access_token')

        const checks = document.getElementsByName('checkbox')
        let ids = []
        this.state.products.map((product) => { 
            ids.push(product.id)
        })
        const url = server + '/api/order/create'
        const receiver = this.state.selectedAddress.receiver
        const phonenumber = this.state.selectedAddress.phonenumber
        const address = this.state.selectedAddress.address
        const bodyData = JSON.stringify({
            ids,
            receiver,
            phonenumber,
            address
        })
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
                this.props.history.push({
                    pathname: '/shoppingCart',
                })
            } else { 
                Toast("生成订单错误", 403)
            }

        })
        
        //res提交给后端
        //console.log(res)
    }
    
    handleClickProduct(productId) {
        const productArea = document.getElementsByName('productArea')[0]
        const scrollTop = productArea.scrollTop
        const record = { scrollTop }
        const backUrl = '/shoppingCart'
        this.props.history.push({ pathname: '/product/detail/'+productId, state: {productId, record, backUrl}})
    }
    handleOpenDia() { 
        this.setState({
            openDia: true,
            
        })

    }

    handleSelectAddress(address) { 
        this.setState(
            {selectedAddress:address},
            () => { 
                this._closeDia()

            }
        )

    }
    handleGoBack() { 
        this.props.history.push({
            pathname:this.backUrl
        })

    }

    render() {
        const { classes } = this.props;
        return (

                this.state.isReady ?
                <div style={{ justifyContent:'center',backgroundColor: 'lavender', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <TopBar
                    backIconHidden={false}
                    cartHidden={true}
                    searchHidden={true}
                    onGoBack={this.handleGoBack.bind(this)}
                />
                    <div style={{
                        flex: 1,
                        overflowY: 'auto',
                    }}
                        className={classes.colBox}
                        name={'productArea'}
                    >
                        {/* 收货地址 */}
                        <div style={{
                            backgroundColor: 'ghostwhite',
                            boxShadow: '1px 1px 3px #AAAAAA',
                            cursor: 'pointer',
                            margin: '0 0 3vh 0',
                            width: '90vw',
                            height: '10vh',
                            //borderStyle: 'solid',
                            alignSelf: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '10px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                            onClick={this.handleOpenDia.bind(this)}
                        >
                            <div >
                                <font >{this.state.selectedAddress.receiver}</font>
                                <font >{this.state.selectedAddress.phonenumber}</font>
                            </div>
                            <font >{this.state.selectedAddress.address}</font>
                        </div>
                    {/* 收货地址 */}
                    {/* <div  className={classes.colBox} style={{cursor:'pointer', margin:'0 0 5vh 0',width: '90vw', height:'20vh', borderStyle:'solid', alignSelf:'center'}}>
                        <div>
                            <font>{this.state.selectedAddress.receiver}</font>
                            <font> {this.state.selectedAddress.phonenumber}</font>
                        </div>
                        <font>{this.state.selectedAddress.address}</font> */}
                            
                            {/* 选择收货地址 */}
                            <Dialog open={this.state.openDia}>
                                <DialogTitle>修改地址</DialogTitle>
                                <DialogContent>
                                    {
                                        this.state.address.map(address => 
                                            <div style={{ cursor: 'pointer' }} onClick={() => { this.handleSelectAddress.bind(this)(address) }}>
                                                <div>
                                                    <font>{address.receiver}</font>
                                                    <font> {address.phonenumber}</font>
                                                </div>
                                                <font>{address.address}</font>
                                             </div>   
                                        )
                                    }
                                    
                                </DialogContent>
                                <DialogActions>
                                    
                                </DialogActions>
                            </Dialog>
                        {/* 商品 */}
                        <div
                            className={classes.colBox}
                            style={{
                                width: '90vw',
                                
                            // borderStyle: 'solid',
                                alignSelf: 'center',
                                backgroundColor: 'ghostwhite',
                                boxShadow: '1px 1px 3px #AAAAAA',
                                margin: '0 0 5vh 0',
                                borderRadius:'10px',

                            }}>
                                {
                                    this.state.products.map((product) => { 
                                        return (
                                            //商品卡片
                                                <div style={{
                                                }}
                                                    onClick={(e) => { this.handleClickProduct(product.id) }}
                                                    className={classes.productCard}
                                                >
                                            
                                                    <img className={classes.image} src={product.image} />
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
                                                                <font className={classes.input} >
                                                                        {product.count}
                                                                </font>
                                                    </div>
                                                        </div>

                                            </div>
                                        )
                                    })
                                }
                        </div>
                    </div>
                    
                    {/* 通过参数传递总价 */}
                    <BottomNavBarForCreateOrder toPay={this.state.toPay} onClick={this.handleCreateOrder.bind(this)}/>
                </div>
                
               
                :
                null

        )
    }
}
export default withStyles(styles, { withTheme: true })(CreateOrderPage);

