import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

type TParams = {
  game: string,
};
type matrix = Array<Array<number>>;

const Game: React.FC<RouteComponentProps<TParams>> = ({ match }) => {
  const alive = 1;
  const dead = 0;

  const conwaysGameOfLife = (game: matrix): matrix => {
    const newGame: matrix = []
    for (let y = 0; y < game.length; y += 1) {
      const newRow: Array<number> = []
      for (let x = 0; x < game[y].length; x += 1) {
        const cell = game[y][x];
        const prevX = x > 0 ? x - 1 : x;
        const nextX = x < game[y].length - 1 ? x + 2 : x + 1;
        const counter =
          (game[y - 1] ? game[y - 1].slice(prevX, nextX).reduce((acc, v) => acc + v) : 0) +
          (game[y][x - 1] || 0) + (game[y][x + 1] || 0) +
          (game[y + 1] ? game[y + 1].slice(prevX, nextX).reduce((acc, v) => acc + v) : 0)
        cell === alive
          ? counter > 1 && counter <= 3
            ? newRow.push(alive)
            : newRow.push(dead)
          : counter === 3
            ? newRow.push(alive)
            : newRow.push(dead)
      }
      newGame.push(newRow);
    }
    return newGame;
  }

  const generateGame = (height: number, width: number): matrix => {
    return Array.from({ length: height }, (v, k) => (
      Array.from({ length: width }, (v, k) => {
        return (Math.random() * 100 | 0) < 50 ? dead : alive
      })
    ))
  }

  const setup = ((game: matrix) => {
    const interval: number = window.setInterval(() => {
      setGeneration(generation => generation + 1);
      const newGame = conwaysGameOfLife(game);
      game = newGame;
      setGameBoard(game);
    }, 1000);
    setTicker(interval);
    return () => clearInterval(interval);
  });

  const parsedURL: matrix = match.params && match.params.game && JSON.parse(match.params.game);
  const game = parsedURL ? parsedURL : generateGame(20, 20);
  const [gameBoard, setGameBoard] = useState(game);
  const [generation, setGeneration] = useState(1);
  const [ticker, setTicker] = useState(1);
  useEffect(() => {
    // console.log(parsedURL);
    // console.log(game);
    // console.log(JSON.stringify(game));
    setup(game);
  }, []);

  return (
    <header className="App-header">
      Generation: {generation}
      <table>
        <tbody>
          {gameBoard.map((tr, trId) => {
            return (
              <tr key={trId}>{tr.map((td, tdId) => {
                return (
                  <td key={tdId} style={{ backgroundColor: td ? 'white' : '', width: '20px', height: '20px' }}></td>
                );
              })}</tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={() => clearInterval(ticker)}>Stop</button>
      <button onClick={() => setup(gameBoard)}>Start</button>
    </header>
  );
}

export default Game;
