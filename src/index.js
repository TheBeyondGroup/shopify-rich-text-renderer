export function convertSchemaToHtml(schema, options = null) {
  const { scoped, classes, newLineToBreak } = options ?? {}
  let html = ''
  if (typeof schema === 'string' || schema instanceof String) {
    schema = JSON.parse(schema)
  }

  if (schema.type === 'root' && schema.children.length > 0) {
    if (scoped) {
      html += `
      <div class="${scoped === true ? `rte` : scoped}">
        ${(convertSchemaToHtml(schema.children), options)}
      </div>
      `
    } else {
      html += convertSchemaToHtml(schema.children, options)
    }
  } else {
    for (const el of schema) {
      switch (el.type) {
        case 'paragraph':
          html += buildParagraph(el, classes)
          break
        case 'heading':
          html += buildHeading(el, classes)
          break
        case 'list':
          html += buildList(el, classes)
          break
        case 'list-item':
          html += buildListItem(el, classes)
          break
        case 'link':
          html += buildLink(el, classes)
          break
        case 'text':
          html += buildText(el, classes, newLineToBreak)
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
  return Object.keys(attributes)
    .map(key => {
      if (attributes[key]) {
        return ` ${key}="${attributes[key]}"`
      }
    })
    .join('')
}

function createElement(tag, classes, content, attributes = {}) {
  attributes = { ...attributes, class: getClass(tag, classes) }
  return `<${tag}${outputAttributes(attributes)}>${content}</${tag}>`
}

export function buildParagraph(el, classes) {
  return createElement('p', classes, convertSchemaToHtml(el?.children, { classes }))
}

export function buildHeading(el, classes) {
  const tag = `h${el?.level}`
  return createElement(tag, classes, convertSchemaToHtml(el?.children, { classes }))
}

export function buildList(el, classes) {
  const tag = el?.listType === 'ordered' ? 'ol' : 'ul'
  return createElement(tag, classes, convertSchemaToHtml(el?.children, { classes }))
}

export function buildListItem(el, classes) {
  return createElement('li', classes, convertSchemaToHtml(el?.children, { classes }))
}

export function buildLink(el, classes) {
  const attributes = {
    href: el?.url,
    title: el?.title,
    target: el?.target,
  }
  return createElement('a', classes, convertSchemaToHtml(el?.children, { classes }), attributes)
}

export function buildText(el, classes, newLineToBreak) {
  if (el?.bold) {
    return createElement('strong', classes, el?.value)
  } else if (el?.italic) {
    return createElement('em', classes, el?.value)
  } else {
    return newLineToBreak ? el?.value?.replace(/\n/g, '<br/>') : el?.value
  }
}
