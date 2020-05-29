import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './css/Login.css';
import './css/PicTxtCard.css';
import './css/UserInfo.css';
import './css/BottomNavBar.css';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
function App() {
  return (
    <Router>
      <Route path="/" component={RegisterPage}></Route>
      <Route path='/Login' component={LoginPage} ></Route>
    </Router>
  );
}

export default App;
