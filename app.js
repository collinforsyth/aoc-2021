#!/usr/bin/env node

const fs = require("fs");
const os = require("os");

function day_one() {
  var result = {};
  // read input from fs
  input = fs.readFileSync("./data/day_one_input.txt", { encoding: "utf8" });

  data = input
    .split(os.EOL)
    .map((o) => parseInt(o, 10))
    .filter((o) => !isNaN(o));

  part_one = data.reduce((acc, _, i) => {
    if (i == 0) {
      return acc;
    } else if (data[i - 1] < data[i]) {
      acc++;
    }
    return acc;
  }, 0);

  result.part_one = part_one;

  part_two = data.reduce((acc, _, i) => {
    if (i == 0 || i == 1 || i == 2) {
      return acc;
    }
    let a = data[i - 3] + data[i - 2] + data[i - 1];
    let b = data[i - 2] + data[i - 1] + data[i];
    if (b > a) {
      acc++;
    }
    return acc;
  }, 0);

  result.part_two = part_two;
  return result;
}

function day_two() {
  // read input from fs
  input = fs.readFileSync("./data/day_two_input.txt", { encoding: "utf8" });

  data = input
    .split(os.EOL)
    .map((o) => o.split(" "))
    .map((o) => {
      return { direction: o[0], value: parseInt(o[1], 10) };
    });

  var result = {};
  part_one = data.reduce(
    (acc, o) => {
      switch (o.direction) {
        case "forward":
          acc.horizontal += o.value;
          break;
        case "up":
          acc.depth -= o.value;
          break;
        case "down":
          acc.depth += o.value;
          break;
        default:
          break;
      }
      return acc;
    },
    { horizontal: 0, depth: 0 }
  );
  result.part_one = part_one.horizontal * part_one.depth;

  part_two = data.reduce(
    (acc, o) => {
      switch (o.direction) {
        case "forward":
          acc.horizontal += o.value;
          acc.depth += acc.aim * o.value;
          break;
        case "up":
          acc.aim -= o.value;
          break;
        case "down":
          acc.aim += o.value;
          break;
        default:
          break;
      }
      return acc;
    },
    { horizontal: 0, depth: 0, aim: 0 }
  );
  result.part_two = part_two.horizontal * part_two.depth;

  return result;
}

function dayThree() {
  var result = {};
  // read input from fs
  input = fs.readFileSync("./data/day_three_input.txt", { encoding: "utf8" });

  data = input
    .split(os.EOL)
    .map((o) => {
      return parseInt(o, 2);
    })
    .filter((o) => !isNaN(o));

  bitCounts = data.reduce(
    (acc, o) => {
      num = o;
      // bitmask LSB and add to end of array
      for (i = 11; i >= 0; i--) {
        num & 1 ? acc[i].oneCount++ : acc[i].zeroCount++;
        num = num >> 1;
      }
      return acc;
    },
    Array(12)
      .fill()
      .map(() => {
        return { oneCount: 0, zeroCount: 0 };
      })
  );

  partOne = bitCounts.reduce(
    (acc, count) => {
      if (count.oneCount > count.zeroCount) {
        acc.gamma = (acc.gamma << 1) | 1;
        acc.epsilon = acc.epsilon << 1;
      } else {
        acc.gamma = acc.gamma << 1;
        acc.epsilon = (acc.epsilon << 1) | 1;
      }
      return acc;
    },
    { gamma: 0, epsilon: 0 }
  );
  result.partOne = partOne.epsilon * partOne.gamma;

  bits = Array(12)
    .fill()
    .map((_, i) => {
      return 11 - i;
    });

  const numBits = (arr, i) => {
    return arr.reduce(
      (acc, o) => {
        (o >> i) & 1 ? acc.oneCount++ : acc.zeroCount++;
        return acc;
      },
      { zero_count: 0, one_count: 0 }
    );
  };

  const bitFilter = (arr, i, keep) => {
    return arr.filter((o) => ((o >> i) & 1) == keep);
  };

  partTwo = bits.reduce(
    (acc, b) => {
      if (acc.oxygenRating.length == 1 && acc.co2Rating.length == 1) {
        return acc;
      }
      oxygenMSB = numBits(acc.oxygenRating, b);
      co2MSB = numBits(acc.co2Rating, b);

      if (acc.oxygenRating != 1) {
        if (oxygenMSB.one_count >= oxygenMSB.zero_count) {
          acc.oxygenRating = bitFilter(acc.oxygenRating, b, 1);
        } else {
          acc.oxygenRating = bitFilter(acc.oxygenRating, b, 0);
        }
      }
      if (acc.co2Rating.length != 1) {
        if (co2MSB.zero_count <= co2MSB.one_count) {
          acc.co2Rating = bitFilter(acc.co2Rating, b, 0);
        } else {
          acc.co2Rating = bitFilter(acc.co2Rating, b, 1);
        }
      }
      return acc;
    },
    { oxygenRating: data, co2Rating: data }
  );

  result.partTwo = partTwo.oxygenRating[0] * partTwo.co2Rating[0];

  return result;
}

