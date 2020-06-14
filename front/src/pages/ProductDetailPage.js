import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForProductDetailPage from '../components/BottomNavBarForProductDetailPage'
import TopBar from '../components/TopBar'

import Slider from '../components/Slider'

import { withStyles } from "@material-ui/core/styles";
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
            images: [
                'https://material-ui.com/static/images/cards/live-from-space.jpg',
                'https://material-ui.com/static/images/cards/live-from-space.jpg',
                'https://material-ui.com/static/images/cards/live-from-space.jpg',
            ],
            detailImages: [
                'https://img.alicdn.com/imgextra/i2/2627785630/O1CN01I9eJx71rSaR8R3tzW_!!2627785630.jpg',
                'https://img.alicdn.com/imgextra/i3/2627785630/O1CN01Q6ZV1m1rSaR3oqq7N_!!2627785630.jpg',
                'https://img.alicdn.com/imgextra/i2/2627785630/O1CN01zBTa8M1rSaR3yrxPt_!!2627785630.jpg',
                'https://img.alicdn.com/imgextra/i2/2627785630/O1CN01lHLMnk1rSaR6ojQAb_!!2627785630.jpg',
            ],
            product: {
                id: 3,
                name: '御牛满地澳洲肥牛卷火锅食材牛肉片',
                price: 178,
                unit: '件',
                cover: '',
                quantity: 15
            },
        }
    }

    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>
            {/* 顶部栏 */}
            <TopBar backUrl={this.props.backUrl} canSearch={true} />
            <div style={{overflowY:'auto', overflowX:'hidden'}}>
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
            <BottomNavBarForProductDetailPage productId={this.state.product.id} />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(ProductDetailPage);