import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { transform } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost/' });
Object.assign(globalThis, {
  window: dom.window, document: dom.window.document, localStorage: dom.window.localStorage,
  HTMLElement: dom.window.HTMLElement, IS_REACT_ACT_ENVIRONMENT: true,
  alert: () => {}, fetch: async () => { throw Error('Live API disabled'); }
});
const React = await import('react');
const { act } = React;
const { createRoot } = await import('react-dom/client');
await mkdir('tests/.compiled', { recursive: true });
const source = (await readFile('src/components/BookForm.jsx', 'utf8'))
  .replace(/import ['"][^'"]+\.css['"];?/g, '');
const result = await transform(source, { loader: 'jsx', jsx: 'automatic', format: 'esm' });
await writeFile('tests/.compiled/BookForm.mjs', result.code);
const { default: BookForm } = await import('./.compiled/BookForm.mjs');
after(() => dom.window.close());

test('failed save preserves input; success clears it; duplicate submission is blocked', async () => {
  const root = createRoot(document.getElementById('root'));
  let rejectSave, resolveSave, calls = 0;
  const save = () => {
    calls++;
    return new Promise((resolve, reject) => { resolveSave = resolve; rejectSave = reject; });
  };
  await act(async () => root.render(React.createElement(BookForm, { onAddBook: save })));
  const input = document.querySelector('input');
  await act(async () => {
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, '가상 도서');
    input.dispatchEvent(new window.Event('input', { bubbles: true }));
  });
  const button = document.querySelector('.add-btn');
  await act(async () => button.click());
  assert.equal(calls, 1); assert.equal(button.disabled, true);
  await act(async () => button.click()); assert.equal(calls, 1);
  await act(async () => rejectSave(Error('mock failure')));
  assert.equal(input.value, '가상 도서'); assert.equal(button.disabled, false);
  await act(async () => button.click());
  await act(async () => resolveSave()); assert.equal(input.value, '');
  await act(async () => root.unmount());
});
