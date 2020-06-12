import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';

const styles = theme => ({
    colBox: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column', 
    },
    rowBox: {
        width: '100vw',
        display: 'flex',
    },
    searchBar: {
        width:'100vw',
        height: '5vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


class SearchPage extends Component { 
    constructor(props) { 
        super(props)
        this.state = {
            catalogs: [],
            products:[],
        }
    }
    componentWillMount() { 
        let catalogs = []
        for (let i = 1; i <= 10; ++i){
            catalogs.push({id:i, name:'catalog-'+i})
        }
        let products = []
        for (let i = 1; i <= 20; ++i){
            products.push({id:i, name:'products-'+i, price:'price-'+i, unit:'unit-'+i,cover:'cover-'+i})
        }
        this.setState({
            catalogs,
            products,

        })
    }
    handleSearch(e) { 
        const searchInput = document.getElementsByName('searchInput')[0]
        const keyword = searchInput.value
        this.props.history.push({ pathname: '/product/search/'+searchInput.value, state: { keyword } })
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{backgroundColor: 'lavender',}}>
            {/* 搜索框 */}
            <div className={classes.searchBar}>
                <input autoFocus={true} name='searchInput' style={{ width: '60%', height: '70%', }} />
                <div style={{ margin: '0' }}>
                    <IconButton onClick={this.handleSearch.bind(this)} >
                        <SearchIcon />
                    </IconButton>
                </div>
            </div>
            <div style={{flex:1}}></div>
            <BottomNavBarForCustomer />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(SearchPage);