import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
import ShoppingCard from './ShoppingCard';
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
//--
//--样式--
const styles = theme => ({
    page: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lavender',
        flex: '1',
    },
    rowBox: {
        display: 'flex',
    },
    flexGrow: {
        flexGrow:'1',
    },
    colBox: {
        display: 'flex',
        flexDirection: 'column',
    },
    root: {
      //backgroundColor: "red",
      maxWidth: '100%',
      mwidth: '100%',
    }
});
//--
/*
props:
products: [{id:int, name:string, price:float, unit:str}, ]
onClick: (product_id:int){}
*/

//--

class ShoppingCartBox extends Component {
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
            //key:value,
        }
    }
    //

    //组件生命周期
    componentWillMount() { 

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
    handleClick(product_id) { 
        if (this.props.onClick) { 
            //let product_id = e.target.?;
            this.props.onClick(product_id);
        }
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
        );
    }
    //


}
export default withStyles(styles, { withTheme: true })(ShoppingCartBox);