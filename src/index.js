export function convertSchemaToHtml(schema, scoped = false) {
  if (typeof schema === 'string' || schema instanceof String) {
    schema = JSON.parse(schema)
  }
  let html = ``
  if (schema.type === 'root' && schema.children.length > 0) {
    if (scoped) {
      html += `
      <div class="${scoped === true ? `rte` : scoped}">
        ${convertSchemaToHtml(schema.children)}
      </div>
      `
    } else {
      html += convertSchemaToHtml(schema.children)
    }
  } else {
    for (const el of schema) {
      switch (el.type) {
        case 'paragraph':
          html += buildParagraph(el)
          break
        case 'heading':
          html += buildHeading(el)
          break
        case 'list':
          html += buildList(el)
          break
        case 'list-item':
          html += buildListItem(el)
          break
        case 'link':
          html += buildLink(el)
          break
        case 'text':
          html += buildText(el)
          break
        default:
          break
      }
    }
  }
  return html
}

export function buildParagraph(el) {
  if (el?.children) {
    return `<p>${convertSchemaToHtml(el?.children)}</p>`
  }
}

export function buildHeading(el) {
  if (el?.children) {
    return `<h${el?.level}>${convertSchemaToHtml(el?.children)}</h${el?.level}>`
  }
}

export function buildList(el) {
  if (el?.children) {
    if (el?.listType === 'ordered') {
      return `<ol>${convertSchemaToHtml(el?.children)}</ol>`
    } else {
      return `<ul>${convertSchemaToHtml(el?.children)}</ul>`
    }
  }
}

export function buildListItem(el) {
  if (el?.children) {
    return `<li>${convertSchemaToHtml(el?.children)}</li>`
  }
}

export function buildLink(el) {
  return `<a href="${el?.url}" title="${el?.title}" target="${
    el?.target
  }">${convertSchemaToHtml(el?.children)}</a>`
}

export function buildText(el) {
  const value = el?.value?.replace(/\n/g, '<br>')
  if (el?.bold) {
    return `<strong>${value}</strong>`
  }
  if (el?.italic) {
    return `<em>${value}</em>`
  }
  return value
}
