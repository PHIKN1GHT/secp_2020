import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from 'react-router-dom';

import './css/Login.css';
import './css/PicTxtCard.css';
import './css/UserInfo.css';
import './css/BottomNavBar.css';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserInfoPage from './pages/UserInfo';
function App() {
  return (
    <Router>
      <Switch>
        <Route path='/Login' component={LoginPage} ></Route>
        <Route path='/Register' component={RegisterPage} ></Route>
        <Route path='/UserInfo' component={UserInfoPage} ></Route>
        <Route path="/" component={RegisterPage}></Route>
      </Switch>
    </Router>
  );
}

export default App;
