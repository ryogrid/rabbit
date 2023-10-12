import { createSignal, Show, type JSX, Component } from 'solid-js';

import Cog6Tooth from 'heroicons/24/outline/cog-6-tooth.svg';
import Plus from 'heroicons/24/outline/plus.svg';
import MagnifyingGlass from 'heroicons/24/solid/magnifying-glass.svg';
import PencilSquare from 'heroicons/24/solid/pencil-square.svg';

import Config from '@/components/modal/Config';
import NotePostForm from '@/components/NotePostForm';
import Popup, { PopupRef } from '@/components/utils/Popup';
import { createSearchColumn } from '@/core/column';
import useConfig from '@/core/useConfig';
import { useHandleCommand, useRequestCommand } from '@/hooks/useCommandBus';
import useModalState from '@/hooks/useModalState';
import resolveAsset from '@/utils/resolveAsset';

const SearchButton = () => {
  let popupRef: PopupRef | undefined;
  let inputRef: HTMLInputElement | undefined;

  const { saveColumn } = useConfig();
  const request = useRequestCommand();

  const [query, setQuery] = createSignal('');

  const handleSearchSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (ev) => {
    ev.preventDefault();

    saveColumn(createSearchColumn({ query: query() }));
    request({ command: 'moveToLastColumn' }).catch((err) => console.error(err));
    popupRef?.close();
    setQuery('');
  };

  return (
    <Popup
      ref={(r) => {
        popupRef = r;
      }}
      position="right"
      button={
        <span class="inline-block h-9 w-9 rounded-full border border-primary p-2 text-2xl font-bold text-primary">
          <MagnifyingGlass />
        </span>
      }
      onOpen={() => inputRef?.focus()}
    >
      <form
        class="flex w-72 items-center gap-1 rounded-md bg-white p-4 shadow-md"
        onSubmit={handleSearchSubmit}
      >
        <input
          ref={inputRef}
          class="h-8 w-full rounded border border-stone-300 focus:border-purple-100 focus:ring-purple-300"
          type="text"
          value={query()}
          onChange={(ev) => setQuery(ev.currentTarget.value)}
        />
        <button class="h-8 w-8 rounded bg-primary p-1 text-white" type="submit">
          <MagnifyingGlass />
        </button>
      </form>
    </Popup>
  );
};

const SideBar: Component = () => {
  let textAreaRef: HTMLTextAreaElement | undefined;

  const { showAddColumn, showAbout } = useModalState();
  const { config } = useConfig();

  const [formOpened, setFormOpened] = createSignal(false);
  const [configOpened, setConfigOpened] = createSignal(false);

  const focusTextArea = () => {
    textAreaRef?.focus();
    textAreaRef?.click();
  };
  const openForm = () => setFormOpened(true);
  const closeForm = () => setFormOpened(false);
  const toggleForm = () => setFormOpened((current) => !current);

  useHandleCommand(() => ({
    commandType: 'openPostForm',
    handler: () => {
      openForm();
      if (textAreaRef != null) {
        setTimeout(() => focusTextArea(), 100);
      }
    },
  }));

  return (
    <div class="flex shrink-0 flex-row border-r bg-sidebar-bg">
      <div class="flex w-14 flex-auto flex-col items-center gap-3 border-r border-purple-200 pt-5">
        <div class="flex flex-col items-center gap-3">
          <button
            class="h-9 w-9 rounded-full border border-primary bg-primary p-2 text-2xl text-white"
            onClick={() => toggleForm()}
          >
            <PencilSquare />
          </button>
          <SearchButton />
        </div>
        <div class="grow" />
        <div class="flex flex-col items-center pb-2">
          <button
            class="h-10 w-12 rounded-full p-3 text-2xl text-primary"
            onClick={() => showAddColumn()}
          >
            <Plus />
          </button>
          <button
            class="h-10 w-12 p-3 text-primary"
            onClick={() => setConfigOpened((current) => !current)}
          >
            <Cog6Tooth />
          </button>
          <button class="pt-2" onClick={() => showAbout()}>
            <img
              class="h-8 w-8"
              src={resolveAsset('images/rabbit_app_256.png')}
              alt="About rabbit"
            />
          </button>
        </div>
      </div>
      <div
        classList={{
          static: formOpened() || config().keepOpenPostForm,
          hidden: !(formOpened() || config().keepOpenPostForm),
        }}
      >
        <NotePostForm
          textAreaRef={(el) => {
            textAreaRef = el;
          }}
          onClose={closeForm}
        />
      </div>
      <Show when={configOpened()}>
        <Config onClose={() => setConfigOpened(false)} />
      </Show>
    </div>
  );
};

export default SideBar;
