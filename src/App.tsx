import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import './App.scss';
import Game from './components/Game';

function App() {
  return (
    <div className="app">
      <header>
        <h1>Conway’s Game of Life</h1>
        <section>
          <p>Here’s a simple implementation of the famous <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank" rel="noopener noreferrer">Life</a> by <a href="https://en.wikipedia.org/wiki/John_Horton_Conway" target="_blank" rel="noopener noreferrer">John Horton Conway</a></p>
        </section>
      </header>
      <Router>
        <Route exact path={['/:startPoint', '/']} component={Game} />
      </Router>
    </div>
  );
}

export default App;
