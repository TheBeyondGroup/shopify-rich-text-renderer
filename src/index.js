/* Shopify Metafield & Metaobject Rich Text Editor Schema to HTML Converter */

const ELEMENT_TO_RICH_TEXT_CONVERTORS = {
  'body': (element) => {
    return { type: 'root' };
  },
  'h1': (element) => {
    return { type: 'heading', level: 1 };
  },
  'h2':  (element) => {
    return { type: 'heading', level: 2 };
  },
  'h3':  (element) => {
    return { type: 'heading', level: 3 };
  },
  'h4':  (element) => {
    return { type: 'heading', level: 4 };
  },
  'h5':  (element) => {
    return { type: 'heading', level: 5 };
  },
  'p':  (element) => {
    return { type: 'paragraph' };
  },
  'a':  (element) => {
    return {
      type: 'link',
      url: element.attributes.getNamedItem('href')?.value ?? undefined,
      title: element.attributes.getNamedItem('title')?.value ?? undefined,
    };
  },
  'ol':  (element) => {
    return { type: 'list', listType: 'ordered' };
  },
  'ul':  (element) => {
    return { type: 'list', listType: 'unordered' };
  },
  'li':  (element) => {
    return { type: 'list-item' };
  },
  'b':  (element) => {
    return { type: 'paragraph' };
  },
  'strong':  (element) => {
    return { type: 'paragraph' };
  },
  'em':  (element) => {
    return { type: 'paragraph' };
  },
  'other':  (element) => {
    return null;
  },
};

function singleNodeToRichTextObject(node) {
  const parentNode = node.parentNode;
  const isBoldText = parentNode?.nodeType === node.ELEMENT_NODE && 
    parentNode?.tagName === 'strong';
  const isItalicText = parentNode?.nodeType === node.ELEMENT_NODE && 
    parentNode?.tagName === 'em';
  switch(node.nodeType){
    case node.ELEMENT_NODE:
      const element = node;
      const convertor = ELEMENT_TO_RICH_TEXT_CONVERTORS[element.tagName] ?? ELEMENT_TO_RICH_TEXT_CONVERTORS.other;
      return convertor(element);
    case node.TEXT_NODE:
      return {
        type: 'text',
        value: node.textContent,
        bold: isBoldText,
        italic: isItalicText,
      };
    default:
      return null;
  }
}

function convertElementToRichTextSchema(element) {
  const richText = singleNodeToRichTextObject(element);
  if(!richText){
    return null;
  }

  if(element.childNodes.length > 0){
    richText.children = [];

    for(let child of element.childNodes){
      const childRichText = singleNodeToRichTextObject(child);
      if(!childRichText){
        continue;
      }
      richText.children.push(childRichText);
    }
  }

  return richText;
}

/**
 * Converts HTML to Shopify Richtext Schema. Modified from https://gist.github.com/edmeehan/b47642f8972e5df3a0e8460aa3a80a87
 *
 * @param {string} htmlString - The HTML string to convert.
 * @param {Object} [options={}] - The conversion options.
 * @returns {Object} The converted Richtext Schema object.
 */
export function convertHtmlToSchema(htmlString, options = { replaceTags: [], removeLineBreaks: true }) {
  const { replaceTags, removeLineBreaks } = options;
  let newString = htmlString;
  if(removeLinkBreaks){
    newString = newString.replaceAll('<br />','\n');
  }
  if(replaceTags.length > 0){
    replaceTags.forEach(([oldTag, newTag]) => {
      newString = newString.replaceAll(`<${oldTag}>`, `<${newTag}>`);
      newString = newString.replaceAll(`<${oldTag}/>`, `<${newTag}/>`);
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
