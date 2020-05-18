import React, { useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Matrix, calculateNextGeneration, generateStartPoint } from '../services/GameLogic';

type Params = {
  startPoint: string,
};

const startPointSize = 20;

const Game: React.FC<RouteComponentProps<Params>> = ({ match }) => {
  let parsedUrl: Matrix | undefined;
  let parseError = '';
  try {
    parsedUrl = match.params && match.params.startPoint && JSON.parse(match.params.startPoint)
  } catch {
    parseError = 'There’s a typo in the link you’ve used. Please make sure it looks like this (mind all the brackets!): [[0,1,0],[0,1,0],[0,1,0]]';
  }

  const startPoint = parsedUrl ? parsedUrl : generateStartPoint(startPointSize, startPointSize);
  const gameUrl = useRef<HTMLInputElement>(null);

  const [area, setArea] = useState(startPoint);
  const [currentStartPoint, setCurrentStartPoint] = useState(startPoint);
  const [shareUrl, setShareUrl] = useState(window.location.href);
  const [generation, setGeneration] = useState(1);
  const [ticker, setTicker] = useState(1);
  const [paused, setPaused] = useState(true);

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

  const copyUrl = (): void => {
    gameUrl.current && gameUrl.current.select();
    document.execCommand("copy");
  }

  const toggleTicking = (): void => {
    paused ? setup(area) : clearInterval(ticker);
    setPaused(!paused);
  }

  const reset = (newStartPoint?: Matrix): void => {
    clearInterval(ticker);
    if (newStartPoint) setCurrentStartPoint(newStartPoint);
    setArea(newStartPoint ? newStartPoint : currentStartPoint);
    setGeneration(1);
    if (!paused) setup(newStartPoint ? newStartPoint : currentStartPoint);
  }

  useEffect(() => {
    setShareUrl(`${window.location.origin}/${JSON.stringify(currentStartPoint)}`);
  }, [currentStartPoint]);

  return (
    <div className="game-field">
      {parseError ? <small><i>{parseError}</i></small> : ''}
      <section>
        <p>
          <button onClick={() => reset(generateStartPoint(startPointSize, startPointSize))} className="toggle">New start point</button>
        </p>
        <div>
          <button onClick={() => reset()} className="toggle" disabled={generation <= 1}>Reset</button>
          <button onClick={toggleTicking} className="toggle">{paused ? (generation > 1 ? 'Resume' : 'Run') : 'Pause'}</button>
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
        : ''
      }

      <section>
        <p><small>Have you enjoyed this particular game? <br />Share it with your peers using the link below:</small></p>
        <div>
          <input ref={gameUrl} value={shareUrl} readOnly />
          <button onClick={copyUrl} className="copy">Copy</button>
        </div>
      </section>
    </div>
  );
}

export default Game;
