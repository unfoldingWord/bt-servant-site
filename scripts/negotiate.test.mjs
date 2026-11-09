// Unit tests for the markdown content negotiation (src/lib/negotiate.js).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { prefersMarkdown, parseAccept } from '../src/lib/negotiate.js';

test('serves markdown when it is asked for', () => {
  assert.equal(prefersMarkdown('text/markdown'), true);
  assert.equal(prefersMarkdown('text/markdown, text/html;q=0.9'), true);
  assert.equal(prefersMarkdown('TEXT/Markdown; charset=utf-8'), true);
  assert.equal(prefersMarkdown('text/markdown;q=0.5, */*;q=0.1'), true);
});

test('ties between markdown and html go to markdown', () => {
  assert.equal(prefersMarkdown('text/html, text/markdown'), true);
});

test('serves html when markdown is rejected', () => {
  assert.equal(prefersMarkdown('text/markdown;q=0, text/html'), false);
  assert.equal(prefersMarkdown('text/markdown;q=0.000'), false);
});

test('serves html when html is preferred', () => {
  assert.equal(prefersMarkdown('text/html;q=1, text/markdown;q=0.1'), false);
  assert.equal(prefersMarkdown('text/*;q=0.9, text/markdown;q=0.5'), false);
});

test('only an exact text/markdown range counts', () => {
  assert.equal(prefersMarkdown('text/markdown-other'), false);
  assert.equal(prefersMarkdown('text/x-markdown'), false);
  assert.equal(prefersMarkdown('text/*'), false);
  assert.equal(prefersMarkdown('*/*'), false);
});

test('browsers and missing headers get html', () => {
  assert.equal(prefersMarkdown('text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'), false);
  assert.equal(prefersMarkdown(''), false);
  assert.equal(prefersMarkdown(null), false);
});

test('a malformed q value counts as 0', () => {
  assert.equal(prefersMarkdown('text/markdown;q=abc'), false);
  assert.equal(prefersMarkdown('text/markdown;q=1.5'), false);
  assert.deepEqual(parseAccept('text/markdown;q=0.7'), [{ type: 'text', subtype: 'markdown', q: 0.7 }]);
});
