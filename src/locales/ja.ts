import stripMargin from '@/utils/stripMargin';

export default {
  general: {
    loading: '読み込み中',
    updating: '更新中',
  },
  posting: {
    placeholder: 'いまどうしてる？',
    placeholderReply: '返信を投稿',
    contentWarning: 'コンテンツ警告を設定',
    contentWarningReason: '警告の理由',
    uploadImage: '画像を投稿',
    submit: '投稿',
    forbiddenToIncludeNsec: '投稿に秘密鍵(nsec)を含めることはできません。',
    failedToUploadFile: 'ファイルのアップロードに失敗しました: {{filenames}}',
    replyToPre: '',
    replyToAnd: ' と ',
    replyToPost: 'に返信',
  },
  column: {
    home: 'ホーム',
    notification: '通知',
    relay: 'リレー',
    japanese: '日本語',
    posts: '投稿',
    reactions: 'リアクション',
    channel: 'チャンネル',
    bookmark: 'ブックマーク',
    search: '検索',
    myPosts: '自分の投稿',
    myReactions: '自分のリアクション',
    back: '戻る',
    config: {
      columnWidth: 'カラム幅',
      widest: '特大',
      wide: '大',
      medium: '中',
      narrow: '小',
      moveLeft: '左に移動',
      moveRight: '右に移動',
      removeColumn: '削除',
    },
  },
  profile: {
    following: 'フォロー',
    followers: 'フォロワー',
    loadFollowers: '読み込む',
    editProfile: '編集',
    follow: 'フォロー',
    unfollow: 'フォロー解除',
    followingCurrently: 'フォロー中',
    followsYou: 'フォローされています',
    copyPubkey: 'IDをコピー',
    mute: 'ミュート',
    unmute: 'ミュート解除',
    followMyself: '自分をフォロー',
    unfollowMyself: '自分をフォロー解除',
    addUserColumn: 'ユーザカラムを追加',
    addUserHomeColumn: 'ホームカラムを追加',
    confirmUnfollow: '本当にフォロー解除しますか？',
    confirmUpdateEvenIfEmpty: stripMargin`
      フォローリストが空のようです。初めてのフォローであれば問題ありません。
      そうでなければ、リレーとの接続がうまくいっていない可能性があります。ページを再読み込みしてリレーと再接続してください。
      また、他のクライアントと同じリレーを設定できているどうかご確認ください。

      続行しますか？
    `,
    failedToUpdateFollowList: 'フォローリストの更新に失敗しました',
    failedToFetchLatestFollowList:
      '最新のフォローリストを取得できませんでした。リレーの接続状況が悪い可能性があります。',
    edit: {
      icon: 'アイコン',
      banner: 'バナー',
      name: 'ユーザ名',
      displayName: 'ユーザ名',
      about: '自己紹介',
      website: 'ウェブサイト',
      nip05: 'ドメイン認証（NIP-05）',
      lightningAddress: 'LNURLアドレス / ライトニングアドレス',
      lightningAddressDescription: 'どちらか片方のみが保存されます。',
      otherProperties: 'その他の項目',
      save: '更新',
      cancel: 'キャンセル',
      updating: '更新中...',
      updateSucceeded: '更新しました',
      failedToUpdatePartially: '{{count}}個のリレーで更新に失敗しました',
      failedToUpdate: 'すべてのリレーで更新に失敗しました',
    },
  },
  post: {
    replyToPre: '',
    replyToPost: 'への返信',
    copyEventId: 'IDをコピー',
    showJSON: 'JSONを確認',
    showReposts: 'リポスト一覧',
    showReactions: 'リアクション一覧',
    deletePost: '削除',
    confirmDelete: '本当に削除しますか？',
    deletedSuccessfully: '削除しました（画面への反映にはリロード）',
    failedToDeletePartially: '{{count}}個のリレーで削除に失敗しました',
    failedToDelete: 'すべてのリレーで削除に失敗しました',
    showImage: '画像を表示する',
    showVideo: '動画を表示する',
    showOverflow: '続きを読む',
    hideOverflow: '隠す',
    download: 'ダウンロード',
    contentWarning: {
      show: '表示するにはクリック',
      reason: '理由',
    },
    failedToFetchEvent: '取得に失敗しました',
  },
  notification: {
    reposted: 'がリポスト',
    reacted: 'がリアクション',
  },
  config: {
    config: '設定',
    profile: {
      profile: 'プロフィール',
      openProfile: '開く',
      editProfile: '編集',
    },
    relays: {
      relays: 'リレー',
      numOfRelays_one: '{{count}}個のリレーが設定されています。',
      numOfRelays_other: '{{count}}個のリレーが設定されています。',
      addRelay: '追加',
      importRelays: 'インポート',
      importFromExtension: '拡張機能からインポート',
      notConfigured: 'リレーが設定されていません',
      askImport: 'これらのリレーをインポートしますか？',
      failedToImport: 'インポートに失敗しました',
      imported_one: '{{count}}個のリレーをインポートしました',
      imported_other: '{{count}}個のリレーをインポートしました',
    },
    display: {
      display: '表示',
      timeNotation: '時刻の表記',
      relativeTimeNotation: '相対表記',
      relativeTimeNotationExample: '7秒前',
      absoluteTimeNotationShort: '絶対表記 (短形式)',
      absoluteTimeNotationShortExample: '昨日 23:55',
      absoluteTimeNotationLong: '絶対表記 (長形式)',
      absoluteTimeNotationLongExample: '2020/11/8 21:02:53',
      reaction: 'リアクション',
      enableEmojiReaction: '絵文字を選べるようにする',
      showEmojiReaction: '投稿にリアクションされた絵文字を表示する',
      embedding: '埋め込み',
      embeddingDescription: '各項目の埋め込みを有効にするかどうか',
      others: 'その他',
      keepOpenPostForm: '投稿後も投稿欄を開いたままにする',
      showMediaByDefault: 'デフォルトで画像や動画を読み込む',
      hideNumbers: 'いいねやリポスト、フォロワーなどの数を隠す',
    },
    customEmoji: {
      customEmoji: 'カスタム絵文字',
      shortcode: '名前',
      url: 'URL',
      addEmoji: '追加',
      emojiImport: '絵文字のインポート',
      emojiImportDescription:
        '絵文字の名前をキー、画像のURLを値とするJSONを読み込むことができます。',
      importEmoji: 'インポート',
    },
    mute: {
      mute: 'ミュート',
      mutedUsers: 'ミュートしたユーザ',
      mutedKeywords: 'ミュートした単語',
      add: '追加',
    },
  },
  hello: {
    signerChecking: '拡張機能のインストール状況を確認中です...',
    signerUnavailable: '利用にはNIP-07に対応した拡張機能が必要です。',
    loginWithSigner: 'NIP-07 拡張機能でログイン',
  },
};
