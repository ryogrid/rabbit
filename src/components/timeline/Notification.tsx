import { For, Switch, Match, type Component } from 'solid-js';

import { Kind, type Event as NostrEvent } from 'nostr-tools';

import ColumnItem from '@/components/ColumnItem';
import Reaction from '@/components/event/Reaction';
import Repost from '@/components/event/Repost';
import TextNote from '@/components/event/TextNote';

export type NotificationProps = {
  events: NostrEvent[];
};

const Notification: Component<NotificationProps> = (props) => {
  return (
    <For each={props.events}>
      {(event) => (
        <Switch fallback={<div>unknown event</div>}>
          <Match when={event.kind === Kind.Text}>
            <ColumnItem>
              <TextNote event={event} />
            </ColumnItem>
          </Match>
          <Match when={event.kind === Kind.Reaction}>
            <ColumnItem>
              <Reaction event={event} />
            </ColumnItem>
          </Match>
          {/* TODO ちゃんとnotification用のコンポーネント使う */}
          <Match when={(event.kind as number) === 6}>
            <ColumnItem>
              <Repost event={event} />
            </ColumnItem>
          </Match>
        </Switch>
      )}
    </For>
  );
};

export default Notification;
