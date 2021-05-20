import { Server, Socket } from 'socket.io';

const state = {
  counter: 0,
};

export const setCounter = (value: number) => (state.counter = value < 0 ? 0 : value);

export const getCounter = () => state.counter;

export const onConnection = (io: Server, socket: Socket) => {
  socket.on('increment', (cb) => {
    setCounter(getCounter() + 1);
    io.emit('counter', getCounter());
    if (cb) {
      cb(getCounter());
    }
  });

  socket.on('decrement', (cb) => {
    setCounter(getCounter() - 1);
    io.emit('counter', getCounter());
    if (cb) {
      cb(getCounter());
    }
  });

  socket.on('get-counter', (cb) => {
    socket.emit('counter', getCounter());
    if (cb) {
      cb(getCounter());
    }
  });
};
