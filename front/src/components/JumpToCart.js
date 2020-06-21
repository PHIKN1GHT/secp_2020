import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import { server} from '../pages/Const'


import { withStyles } from "@material-ui/core/styles";
import LensIcon from '@material-ui/icons/Lens';


const styles = theme => ({
    root: {
      //backgroundColor: "red"
    }
});
//--
function calAbsPosition(element) { 
    let actualLeft = element.offsetLeft;
    let current = element.offsetParent;

　　　　while (current != undefined){
　　　　　　actualLeft += current.offsetLeft;
　　　　　　current = current.offsetParent;
    }
    let actualTop = element.offsetTop;
    current = element.offsetParent;

　　　　while (current != undefined){
　　　　　　actualTop += current.offsetTop;
　　　　　　current = current.offsetParent;
    }
    return {left: actualLeft, top: actualTop}
    
}
function elementJump(element) { 
    let cloneElement = document.getElementsByName('circle')[0].cloneNode(true)
    console.log(cloneElement)
    cloneElement.style.position = 'absolute'
    cloneElement.style.zIndex = '99'
    cloneElement.style.display = 'initial'
    
    const nowPosition = element.getBoundingClientRect()
    cloneElement.style.left = nowPosition.left+'px'
    cloneElement.style.top = nowPosition.top + 'px'
    cloneElement.style.WebkitTransition ='top 1s, left 0.8s, width 1s, height 1s'
    cloneElement.style.transition = 'top 1s, left 0.8s, width 1s, height 1s'
    cloneElement.style.width = '2vh'
    cloneElement.style.height = '2vh'

    document.body.appendChild(cloneElement)
    setTimeout(
        () => { 
            const cart = document.getElementsByName('cart')[0]
            const cartPosition = calAbsPosition(cart)
            console.log(cartPosition)
            cloneElement.style.left = cartPosition.left+cart.offsetWidth/3+'px'
            cloneElement.style.top = cartPosition.top+cart.offsetHeight/6 + 'px'
            // cloneElement.style.width = 0+'px'
            // cloneElement.style.height = 0+'px'
            setTimeout(() => { document.body.removeChild(cloneElement) }, 1000)
        },
        0);
}
export function handleToCart(e, productId) { 
    console.log(e.target)
    console.log(productId)
    e.stopPropagation()
    const url = server+'/api/cart/add'
    const id = productId
    const count = 1
    const bodyData = JSON.stringify({
        id,
        count,

    })
    /*
    网络
    */
    // fetch(url, {
    //     body: bodyData, // must match 'Content-Type' header
    //     cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: 'include', // include, same-origin, *omit
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //     mode: 'no-cors', // no-cors, cors, *same-origin
    //     //redirect: 'follow', // manual, *follow, error
    //     //referrer: 'no-referrer', // *client, no-referrer
    // })
    // .then(response => response.json()) // parses response to JSON 
    // .then(json => {
    //     const result = json['result']
    //     if (!result) { 
    //         Toast('添加购物车失败', 403)
            
    //     }
    // }).catch(Toast('网络故障', 403))
    let element = e.target
    console.log(element.tagName)
    if (element.tagName == 'path') { 
        element = element.parentNode
    }
    elementJump(element)
}

class JumpToCart extends Component { 
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
    
    render() { 
        const { classes } = this.props;

        return (<>
            <div name='circle' style={{display:'none'}}>
                <LensIcon style={{height:'100%', width:'100%'}}  />
            </div>
                
        </>);
    }
    //
}
export default withStyles(styles, { withTheme: true })(JumpToCart);