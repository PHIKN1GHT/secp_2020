import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
import ShoppingCartBox from '../components/ShoppingCartBox'
import FunctionBarForShoppingCart from '../components/FunctionBarForShoppingCart';
//--
//--material-ui--
import { withStyles, makeStyles } from "@material-ui/core/styles";
import BottomNavBarForManager from '../components/BottomNavBarForManager';

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
    functionBar: {
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',

    },
    root: {
      //backgroundColor: "red"
    }
});
//--

class PurchaseOrder extends Component { 
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
            product:[
                { id: 0, name: '山东莱阳秋月梨', price: 25.9, unit: '箱', cover:'', quantity:12},
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
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex:1, backgroundColor: 'lavender', borderStyle:'none'}}>
                    
                </div>
                <div style={{backgroundColor: 'lavender', borderStyle: 'none'}}>
                    <div className={classes.functionBar}>
                        {this.state.product.map((product)=>{
                            return(
                                <PurchaseOrder productName={product.name} productPrice={product.price} productUnit={product.unit}></PurchaseOrder>
                            )
                        })}
                        
                        <button>进货</button>
                    </div>
                </div>
                <BottomNavBarForManager/>
            </div>
        </>);
    }
    //


}
export default withStyles(styles, { withTheme: true })(PurchaseOrder);