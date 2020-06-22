import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
//--项目组件--
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
//--
//--样式--
const styles = theme => ({
    root: {
      //backgroundColor: "red"
    }
});
//--

class T extends Component { 
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
            //key:value,
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
                
        </>);
    }
    //


}
export default withStyles(styles, { withTheme: true })(T);