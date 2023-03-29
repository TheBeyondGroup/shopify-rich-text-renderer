## Shopify Rich Text to HTML

This package converts the rich text returned by Shopify's Storefront API. In particular when dealing with the rich text field type for _MetaObjects_ and for _Metafields_.

### Usage

- Install `yarn add @thebeyondgroup/shopify-rich-text-to-html`
- Then import the `richTextToHTML()` function

```javascript
import { richTextToHTML } from '@thebeyondgroup/shopify-rich-text-to-html'

/*  this is an example of the rich text Shopify returns
const richTextRes = {\"type\":\"root\",\"children: [{\"type\":\"heading\"
\"level\":1,\"children\":[{\"type\":\"text\",\"value\":\
"Test Heading\"}]},{\"listType\":\"ordered\",\"type\":\"list\",
\"children\":[{\"type\":\"list-item\",\"children\":..." */

richTextToHTML(richTextRes)
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
richTextToHTML(richTextRes, true)
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
richTextToHTML(richTextRes, 'rich-text-wrap')
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
