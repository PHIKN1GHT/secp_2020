import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';
import { withStyles } from "@material-ui/core/styles";
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
//项目组件引入
//
//material-ui 引入
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
class ProductCard extends Component { 
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

    //事件监听
    handleClick(product_id) {
        if (this.props.onClick) { 
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
        return (<>
            <Card className={classes.root}>
                <CardActionArea onClick={(e) => { this.handleClick(this.props.product.id)}} className={classes.actionArea} >
                    <CardMedia
                        className={classes.cover}
                        //image={this.props.product.cover}
                        image="https://material-ui.com/static/images/cards/live-from-space.jpg"
                        title="product image"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography className={classes.tpContent} component="div">
                                <Box style={{margin: '0'}} textAlign="left" fontWeight="fontWeightMedium" m={1}>
                                    {this.props.product.name}
                                </Box>
                                <Box>
                                    <Box display="table-cell" color="#ff5252" textAlign="left" fontWeight="fontWeightRegular" m={1}>
                                            ￥{this.props.product.price}
                                    </Box>
                                    <Box display="table-cell" color="#bdbdbd" textAlign="left" fontWeight="fontWeightRegular" m={1}>
                                            /{this.props.product.unit}
                                    </Box>
                                </Box> 
                                
                                <Box className={classes.shoppingBox}>
                                    <AddShoppingCartIcon className={classes.shoppingIcon}/>
                                </Box>
                            
                            </Typography>
                        </CardContent>
                    </div>
                </CardActionArea>
            </Card>
        </>);
    }
    //


}
export default withStyles(styles, { withTheme: true })(ProductCard);