import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tetris from 'react-tetris';
import * as rrweb from 'rrweb';
import { eventWithTime } from '@rrweb/types';
import { io, Socket } from 'socket.io-client';

const SEND_DOM_EVENT = 'send_dom';
const API_URL = 'http://localhost:3000';

function App() {
  const [socket, setSocket] = useState<Socket>();
  const [sessionId] = useState(uuidv4());
  let events: eventWithTime[] = [];

  useEffect(() => {
    setSocket(() =>
      io(API_URL, {
        extraHeaders: {
          sessionId,
        },
        closeOnBeforeunload: true,
        reconnection: true,
      })
    );
  }, []);

  useEffect(() => {
    const stopFn = rrweb.record({
      emit(event: eventWithTime) {
        events.push(event);
      },
    });

    const save = () => {
      if (socket) {
        socket.emit(SEND_DOM_EVENT, { sessionId, events });
      }
    };
    const interval = setInterval(save, 1000);

    return () => {
      if (stopFn) {
        stopFn();
      }
      if (socket) {
        socket.off(SEND_DOM_EVENT);
      }
      clearInterval(interval);
    };
  }, [socket]);

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
        {({ Gameboard, points, linesCleared, state, controller }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <div>
              <p>Points: {points}</p>
              <p>Lines Cleared: {linesCleared}</p>
            </div>
            <Gameboard />
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
