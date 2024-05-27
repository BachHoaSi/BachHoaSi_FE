// src/App.js
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import "./App.scss";
import { router } from './config/router';

const App = () => {
  return (
    <RouterProvider router={router} />
  );
};

export default App;


// <Route path="/customer" component={CustomerPage} />
// <Route path="/shipper" component={ShipperPage} />
// <Route path="/staff" component={StaffPage} />
// <Route path="/login" component={LoginPage} />
// <Route path="/" exact component={CustomerPage} />