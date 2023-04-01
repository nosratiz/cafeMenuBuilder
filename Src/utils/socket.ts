import * as http from 'http';

let io: http.Server;

export = {
  init: (httpServer: http.Server): http.Server => {
    io = require('socket.io')(httpServer, {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      });
    return io;
  },
  getIO: (): http.Server => {
    if (!io) {
      throw new Error('Socket.io not initialized!');
    }
    return io;
  }
};