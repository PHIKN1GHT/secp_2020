import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';
import { useState, useEffect } from 'react';
//--项目组件--
//--
//--material-ui--
import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

//--
//--样式--
const styles = theme => ({
    root: {
      //backgroundColor: "red"
    }
});
//--



function InputDialog(props) {
    const [open, setOpen] = React.useState(props.open);
    

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    };
    //传递该组件给父组件
    useEffect(() => { 
        if (props.onRef) { 
            props.onRef(this)
        }
    });

  return (
    <div>
      
    </div>
  );
}


/*
props:
quantity->从服务端读取的商品的选择数量
onChange->向服务端更新
*/

class ChangQuantity extends Component { 
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
        this.dialog = undefined
        this.state = {
            quantity: 1,
            open: false,
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
    _updateQuantity() { 
        if (this.props.onChange) { 
            this.props.onChange(this.state.quantity);
        }
    }
    //
    
    //事件监听
    handleAdd() {
        if (this.state.quantity < 99) {
            this.setState((prevState) => { return { quantity: prevState.quantity + 1 } })
        }
        this._updateQuantity();

    }
    handleSub() {
        if (this.state.quantity > 1) {
            this.setState((prevState) => {return  { quantity: prevState.quantity - 1 }})
        }
        this._updateQuantity();
    }
    handleChange(e) { 
        this.setState({
            quantity: e.target.value,
        })
    }
    handleClickOpen() {
        this.setState({open:true})   
    }
    handleClose() {
        this.setState({open:false})   
    }
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
            <IconButton>
                <AddIcon onClick={this.handleAdd.bind(this)}/>
            </IconButton>
            <Dialog
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
            </Dialog>
            <TextField onClick={this.handleClickOpen.bind(this)} InputLabelProps={{ shrink: true }} value={this.state.quantity}/>
            <IconButton>
                <RemoveIcon onClick={this.handleSub.bind(this)}/>
            </IconButton>
        </>);
    }
}
export default withStyles(styles, { withTheme: true })(ChangQuantity);