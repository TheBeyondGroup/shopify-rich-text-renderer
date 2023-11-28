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
  expect(document.querySelector('p em').textContent).toBe(
    'This is italicized text and '
  )
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
            children: [
              { type: 'text', value: 'a bolded hyperlink', bold: true },
            ],
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

  expect(document.querySelector('h1').textContent).toBe('Heading 1')
  expect(document.querySelector('h4').textContent).toBe('Heading 4')
  expect(document.querySelector('ul>li').textContent).toBe('item1')
  expect(document.querySelector('p em').textContent).toBe(
    'This is italicized text and '
  )
  expect(document.querySelector('p:nth-child(2)').innerHTML).toBe(
    'This is test. New<br>lines<br>are supported.'
  )
})
