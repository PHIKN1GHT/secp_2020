import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from 'react-router-dom';

import './css/Login.css';
import './css/PicTxtCard.css';
import './css/UserInfo.css';
import './css/BottomNavBar.css';
import './css/Orders.css';
import './css/OrderCards.css';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserInfoPage from './pages/UserInfo';
import OrdersPage from './pages/Orders';
import ProductView from './pages/ProductView';
import ProductDetail from './pages/ProductDetail';
import ShoppingCart from './pages/ShoppingCart';
function App() {
  return (
    <Router>
      <Switch>
        <Route path='/product/catalogs' component={ProductView} ></Route>
        <Route path='/shoppingCart' component={ShoppingCart} ></Route>
        <Route path='/product/detail/:product_id' component={ProductView} ></Route>
        <Route path='/login' component={LoginPage} ></Route>
        <Route path='/register' component={RegisterPage} ></Route>
        <Route path='/user-info' component={UserInfoPage} ></Route>
        <Route path='/orders' component={OrdersPage}></Route>

        <Route path="/" component={ShoppingCart}></Route>
        {/* <Route path="/" component={RegisterPage}></Route> */}
      </Switch>
    </Router>
  );
}

export default App;
