/* Shopify Metafield & Metaobject Rich Text Editor Schema to HTML Converter */

function convertElementToRichTextSchema(element) {
  let shopifyRichTextObject = {};
  let currentElementCanHaveChildren = true;

  if (['style','script'].includes(element.tagName.toLowerCase())) {
    return null; // Drop the element if it matches any tag in the list
  }

  if (element.tagName.toLowerCase() === 'body') {
    shopifyRichTextObject = { type: 'root' };
  } else {
    switch (element.tagName.toLowerCase()) {
      case 'h1':
        shopifyRichTextObject = { type: 'heading', level: 1 };
        break;
      case 'h2':
        shopifyRichTextObject = { type: 'heading', level: 2 };
        break;
      case 'h3':
        shopifyRichTextObject = { type: 'heading', level: 3 };
        break;
      case 'h4':
        shopifyRichTextObject = { type: 'heading', level: 4 };
        break;
      case 'h5':
        shopifyRichTextObject = { type: 'heading', level: 5 };
        break;
      case 'p':
        shopifyRichTextObject = { type: 'paragraph' };
        break;
      case 'a':
        shopifyRichTextObject = { type: 'link' };
        break;
      case 'ol':
        shopifyRichTextObject = { type: 'list', listType: 'ordered' };
        break;
      case 'ul':
        shopifyRichTextObject = { type: 'list', listType: 'unordered' };
        break;
      case 'li':
        shopifyRichTextObject = { type: 'list-item' };
        break;
      case 'b':
      case 'strong':
        shopifyRichTextObject = { type: 'text', bold: true, value: element.textContent };
        currentElementCanHaveChildren = false;
        break;
      case 'em':
        shopifyRichTextObject = { type: 'text', italic: true, value: element.textContent };
        currentElementCanHaveChildren = false;
        break;
      default:
        // add unknown elements as text with raw HTML for later editing
        shopifyRichTextObject = { type: 'text', value: element.innerHTML };
        currentElementCanHaveChildren = false;
        break;
    }
  }

  if (currentElementCanHaveChildren) {
    // only hyperlinks get attributes
    if (element.attributes && shopifyRichTextObject.type === 'link') {
      for (let attribute of element.attributes) {
        if (attribute.name === 'href') {
          shopifyRichTextObject['url'] = attribute.value;
        }
        if (attribute.name === 'title') {
          shopifyRichTextObject['title'] = attribute.value;
        }
      }
    }

    shopifyRichTextObject.children = [];
    for (let subElement of element.childNodes) {
      if (subElement.nodeType === subElement.TEXT_NODE) {
        const trimmedText = subElement.textContent?.trim();
        if (trimmedText) {
          shopifyRichTextObject.children.push({ type: 'text', value: trimmedText });
        }
      } else if (subElement.nodeType === subElement.ELEMENT_NODE) {
        const resultObj = elementToObj(subElement);
        if(resultObj){
          shopifyRichTextObject.children.push(resultObj);
        }
      }
    }
  }

  return shopifyRichTextObject;
}

/**
 * Converts HTML to Shopify Richtext Schema. Modified from https://gist.github.com/edmeehan/b47642f8972e5df3a0e8460aa3a80a87
 *
 * @param {string} htmlString - The HTML string to convert.
 * @param {Object} [options={}] - The conversion options.
 * @returns {Object} The converted Richtext Schema object.
 */
export function convertHtmlToSchema(htmlString, options = {}) {
  const { replaceTags } = options;
  const newString = htmlString.replace('<br />','\n');
  if((replaceTags?.length ?? 0) > 0){
    replaceTags.forEach(([old, new]) => {
      newString = newString.replaceAll(`<${old}>`, `<${new}>`);
      newString = newString.replaceAll(`<${old}/>`, `<${new}/>`);
    });
  }

  const dom = new JSDOM(newString);
  const element = dom.window.document.body;
  
  return convertElementToRichTextSchema(element);
}

/**
 * Converts Shopify Richtext Schema to HTML.
 *
 * @param {Object|string} schema - The schema object or JSON string to convert.
 * @param {Object} [options={}] - The conversion options.
 * @param {string|boolean} [options.scoped] - The scoped class name or a boolean value indicating whether to use the default scoped class name.
 * @returns {string} The converted HTML string.
 */
export function convertSchemaToHtml(schema, options = {}) {
  let { scoped } = options
  let html = ''
  if (typeof schema === 'string' || schema instanceof String) {
    schema = JSON.parse(schema)
  }

  if (typeof options === 'string' || options instanceof String || options === true) {
    scoped = options
  }

  if (schema.type === 'root' && schema.children.length > 0) {
    if (scoped) {
      html += `
      <div class="${scoped === true ? `rte` : scoped}">
        ${convertSchemaToHtml(schema.children, options)}
      </div>
      `
    } else {
      html += convertSchemaToHtml(schema.children, options)
    }
  } else {
    for (const el of schema) {
      switch (el.type) {
        case 'paragraph':
          html += buildParagraph(el, options)
          break
        case 'heading':
          html += buildHeading(el, options)
          break
        case 'list':
          html += buildList(el, options)
          break
        case 'list-item':
          html += buildListItem(el, options)
          break
        case 'link':
          html += buildLink(el, options)
          break
        case 'text':
          html += buildText(el, options)
          break
        default:
          break
      }
    }
  }
  return html
}

function getClass(tag, classes) {
  if (classes && classes[tag]) {
    return classes[tag]
  } else {
    return null
  }
}

function outputAttributes(attributes) {
  if (!attributes && attributes?.class) return ''
  const ATTRIBUTE_SEPARATOR = ' '
  return Object.keys(attributes)
    .map(key => {
      if (attributes[key]) {
        return `${ATTRIBUTE_SEPARATOR}${key}="${attributes[key]}"`
      }
    })
    .join('')
}

function createElement(tag, classes, content, attributes = {}) {
  attributes = { ...attributes, class: getClass(tag, classes) }
  return `<${tag}${outputAttributes(attributes)}>${content}</${tag}>`
}

function buildParagraph(el, options) {
  const { classes } = options
  return createElement('p', classes, convertSchemaToHtml(el?.children, options))
}

function buildHeading(el, options) {
  const { classes } = options
  const tag = `h${el?.level}`
  return createElement(tag, classes, convertSchemaToHtml(el?.children, options))
}

function buildList(el, options) {
  const { classes } = options
  const tag = el?.listType === 'ordered' ? 'ol' : 'ul'
  return createElement(tag, classes, convertSchemaToHtml(el?.children, options))
}

function buildListItem(el, options) {
  const { classes } = options
  return createElement('li', classes, convertSchemaToHtml(el?.children, options))
}

function buildLink(el, options) {
  const { classes } = options
  const attributes = {
    href: el?.url,
    title: el?.title,
    target: el?.target,
  }
  return createElement('a', classes, convertSchemaToHtml(el?.children, options), attributes)
}

function buildText(el, options) {
  const { classes, newLineToBreak } = options
  if (el?.bold && el?.italic) {
    return createElement('strong', classes, createElement('em', classes, el?.value))
  } else if (el?.bold) {
    return createElement('strong', classes, el?.value)
  } else if (el?.italic) {
    return createElement('em', classes, el?.value)
  } else {
    return newLineToBreak ? el?.value?.replace(/\n/g, '<br>') : el?.value
  }
}
