import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Game from './components/Game';

type matrix = Array<Array<number>>;

function App() {
  return (
    <div className="App">

      <Router>
        <Route exact path={['/game/:game', '/']} component={Game} />
      </Router>
    </div>
  );
}

export default App;
