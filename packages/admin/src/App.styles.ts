import { styled as MUIstyled } from '@mui/material/styles';
import styled from '@emotion/styled';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export const Item = MUIstyled(Paper)<{
  sessionId: string;
  selectedSessionId?: string;
}>(({ theme, sessionId, selectedSessionId }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  height: 60,
  lineHeight: '60px',
  backgroundColor:
    selectedSessionId === sessionId
      ? theme.palette.action.selected
      : theme.palette.background.default,
}));

export const SessionContainer = styled.div(() => ({
  height: '50vh',
  overflow: 'scroll',
}));

export const RowContainer = styled.div(() => ({
  display: 'flex',
}));

export const SessionsClassifyingListsContainer = styled.div(() => ({
  flexDirection: 'column',
  height: '100vh',
  width: '50vw',
}));

export const SelectedSessionTitle = MUIstyled(Typography)(({ theme }) => ({
  ...theme.typography.h5,
  display: 'flex',
  justifyContent: 'center',
  width: '50vw',
  height: '3rem',
  backgroundColor: theme.palette.background.default,
}));

export const SessionTitle = MUIstyled(SelectedSessionTitle)(() => ({
  position: 'fixed',
}));

export const ItemsBox = MUIstyled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'grid',
  gap: 1,
  margin: theme.spacing(2),
  marginTop: '3.1rem',
}));

export const VideoSpotContainer = styled.div(() => ({
  display: 'flex',
  justifyContent: 'center',
}));

export const RefreshButton = MUIstyled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: 20,
  left: 20,
  border: `1px solid ${theme.palette.info.dark}`,
  color: theme.palette.info.dark,
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
}));
