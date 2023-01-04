const s = p => {
  let dim, rows, cols, maze;
  let rx, ry;
  const create2DArray = (rows, cols) => {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) arr[i] = new Array(rows);
    return arr;
  };
  p.setup = () => {
    dim = 40;
    let myCanvas = p.createCanvas(800, 400);
    p.frameRate(5);
    myCanvas.parent("my-canvas");
    // p.background("black");
    rows = p.floor(p.height / dim);
    cols = p.floor(p.width / dim);
    maze = create2DArray(rows, cols);
    rx = 0;
    ry = 0;
    init();
  };
  p.draw = () => {
    paint();
  };

  const paint = () => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (maze[i][j] === 1) p.fill("white");
        else if (maze[i][j] === 2) p.fill("yellow");
        else if (maze[i][j] === 3) p.fill("black");
        p.stroke(100);
        p.rect(i * dim, j * dim, dim - 2, dim - 2);
      }
    }
  };

  const init = () => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        maze[i][j] = 1;
      }
    }
    maze[2][2] = 3;
    maze[19][2] = 3;
    maze[19][8] = 3;
    maze[13][8] = 3;
    maze[0][0] = 2;
  };
  // backtracking algorithm goes here...
  const generate = () => {
    if (
      rx < 0 ||
      rx == cols ||
      ry < 0 ||
      ry == rows ||
      maze[rx][ry] === 3 ||
      maze[rx][ry] === 2
    )
      return;
    if (rx === cols - 1 && ry === rows - 1) return;
    maze[rx][ry] = 2;
    generate(rx + 1, ry);
    generate(rx - 1, ry);
    generate(rx, ry + 1);
    generate(rx, ry - 1);
    maze[rx][ry] = 1;
    return;
  };
};

let sketch = new p5(s);
