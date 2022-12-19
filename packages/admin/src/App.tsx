import { useCallback, useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import rrwebPlayer from 'rrweb-player';
import { eventWithTime } from '@rrweb/types';
import {
  Item,
  ItemsBox,
  RowContainer,
  SelectedSessionTitle,
  SessionContainer,
  SessionsClassifyingListsContainer,
  SessionTitle,
  VideoSpotContainer,
} from './App.styles';

import 'rrweb-player/dist/style.css';

type Sessions = Record<string, eventWithTime[]>;

const API_URL = 'http://localhost:3000';
const VIDEO_SPOT_ID = 'video-spot';

function App() {
  const [activeSessions, setActiveSessions] = useState<string[]>([]);
  const [sessions, setSessions] = useState<Sessions>({});
  const [selectedSessionId, setSelectedSessionId] = useState<string>();
  const [player, setPlayer] = useState<rrwebPlayer>();

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
  }, [selectedSessionId, getNewEventsFromSelectedActiveSession]);

  const handleSelectItem = (sessionId: string) => () => {
    const sessionEvents = sessions[sessionId];
    if (!sessionEvents) {
      return;
    }
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
  };

  const renderItems = (sessionsToBeRendered: string[] = [], title: string) => {
    if (sessionsToBeRendered.length === 0) {
      return (
        <Typography>There are no {title.toLowerCase()} to be shown.</Typography>
      );
    }

    return sessionsToBeRendered.map((sessionId, index) => (
      <Item
        key={sessionId}
        elevation={index + 1}
        sessionId={sessionId}
        selectedSessionId={selectedSessionId}
        onClick={handleSelectItem(sessionId)}
      >
        {sessionId}
      </Item>
    ));
  };

  const renderSessions = (
    sessionsToBeRendered: string[] = [],
    title: string
  ) => {
    return (
      <SessionContainer>
        <SessionTitle>{title}</SessionTitle>
        <ItemsBox>{renderItems(sessionsToBeRendered, title)}</ItemsBox>
      </SessionContainer>
    );
  };

  const oldSessions = Object.keys(sessions || {}).filter(
    (item) => !activeSessions.includes(item)
  );

  return (
    <RowContainer>
      <SessionsClassifyingListsContainer>
        {renderSessions(activeSessions, 'Active Sessions')}
        {renderSessions(oldSessions, 'Old Sessions')}
      </SessionsClassifyingListsContainer>
      <div>
        <SelectedSessionTitle>{selectedSessionId}</SelectedSessionTitle>
        <VideoSpotContainer id={VIDEO_SPOT_ID} />
      </div>
    </RowContainer>
  );
}

export default App;
