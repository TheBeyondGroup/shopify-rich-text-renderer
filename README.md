## Shopify Rich Text Renderer

This package converts the rich text schema returned by Shopify's Storefront API to an HTML string. In particular, this package is useful when dealing with the rich text field type for _MetaObjects_ and _Metafields_ when using the Storefront API. Supports all of Shopify's Richtext Editor markup, including new line characters, and both **_bold & italic_** on the same text node.

### Usage

- Install `yarn add @thebeyondgroup/shopify-rich-text-renderer`
- Then import the `convertSchemaToHtml()` function

```javascript
import { convertSchemaToHtml } from '@thebeyondgroup/shopify-rich-text-renderer'

/*  this is an example of the rich text Shopify returns
const richTextResponse = {\"type\":\"root\",\"children: [{\"type\":\"heading\"
\"level\":1,\"children\":[{\"type\":\"text\",\"value\":\
"Test Heading\", \"bold\": true, \"italic\": true}]},{\"listType\":\"ordered\",\"type\":\"list\",
\"children\":[{\"type\":\"list-item\",\"children\":..." */

convertSchemaToHtml(richTextResponse)
```

```html
<!-- Output: -->
<h1>
  <strong>
    <em>Test Heading</em>
  </strong>
</h1>
<ol>
  ...
</ol>
...
```

To get scoped HTML pass either true or the name of a class(es) to use in your scoped css selectors in the `scoped` property of the `options` parameter (options.scoped). This allows for the rich text HTML to be easily styled. _Note: You can also pass a scoped class name or_ `true`(to use default scoped class) instead of the options object, i.e. `convertSchemaToHtml(richTextResponse, 'rich-text-wrap')`.

```javascript
// scoped html
convertSchemaToHtml(richTextResponse, { scoped: true })
```

```html
<!-- Output: -->
<div class="rte">
  <h1>
    <strong>
      <em>Test Heading</em>
    </strong>
  </h1>
  <ol>
    ...
  </ol>
  ...
</div>
```

You can also pass in a custom class name to be used as the scoped class instead of the default `rte`.

```javascript
//scoped w/ custom class name
convertSchemaToHtml(richTextResponse, { scoped: 'rich-text-wrap' })
```

```html
<!-- Output: -->
<div class="rich-text-wrap">
  <h1>
    <strong><em>Test Heading</em></strong>
  </h1>
  <ol>
    ...
  </ol>
  ...
</div>
```

If you want to be more specific or are using something like Tailwind CSS you can pass a string of classes to be used with specific HTML elements to the `classes` property of the `options` parameter (options.classes).

This makes it easy to write your own wrapper class to apply a default classlist to various elements. There is also an option to convert new line character's to `<br/>` (You can create new lines using `shift + space` in Shopify's rich text editor).

```javascript
const options = {
  scoped: false,
  newLineToBreak: true, // convert new line character to <br/>
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
    strong: 'font-medium', // bold/strong classes
    em: 'font-italic', // italic/em classes
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
  <a href="https://grocerystore.com" class="underline text-blue-500 hover:text-blue-700"> The Grocery Store </a>
</p>
<ol class="my-3 ml-3 flex flex-col gap-y-2">
  <li class="text-sm md:text-base">apples</li>
  <li class="text-sm md:text-base">oranges</li>
  <li class="text-sm md:text-base">bananas</li>
</ol>
```

**React Typescript Component Example**

