import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
import { withStyles } from "@material-ui/core/styles";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
//项目组件引入
import ChangeQuantity from './ChangeQuantity';
import { server } from '../pages/Const'
import Toast from '../components/Toast'
//




//material-ui 引入
import { Checkbox } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Box from '@material-ui/core/Box';
//
//样式

const styles = theme => ({
    rowBox: {
        display: 'flex',
        flexGrow: '1',
    },
    colBox: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
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
    root: {
        display: 'flex',
        height: String(20) + 'vh'
      },
      details: {
            display: 'flex',
          flexDirection: 'row',
          flex: '1',
          borderRadius: '10px',
          border: 'hidden',
          //alignSelf: 'flex-start',
          alignSelf: 'stretch',
    },
    tpContent: {
        display: 'flex',
        flexDirection: 'column',
        margin: '3vh 0 0 2vh',
        flex: 1,
    },
      content: {
        //flex: '1 0 auto',
        maxWidth: '100%',
          width: '100%',
          display:'flex',
          flex: 1,
          alignSelf: 'stretch',
          padding: 0,
            "&:last-child": {
            paddingBottom: 0
          },
      },
    cover: {
        //flex:'1 0 auto',
        // width: 110,
        // height: 110,
        // margin:10,
        width: String(16) + 'vh',
        height: String(16) + 'vh',
        //width: '7.9vw',
        //height: '7.9vw',
        margin: '2vh 0 0 2vh',
        alignSelf: 'start',
        borderRadius:'5px',
    },
    actionArea: {
        display: 'flex',
        justifyContent: 'left',
    },
    shoppingBox: {
        justifySelf: 'flex-end',
        display: 'flex',
        flexGrow: 1,
        justifyContent: 'flex-end',
        /* align-content: flex-end; */
        alignItems: 'flex-end',
    },
    shoppingIcon: {
        margin: '0 2vh 2vh 0',
    }
  
});
  
/*
props:
product:{id:int, name:string, price:float, unit:str}
*/
class ShoppingCard extends Component { 
    //类型检查
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
    _addToCart(productId, quantity) { 
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
                Toast('修改数量失败', 403)
                
            } else { 
                let product_new = Object.assign({}, this.state.product)
                product_new.quantity += quantity
                this.setState({ product: product_new })
            }
        }).catch(Toast('网络故障', 403))

    }

    //事件监听
    handleClick(product_id) {
        if (this.props.onClick) { 
            this.props.onClick(product_id);
        }

    }
    handleChangeQuantity(e, quantity) {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        this._addToCart(this.state.product.id, quantity)
        
    }
    handleRenderDelete() { 
        
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
        return(
            <div className={classes.card}>

            <div className={classes.rowBox} onClick={(e) => { this.handleClick(this.props.product.id) }}>
              
                    <Checkbox
                        disableRipple={true}
                        onClick={this.props.update}
                        name='checkbox'
                        id={this.props.product.id} />
            
                    <img className={classes.image} src={this.props.product.image} />
                <div className={classes.colBox+" "+classes.marginAround}>
                    <span>{this.props.product.name}</span>
                    <div>
                        <span>￥{this.props.product.price}</span>
                        <span>/{this.props.product.unit}</span>
                        </div>
                    <div className={classes.rbCorner}>
                    <ChangeQuantity onChange={this.handleChangeQuantity.bind(this)} />
                    </div>
                        </div>

            </div>
        </div>
        );
    }


}
export default withStyles(styles, { withTheme: true })(ShoppingCard);