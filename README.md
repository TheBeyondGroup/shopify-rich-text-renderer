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

To get scoped HTML pass either true or the name of a class(es) to use in your scoped css selectors. This allows for the rich text HTML to be easily styled.

```javascript
// scoped html
convertSchemaToHtml(richTextResponse, true)
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
convertSchemaToHtml(richTextResponse, 'rich-text-wrap')
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
