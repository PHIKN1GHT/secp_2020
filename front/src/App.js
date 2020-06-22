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
//import './css/OperatorInfo.css';
import './css/OperatorCustomerOrder.css';
import './css/OperatorSupplierOrder.css';

import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserInfoPage from './pages/UserInfo';
import OrdersPage from './pages/Orders';
import AddressManagerPage from './pages/AddressManager';
import OrderDetailPage from './pages/OrderDetail';
import OperatorInfoPage from './pages/OperatorInfo';
import OperatorCustomerOrderPage from './pages/OperatorCustomerOrder';
import OperatorSupplierOrderPage from './pages/OperatorSupplierOrder';

import ShoppingCart from './pages/ShoppingCart';
import MainPage from './pages/MainPage';
import SearchResultPage from './pages/SearchResultPage';
import SearchPage from './pages/SearchPage';
import CatalogsPage from './pages/CatalogsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OrderManagement from './pages/OrderManagement';
import OrderManagementDetailPage from './pages/OrderManagementDetail';
import ManagerInfoPage from './pages/ManagerInfo';
import SalesStatisticsPage from './pages/SalesStatistics';
import InventoryPage from './pages/Inventory';
import PurchasePage from './pages/Purchase';
import PurchaseOrderPage from './pages/PurchaseOrder';

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
        <Route path='/orderManagement-detail' component={OrderManagementDetailPage} ></Route>
        <Route path='/operator-info' component={OperatorInfoPage}></Route>
        <Route path='/operator-customer-order' component={OperatorCustomerOrderPage}></Route>
        <Route path='/operator-supplier-order' component={OperatorSupplierOrderPage}></Route>
        <Route path='/manager-info' component={ManagerInfoPage} ></Route>
        <Route path='/salesStatistics' component={SalesStatisticsPage} ></Route>
        <Route path='/localInventory' component={InventoryPage} ></Route>
        <Route path='/purchase' component={PurchasePage} ></Route>
        <Route path='/purchase-order' component={PurchaseOrderPage} ></Route>
        {/* <Route path="/" component={ShoppingCart}></Route> */}
        <Route path="/" component={MainPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;
