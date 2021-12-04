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

function day_three() {
  var result = {};
  // read input from fs
  input = fs.readFileSync("./data/day_three_input.txt", { encoding: "utf8" });

  data = input
    .split(os.EOL)
    .map((o) => {
      return parseInt(o, 2);
    })
    .filter((o) => !isNaN(o));

  bit_counts = data.reduce(
    (acc, o) => {
      num = o;
      // bitmask LSB and add to end of array
      for (i = 11; i >= 0; i--) {
        num & 1 ? acc[i].one_count++ : acc[i].zero_count++;
        num = num >> 1;
      }
      return acc;
    },
    Array(12)
      .fill()
      .map(() => {
        return { one_count: 0, zero_count: 0 };
      })
  );

  part_one = bit_counts.reduce(
    (acc, count) => {
      if (count.one_count > count.zero_count) {
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
  result.part_one = part_one.epsilon * part_one.gamma;

  bits = Array(12)
    .fill()
    .map((_, i) => {
      return 11 - i;
    });

  const num_bits = (arr, i) => {
    return arr.reduce(
      (acc, o) => {
        (o >> i) & 1 ? acc.one_count++ : acc.zero_count++;
        return acc;
      },
      { zero_count: 0, one_count: 0 }
    );
  };

  const bit_filter = (arr, i, keep) => {
    return arr.filter((o) => ((o >> i) & 1) == keep);
  };

  part_two = bits.reduce(
    (acc, b) => {
      if (
        acc.oxygen_generator_rating.length == 1 &&
        acc.co2_scrubber_rating.length == 1
      ) {
        return acc;
      }
      oxygen_msb = num_bits(acc.oxygen_generator_rating, b);
      co2_msb = num_bits(acc.co2_scrubber_rating, b);

      if (acc.oxygen_generator_rating != 1) {
        if (oxygen_msb.one_count >= oxygen_msb.zero_count) {
          acc.oxygen_generator_rating = bit_filter(
            acc.oxygen_generator_rating,
            b,
            1
          );
        } else {
          acc.oxygen_generator_rating = bit_filter(
            acc.oxygen_generator_rating,
            b,
            0
          );
        }
      }
      if (acc.co2_scrubber_rating.length != 1) {
        if (co2_msb.zero_count <= co2_msb.one_count) {
          acc.co2_scrubber_rating = bit_filter(acc.co2_scrubber_rating, b, 0);
        } else {
          acc.co2_scrubber_rating = bit_filter(acc.co2_scrubber_rating, b, 1);
        }
      }
      return acc;
    },
    { oxygen_generator_rating: data, co2_scrubber_rating: data }
  );

  result.part_two =
    part_two.oxygen_generator_rating[0] * part_two.co2_scrubber_rating[0];

  return result;
}

console.log(day_three());
