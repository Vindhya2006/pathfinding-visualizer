export function bfs(grid: any[][], start: any, end: any) {
  const visited: any[] = [];
  const queue: any[] = [];
  const prev = new Map();

  const key = (n: any) => `${n.row}-${n.col}`;

  const dirs = [
    [1,0],
    [-1,0],
    [0,1],
    [0,-1]
  ];

  queue.push(start);
  const seen = new Set([key(start)]);

  while (queue.length) {

    const curr = queue.shift();
    visited.push(curr);

    if (key(curr) === key(end)) break;

    for (const [dr,dc] of dirs) {

      const r = curr.row + dr;
      const c = curr.col + dc;

      if (
        r >= 0 &&
        r < grid.length &&
        c >= 0 &&
        c < grid[0].length
      ) {

        const nb = grid[r][c];

        if (!nb.isWall && !seen.has(key(nb))) {
          seen.add(key(nb));
          queue.push(nb);
          prev.set(key(nb), curr);
        }

      }
    }
  }

  const path:any[] = [];
  let curr = end;

  while (curr && key(curr) !== key(start)) {
    path.unshift(curr);
    curr = prev.get(key(curr));
  }

  return { visited, path };
}



export function dijkstra(grid: any[][], start: any, end: any) {
  const visited: any[] = [];
  const dist = new Map();
  const prev = new Map();
  const pq: any[] = [];

  const key = (n: any) => `${n.row}-${n.col}`;

  const dirs = [
    [1,0],
    [-1,0],
    [0,1],
    [0,-1]
  ];

  grid.flat().forEach((n: any) => {
    dist.set(key(n), Infinity);
  });

  dist.set(key(start), 0);
  pq.push(start);

  while (pq.length) {

    pq.sort((a,b)=>dist.get(key(a)) - dist.get(key(b)));
    const curr = pq.shift();

    visited.push(curr);

    if (key(curr) === key(end)) break;

    for (const [dr,dc] of dirs) {

      const r = curr.row + dr;
      const c = curr.col + dc;

      if (
        r >= 0 &&
        r < grid.length &&
        c >= 0 &&
        c < grid[0].length
      ) {

        const nb = grid[r][c];

        if (nb.isWall) continue;

        const newDist =
          dist.get(key(curr)) + nb.weight;

        if (newDist < dist.get(key(nb))) {
          dist.set(key(nb), newDist);
          prev.set(key(nb), curr);
          pq.push(nb);
        }

      }
    }
  }

  const path:any[] = [];
  let curr = end;

  while (curr && key(curr) !== key(start)) {
    path.unshift(curr);
    curr = prev.get(key(curr));
  }

  return { visited, path };
}
export function astar(grid: any[][], start: any, end: any) {
  const visited: any[] = [];
  const open: any[] = [];
  const prev = new Map();

  const g = new Map();
  const f = new Map();

  const key = (n: any) => `${n.row}-${n.col}`;

  const dirs = [
    [1,0],
    [-1,0],
    [0,1],
    [0,-1]
  ];

  const heuristic = (a:any,b:any)=>
    Math.abs(a.row-b.row)+Math.abs(a.col-b.col);

  grid.flat().forEach((n:any)=>{
    g.set(key(n),Infinity);
    f.set(key(n),Infinity);
  });

  g.set(key(start),0);
  f.set(key(start),heuristic(start,end));

  open.push(start);

  while(open.length){

    open.sort((a,b)=>f.get(key(a))-f.get(key(b)));
    const curr=open.shift();

    visited.push(curr);

    if(key(curr)===key(end)) break;

    for(const [dr,dc] of dirs){

      const r=curr.row+dr;
      const c=curr.col+dc;

      if(
        r>=0 &&
        r<grid.length &&
        c>=0 &&
        c<grid[0].length
      ){

        const nb=grid[r][c];

        if(nb.isWall) continue;

        const newG=g.get(key(curr))+nb.weight;

        if(newG<g.get(key(nb))){
          prev.set(key(nb),curr);
          g.set(key(nb),newG);
          f.set(key(nb),newG+heuristic(nb,end));

          if(!open.includes(nb)) open.push(nb);
        }

      }
    }
  }

  const path:any[]=[];
  let curr=end;

  while(curr && key(curr)!==key(start)){
    path.unshift(curr);
    curr=prev.get(key(curr));
  }

  return {visited,path};
}
export function generateMaze(grid: any[][]) {
  const newGrid = grid.map((row: any[]) =>
    row.map((node: any) => ({
      ...node,
      isWall: false
    }))
  );

  newGrid.forEach((row: any[]) => {
    row.forEach((node: any) => {

      if (!node.isStart && !node.isEnd) {

        if (Math.random() < 0.28) {
          node.isWall = true;
        }

      }

    });
  });

  return newGrid;
}