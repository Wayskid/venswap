import { Server } from "socket.io";

const socketConnect = (server, options) => {
  //Socket
  const io = new Server(server, {
    cors: options,
  });

  io.on("connect", (socket) => {
    socket.on("new_business", (newBusiness) => {
      socket.broadcast.emit("update_businesses", newBusiness);
    });
    socket.on("edit_business", (updatedBusiness) => {
      socket.broadcast.emit("update_business", updatedBusiness);
    });
    socket.on("new_message", (newMessage) => {
      socket.broadcast.emit("update_messages", newMessage);
    });
    socket.on("edit_message", (updatedMessage) => {
      socket.broadcast.emit("update_message", updatedMessage);
    });
  });
};

export default socketConnect;
