import { eventWithTime } from '@rrweb/types';

export interface DataMessageBody {
  sessionId: string;
  events: Object[];
}

export interface SessionsCache {
  activeSessionIds: Record<string, boolean>;
  sessions: Record<string, eventWithTime[]>;
}
