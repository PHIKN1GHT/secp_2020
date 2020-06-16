import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from './BottomNavBarForCustomer'

import { withStyles } from "@material-ui/core/styles";
import { IconButton } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

const styles = theme => ({
    colBox: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column', 
        backgroundColor: 'lavender',
    },
    rowBox: {
        width: '100vw',
        display: 'flex',
    },
    topBar: {
        margin: '0 5vw 0 5vw',
        height: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: '70%',
        flex: '1 1',
        borderRadius: '20px',
        border: 'mediumaquamarine 1px solid',
        overflow: 'hidden',
        paddingLeft: '10px',
    }
});


class TopBar extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            products:[],
        }
    }
    componentWillMount() { 
       
        let products = []
        for (let i = 1; i <= 20; ++i){
            products.push({id:i, name:'products-'+i, price:'price-'+i, unit:'unit-'+i,cover:'cover-'+i})
        }
        this.setState({
            products,

        })
    }
    handleGoBack(){
        this.props.history.go(-1)
    }
    handleSearch(e) { 
        if (this.props.fakeSearch == true) {
            this.props.history.push({ pathname: '/product/search', })
        } else { 
            const searchInput = document.getElementsByName('searchInput')[0]
            const keyword = searchInput.value
            this.props.history.push({ pathname: '/product/search/'+keyword, state: { keyword } })
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.topBar}>
                <ArrowBackIosIcon
                    onClick={this.props.onGoBack}
                    style={{
                        visibility: this.props.backIconHidden ? 'hidden' : 'visible',
                        margin: '0 2vw',
                        justifySelf: "flex-start",
                        cursor: 'pointer',
                    }} />
                <input
                    name={'searchInput'}
                    className={classes.input} 
                    onClick={this.props.onSearch}
                    readOnly={this.props.fakeSearch?'readOnly':''}
                    style={{}} />
                <div style={{ margin: '0 2vw', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <SearchIcon
                        style={{ cursor: 'pointer' }}
                        onClick={this.props.onSearch} />
                </div>

            </div>
        );
    }
}
export default withStyles(styles, { withTheme: true })(TopBar);