function dayFour() {
  var result = {};
  // read input from fs
  input = fs
    .readFileSync("./data/day_four_input.txt", { encoding: "utf8" })
    .split(os.EOL);

  moves = input[0].split(",").map((o) => parseInt(o));
  boardData = input.slice(1, input.length - 1);

  class Board {
    constructor(board) {
      this.board = board;
    }

    score() {
      let count = 0;
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          if (!this.board[i][j].set) {
            count += this.board[i][j].val;
          }
        }
      }
      return count;
    }

    mark(val) {
      for (let i = 0; i < this.board.length; i++) {
        for (let j = 0; j < this.board[i].length; j++) {
          if (this.board[i][j].val == val) {
            this.board[i][j].set = true;
            // check if row is complete
            let count = 0;
            for (let k = 0; k < 5; k++) {
              if (this.board[i][k].set) {
                count++;
              }
            }
            if (count == 5) {
              return true;
            }
            count = 0;
            for (let k = 0; k < 5; k++) {
              if (this.board[k][j].set) {
                count++;
              }
            }
            if (count == 5) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }

  const getBoards = (boardData) =>
    boardData.reduce((acc, _, index) => {
      if (index % 6 != 0) {
        return acc;
      }
      b = [];
      for (let i = 1; i < 6; i++) {
        b.push(
          boardData[index + i]
            .split(" ")
            .map((o) => {
              return { val: parseInt(o), set: false };
            })
            .filter((o) => !isNaN(o.val))
        );
      }
      acc.push(new Board(b));
      return acc;
    }, []);

  runPartOne = (moves, boards) => {
    for (const m of moves) {
      for (const b of boards) {
        complete = b.mark(m);
        if (complete) {
          return { move: m, board: b };
        }
      }
    }
    return { move: null, board: null };
  };

  partOne = runPartOne(moves, getBoards(boardData));
  result.partOne = partOne.board.score() * partOne.move;

  runPartTwo = (moves, boards) => {
    let completeBoards = boards.map(() => {
      return { completed: false };
    });
    return moves.reduce((acc, o) => {
      for (let j = 0; j < boards.length; j++) {
        complete = boards[j].mark(o);
        if (complete && !completeBoards[j].completed) {
          completeBoards[j].completed = true;
          let score = boards[j].score(o);
          acc.push({
            score: score,
            move: o,
          });
        }
      }
      return acc;
    }, []);
  };

  let partTwoResults = runPartTwo(moves, getBoards(boardData)).pop();

  result.partTwo = partTwoResults.score * partTwoResults.move;

  return result;
}

function dayFive() {
  var result = {};
  // read input from fs
  input = fs.readFileSync("./data/day_five_input.txt", { encoding: "utf8" });

  let data = input
    .split(os.EOL)
    .map((o) =>
      o
        .split("->")
        .map((o) => o.split(",").map((o) => parseInt(o)))
        .map((o) => {
          return { x: o[0], y: o[1] };
        })
    )
    .map((o) => {
      return { start: o[0], end: o[1] };
    })
    .filter((o) => !isNaN(o.start.x));

  let partOneBoard = Array(1000)
    .fill(0)
    .map(() => Array(1000).fill(0));

  // for part one we should only consider horizontal or vertical lines
  // e.g. x1 = x2 or y1 = 2
  partOneData = data.filter(
    (o) => o.start.x == o.end.x || o.start.y == o.end.y
  );

  partOneVents = partOneData.reduce((acc, o) => {
    if (o.start.x == o.end.x) {
      // vertical line
      for (
        let i = Math.min(o.start.y, o.end.y);
        i <= Math.max(o.start.y, o.end.y);
        i++
      ) {
        acc[i][o.start.x]++;
      }
    } else {
      // horizontal line
      for (
        let i = Math.min(o.start.x, o.end.x);
        i <= Math.max(o.start.x, o.end.x);
        i++
      ) {
        acc[o.start.y][i]++;
      }
    }
    return acc;
  }, partOneBoard);

  partOne = partOneVents.reduce((acc, o) => {
    return o.reduce((acc, o) => {
      if (o >= 2) {
        acc++;
      }
      return acc;
    }, acc);
  }, 0);

  result.partOne = partOne;

  let partTwoBoard = Array(1000)
    .fill(0)
    .map(() => Array(1000).fill(0));

  let partTwoData = data;

  partTwoVents = partTwoData.reduce((acc, o) => {
    if (o.start.x == o.end.x) {
      // vertical line
      for (
        let i = Math.min(o.start.y, o.end.y);
        i <= Math.max(o.start.y, o.end.y);
        i++
      ) {
        acc[i][o.start.x]++;
      }
    } else if (o.start.y == o.end.y) {
      // horizontal line
      for (
        let i = Math.min(o.start.x, o.end.x);
        i <= Math.max(o.start.x, o.end.x);
        i++
      ) {
        acc[o.start.y][i]++;
      }
    } else {
      // we need to consider which direction we are iterating towards
      let len = Math.abs(o.start.x - o.end.x);
      if (o.start.x < o.end.x && o.start.y < o.end.y) {
        for (let i = 0; i <= len; i++) {
          acc[o.start.y + i][o.start.x + i]++;
        }
      } else if (o.start.x < o.end.x && o.start.y > o.end.y) {
        for (let i = 0; i <= len; i++) {
          acc[o.start.y - i][o.start.x + i]++;
        }
      } else if (o.start.x > o.end.x && o.start.y < o.end.y) {
        for (let i = 0; i <= len; i++) {
          acc[o.start.y + i][o.start.x - i]++;
        }
      } else {
        for (let i = 0; i <= len; i++) {
          acc[o.start.y - i][o.start.x - i]++;
        }
      }
    }
    return acc;
  }, partTwoBoard);

  partTwo = partTwoVents.reduce((acc, o) => {
    return o.reduce((acc, o) => {
      if (o >= 2) {
        acc++;
      }
      return acc;
    }, acc);
  }, 0);

  result.partTwo = partTwo;

  return result;
}

function daySix() {
  var result = {};
  // read input from fs
  let input = fs.readFileSync("./data/day_six_input.txt", {
    encoding: "utf8",
  });

  let initialState = input
    .split(",")
    .map((o) => parseInt(o))
    .filter((o) => !isNaN(o));

  let partOneState = [...initialState];

  for (let i = 0; i < 80; i++) {
    partOneState = partOneState.reduce((acc, _, i) => {
      // if we find a zero value, reset to 6 and add 8 to end
      if (acc[i] == 0) {
        acc[i] = 6;
        acc.push(8);
      } else {
        acc[i]--;
      }
      return partOneState;
    }, partOneState);
  }

  result.partOne = partOneState.length;

  partTwoState = initialState.reduce((acc, o) => {
    acc[o] = acc[o] + 1n;
    return acc;
  }, Array(9).fill(BigInt(0)));

  // for part two, we need to create a more efficient accumulator
  for (let i = 0; i < 256; i++) {
    let newFish = partTwoState[0];
    [
      partTwoState[0],
      partTwoState[1],
      partTwoState[2],
      partTwoState[3],
      partTwoState[4],
      partTwoState[5],
      partTwoState[6],
      partTwoState[7],
    ] = [
      partTwoState[1],
      partTwoState[2],
      partTwoState[3],
      partTwoState[4],
      partTwoState[5],
      partTwoState[6],
      partTwoState[7],
      partTwoState[8],
    ];
    // all fish at zero are back to 6
    partTwoState[6] += newFish;
    // these fish also reproduced
    partTwoState[8] = newFish;
  }
  partTwoResult = partTwoState.reduce((acc, o) => {
    acc = acc + o;
    return acc;
  }, BigInt(0));
  result.partTwo = partTwoResult;
  return result;
}

function daySeven() {
  var result = {};
  // read input from fs
  let input = fs.readFileSync("./data/day_seven_input.txt", {
    encoding: "utf8",
  });

  let initialState = input
    .split(",")
    .map((o) => parseInt(o))
    .filter((o) => !isNaN(o));

  let minMax = initialState.reduce(
    (acc, o) => {
      if (o > acc.max) {
        acc.max = o;
      } else if (o < acc.min) {
        acc.min = o;
      }
      return acc;
    },
    {
      max: Number.MIN_SAFE_INTEGER,
      min: Number.MAX_SAFE_INTEGER,
    }
  );

  let partOneState = [];
  for (let i = minMax.min; i < minMax.max; i++) {
    partOneState.push(
      initialState.reduce((acc, o) => {
        acc += Math.abs(o - i);
        return acc;
      }, 0)
    );
  }
  result.partOne = Math.min(...partOneState);

  let partTwoState = [];
  for (let i = minMax.min; i < minMax.max; i++) {
    partTwoState.push(
      initialState.reduce((acc, o) => {
        // fuel cost is n(n+1)/2, aka sum of arithmetic series
        let n = Math.abs(o - i);
        acc += (n * (n + 1)) / 2;
        return acc;
      }, 0)
    );
  }
  result.partTwo = Math.min(...partTwoState);

  return result;
}

console.log(daySeven());
