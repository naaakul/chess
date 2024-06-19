// const express = require("express");
// const socket = require("socket.io");
// const http = require("http");
// const { Chess } = require("chess.js");
// const path = require("path");
// const { log } = require("console");

// const app = express();

// const server = http.createServer(app); //linking http server to express
// const io = socket(server); //and the server will run by socket

// const chess = new Chess();
// let players = {};
// let currentPlayer = "w";

// app.set("view engine", "ejs");
// app.use(express.static(path.join(__dirname, "public")));

// app.get("/", (req, res) => {
//   res.render("index", { title: "Chess Game" });
// });

// io.on("connection", function (UniqueSocket) {
//   //frontend se backend me recive karna
//   console.log("Connected");

//   if (!players.white) {
//     players.white = UniqueSocket.id;
//     UniqueSocket.emit("playerRole", "w");
//   } else if (!players.black) {
//     players.white = UniqueSocket.id;
//     UniqueSocket.emit("playerRole", "b");
//   } else {
//     UniqueSocket.emit("spectatorRole");
//   }

//   UniqueSocket.on("disconnect", function () {
//     if (UniqueSocket.id === players.white) {
//       delete players.white;
//     } else if (UniqueSocket.id === players.black) {
//       delete players.black;
//     }
//   });

//   UniqueSocket.on("move", function (move) {
//     try {
//       if (chess.turn() === "w" && UniqueSocket.id !== players.white) return;
//       if (chess.turn() === "b" && UniqueSocket.id !== players.black) return;

//       const result = chess.move(move);
//       if (result) {
//         currentPlayer = chess.turn();
//         io.emit("move", move);
//         io.emit("boardState", chess.fen());
//       } else {
//         console.log("Invalid move : ", move);
//         UniqueSocket.emit("invalidMove", move);
//       }
//     } catch (err) {
//       console.log(err);
//       UniqueSocket.emit("invalidMove", move);
//     }
//   });

//   // UniqueSocket.on("disconnect", function(){
//   //     console.log("Disconnected");
//   // })
// });

// server.listen(3000, function () {
//   console.log("listening on port 3000");
// });


const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();

const server = http.createServer(app); //linking http server to express
const io = socket(server); //and the server will run by socket

const chess = new Chess();
let players = {};
let currentPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", function (UniqueSocket) {
  //frontend se backend me recive karna
  console.log("Connected");

  if (!players.white) {
    players.white = UniqueSocket.id;
    UniqueSocket.emit("playerRole", "w");
  } else if (!players.black) {
    players.black = UniqueSocket.id;
    UniqueSocket.emit("playerRole", "b");
  } else {
    UniqueSocket.emit("spectatorRole");
  }

  UniqueSocket.on("disconnect", function () {
    if (UniqueSocket.id === players.white) {
      delete players.white;
    } else if (UniqueSocket.id === players.black) {
      delete players.black;
    }
  });

  UniqueSocket.on("move", function (move) {
    try {
      if (chess.turn() === "w" && UniqueSocket.id !== players.white) return;
      if (chess.turn() === "b" && UniqueSocket.id !== players.black) return;

      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move);
        io.emit("boardState", chess.fen());
      } else {
        console.log("Invalid move : ", move);
        UniqueSocket.emit("invalidMove", move);
      }
    } catch (err) {
      console.log(err);
      UniqueSocket.emit("invalidMove", move);
    }
  });
});

server.listen(3000, function () {
  console.log("listening on port 3000");
});
