import { createContext, useContext } from 'solid-js';

import { type Event as NostrEvent } from 'nostr-tools/pure';
import { createStore } from 'solid-js/store';

export type TimelineContent = {
  type: 'Replies';
  event: NostrEvent;
};

export type TimelineState = {
  content?: TimelineContent;
};

export type UseTimelineState = {
  timelineState: TimelineState;
  setTimeline: (content: TimelineContent) => void;
  clearTimeline: () => void;
};

export const TimelineContext = createContext<UseTimelineState>();

export const useTimelineContext = () => useContext(TimelineContext);

export const useTimelineState = (): UseTimelineState => {
  const [timelineState, setTimelineState] = createStore<TimelineState>({});

  return {
    timelineState,
    setTimeline: (content: TimelineContent) => setTimelineState('content', content),
    clearTimeline: () => setTimelineState('content', undefined),
  };
};
