const fs = require("node:fs");
const { exitCode } = require("node:process");

class Col {
  raw = {};

  /**
   * @param {string} key
   */
  get(key) {
    return this.raw[key];
  }

  set(key, value) {
    this.raw[key] = value;
    return this;
  }
}

class Renderer {
  /**
   * @param {Col} dataSet
   * @param {string} input
   * @param {fs.PathLike} output
   */
  compile(dataSet, input, output = "output.html") {
    return new Promise((res, rej) => {
      var final = fs.readFileSync(input, "utf-8");
      Object.keys(dataSet.raw).forEach((key, i) => {
        try {
          final = final.replaceAll(`((${key}))`, dataSet.raw[key]);
          // fs.writeFileSync(`test${i}`, final);
        } catch (err) {
          return (exitCode = 1);
        }

        if (i == Object.keys(dataSet.raw).length - 1) {
          fs.writeFile(output, final, { encoding: "utf-8" }, (_err) => {
            if (_err) return (exitCode = 1);

            // console.log("Success.");
          });
        }
      });
    });
  }
}

var myset = {
  TEST: "foobar",
};

var col = new Col();

Object.keys(myset).every((key) => col.set(key, myset[key]));

// console.log(myset);

Renderer.prototype.compile(col, "./input/index.parakeet", "public/index.html");

fs.watch("./input/index.parakeet").on("change", () => {
  Renderer.prototype.compile(col, "./input.gli", "public/index.html");
});

require("./serve").run();
