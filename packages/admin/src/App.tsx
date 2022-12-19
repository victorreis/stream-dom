import { useCallback, useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import rrwebPlayer from 'rrweb-player';
import { eventWithTime } from '@rrweb/types';

import 'rrweb-player/dist/style.css';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
}));

type Sessions = Record<string, eventWithTime[]>;

const API_URL = 'http://localhost:3000';
const VIDEO_SPOT_ID = 'video-spot';

function App() {
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Sessions>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [player, setPlayer] = useState<rrwebPlayer>();

  const theme = useTheme();

  const isActiveSession =
    selectedSessionId && activeSessions.includes(selectedSessionId);

  useEffect(() => {
    fetch(`${API_URL}/sessions`)
      .then((response) => response.json())
      .then((response) => {
        setSessions(response.sessions);
        setActiveSessions(Object.keys(response.activeSessionIds));
      })
      .catch(() => console.error('Error on getting sessions.'));
  }, []);

  const getNewEventsFromSelectedActiveSession = useCallback(() => {
    fetch(`${API_URL}/sessions/${selectedSessionId}/${player}`)
      .then((response) => response.json())
      .then((response) => {
        (response as eventWithTime[]).forEach((event) =>
          player?.addEvent(event)
        );
        return response;
      })
      .catch(() =>
        console.error('Error on getting the new events from the active .')
      );
  }, [selectedSessionId, player]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isActiveSession) {
      intervalId = setInterval(getNewEventsFromSelectedActiveSession, 2000);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [selectedSessionId]);

  const handleSelectItem = (sessionId: string) => () => {
    const sessionEvents = sessions[sessionId];
    if (sessionEvents) {
      const videoSpot = document.getElementById(VIDEO_SPOT_ID);
      if (!videoSpot) {
        return;
      }
      videoSpot.innerHTML = '';

      setSelectedSessionId(sessionId);

      try {
        const createdPlayer = new rrwebPlayer({
          target: videoSpot,
          props: {
            events: sessionEvents,
            width: 400,
            height: 600,
          },
        });
        setPlayer(createdPlayer);
      } catch (error) {
        console.error('ERROR: ', error);
      }
    }
  };

  const renderSessions = (
    sessionsToBeRendered: string[] = [],
    title: string
  ) => {
    const renderItems = () => {
      if (sessionsToBeRendered.length === 0) {
        return (
          <Typography>
            There are no {title.toLowerCase()} to be shown.
          </Typography>
        );
      }

      return sessionsToBeRendered.map((sessionId, index) => {
        const backgroundColor =
          selectedSessionId === sessionId
            ? theme.palette.action.selected
            : theme.palette.background.default;

        return (
          <Item
            key={sessionId}
            elevation={index + 1}
            style={{ backgroundColor }}
            onClick={handleSelectItem(sessionId)}
          >
            {sessionId}
          </Item>
        );
      });
    };

    return (
      <div style={{ height: '50vh', overflow: 'scroll' }}>
        <Typography
          variant="h5"
          align="center"
          style={{
            position: 'fixed',
            width: '50vw',
            height: '3rem',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {title}
        </Typography>
        <div style={{ marginTop: '3rem' }}>
          <Box
            margin={2}
            sx={{
              bgcolor: 'background.default',
              display: 'grid',
              gap: 1,
            }}
          >
            {renderItems()}
          </Box>
        </div>
      </div>
    );
  };

  const oldSessions = Object.keys(sessions || {}).filter(
    (item) => !activeSessions.includes(item)
  );

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          flexDirection: 'column',
          height: '100vh',
          width: '50vw',
        }}
      >
        {renderSessions(activeSessions, 'Active Sessions')}
        {renderSessions(oldSessions, 'Old Sessions')}
      </div>
      <div>
        <Typography
          variant="h5"
          align="center"
          style={{
            width: '50vw',
            height: '3rem',
            backgroundColor: theme.palette.background.default,
          }}
        >
          {selectedSessionId}
        </Typography>
        <div
          style={{
            zIndex: 10,
            display: 'flex',
            justifyContent: 'center',
            height: '100vh',
            width: '50vw',
          }}
          id={VIDEO_SPOT_ID}
        />
      </div>
    </div>
  );
}

export default App;
