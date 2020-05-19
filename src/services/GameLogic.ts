export type Matrix = Array<Array<number>>;
const alive = 1;
const dead = 0;

export const calculateNextGeneration = (prevGen: Matrix): Matrix => {
  const nextGen: Matrix = []
  for (let y = 0; y < prevGen.length; y++) {
    const newRow: Array<number> = []
    for (let x = 0; x < prevGen[y].length; x++) {
      const cell = prevGen[y][x];
      const prevX = x > 0
        ? x - 1
        : x;
      const nextX = x < prevGen[y].length - 1
        ? x + 2
        : x + 1;
      const counter = (
        prevGen[y - 1]
          ? prevGen[y - 1].slice(prevX, nextX).reduce((acc, v) => acc + v)
          : 0)
        + (prevGen[y][x - 1] || 0)
        + (prevGen[y][x + 1] || 0)
        + (prevGen[y + 1]
          ? prevGen[y + 1].slice(prevX, nextX).reduce((acc, v) => acc + v)
          : 0
        );
      cell === alive
        ? counter > 1 && counter <= 3
          ? newRow.push(alive)
          : newRow.push(dead)
        : counter === 3
          ? newRow.push(alive)
          : newRow.push(dead)
        ;
    }
    nextGen.push(newRow);
  }
  return nextGen;
}

export const generateStartPoint = (width: number, height: number, value?: 0 | 1): Matrix => {
  return Array.from({ length: height }, () => (
    Array.from({ length: width }, () => {
      return (
        value !== undefined
          ? value
          : (Math.random() * 100 | 0) < 50
            ? dead
            : alive
      );
    })
  ))
}