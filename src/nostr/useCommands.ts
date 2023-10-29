import { getEventHash, Kind, type UnsignedEvent } from 'nostr-tools';

// import '@/types/nostr.d';
import { ProfileWithOtherProperties, Profile } from '@/nostr/event/Profile';
import { ReactionTypes } from '@/nostr/event/Reaction';
import usePool from '@/nostr/usePool';
import epoch from '@/utils/epoch';

export type TagParams = {
  tags?: string[][];
  notifyPubkeys?: string[];
  rootEventId?: string;
  mentionEventIds?: string[];
  replyEventId?: string;
  hashtags?: string[];
  urls?: string[];
  contentWarning?: string;
};

export type PublishTextNoteParams = {
  relayUrls: string[];
  pubkey: string;
  content: string;
} & TagParams;

export const buildTags = ({
  notifyPubkeys,
  rootEventId,
  mentionEventIds,
  replyEventId,
  contentWarning,
  hashtags,
  urls,
  tags,
}: TagParams): string[][] => {
  // NIP-10
  const eTags = [];
  const pTags = notifyPubkeys?.map((p) => ['p', p]) ?? [];
  const otherTags = [];

  // the order of e tags should be [rootId, ...mentionIds, replyIds] for old clients
  if (rootEventId != null) {
    eTags.push(['e', rootEventId, '', 'root']);
  }
  // For top level replies, only the "root" marker should be used.
  if (rootEventId == null && replyEventId != null) {
    eTags.push(['e', replyEventId, '', 'root']);
  }
  if (mentionEventIds != null) {
    mentionEventIds.forEach((id) => eTags.push(['e', id, '', 'mention']));
  }
  if (rootEventId != null && replyEventId != null && rootEventId !== replyEventId) {
    eTags.push(['e', replyEventId, '', 'reply']);
  }

  if (hashtags != null) {
    hashtags.forEach((tag) => otherTags.push(['t', tag]));
  }

  if (urls != null) {
    urls.forEach((url) => otherTags.push(['r', url]));
  }

  if (contentWarning != null) {
    otherTags.push(['content-warning', contentWarning]);
  }

  if (tags != null && tags.length > 0) {
    otherTags.push(...tags);
  }

  return [...eTags, ...pTags, ...otherTags];
};

const useCommands = () => {
  const pool = usePool();

  const publishEvent = async (
    relayUrls: string[],
    event: UnsignedEvent,
  ): Promise<Promise<void>[]> => {
    const preSignedEvent: UnsignedEvent & { id?: string } = { ...event };
    preSignedEvent.id = getEventHash(preSignedEvent);

    if (window.nostr == null) {
      throw new Error('NIP-07 implementation not found');
    }
    const signedEvent = await window.nostr.signEvent(preSignedEvent);

    return relayUrls.map(async (relayUrl) => {
      const relay = await pool().ensureRelay(relayUrl);
      try {
        await relay.publish(signedEvent);
        console.log(`${relayUrl} has accepted our event`);
      } catch (err) {
        const reason = err instanceof Error ? err.message : JSON.stringify(err);
        console.warn(`failed to publish to ${relayUrl}: ${reason}`);
      }
    });
  };

  // NIP-01
  const publishTextNote = async (params: PublishTextNoteParams): Promise<Promise<void>[]> => {
    const { relayUrls, pubkey, content } = params;
    const tags = buildTags(params);

    const preSignedEvent: UnsignedEvent = {
      kind: 1,
      pubkey,
      created_at: epoch(),
      tags,
      content,
    };
    return publishEvent(relayUrls, preSignedEvent);
  };

  // NIP-25
  const publishReaction = async ({
    relayUrls,
    pubkey,
    eventId,
    reactionTypes,
    notifyPubkey,
  }: {
    relayUrls: string[];
    pubkey: string;
    eventId: string;
    reactionTypes: ReactionTypes;
    notifyPubkey: string;
  }): Promise<Promise<void>[]> => {
    const tags = [
      ['e', eventId, ''],
      ['p', notifyPubkey],
    ];

    if (reactionTypes.type === 'CustomEmoji') {
      tags.push(['emoji', reactionTypes.shortcode, reactionTypes.url]);
    }

    const preSignedEvent: UnsignedEvent = {
      kind: 7,
      pubkey,
      created_at: epoch(),
      tags,
      content: reactionTypes.content,
    };
    return publishEvent(relayUrls, preSignedEvent);
  };

  // NIP-18
  const publishRepost = async ({
    relayUrls,
    pubkey,
    eventId,
    notifyPubkey,
  }: {
    relayUrls: string[];
    pubkey: string;
    eventId: string;
    notifyPubkey: string;
  }): Promise<Promise<void>[]> => {
    const preSignedEvent: UnsignedEvent = {
      kind: 6 as Kind,
      pubkey,
      created_at: epoch(),
      tags: [
        ['e', eventId, ''],
        ['p', notifyPubkey],
      ],
      content: '',
    };
    return publishEvent(relayUrls, preSignedEvent);
  };

  const updateProfile = async ({
    relayUrls,
    pubkey,
    profile,
    otherProperties,
  }: {
    relayUrls: string[];
    pubkey: string;
    profile: Profile;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    otherProperties: Record<string, any>;
  }): Promise<Promise<void>[]> => {
    const content: ProfileWithOtherProperties = {
      ...profile,
      ...otherProperties,
    };
    const preSignedEvent: UnsignedEvent = {
      kind: Kind.Metadata,
      pubkey,
      created_at: epoch(),
      tags: [],
      content: JSON.stringify(content),
    };
    return publishEvent(relayUrls, preSignedEvent);
  };

  const updateContacts = async ({
    relayUrls,
    pubkey,
    updatedTags,
    content,
  }: {
    relayUrls: string[];
    pubkey: string;
    updatedTags: string[][];
    content: string;
  }): Promise<Promise<void>[]> => {
    const preSignedEvent: UnsignedEvent = {
      kind: Kind.Contacts,
      pubkey,
      created_at: epoch(),
      tags: updatedTags,
      content,
    };
    return publishEvent(relayUrls, preSignedEvent);
  };

  const deleteEvent = async ({
    relayUrls,
    pubkey,
    eventId,
  }: {
    relayUrls: string[];
    pubkey: string;
    eventId: string;
  }): Promise<Promise<void>[]> => {
    const preSignedEvent: UnsignedEvent = {
      kind: Kind.EventDeletion,
      pubkey,
      created_at: epoch(),
      tags: [['e', eventId, '']],
      content: '',
    };
    return publishEvent(relayUrls, preSignedEvent);
  };

  return {
    publishTextNote,
    publishReaction,
    publishRepost,
    updateProfile,
    updateContacts,
    deleteEvent,
  };
};

export default useCommands;
