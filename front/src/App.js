import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from 'react-router-dom';

import './css/Login.css';
import './css/UserInfo.css';
import './css/BottomNavBar.css';
import './css/Orders.css';
import './css/OrderCards.css';
import './css/OrderDetail.css';
import './css/AddressManager.css';
import './css/Operator.css';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserInfoPage from './pages/UserInfo';
import OrdersPage from './pages/Orders';
import AddressManagerPage from './pages/AddressManager';
import OrderDetailPage from './pages/OrderDetail';

import ShoppingCart from './pages/ShoppingCart';
import MainPage from './pages/MainPage';
import SearchResultPage from './pages/SearchResultPage';
import SearchPage from './pages/SearchPage';
import CatalogsPage from './pages/CatalogsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderManagement from './pages/OrderManagement';
import OperatorPage from './pages/Operator';

function App() {
  return (
    <Router>
      <Switch>


        <Route path='/product/detail/:productId' component={ProductDetailPage} ></Route>
        <Route path='/product/search/:keyword' component={SearchResultPage} ></Route>
        <Route path='/product/search' component={SearchPage} ></Route>
        <Route path='/product/catalogs' component={CatalogsPage} ></Route>
        <Route path='/shoppingCart' component={ShoppingCart} ></Route>
        {/* <Route path='/product/detail/:product_id' component={ProductView} ></Route> */}
        <Route path='/login' component={LoginPage} ></Route>
        <Route path='/register' component={RegisterPage} ></Route>
        <Route path='/user-info' component={UserInfoPage} ></Route>
        <Route path='/orders' component={OrdersPage} ></Route>
        <Route path='/order-detail' component={OrderDetailPage} ></Route>
        <Route path='/address' component={AddressManagerPage} ></Route>
        <Route path='/orderManagement' component={OrderManagement} ></Route>
        <Router path='/operator' component={OperatorPage}></Router>

        {/* <Route path="/" component={ShoppingCart}></Route> */}
        <Route path="/" component={MainPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;
