import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { withStyles } from "@material-ui/core/styles";
const styles = theme => ({
    colBox: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column', 
    },
});

/*
使用时用一个固定大小的div包裹起来
props：
images:[url...]
*/

class Slider extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            index: 0,
        }
    }
    handleNext() { 
        if (this.state.index == this.props.images.length-1) { 
            return 
        }
        this.setState((prevState) => { 
            return {
                index: prevState.index+1,
            }
        }, () => { 
            const slider = document.getElementsByName('slider')[0]
            slider.style.marginLeft = -100 * this.state.index + 'vw'
        })
        
    }
    handlePre() { 
        if (this.state.index == 0) { 
            return 
        }
        this.setState((prevState) => { 
            return {
                index: prevState.index-1,
            }
        }, () => { 
            const slider = document.getElementsByName('slider')[0]
            slider.style.marginLeft = -100 * this.state.index + 'vw'
        })
        
    }
    render() {
        const { classes } = this.props;
        return (<div style={{ position: 'relative' }}>
            {
                this.state.index == 0 ?
                    null :
                    <IconButton style={{ position: 'absolute', left: 0, top: '50%' }} onClick={this.handlePre.bind(this)}>
                        <ArrowBackIosIcon />
                    </IconButton>
            }
            {
                this.state.index == this.props.images.length-1 ? null :
                <IconButton  style={{position:'absolute', right:0, top:'50%'}} onClick={this.handleNext.bind(this)}>
                    <ArrowForwardIosIcon />
                </IconButton>
            }
            
            <div name={'slider'} style={{width:"100%", height:'100%', display:'block ruby', webkitTransition:'marginleft 1s', transition:'margin-left 1s'}}>
                {
                    this.props.images.map((image) => { 
                        return (
                            <div style={{ height: '100%', width: '100%' }}>
                                <img style={{height:'100%', width:'100%'}} src={image} />
                            </div>
                        )
                    })
                }
                
            </div>
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(Slider);