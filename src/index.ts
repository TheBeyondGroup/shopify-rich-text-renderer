// convertSchemaToHtml.js

export interface Schema {
  type: string
  children?: Schema[]
  level?: number
  listType?: 'ordered' | 'unordered'
  url?: string
  title?: string
  target?: string
  bold?: boolean
  italic?: boolean
  value?: string
}

export interface Options {
  scoped?: boolean | string
  classes?: { [key: string]: string }
  newLineToBreak?: boolean
}

export function convertSchemaToHtml(schema: string | Schema | Schema[] | String, options: Options = {}): string {
  let scoped: boolean | string | undefined = typeof options.scoped === 'string' ? options.scoped : undefined
  if (typeof options.scoped === 'string' || typeof options.scoped === 'string') {
    scoped = options.scoped
  }
  let html = ''

  if (typeof schema === 'string' || schema instanceof String) {
    schema = JSON.parse(schema.toString())
  }

  if (typeof options === 'boolean') {
    scoped = options
  }

  if ((schema as Schema).type === 'root' && (schema as Schema).children!.length > 0) {
    if (scoped) {
      html += `
        <div class="${Boolean(scoped) === true || scoped === 'true' ? `rte` : scoped.toString()}">
          ${convertSchemaToHtml((schema as Schema).children!, options)}
        </div>
        `
    } else {
      html += convertSchemaToHtml((schema as Schema).children!, options)
    }
  } else {
    for (const el of schema as Schema[]) {
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

function getClass(tag: string, classes?: { [key: string]: string }): string | null {
  if (classes && classes[tag]) {
    return classes[tag]
  } else {
    return null
  }
}

function outputAttributes(attributes: { [key: string]: string | null | undefined }): string {
  if (!attributes || attributes?.class) return ''
  const ATTRIBUTE_SEPARATOR = ' '
  return Object.keys(attributes)
    .map(key => (attributes[key] ? `${ATTRIBUTE_SEPARATOR}${key}="${attributes[key]}"` : ''))
    .join('')
}

function createElement(
  tag: string,
  classes: { [key: string]: string } | undefined,
  content: string,
  attributes: { [key: string]: string | null | undefined } = {}
): string {
  attributes = { ...attributes, class: getClass(tag, classes), target: attributes.target ?? null }
  return `<${tag}${outputAttributes(attributes)}>${content}</${tag}>`
}

function buildParagraph(el: Schema, options: Options): string {
  const { classes } = options
  return createElement('p', classes, convertSchemaToHtml(el.children!, options))
}

function buildHeading(el: Schema, options: Options): string {
  const { classes } = options
  const tag = `h${el.level}`
  return createElement(tag, classes, convertSchemaToHtml(el.children!, options))
}

function buildList(el: Schema, options: Options): string {
  const { classes } = options
  const tag = el.listType === 'ordered' ? 'ol' : 'ul'
  return createElement(tag, classes, convertSchemaToHtml(el.children!, options))
}

function buildListItem(el: Schema, options: Options): string {
  const { classes } = options
  return createElement('li', classes, convertSchemaToHtml(el.children!, options))
}

function buildLink(el: Schema, options: Options): string {
  const { classes } = options
  const attributes = {
    href: el.url!,
    title: el.title ?? null,
    target: el.target,
  }
  return createElement('a', classes, convertSchemaToHtml(el.children!, options), attributes)
}

function buildText(el: Schema, options: Options): string {
  const { classes, newLineToBreak } = options
  if (el.bold) {
    return createElement('strong', classes, el.value!)
  } else if (el.italic) {
    return createElement('em', classes, el.value!)
  } else {
    return newLineToBreak ? el.value!.replace(/\n/g, '<br>') : el.value!
  }
}
