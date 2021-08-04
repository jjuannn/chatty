const express = require("express");
const app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "client")));

const PORT = 8080;
const server = app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const Message = require("./utils/messages/entity");
const moment = require("moment");

const socketIO = require("socket.io");
const io = socketIO(server);

// listening connection
io.on("connection", (socket) => {
  // socket = the current connection (the "client / user that")
  // is using our application
  console.log(socket.id);

  // listening for "new_message"
  socket.on("new_message", ({ username, message }) => {
    const messageToEmit = new Message({ username, message }, moment);
    // emits "new_message" for everyone
    // io.sockets => all the sockets connected
    io.sockets.emit("new_message", messageToEmit);
  });

  socket.on("user_typing", (data) => {
    // socket.broadcast = emits something for everyone
    // excepts for the socket that did the action
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("stop_typing", () => {
    socket.broadcast.emit("stop_typing");
  });
});
