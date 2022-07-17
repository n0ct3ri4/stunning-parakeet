const http = require("node:http");
const fs = require("node:fs");

const { Server } = require("ws");
const wss = new Server({ port: 3001 });

function run() {
  http
    .createServer((req, res) => {
      if (req.url == "/") {
        serve("/index.html");
      } else {
        serve(req.url);
      }

      function serve(url = "/index.html") {
        console.log(url);
        fs.readFile(__dirname + "/public" + url, "utf-8", (err, data) => {
          if (err) {
            return res
              .writeHead(404, { "Content-Type": "text/html" })
              .end(`Cannot reach <i>${req.url}</i>`);
          }

          return res.end(
            data +
              `<script>\n${fs.readFileSync(
                `${__dirname}/reloader.js`,
                "utf-8"
              )}</script>`
          );
        });
      }
    })
    .listen(3000);

  wss
    .on("connection", (ws) => {
      globalThis.watcher = fs.watch("./public").on("change", () => {
        ws.send("changes");
      });
    })
    .on("close", () => {
      globalThis.watcher.close();
    });
}

module.exports = {
  run,
};
