import { createSignal, onMount, Switch, Match, type Component } from 'solid-js';

import { useNavigate } from '@solidjs/router';

import usePersistStatus from '@/hooks/usePersistStatus';
import { useTranslation } from '@/i18n/useTranslation';
import resolveAsset from '@/utils/resolveAsset';

type SignerStatus = 'checking' | 'available' | 'unavailable';

const useSignerStatus = () => {
  const [signerStatus, setSignerStatus] = createSignal<SignerStatus>('checking');

  const checkStatus = () => {
    if (window.nostr != null) {
      setSignerStatus('available');
    } else {
      setSignerStatus('unavailable');
    }
  };

  onMount(() => {
    let count = 0;
    const intervalId = setInterval(() => {
      checkStatus();
      if (count >= 10) clearInterval(intervalId);
      count += 1;
    }, 1000);
  });

  return signerStatus;
};

const Hello: Component = () => {
  const i18n = useTranslation();
  const signerStatus = useSignerStatus();
  const navigate = useNavigate();
  const { persistStatus, loggedIn } = usePersistStatus();

  const handleLogin = () => {
    loggedIn();
    navigate('/');
  };

  onMount(() => {
    if (persistStatus().loggedIn) {
      navigate('/');
    }
  });

  return (
    <div class="mx-auto flex max-w-[640px] flex-col items-center p-4 text-stone-600">
      <div class="flex flex-col items-center gap-4 rounded bg-white p-4">
        <img src={resolveAsset('images/rabbit_256.png')} width="96" alt="logo" height="96" />
        <h1 class="text-5xl font-black text-red-300">Usagi</h1>
        <div>Usagi is a Web client for Nostr.</div>
        <p class="text-center">
          <span class="font-bold text-red-400">注意: 現在ベータ版です。</span>
          <br />
          未実装の機能やバグがあることを承知の上でご利用ください。
        </p>
      </div>
      <div class="rounded-md p-8 shadow-md">
        <Switch>
          <Match when={signerStatus() === 'checking'}>
            <p>{i18n()('hello.signerChecking')}</p>
          </Match>
          <Match when={signerStatus() === 'unavailable'}>
            <h2 class="font-bold">{i18n()('hello.signerUnavailable')}</h2>
            <p>
              <br />
              初めて利用する方も、他のクライアントをつかっている方も
              <br />
              <a
                class="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
                href="https://scrapbox.io/nostr/NIP-07#63e1c10c8b8fcb00000584fc"
              >
                こちらを参考
              </a>
              に拡張機能をインストールしてください。
              <br />
              終わりましたら、このページを再読込してください。
            </p>
          </Match>
          <Match when={signerStatus() === 'available'}>
            <button
              class="rounded bg-red-400 p-4 text-lg font-bold text-white hover:shadow-md"
              onClick={handleLogin}
            >
              {i18n()('hello.loginWithSigner')}
            </button>
          </Match>
        </Switch>
      </div>
    </div>
  );
};

export default Hello;
