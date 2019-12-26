import React, { Component } from 'react';
import Navbar from './Components/layouts/Navbar';
import {Provider} from  'react-redux';
import Landing from './Components/layouts/Landing';
import Footer from './Components/layouts/Footer';
import Login from './Components/Auth/Login';
import Register from './Components/Auth/Register';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import store from './store'
class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
