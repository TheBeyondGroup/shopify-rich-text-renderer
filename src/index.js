export function convertSchemaToHtml(schema, options = null) {
  const { scoped, classes } = options ?? {}
  let html = ''

  if (typeof schema === 'string' || schema instanceof String) {
    schema = JSON.parse(schema)
  }

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
          html += buildText(el, classes)
          break
        default:
          break
      }
    }
  }
  return html
}

export function buildParagraph(el, classes) {
  if (el?.children && classes?.p) {
    return `<p class="${classes.p}">${convertSchemaToHtml(el?.children)}</p>`
  } else if (el?.children) {
    return `<p>${convertSchemaToHtml(el?.children)}</p>`
  }
}

export function buildHeading(el, classes) {
  const key = `h${el?.level}`
  if (el?.children && classes && classes[key]) {
    return `<h${el?.level} class="${classes[key]}">
      ${convertSchemaToHtml(el?.children)}
    </h${el?.level}>`
  } else if (el?.children) {
    return `<h${el?.level}>
      ${convertSchemaToHtml(el?.children)}
    </h${el?.level}>`
  }
}

export function buildList(el, classes) {
  if (el?.children) {
    if (el?.listType === 'ordered') {
      if (classes?.ol) {
        return `<ol class="${classes.ol}">
         ${convertSchemaToHtml(el?.children)}
        </ol>`
      } else {
        return `<ol>${convertSchemaToHtml(el?.children)}</ol>`
      }
    } else {
      if (classes?.ul) {
        return `<ul class="${classes.ul}">${convertSchemaToHtml(
          el?.children
        )}</ul>`
      } else {
        return `<ul>${convertSchemaToHtml(el?.children)}</ul>`
      }
    }
  }
}

export function buildListItem(el, classes) {
  if (el?.children && classes?.li) {
    return `<li class="${classes.li}">${convertSchemaToHtml(el?.children)}</li>`
  } else if (el?.children) {
    return `<li>${convertSchemaToHtml(el?.children)}</li>`
  }
}

export function buildLink(el, classes) {
  if (classes?.a) {
    return `
    <a href="${el?.url}" 
       class="${classes.a}" 
       title="${el?.title}" 
       target="${el?.target}">
       ${convertSchemaToHtml(el?.children)}
    </a>`
  } else {
    return `
    <a href="${el?.url}" 
       title="${el?.title}" 
       target="${el?.target}">
       ${convertSchemaToHtml(el?.children)}
    </a>`
  }
}

export function buildText(el, classes) {
  if (el?.bold) {
    if (classes?.bold) {
      return `<strong  class="${classes?.bold}">${el?.value}</strong>`
    } else {
      return `<strong>${el?.value}</strong>`
    }
  }
  if (el?.italic) {
    if (classes?.italic) {
      return `<em class="${classes.italic}">${el?.value}</em>`
    } else {
      return `<em>${el?.value}</em>`
    }
  }
  return el?.value
}
