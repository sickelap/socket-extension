import React, { useContext, useState } from 'react';
import { CommContext } from '../socket-context';
import './Receiver.scss';

export function Receiver() {
  const [counter, setCounter] = useState(0);
  const comm = useContext(CommContext);

  comm.on('counter', setCounter);

  return <div id="receiver-container">Counter: {counter}</div>;
}
