import React, { useContext, useState } from 'react';
import { CommContext } from '../socket-context';
import './Sender.scss';

export function Sender() {
  const [counter, setCounter] = useState(0);
  const comm = useContext(CommContext);
  const onClick = (event) => comm.emit(event);

  comm.on('counter', setCounter);
  comm.emit('get-counter');

  return (
    <div id="sender-container">
      <button onClick={() => onClick('decrement')}>-</button>
      Counter: {counter}
      <button onClick={() => onClick('increment')}>+</button>
    </div>
  );
}
