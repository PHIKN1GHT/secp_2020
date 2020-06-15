import React, {Component} from 'react';
import { ReactDOM } from 'react-dom';

import BottomNavBarForCustomer from '../components/BottomNavBarForCustomer'

import { withStyles } from "@material-ui/core/styles";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import TopBar from '../components/TopBar';

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
            products: [],
            totalPage: 0,
        }
    }
    componentWillMount() {
        this.fetchAndInitial()
        // let catalogs = []
        // for (let i = 1; i <= 10; ++i){
        //     catalogs.push({id:i, name:'catalog-'+i})
        // }
        // let products = []
        // for (let i = 1; i <= 20; ++i){
        //     products.push({id:i, name:'products-'+i, price:'price-'+i, unit:'unit-'+i,cover:'cover-'+i})
        // }
        // this.setState({
        //     catalogs,
        //     products,

        // })
    }
    fetchAndInitial() { 
        // totalPage: number,
        // catalogs: [id: number, name: str],
        // products: [number: [id: number, name: str, price: number, unit: str, cover: '']]
        const url = 'http://localhost:2333/api/mall/homepage'
        fetch(url, {
            // body: bodyData, // must match 'Content-Type' header
            //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'include', // include, same-origin, *omit
            headers: {
                'content-type': 'application/json'
            },
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            //redirect: 'follow', // manual, *follow, error
            //referrer: 'no-referrer', // *client, no-referrer
        })
        .then(response => response.json()) // parses response to JSON 
        .then(json => {
            const catalogs = json['catalogs']
            const products = json['products']
            const totalPage = json['totalPage']
            this.setState({
                catalogs,
                products,
                totalPage,
            })
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
            {/* <TopBar canGoBack={false} canSearch={true} /> */}
            <div className={classes.searchBar}>
                <input onClick={this.handleSearch.bind(this)} readonly="readonly" style={{ width: '60%', height: '70%', }} />
                <div style={{ margin: '0' }}>
                    <IconButton onClick={this.handleSearch.bind(this)} >
                        <SearchIcon />
                    </IconButton>
                </div>
            </div>
            <div style={{ flex:1, overflowY:'auto',scrollbarWidth: 'none',}}>
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