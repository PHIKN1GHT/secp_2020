import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
//--
//--样式--
const styles = theme => ({
    root: {
        //backgroundColor: "red"
        maxWidth: '100%',
        width: '100%'
    }
});
//--

/*
props:
catalogs: [{id:int, name:string}, ]
onClick: (int){}
*/

class ProductSideBar extends Component {
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
    handleClick(e, catalog_id) {
        if (this.props.onClick) {
            this.props.onClick(catalog_id);
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
        let catalogs = this.props.catalogs;

        return (<>
            <div className={classes.root}>
                <List component="nav" aria-label="main mailbox folders">
                    {
                        catalogs.map((item, index) => {
                            return (
                                <ListItem button
                                    key={item.id}
                                    onClick={(e) => { this.handleClick(e, item.id)}}
                                    selected={this.props.selectedCatalog === item.id}
                                >
                                    <ListItemText primary={item.name} />
                                </ListItem>
                            )

                        })
                    }
                </List>
            </div>
        </>);
    }
    //


}
export default withStyles(styles, { withTheme: true })(ProductSideBar);