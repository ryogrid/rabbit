import { createSignal, createEffect, onMount, onCleanup, on } from 'solid-js';

import uniqBy from 'lodash/uniqBy';
import { type Filter } from 'nostr-tools/filter';
import { type SubscribeManyParams } from 'nostr-tools/pool';
import { type Event as NostrEvent } from 'nostr-tools/pure';
import { insertEventIntoDescendingList } from 'nostr-tools/utils';

import useConfig from '@/core/useConfig';
import { sortEvents } from '@/nostr/event/comparator';
import usePool from '@/nostr/usePool';
import useStats from '@/nostr/useStats';
import epoch from '@/utils/epoch';

export type UseSubscriptionProps = {
  relayUrls: string[];
  filters: Filter[];
  options?: SubscribeManyParams;
  /**
   * subscribe not only stored events but also new events published after the subscription
   * default is true
   */
  continuous?: boolean;
  /**
   * limit the number of events
   */
  limit?: number;
  clientEventFilter?: (event: NostrEvent) => boolean;
  onEvent?: (event: NostrEvent & { id: string }) => void;
  onEOSE?: () => void;
  signal?: AbortSignal;
  debugId?: string;
};

let count = 0;

const { setActiveSubscriptions } = useStats();
setInterval(() => {
  setActiveSubscriptions(count);
}, 1000);

const useSubscription = (propsProvider: () => UseSubscriptionProps | null) => {
  const { config, shouldMuteEvent } = useConfig();
  const pool = usePool();
  const [events, setEvents] = createSignal<NostrEvent[]>([]);

  createEffect(
    on(
      () => [config().mutedPubkeys, config().mutedKeywords],
      () => {
        setEvents((currentEvents) => currentEvents.filter((event) => !shouldMuteEvent(event)));
      },
      { defer: true },
    ),
  );

  onMount(() => {
    console.debug('subscription mounted', propsProvider()?.debugId, propsProvider());
    onCleanup(() => {
      console.debug('subscription unmount', propsProvider()?.debugId, propsProvider());
    });
  });

  const addEvent = (event: NostrEvent) => {
    const SecondsToIgnore = 300; // 5 min
    const limit = propsProvider()?.limit ?? 500; //50;


    const diffSec = event.created_at - epoch();
    if (diffSec > SecondsToIgnore) return;
    if (diffSec > 0) {
      setTimeout(() => addEvent(event), diffSec * 1000);
      return;
    }

    setEvents((current) => {
      const sorted = insertEventIntoDescendingList(current, event).slice(0, limit);
      // FIXME なぜか重複して取得される問題があるが一旦uniqByで対処
      // https://github.com/syusui-s/rabbit/issues/5
      const deduped = uniqBy(sorted, (e) => e.id);
      if (deduped.length !== sorted.length) {
        console.warn('duplicated event', event);
      }
      return deduped;
    });
  };

  const startSubscription = () => {
    console.debug('startSubscription: start');

    const props = propsProvider();
    if (props == null) return;
    const { relayUrls, filters, options, onEvent, onEOSE, continuous = true } = props;
    let subscribing = true;
    count += 1;

    let pushed = false;
    let eose = false;
    const storedEvents: NostrEvent[] = [];

    const sub = pool().subscribeMany(
      relayUrls,
      filters,
      options ?? {
        eoseTimeout: 12000,
        maxWait: 6000,
        onevent: (event: NostrEvent) => {
          if (onEvent != null) {
            onEvent(event as NostrEvent & { id: string });
          }
          if (props.clientEventFilter != null && !props.clientEventFilter(event)) {
            return;
          }

          if (!eose) {
            pushed = true;
            storedEvents.push(event);
          } else {
            addEvent(event);
          }
        },
        oneose: () => {
          if (onEOSE != null) {
            onEOSE();
          }

          eose = true;
          setEvents(sortEvents(storedEvents));

          if (!continuous) {
            sub.close();
            if (subscribing) {
              subscribing = false;
              count -= 1;
            }
          }
        },
      },
    );

    // avoid updating an array too rapidly while this is fetching stored events
    let updating = false;
    const intervalId = setInterval(() => {
      if (updating) return;
      updating = true;
      if (eose) {
        clearInterval(intervalId);
        updating = false;
        return;
      }
      if (pushed) {
        pushed = false;
        setEvents(sortEvents(storedEvents));
      }
      updating = false;
    }, 100);

    onCleanup(() => {
      console.debug('startSubscription: end');
      sub.close();
      if (subscribing) {
        subscribing = false;
        count -= 1;
      }
      clearInterval(intervalId);
    });
  };

  createEffect(() => {
    startSubscription();
  });

  return { events };
};

export default useSubscription;
