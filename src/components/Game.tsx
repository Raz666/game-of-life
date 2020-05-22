import React, { useState, useRef, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Matrix, calculateNextGeneration, generateStartPoint } from '../services/GameLogic';
import SizeInput from './SizeInput';

type Params = {
  startPoint: string,
}
type CellCoordinate = {
  rowIndex: number,
  cellIndex: number,
}

const startPointSize = 20;

const Game: React.FC<RouteComponentProps<Params>> = ({ match }) => {
  let parsedUrl: Matrix | undefined;
  let parseError = '';
  try {
    let rawParse = match.params && match.params.startPoint && JSON.parse(match.params.startPoint);
    if (rawParse) {
      const startPointWidth = parseInt(rawParse.pop());
      parsedUrl = rawParse.map((row: Array<string>) => row
        .map((e, index) => parseInt(e, 16)
          .toString(2)
          .padStart(index === row.length - 1 ? (startPointWidth % 20 || 20) : 20, '0')
        )
        .reduce((a, acc) => a + acc)
        .split('')
        .map(e => parseInt(e))
      );
    }
  } catch (err) {
    parseError = `There’s a typo in the link you’ve used. A random starting area has been set up instead.`;
  }

  const [startWidth, setStartWidth] = useState(parsedUrl ? parsedUrl[0].length : startPointSize);
  const [startHeight, setStartHeight] = useState(parsedUrl ? parsedUrl.length : startPointSize);
  const startPoint = parsedUrl ? parsedUrl : () => generateStartPoint(startWidth, startHeight);
  const gameUrl = useRef<HTMLInputElement>(null);

  const [area, setArea] = useState(startPoint);
  const [currentStartPoint, setCurrentStartPoint] = useState(startPoint);
  const [newStartPointViable, setNewStartPointViable] = useState(true);
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

  const toggleCell = (cellCoordinate: CellCoordinate, area: Matrix): void => {
    const newArea = area
      .map((row, rowIndex) => row
        .map((cell, cellIndex) => (rowIndex === cellCoordinate.rowIndex && cellIndex === cellCoordinate.cellIndex
          ? (cell ? 0 : 1)
          : cell
        )));
    reset(newArea);
  }

  useEffect(() => {
    const hexadecimal: Array<Array<string> | string> = currentStartPoint.map((e, index) => {
      const binary = e.toString().replace(/,/g, '');
      let binPart: Array<string> = [];
      let j = 0;
      let temp = '';
      for (let i = 0; i < binary.length; i++) {
        temp = temp + binary[i];
        j++;
        if (j === 20 || i === binary.length - 1) {
          binPart.push(temp);
          temp = '';
          j = 0;
        }
      }
      const hexPart = binPart.map(e => parseInt(e, 2).toString(16));
      return hexPart;
    });
    hexadecimal.push(currentStartPoint[0].length.toString());
    setShareUrl(`${window.location.origin}/${JSON.stringify(hexadecimal)}`);
  }, [currentStartPoint]);

  return (
    <div className="game-field">
      {parseError ? <small><i>{parseError}</i></small> : ''}
      <section>
        <h3 className="heading">
          Starting area
        </h3>
        <div style={{ marginBottom: '1em' }}>
          <SizeInput value={startWidth} setValue={setStartWidth} label="width" setValidity={setNewStartPointViable} />
          <SizeInput value={startHeight} setValue={setStartHeight} label="height" setValidity={setNewStartPointViable} />
        </div>
        <div>
          <button
            onClick={() => reset(generateStartPoint(startWidth, startHeight))}
            className="toggle"
            disabled={!newStartPointViable}
          >
            Random
          </button>
          <button
            onClick={() => reset(generateStartPoint(startWidth, startHeight, 1))}
            disabled={!newStartPointViable}
            className="toggle"
          >
            All alive
          </button>
          <button
            onClick={() => reset(generateStartPoint(startWidth, startHeight, 0))}
            disabled={!newStartPointViable}
            className="toggle"
          >
            All dead
          </button>
        </div>
        <h3 className="heading">
          Unleash life
        </h3>
        <div>
          <button
            onClick={toggleTicking}
            className="toggle"
          >
            {paused ? (generation > 1 ? 'Resume' : 'Run') : 'Pause'}
          </button>
          <button
            onClick={() => reset()}
            className="toggle"
            disabled={generation <= 1}
          >
            Reset
          </button>
        </div>
        <p>
          Current generation: {generation}
        </p>
      </section>
      {area
        ? <div className="area">
          {area.map((row, rowIndex) => {
            return (
              <div key={rowIndex} className="area-row">
                {row.map((cell, cellIndex) => {
                  return (
                    <div key={cellIndex} className="area-cell">
                      <button
                        onClick={() => toggleCell({ cellIndex: cellIndex, rowIndex: rowIndex }, area)}
                        className={`cell ${cell ? 'alive' : 'dead'}`}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        : ''
      }

      <section>
        <h3 className="heading">
          Share your joy
        </h3>
        <p><small>You can share the current starting area setup using the link below:</small></p>
        <div className="group">
          <input ref={gameUrl} value={shareUrl} readOnly />
          <button onClick={copyUrl}>Copy</button>
        </div>
      </section>
    </div>
  );
}

export default Game;
