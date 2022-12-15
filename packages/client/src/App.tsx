import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tetris from 'react-tetris';
import * as rrweb from 'rrweb';
import { eventWithTime } from '@rrweb/types';
import { io } from 'socket.io-client';

import StreamDOM from './streamDOM';

// randomly generate a user ID every time you join the room
const SESSION_ID = uuidv4();

function App() {
  let events: eventWithTime[] = [];

  // initializes streamDOM on component load
  useEffect(() => {
    const stopFn = rrweb.record({
      emit(event: eventWithTime) {
        events.push(event);
      },
    });

    const socket = io('http://localhost:3000');
    socket.on('connect', () => {
      console.log('Connected');
    });
    socket.on('send_dom', (data) => {
      console.log('send_dom', data);
    });
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });
    StreamDOM.init({ sessionId: SESSION_ID });

    const save = () => {
      socket.emit('send_dom', events);
    };

    const interval = setInterval(save, 1000);

    return () => {
      if (stopFn) {
        stopFn();
      }
      socket.emit('disconnect');
      socket.off('connect');
      socket.off('send_dom');
      socket.off('disconnect');
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="main-app">
      <Tetris
        keyboardControls={{
          // Default values shown here. These will be used if no
          // `keyboardControls` prop is provided.
          down: 'MOVE_DOWN',
          left: 'MOVE_LEFT',
          right: 'MOVE_RIGHT',
          space: 'HARD_DROP',
          z: 'FLIP_COUNTERCLOCKWISE',
          x: 'FLIP_CLOCKWISE',
          up: 'FLIP_CLOCKWISE',
          p: 'TOGGLE_PAUSE',
          c: 'HOLD',
          shift: 'HOLD',
        }}
      >
        {({
          HeldPiece,
          Gameboard,
          PieceQueue,
          points,
          linesCleared,
          state,
          controller,
        }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <HeldPiece />
            <div>
              <p>Points: {points}</p>
              <p>Lines Cleared: {linesCleared}</p>
            </div>
            <Gameboard />
            <PieceQueue />
            {state === 'LOST' && (
              <div>
                <h2>Game Over</h2>
                <button onClick={controller.restart}>New game</button>
              </div>
            )}
          </div>
        )}
      </Tetris>
    </div>
  );
}

export default App;
