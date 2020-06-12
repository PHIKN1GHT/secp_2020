import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    colBox: {
        display: 'flex',
        flexDirection: 'column', 
    },
});


class T extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
        }
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox}>

                
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(T);