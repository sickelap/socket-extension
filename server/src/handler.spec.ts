import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { io, Socket as ClientSocket } from 'socket.io-client';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import { getCounter, onConnection, setCounter } from './handler';

describe('connection handler', () => {
  let client1: ClientSocket;
  let client2: ClientSocket;
  let server: Server;

  beforeEach((done: any) => {
    const httpServer = createServer();
    server = new Server(httpServer);
    httpServer.listen(() => {
      const httpServerAddress = httpServer.address() as AddressInfo;
      client1 = io(`http://localhost:${httpServerAddress.port}`);
      client2 = io(`http://localhost:${httpServerAddress.port}`);
      server.on('connection', (socket: Socket) => onConnection(server, socket));
      Promise.all([
        new Promise((ok: any) => client1.on('connect', ok)),
        new Promise((ok: any) => client2.on('connect', ok)),
      ]).then(() => done());
    });
  });

  afterEach(() => {
    server.close();
    client1.close();
    client2.close();
  });

  test('should get/set counter', () => {
    setCounter(0);
    expect(getCounter()).toBe(0);

    setCounter(1337);
    expect(getCounter()).toBe(1337);

    setCounter(-99);
    expect(getCounter()).toBe(0);
  });

  test('user should receive current counter value via callback', (done: any) => {
    setCounter(3);
    client1.emit('get-counter', (counter: number) => {
      expect(counter).toBe(3);
      done();
    });
  });

  test('joining user should receive current counter value via event', (done: any) => {
    setCounter(2);
    client1.on('counter', (counter: number) => {
      expect(counter).toBe(2);
      done();
    });
    client1.emit('get-counter');
  });

  test('after counter increment author should receive updated value via callback', (done: any) => {
    setCounter(99);
    client1.emit('increment', (counter: number) => {
      expect(counter).toBe(100);
      done();
    });
  });

  test('after counter increment it should broadcast to all users', (done: any) => {
    setCounter(49);

    Promise.all([
      new Promise((ok) => {
        client1.on('counter', (counter: number) => {
          expect(counter).toBe(50);
          ok(true);
        });
      }),
      new Promise((ok) => {
        client2.on('counter', (counter: number) => {
          expect(counter).toBe(50);
          ok(true);
        });
      }),
    ])
      .then(() => done())
      .catch(console.error);

    client1.emit('increment');
  });

  test('after counter decrement author should receive updated value via callback', (done: any) => {
    setCounter(88);
    client1.emit('decrement', (counter: number) => {
      expect(counter).toBe(87);
      done();
    });
  });

  test('after counter decrement it should broadcast to all users', (done: any) => {
    setCounter(70);

    Promise.all([
      new Promise((ok) => {
        client1.on('counter', (counter: number) => {
          expect(counter).toBe(69);
          ok(true);
        });
      }),
      new Promise((ok) => {
        client2.on('counter', (counter: number) => {
          expect(counter).toBe(69);
          ok(true);
        });
      }),
    ])
      .then(() => done())
      .catch(console.error);

    client1.emit('decrement');
  });
});
