import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'
import TopBar from '../components/TopBar'

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';

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
        const backUrl = this.props.location.state['backUrl']
        const record = this.props.location.state['record']

        this.props.history.push({ pathname: '/product/search/'+keyword, state: { keyword, backUrl, record } })
    }
    handleGoBack() {
        const record = this.props.location.state['record']
        const backUrl = this.props.location.state['backUrl']
        this.props.history.push({ pathname: backUrl, state: {record}})
        //this.props.history.go(-1)
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{backgroundColor: 'lavender',}}>
            {/* 搜索框 */}
            <TopBar
                backIconHidden={false}
                fakeSearch={false}
                cartHidden={true}
                onGoBack={this.handleGoBack.bind(this)}
                onSearch={this.handleSearch.bind(this)} />
            {/* <div className={classes.searchBar}>
                <ArrowBackIosIcon style={{margin: '0 2vw',justifySelf:"flex-start", cursor:'pointer'}} onClick={this.handleGoBack.bind(this)} />
                <input className={classes.input} autoFocus={true} name='searchInput' style={{ }} />
                <div style={{ margin: '0 2vw', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <SearchIcon style={{cursor:'pointer'}} onClick={this.handleSearch.bind(this)} />
                </div>
            </div> */}
            <div style={{flex:1}}></div>
            <BottomNavBarForCustomer />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(SearchPage);