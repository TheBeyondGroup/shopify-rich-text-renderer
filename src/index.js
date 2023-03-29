export function richTextToHTML(arr, scoped = false) {
  let html = ``
  if (arr.type === 'root' && arr.children.length > 0) {
    if (scoped) {
      html += `
      <div class="${scoped === true ? `rte` : scoped}">
        ${richTextToHTML(arr.children)}
      </div>
      `
    } else {
      html += richTextToHTML(arr.children)
    }
  } else {
    for (const el of arr) {
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
  if (el.children) {
    return `<p>${richTextToHTML(el?.children)}</p>`
  }
  return `<p>${el?.value}</p>`
}

export function buildHeading(el) {
  if (el.children) {
    return `<h${el.level}>${richTextToHTML(el.children)}</h${el.level}>`
  }
  return `<h${el.level}>${el.value}</h${el.level}>`
}

export function buildList(el) {
  if (el.children) {
    return `<ul>${richTextToHTML(el.children)}</ul>`
  }
  return `<ul>${el.value}</ul>`
}

export function buildListItem(el) {
  if (el.children) {
    return `<li>${richTextToHTML(el.children)}</li>`
  }
  return `<li>${el.value}</li>`
}

export function buildLink(el) {
  return `<a href="${el.url}" title="${el.title}" target="${
    el.target
  }">${richTextToHTML(el.children)}</a>`
}

export function buildText(el) {
  if (el.bold) {
    return `<b>${el.value}</b>`
  }
  if (el.italic) {
    return `<i>${el.value}</i>`
  }
  return el.value
}
