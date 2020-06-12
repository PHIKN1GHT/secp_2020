import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
import ShoppingCartBox from '../components/ShoppingCartBox'
import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer';
import FunctionBarForShoppingCart from '../components/FunctionBarForShoppingCart';
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
//--
//--样式--
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
            products: [
                { id: 0, name: '山东莱阳秋月梨', price: 25.9, unit: '箱', cover:'', quantity:12},
                { id: 1, name: '云南红心木瓜', price: 29.9, unit: '箱', cover:'',qauntity:1 },
                { id: 2, name: '西班牙伊比利亚黑猪猪颈肉', price: 105, unit: '件', cover:'',quantity:7 },
                { id: 3, name: '御牛满地澳洲肥牛卷火锅食材牛肉片', price: 178, unit: '件', cover:'',quantity:15},
            ]
        }
    }
    //

    //组件生命周期
    componentWillMount() { 
        //fetch数据
    }
    componentDidMount() { 
        

    }
    componentWillUnmount() { 

    }
    //

    //私有方法,使用较少,使用_开头，ES6没有实现私有方法，所以这里的函数和别的成员函数没有性质上的区别
    _privateFunc() { 

    }
    //
    
    //事件监听
    handleFoo() { 

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

        return (<>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
            <ShoppingCartBox products={this.state.products} />
                <FunctionBarForShoppingCart />
            </div>
            <BottomNavBarForCustomer/>
        </>);
    }
    //


}
export default withStyles(styles, { withTheme: true })(ShoppingCart);