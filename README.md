## Shopify Rich Text Renderer

This package converts the rich text schema returned by Shopify's Storefront API to an HTML string. In particular, this package is useful when dealing with the rich text field type for _MetaObjects_ and _Metafields_ when using the Storefront API.

### Usage

- Install `yarn add @thebeyondgroup/shopify-rich-text-renderer`
- Then import the `convertSchemaToHtml()` function

```javascript
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'

/*  this is an example of the rich text Shopify returns
const richTextResponse = {\"type\":\"root\",\"children: [{\"type\":\"heading\"
\"level\":1,\"children\":[{\"type\":\"text\",\"value\":\
"Test Heading\"}]},{\"listType\":\"ordered\",\"type\":\"list\",
\"children\":[{\"type\":\"list-item\",\"children\":..." */

convertSchemaToHtml(richTextResponse)
```

```html
<!-- Output: -->
<h1>Test Heading</h1>
<ol>
  ...
</ol>
...
```

To get scoped HTML pass either true or the name of a class(es) to use in your scoped css selectors in the `scoped` property of the `options` parameter (options.scoped). This allows for the rich text HTML to be easily styled.

```javascript
// scoped html
convertSchemaToHtml(richTextResponse, { scoped: true })
```

```html
<!-- Output: -->
<div class="rte">
  <h1>Test Heading</h1>
  <ol>
    ...
  </ol>
  ...
</div>
```

You can also pass in a custom class name to be used as the scoped class instead of the default `rte`

```javascript
//scoped w/ custom class name
convertSchemaToHtml(richTextResponse, { scoped: 'rich-text-wrap' })
```

```html
<!-- Output: -->
<div class="rich-text-wrap">
  <h1>Test Heading</h1>
  <ol>
    ...
  </ol>
  ...
</div>
```

If you want to be more specific or are using something like Tailwind CSS you can pass a string of classes to be used with specific HTML elements to the `classes` property of the `options` parameter (options.classes). This makes it easy to write your own wrapper class to apply a default classlist to various elements.

```javascript
const options = {
  scoped: false,
  classes: {
    p: 'mt-3 text-lg', // paragraph classes
    h1: 'mb-4 text-2xl md:text-4xl', // heading1 classes
    h2: 'mb-4 text-xl md:text-3xl', // heading2 classes
    h3: 'mb-3 text-lg md:text-2xl', // heading3 classes
    h4: 'mb-3 text-base md:text-lg', // heading4 classes
    h5: 'mb-2.5 text-sm md:text-base', // heading5 classes
    h6: 'mb-2 text-xs md:text-sm', // heading6 classes
    ol: 'my-3 ml-3 flex flex-col gap-y-2', // order list classes
    ul: 'my-3 ml-3 flex flex-col gap-y-2', // unordered list classes
    li: 'text-sm md:text-base', // list item classes
    a: 'underline text-blue-500 hover:text-blue-700', // anchor/link classes
    bold: 'font-medium', // bold/strong classes
    italic: 'font-italic', // italic/em classes
  },
}

// Applying classes directly to elements
convertSchemaToHtml(richTextResponse, options)
```

```html
<!-- Output: -->
<h1 class="mb-4 text-2xl md:text-4xl">Groceries</h1>
<p class="mt-3 text-lg">
  Here is my shopping list for various fruit to buy at
  <a
    href="https://grocerystore.com"
    class="underline text-blue-500 hover:text-blue-700"
  >
    The Grocery Store
  </a>
</p>
<ol class="my-3 ml-3 flex flex-col gap-y-2">
  <li class="text-sm md:text-base">apples</li>
  <li class="text-sm md:text-base">oranges</li>
  <li class="text-sm md:text-base">bananas</li>
</ol>
...
```

React/Hydrogen example:

```javascript
export default RenderedHTML(){
 const richTextResponse  = await getRichTextFromShopify()
  return (
   <>
    <div
        className="html"
        dangerouslySetInnerHTML={{
          __html: convertSchemaToHtml(richTextResponse),
          }}
         />
      <div>
   </>
 )
}
```

Here is a [JSFiddle Demo](https://jsfiddle.net/psmzrojd/) that shows a working example.
