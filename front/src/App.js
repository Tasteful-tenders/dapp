import './App.css';
import React, { Component } from 'react';

import { Header, Footer, Caroussel } from './components';

class App extends Component {

  render(){
    return (
      <div className="App">
        <Header />
        {/* <Caroussel /> */}
        <Footer />
      </div>
    );
  }

}

export default App;