```typescript
// @/components/RichtextToHTML.tsx
import {convertSchemaToHtml} from '@thebeyondgroup/shopify-rich-text-renderer';
import type {Schema, Options} from '@thebeyondgroup/shopify-rich-text-renderer';
import {useEffect, useState} from 'react';

/**
 * Default options for the HTML conversion, using Tailwind CSS classes
 * for styling, you can update these to suit your specific needs
 **/

const defaultOptions = {
  scoped: false,
  newLineToBreak: false, // convert new line character to <br/>
  classes: {
    p: 'mt-2 text-sm', // paragraph classes
    h1: 'mb-4 text-3xl md:text-4xl', // heading1 classes
    h2: 'mb-4 text-2xl md:text-3xl', // heading2 classes
    h3: 'mb-3 text-lg md:text-2xl', // heading3 classes
    h4: 'mb-3 text-base md:text-lg', // heading4 classes
    h5: 'mb-2.5 text-sm md:text-base', // heading5 classes
    h6: 'mb-2 text-xs md:text-sm', // heading6 classes
    ol: 'my-3 ml-3 flex flex-col gap-y-2', // order list classes
    ul: 'my-3 ml-3 flex flex-col gap-y-2', // unordered list classes
    li: 'text-sm md:text-base', // list item classes
    a: 'underline text-gray-700 hover:text-blue-700 text-sm', // anchor/link classes
    strong: 'font-semibold', // bold/strong classes
    em: 'font-italic', // italic/em classes
  },
};

function mergeOptions(
  options: Options,
  defaultOptions: Options,
  classes?: any,
  newLineToBreak?: boolean,
) {
  return {
    ...defaultOptions,
    ...options,
    classes: {
      ...defaultOptions?.classes,
      ...options.classes,
      ...classes,
    },
    newLineToBreak,
  };
}

interface RichtextToHtmlProps {
  schema: string | Schema | Schema[];
  options?: Options;
  className?: string;
  newLineToBreak?: boolean;
  classes?: {
    p?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
    ol?: string;
    ul?: string;
    li?: string;
    a?: string;
    strong?: string;
    em?: string;
  };
}

/**
 * React component that converts a Shopify Richtext schema to HTML
 **/

export default function RichtextToHtml({
  schema,
  options,
  className,
  newLineToBreak,
  classes,
}: RichtextToHtmlProps) {

  //options passed via props override default options (classes, scoped, newLineToBreak) etc...
  const combinedOptions = mergeOptions(
    (options as Options) || {},
    defaultOptions,
    classes,
    newLineToBreak,
  );

  const html = convertSchemaToHtml(schema, combinedOptions);
  return (
    <>
      <div className={className} dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
}
```

**Example of the react RichtextToHTML components in use**

```typescript
// App.tsx
import React from 'react'
import RichTextToHtml from './RichTextToHtml'

/**
 * Normally schema would be passed through
 * a loader after requesting it from shopify api
 * */
const productDescriptionSchema = {
  type: 'root',
  children: [
    ...
  ],
}

const userProfileSchema =  {
  type: 'root',
  children: [
    ...
  ],
}


// Custom options for demonstration of overriding defaults.
// Note: you probably wouldn't need to set the scoped class name & apply unique classes per element
const customOptions = {
  scoped: 'custom-scope',
  classes: {
    p: 'text-lg text-slate-800 my-2',
    h2: 'text-2xl md:text-4xl font-semibold leading-none tracking-wide mb-2',
  },
  newLineToBreak: true,
}

// Main React App Component
const App = () => {
  return (
    <div className="container flex flex-col gap-4 mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopify Storefront</h1>
      <section>
        <h2 className="text-xl font-semibold">Product Description</h2>
        <RichTextToHtml className="my-5 py-3" schema={productDescriptionSchema} options={customOptions} />
      </section>
      <section>
        <h2 className="text-xl font-semibold">User Profile</h2>
        {/**
          * Example showing prop priority, classes has priority over prop option.classes.
          * scoped:false, p: 'my-3 text-sm font-medium', h6: 'text-xs font-bold' newLineToBreak: true
          */}
        <RichTextToHtml
          schema={userProfileSchema}
          newLineToBreak={true}
          classes={{ p: 'my-3 text-sm font-medium'}}
          options={{scoped: false, classes:{h6: 'text-xs font-bold', p: 'text-xs my-2'}}}
        />
      </section>
    </div>
  )
}

export default App
```

**Live Examples**

- [JSFiddle: Basic Use](https://jsfiddle.net/r2d4wsna/)
- [Stackblitz: React Typescript Component](https://stackblitz.com/edit/react-starter-typescript-ohxvltnb?file=components%2FRichtextToHtml.tsx)
