const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const create2DArray = (rows, cols) => {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) arr[i] = new Array(rows);
  return arr;
};

const s = p => {
  let dim,
    rows,
    cols,
    maze,
    simFinished,
    simSpeed,
    mazeValues,
    directions,
    vis,
    simStarted;
  p.setup = () => {
    let myCanvas = p.createCanvas(800, 400).parent("my-canvas");
    myCanvas.mousePressed(mousePressed);
    dim = 50;
    rows = p.floor(p.height / dim);
    cols = p.floor(p.width / dim);
    simSpeed = 100; // in ms
    mazeValues = {
      ratTrail: 1,
      obstacle: 2,
      finish: 3,
      clearPath: 4,
      // usedPath: 5,
    };
    directions = [
      [1, 0],
      [0, 1],
      [-1, 0],
      [0, -1],
      // [1, 1],
      // [-1, -1],
      // [1, -1],
      // [-1, 1],
    ];
    simStarted = false;
    simFinished = false;
    maze = create2DArray(rows, cols);
    vis = create2DArray(rows, cols);
    initGridState();
  };
  p.draw = () => {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        switch (maze[i][j]) {
          case mazeValues.ratTrail:
            p.fill("#ff0");
            break;
          case mazeValues.obstacle:
            p.fill("#000");
            break;
          case mazeValues.finish:
            p.fill("#03fc7f");
            break;
          // case mazeValues.usedPath:
          //   p.fill("#f11");
          //   break;
          case mazeValues.clearPath:
          default:
            p.fill("#fff");
        }
        p.stroke(160);
        p.rect(i * dim, j * dim, dim - 3, dim - 3);
      }
    }
  };
  const ratInMaze = async (x, y) => {
    if (
      x >= 0 &&
      x < cols &&
      y >= 0 &&
      y < rows &&
      maze[x][y] === mazeValues.clearPath &&
      vis[x][y] === false
    ) {
      vis[x][y] = true;
      if (x == cols - 1 && y == rows - 1) {
        maze[x][y] = mazeValues.finish;
        simFinished = true;
        return;
      }
      // boundary
      if (simFinished) return;

      maze[x][y] = mazeValues.ratTrail;
      await sleep(simSpeed);

      for (let [dx, dy] of directions) await ratInMaze(x + dx, y + dy);

      // boundary
      if (simFinished) return;

      maze[x][y] = mazeValues.clearPath;
      await sleep(simSpeed);
    }
  };

  const initGridState = (preserveObstacles = false) => {
    simFinished = false;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        preserveObstacles
          ? (maze[i][j] =
            maze[i][j] == mazeValues.obstacle
              ? maze[i][j]
              : mazeValues.clearPath)
          : (maze[i][j] = mazeValues.clearPath);
        vis[i][j] = false;
      }
    }
  };

  const mousePressed = () => {
    if (simStarted) return;
    let col = (p.mouseX - (p.mouseX % dim)) / dim;
    let row = (p.mouseY - (p.mouseY % dim)) / dim;

    if (row < rows && row >= 0 && col < cols && col >= 0) {
      maze[col][row] =
        maze[col][row] === maze.clearPath
          ? mazeValues.obstacle
          : maze.clearPath;
    }
  };

  document.getElementById("startBtn").addEventListener("click", async e => {
    e.preventDefault();
    if (simStarted || simFinished) return;
    simStarted = true;
    await ratInMaze(0, 0);
    simStarted = false;
  });
  document.getElementById("resetBtn").addEventListener("click", e => {
    e.preventDefault();
    if (!simStarted) initGridState(true);
  });
  document.getElementById("clearBtn").addEventListener("click", e => {
    e.preventDefault();
    if (!simStarted) initGridState();
  });
};

let sketch = new p5(s);
