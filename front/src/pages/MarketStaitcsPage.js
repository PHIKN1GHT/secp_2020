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
        backgroundColor: 'lavender',
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


class MainPage extends Component { 
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
        //const searchInput = document.getElementsByName('searchInput')[0]
        //const keyword = searchInput.value
        this.props.history.push({ pathname: '/product/search',})
    }
    render() {
        const { classes } = this.props;
        return (<div className={classes.colBox} style={{}}>
            {/* 搜索框 */}
            <div className={classes.searchBar}>
                <input onClick={this.handleSearch.bind(this)} readonly="readonly" style={{ width: '60%', height: '70%', }} />
                <div style={{ margin: '0' }}>
                    <IconButton onClick={this.handleSearch.bind(this)} >
                        <SearchIcon />
                    </IconButton>
                </div>
            </div>
            <div style={{overflowY:'auto',scrollbarWidth: 'none',}}>
                {/* 目录展示 */}
                <div className={classes.rowBox} style={{flexWrap:'wrap'}}>
                    {this.state.catalogs.map((catalog) => { 
                        return (
                            <div style={{ width: '20vw', height: '20vw', display: 'flex', flexDirection: 'column', alignItems:'center'}}>
                                <img style={{borderRadius:'80%',width:'80%', height:'80%'}} src="https://material-ui.com/static/images/cards/live-from-space.jpg" />
                                <span>
                                    {catalog.name}
                                </span>    
                            </div>
                        )
                    })}
                </div>
                {/* 推荐商品 */}
                <div className={classes.rowBox} style={{justifyContent: 'space-evenly',flexWrap:'wrap'}}>
                {this.state.products.map((product) => { 
                    return (
                        <div style={{borderRadius:'5px',  border:"1px solid", margin:'2vh 0 0 0', width: '48vw',  display: 'flex', flexDirection: 'column', alignItems:'center',borderColor: 'thistle',}}>
                            <img style={{borderRadius:'5px 5px 0 0', width: '100%', maxHeight: (50 * 0.9) + 'vw' }} src="https://material-ui.com/static/images/cards/live-from-space.jpg" />
                            <span>
                                {product.name}
                            </span>
                            <div>
                                <span>
                                    ￥{product.price}
                                </span>
                                <span>
                                    /{product.unit}
                                </span>
                            </div>
                            <div style={{alignSelf:'flex-end'}} >
                                <AddShoppingCartIcon className={classes.shoppingIcon}/>
                            </div>    
                        </div>
  
                    )
                })}
            </div>
            </div>
            <BottomNavBarForCustomer />
        </div>);
    }
}
export default withStyles(styles, { withTheme: true })(MainPage);