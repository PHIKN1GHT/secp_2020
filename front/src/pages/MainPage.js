import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
    colBox: {
        display: 'flex',
        flexDirection: 'column', 
    },
});


class MainPage extends Component { 
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
export default withStyles(styles, { withTheme: true })(MainPage);