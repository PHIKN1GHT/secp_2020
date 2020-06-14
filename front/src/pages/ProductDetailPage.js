import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'

import Slider from '../components/Slider'

import { withStyles } from "@material-ui/core/styles";
const styles = theme => ({
    colBox: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column', 
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
            ]
        }
    }

    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>
            <div style={{ height: '50vh', width: '100vw' }}>
                <Slider images={this.state.images} />
            </div>
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(ProductDetailPage);