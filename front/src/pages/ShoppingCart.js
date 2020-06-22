import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
import ShoppingCartBox from '../components/ShoppingCartBox'
import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer';
import FunctionBarForShoppingCart from '../components/FunctionBarForShoppingCart';
import { server,IsLoggedIn } from './Const'
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
//--
//--样式--


/*****
 * 待完成
 * 商品删除功能
*****/


const styles = theme => ({
        
    page: {
        display: 'felx',
        flexDirection: 'column',
        backgroundColor: 'lavender',
        flex: '1 1',
        
    },
    root: {
      //backgroundColor: "red"
    }
});
//--

class ShoppingCart extends Component { 
    //静态内容
    // static propTypes = {
    //     receivedProps: PropTypes.object.isRequired,
    // }
    // static defaultProps = {
    //     key:value,
    // }
    //

    //构造函数
    constructor(props) { 
        super(props)
        this.state = {
            renderDelete:false,
            products: [
                // { id: 0, name: '山东莱阳秋月梨', price: 25.9, unit: '箱', cover:'', quantity:12},
                // { id: 1, name: '云南红心木瓜', price: 29.9, unit: '箱', cover:'',qauntity:1 },
                // { id: 2, name: '西班牙伊比利亚黑猪猪颈肉', price: 105, unit: '件', cover:'',quantity:7 },
                // { id: 3, name: '御牛满地澳洲肥牛卷火锅食材牛肉片', price: 178, unit: '件', cover:'',quantity:15},
                // { id: 4, name: '山东莱阳秋月梨', price: 25.9, unit: '箱', cover:'', quantity:12},
                // { id: 5, name: '云南红心木瓜', price: 29.9, unit: '箱', cover:'',qauntity:1 },
                // { id: 6, name: '西班牙伊比利亚黑猪猪颈肉', price: 105, unit: '件', cover:'',quantity:7 },
                // { id: 7, name: '御牛满地澳洲肥牛卷火锅食材牛肉片', price: 178, unit: '件', cover: '', quantity: 15 },
                // { id: 8, name: '山东莱阳秋月梨', price: 25.9, unit: '箱', cover:'', quantity:12},
                // { id: 9, name: '云南红心木瓜', price: 29.9, unit: '箱', cover:'',qauntity:1 },
                // { id: 10, name: '西班牙伊比利亚黑猪猪颈肉', price: 105, unit: '件', cover:'',quantity:7 },
                // { id: 11, name: '御牛满地澳洲肥牛卷火锅食材牛肉片', price: 178, unit: '件', cover:'',quantity:15},
            ]
        }
    }
    //

    //组件生命周期
    componentWillMount() { 
        //fetch数据
        this.initial()

    }
    componentDidMount() { 

    }
    componentWillUnmount() { 

    }
    initial() {
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
            })   
                
        })
        
    }
    handleSetRenderDelete() { 
        const checks = Array.from(document.getElementsByName('checkbox'))
        console.log(checks)
        let flag = false
        for (let i = 0; i < checks.length; ++i) { 
            if (checks[i].checked) { 
                flag = true
                break
            }
        }
        this.setState({ renderDelete: flag })
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

        return (<>
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* 页面 */}
                <div style={{ flex:1, backgroundColor: 'lavender', borderStyle:'none'}}>
                    {/* <ShoppingCartBox update={this.handleSetRenderDelete.bind(this)} products={this.state.products} /> */}
                    <div className={classes.page}>
                        {
                            this.props.products.map((product) => {
                                return (
                                    <div className={classes.rowBox}>
                                        
                                        <ShoppingCard update={this.props.update} onClick={this.handleClick.bind(this)} key={product.id} product={product} />
                                </div>)
                            })
                        }
                </div>
                </div>
                <div style={{backgroundColor: 'lavender', borderStyle: 'none'}}>
                    <FunctionBarForShoppingCart renderDelete={this.state.renderDelete} />
                </div>
                <BottomNavBarForCustomer/>
            </div>
        </>);
    }
    //


}
export default withStyles(styles, { withTheme: true })(ShoppingCart);