import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tetris from 'react-tetris';
import * as rrweb from 'rrweb';
import StreamDOM from './streamDOM';
import { eventWithTime } from '@rrweb/types';

// randomly generate a user ID every time you join the room
const SESSION_ID = uuidv4();

function App() {
  let events: eventWithTime[] = [];

  const stopFn = rrweb.record({
    emit(event: eventWithTime) {
      events.push(event);
      console.log(event);
      if (events.length > 100) {
        // stop after 100 events
        if (stopFn) {
          stopFn();
        }
      }
    },
  });

  function save() {
    const body = JSON.stringify({ events });
    events = [];
    fetch('http://YOUR_BACKEND_API', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });
  }

  // initializes streamDOM on component load
  useEffect(() => {
    StreamDOM.init({ sessionId: SESSION_ID });

    const interval = setInterval(save, 10 * 1000);

    return () => clearInterval(interval);
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
