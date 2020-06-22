import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import { server } from './Const' 
import BottomNavBarForProductDetailPage from '../components/BottomNavBarForProductDetailPage'
import TopBar from '../components/TopBar'
import Slider from '../components/Slider'
import {handleToCart} from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'

import { withStyles } from "@material-ui/core/styles";
import LensIcon from '@material-ui/icons/Lens';

const styles = theme => ({
    colBox: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column', 
        backgroundColor: 'lavender',
        scrollbarWidth: 'none',
    },
});


class ProductDetailPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            index: 0,
            images: [],
            detailImages: [],
            product: {},
        }
        this.tmp = undefined
        this.addLock = false
    }
    componentWillMount() { 
        this.fetchAndInitial()
        // const index = 0
        // const images = [
        //         'https://material-ui.com/static/images/cards/live-from-space.jpg',
        //         'https://material-ui.com/static/images/cards/live-from-space.jpg',
        //         'https://material-ui.com/static/images/cards/live-from-space.jpg',
        //     ]
        // const detailImages= [
        //         'https://img.alicdn.com/imgextra/i2/2627785630/O1CN01I9eJx71rSaR8R3tzW_!!2627785630.jpg',
        //         'https://img.alicdn.com/imgextra/i3/2627785630/O1CN01Q6ZV1m1rSaR3oqq7N_!!2627785630.jpg',
        //         'https://img.alicdn.com/imgextra/i2/2627785630/O1CN01zBTa8M1rSaR3yrxPt_!!2627785630.jpg',
        //         'https://img.alicdn.com/imgextra/i2/2627785630/O1CN01lHLMnk1rSaR6ojQAb_!!2627785630.jpg',
        //     ]
        // const product= {
        //         id: this.props.match.params.productId,
        //         name: this.props.match.params.productId+'御牛满地澳洲肥牛卷火锅食材牛肉片',
        //         price: 178,
        //         unit: '件',
        // }
        // this.setState({ index, images, detailImages, product })
        

    }
    fetchAndInitial() { 
        const url = server+'/api/product/detail'
        //const id = this.props.location.state['productId']
        const id = this.props.match.params.productId
        const bodyData = JSON.stringify({
            id,
        })
        fetch(url, {
            body: bodyData, // must match 'Content-Type' header
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
        })
        .then(response => response.json()) // parses response to JSON 
            .then(json => {
            
            const images = json['images']
            const detailImages = json['detailImages']
            const product = json['product']
            
            this.setState({
                images,
                detailImages,
                product,
            })
        })
    }
    calAbsPosition(element) { 
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
    elementJump(element) { 
        console.log(this.props.location.state)
        let cloneElement = document.getElementsByName('circle')[0].cloneNode(true)
        console.log(cloneElement)
        cloneElement.style.position = 'absolute'
        cloneElement.style.zIndex = '99'
        cloneElement.style.display = 'initial'
        
        let nowPosition = this.calAbsPosition(element)
        console.log(nowPosition)
        nowPosition.left+=element.offsetWidth/2
        cloneElement.style.left = nowPosition.left+'px'
        cloneElement.style.top = nowPosition.top + 'px'
        cloneElement.style.WebkitTransition ='top 1s, left 0.8s, width 1s, height 1s'
        cloneElement.style.transition = 'top 1s, left 0.8s, width 1s, height 1s'
        cloneElement.style.width = '2vh'
        cloneElement.style.height = '2vh'
       
        document.body.appendChild(cloneElement)
        
        this.addLock = true
        this.tmp = this.props.location.state
        setTimeout(
            (() => { 
                
                
                const cart = document.getElementsByName('topBarCart')[0]
                // const cartPosition = this.calAbsPosition(cart)
                const cartPosition = {left: cart.offsetLeft, top:cart.offsetTop}
                
                cloneElement.style.left = cartPosition.left+cart.offsetWidth/3+'px'
                cloneElement.style.top = cartPosition.top+'px'
                // cloneElement.style.width = 0+'px'
                // cloneElement.style.height = 0+'px'
                
                setTimeout(() => {
                    document.body.removeChild(cloneElement)
                    this.props.location.state = this.tmp
                    this.addLock = false
                }, 1000)
            }),
        0)
        
        
    }
    handleGoBack() {
        const backUrl = this.props.location.state['backUrl']
        const record = this.props.location.state['record']
        this.props.history.push({ pathname: backUrl, state: { record, backUrl: record.backUrl } })
        // if (backUrl == '/product/search/') { 
        //     const keyword = this.props.location.state['keyword']
        //     this.props.history.push({ pathname: backUrl+keyword, state: { record: this.props.location.state['record'] } }) 
        // }
    }
    handleSearch(e) { 
        const backUrl = '/product/catalogs'
        const record = this.props.location.state['record']
        console.log(record)
        this.props.history.push({ pathname: '/product/search', state: {backUrl, record}})

        // const searchInput = document.getElementsByName('searchInput')[0]
        // const keyword = searchInput.value
        // this.props.history.push({ pathname: '/product/search/'+keyword, state: { keyword } })
    
    }
    // handleAddToCart(e, productId) { 
    //     if(this.addLock) return 
    //     console.log(this.props.location.state)

    //     let element = e.target
    //     console.log(element.tagName)
    //     if (element.tagName == 'FONT') { 
    //         element = element.parentNode
    //     }
    //     this.elementJump(element)
        
    // }
    handleAddToCart(e, productId) { 
        e.stopPropagation()
        if(this.addLock) return 
        handleToCart(e, productId)
    }

    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>
            <JumpToCart />

            {/* <div name='circle' style={{display:'none'}}>
                <LensIcon style={{height:'100%', width:'100%'}}  />
            </div> */}
            {/* 顶部栏 */}
            <TopBar
                backIconHidden={false}
                searchHidden={true}
                fakeSearch={true}
                onGoBack={this.handleGoBack.bind(this)}
                onSearch={this.handleSearch.bind(this)} />
            <div style={{overflowY:'auto', overflowX:'hidden', flex:1, scrollbarWidth:'none', }}>
                {/* 轮播图 */}
                <div style={{ height: '100vw', width: '100vw' }}>
                    <Slider images={this.state.images} />
                </div>
                {/* 商品信息 */}
                <div style={{display:'flex', flexDirection:'column'}}>
                    <span>{this.state.product.name}</span>
                    <div>
                        <span>￥{this.state.product.price}</span>
                        <span>/{this.state.product.unit}</span>
                    </div>
                </div>
                {/* 商品详情图片 */}
                {
                    this.state.detailImages.map((detailImage) => { 
                        return (
                            <div style={{ width: '100%' }}>
                                <img style={{ width: '100%' }} src={detailImage} />
                            </div>
                        )
                    })
                }
            </div>
            {/* 底部功能条 */}
            <BottomNavBarForProductDetailPage onClick={(e) => { this.handleAddToCart(e, this.state.product.id)}} />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(ProductDetailPage);