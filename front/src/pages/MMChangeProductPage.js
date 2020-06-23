import React, { Component } from 'react';
import { ReactDOM } from 'react-dom';

import { server } from './Const'
import BottomNavBarForProductDetailPage from '../components/BottomNavBarForProductDetailPage'
import TopBar from '../components/TopBar'
import Slider from '../components/Slider'
import { handleToCart } from '../components/JumpToCart'
import JumpToCart from '../components/JumpToCart'
import BottomNavBarForMMSubmitChange from '../components/BottomNavBarForMMSubmitChange'

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


class MMChangeProductPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            index: 0,
            images: [],
            detailImages: [],
            product: {},
        }

    }
    componentWillMount() {
        console.log('state', this.props.location)
        this.backUrl = this.props.location.state['backUrl']
        this.record = this.props.location.state['record']

        this.mm = this.props.location.state['mm']
        this.productId = this.props.match.params.productId
        console.log(this.props.location.state.productId)
        this.fetchAndInitial()
    }
    fetchAndInitial() {
        const url = server + '/api/product/detail'
        const id = this.productId
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
                console.log(json)
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

    handleGoBack() {
        const backUrl = this.backUrl
        const record = this.record
        this.props.history.push({ pathname: backUrl, state: { record, backUrl: record.backUrl } })
    }
    handleSubmitChange() {

    }


    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>

            {/* 顶部栏 */}
            <TopBar
                backIconHidden={false}
                searchHidden={true}
                fakeSearch={true}
                onGoBack={this.handleGoBack.bind(this)}
            />
            <div style={{ overflowY: 'auto', overflowX: 'hidden', flex: 1, scrollbarWidth: 'none', }}>

                {/* 商品信息 */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>{this.state.product.name}</span>
                    <div>
                        <span>￥{this.state.product.price}</span>
                        <span>/{this.state.product.unit}</span>
                    </div>
                </div>

            </div>
            {/* 底部功能条 */}
            <BottomNavBarForMMSubmitChange onClick={this.handleSubmitChange.bind(this)} />

        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(MMChangeProductPage);