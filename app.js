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

console.log(day_two());
