import { useEffect, useState } from 'react';
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

  const theme = useTheme();

  useEffect(() => {
    fetch(`${API_URL}/sessions`)
      .then((response) => response.json())
      .then((response) => {
        setSessions(response.sessions);
        setActiveSessions(Object.keys(response.activeSessionIds));
      })
      .catch(() => console.error('Error on getting sessions.'));
  }, []);

  const handleSelectItem = (sessionId: string) => () => {
    const sessionEvents = sessions[sessionId];
    if (sessionEvents) {
      const videoSpot = document.getElementById(VIDEO_SPOT_ID);
      if (!videoSpot) {
        return;
      }

      try {
        new rrwebPlayer({
          target: videoSpot,
          props: {
            events: sessionEvents,
            autoPlay: false,
            width: 400,
            height: 650,
          },
        });
      } catch (error) {
        console.log('ERROR: ', error);
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
      return sessionsToBeRendered.map((sessionId, index) => (
        <Item
          key={sessionId}
          elevation={index + 1}
          onClick={handleSelectItem(sessionId)}
        >
          {sessionId}
        </Item>
      ));
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
        style={{ zIndex: 10, height: '100vh', width: '50vw' }}
        id={VIDEO_SPOT_ID}
      />
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
    </div>
  );
}

export default App;
