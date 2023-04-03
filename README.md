## Shopify Rich Text Renderer

This package converts the rich text schema returned by Shopify's Storefront API to an HTML string. In particular, this package is useful when dealing with the rich text field type for _MetaObjects_ and _Metafields_.

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

To get scoped html pass either true or the name of a class to use in your scoped css selectors:

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

Or pass in custom class name to be used as the scoped class

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
