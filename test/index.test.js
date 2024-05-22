/**
 * @jest-environment jsdom
 */

import { convertSchemaToHtml } from '../src/index.js'

test('check converting string schema to HTML', () => {
  const res =
    '{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","value":"This is italicized text and ","italic":true},{"url":"https://example.com","title":"Link to example.com","type":"link","children":[{"type":"text","value":"a bolded hyperlink","bold":true}]},{"type":"text","value":""}]},{"type":"paragraph","children":[{"type":"text","value":"This is test."}]},{"type":"heading","children":[{"type":"text","value":"Heading 1"}],"level":1},{"listType":"unordered","type":"list","children":[{"type":"list-item","children":[{"type":"text","value":"item1"}]},{"type":"list-item","children":[{"type":"text","value":"item2"}]}]},{"type":"heading","level":4,"children":[{"type":"text","value":"Heading 4"}]},{"listType":"ordered","type":"list","children":[{"type":"list-item","children":[{"type":"text","value":"a"}]},{"type":"list-item","children":[{"type":"text","value":"b"}]},{"type":"list-item","children":[{"type":"text","value":"c"}]}]}]}'
  const html = convertSchemaToHtml(res)
  document.body.innerHTML = html

  expect(document.querySelector('h1').textContent).toBe('Heading 1')
  expect(document.querySelector('h4').textContent).toBe('Heading 4')
  expect(document.querySelector('ul>li').textContent).toBe('item1')
  expect(document.querySelector('p em').textContent).toBe('This is italicized text and ')
  expect(document.querySelector('a').getAttribute('href')).toBe('https://example.com')
  expect(document.querySelector('a').getAttribute('title')).toBe('Link to example.com')
})

test('check converting JSON object schema to HTML', () => {
  const resObject = {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          { type: 'text', value: 'This is italicized text and ', italic: true },
          {
            url: 'https://example.com',
            title: 'Link to example.com',
            type: 'link',
            children: [{ type: 'text', value: 'a bolded hyperlink', bold: true }],
          },
          { type: 'text', value: '' },
        ],
      },
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: 'This is test. New\nlines\nare supported.',
          },
        ],
      },
      {
        type: 'heading',
        children: [{ type: 'text', value: 'Heading 1' }],
        level: 1,
      },
      {
        listType: 'unordered',
        type: 'list',
        children: [
          { type: 'list-item', children: [{ type: 'text', value: 'item1' }] },
          { type: 'list-item', children: [{ type: 'text', value: 'item2' }] },
        ],
      },
      {
        type: 'heading',
        level: 4,
        children: [{ type: 'text', value: 'Heading 4' }],
      },
      {
        listType: 'ordered',
        type: 'list',
        children: [
          { type: 'list-item', children: [{ type: 'text', value: 'a' }] },
          { type: 'list-item', children: [{ type: 'text', value: 'b' }] },
          { type: 'list-item', children: [{ type: 'text', value: 'c' }] },
        ],
      },
    ],
  }

  const html = convertSchemaToHtml(resObject)
  document.body.innerHTML = html
  expect(document.querySelector('a').getAttribute('href')).toBe('https://example.com')
  expect(document.querySelector('a').getAttribute('title')).toBe('Link to example.com')
  expect(document.querySelector('h1').textContent).toBe('Heading 1')
  expect(document.querySelector('h4').textContent).toBe('Heading 4')
  expect(document.querySelector('ul>li').textContent).toBe('item1')
  expect(document.querySelector('p em').textContent).toBe('This is italicized text and ')
  expect(document.querySelector('p:nth-child(2)').innerHTML).toBe('This is test. New<br/>lines<br/>are supported.')
})

test('check applied classes to elements', () => {
  const res =
    '{"type":"root","children":[{"type":"paragraph","children":[{"type":"text","value":"This is italicized text and ","italic":true},{"url":"https://example.com","title":"Link to example.com","type":"link","children":[{"type":"text","value":"a bolded hyperlink","bold":true}]},{"type":"text","value":""}]},{"type":"paragraph","children":[{"type":"text","value":"This is test."}]},{"type":"heading","children":[{"type":"text","value":"Heading 1"}],"level":1},{"listType":"unordered","type":"list","children":[{"type":"list-item","children":[{"type":"text","value":"item1"}]},{"type":"list-item","children":[{"type":"text","value":"item2"}]}]},{"type":"heading","level":4,"children":[{"type":"text","value":"Heading 4"}]},{"listType":"ordered","type":"list","children":[{"type":"list-item","children":[{"type":"text","value":"a"}]},{"type":"list-item","children":[{"type":"text","value":"b"}]},{"type":"list-item","children":[{"type":"text","value":"c"}]}]}]}'
  const options = {
    scoped: false,
    classes: {
      p: 'mb-3',
      h1: 'mb-4 text-2xl md:text-4xl',
      h2: 'mb-4 text-xl md:text-3xl',
      h3: 'mb-3 text-lg md:text-2xl',
      h4: 'mb-3 text-base md:text-lg',
      h5: 'mb-2.5 text-sm md:text-base',
      h6: 'mb-2 text-xs md:text-sm',
      ol: 'my-3 ml-3 flex flex-col gap-y-2',
      ul: 'my-3 ml-3 flex flex-col gap-y-2',
      li: 'text-sm md:text-base',
      a: 'underline text-blue-500 hover:text-blue-700',
      strong: 'font-medium',
      em: 'font-italic',
    },
  }
  const html = convertSchemaToHtml(res, options)
  document.body.innerHTML = html
  expect(document.querySelector('p').className).toBe('mb-3')
  expect(document.querySelector('h1').className).toBe('mb-4 text-2xl md:text-4xl')
  expect(document.querySelector('h4').className).toBe('mb-3 text-base md:text-lg')
  expect(document.querySelector('ul>li').className).toBe('text-sm md:text-base')
  expect(document.querySelector('p em').className).toBe('font-italic')
  expect(document.querySelector('p a').className).toBe('underline text-blue-500 hover:text-blue-700')
})
