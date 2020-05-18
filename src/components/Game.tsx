import React, { useState, useRef } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Matrix, calculateNextGeneration, generateStartPoint } from '../services/GameLogic';

type Params = {
  startPoint: string,
};

const startPointSize = 50; //prepare table to overflow instead if squish

const Game: React.FC<RouteComponentProps<Params>> = ({ match }) => {
  let parsedURL: Matrix | undefined;
  let parseError: string;
  try {
    parsedURL = match.params && match.params.startPoint && JSON.parse(match.params.startPoint)
  } catch {
    parseError = 'There’s a typo in the starting point. Please make sure it looks like this: [[0,1,0],[0,1,0],[0,1,0]]'; //show it somewhere
  }

  const startPoint = parsedURL ? parsedURL : generateStartPoint(startPointSize, startPointSize);
  const gameUrl = useRef<HTMLInputElement>(null);

  const [area, setArea] = useState(startPoint);
  const [generation, setGeneration] = useState(1);
  const [ticker, setTicker] = useState(1);
  const [paused, setPaused] = useState(false);

  const setup = ((game: Matrix) => {
    const interval: number = window.setInterval(() => {
      setGeneration(generation => generation + 1);
      const newGame = calculateNextGeneration(game);
      game = newGame;
      setArea(game);
    }, 1000);
    setTicker(interval);
    return () => clearInterval(interval);
  });

  const copyUrl = () => {
    gameUrl.current && gameUrl.current.select();
    document.execCommand("copy");
  }


  const toggleTicking = () => {
    paused ? setup(area) : clearInterval(ticker);
    setPaused(!paused);
  }

  const reset = () => {
    clearInterval(ticker);
    setArea(startPoint);
    setGeneration(1);
    setup(startPoint);
  }

  return (
    <header className="App-header">
      <section>
        <div>
          <button onClick={reset} className="toggle">{generation > 1 ? 'Reset' : 'Run'}</button>
          <button onClick={toggleTicking} className="toggle">{paused ? 'Resume' : 'Pause'}</button>
        </div>
        <p>
          Current generation: {generation}
        </p>
      </section>
      {area
        ? <table>
          <tbody>
            {area.map((tr, trId) => {
              return (
                <tr key={trId}>{tr.map((td, tdId) => {
                  return (
                    <td key={tdId} className={td ? 'alive' : 'dead'}></td>
                  );
                })}</tr>
              );
            })}
          </tbody>
        </table>
        : ''}

      <section>
        <p><small>Have you enjoyed this particular game? <br />Share it with your peers using the link below:</small></p>
        <div>
          <input ref={gameUrl} value={window.location.href} readOnly />
          <button onClick={copyUrl} className="copy">Copy</button>
        </div>
      </section>
    </header>
  );
}

export default Game;
