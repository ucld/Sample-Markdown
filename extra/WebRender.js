// HTML DOM Rendering
function render (target, object) {
  if (object.tag === 'text') {
    for (const i in object.inner) {
      if (typeof object.inner[i] === 'string') {
        target.appendChild(document.createTextNode(object.inner[i]))
      } else {
        render(target, object.inner[i])
      }
    }
  } else {
    const node = document.createElement(object.tag)
    // Apply attributes
    for (const i in object) {
      if (!['inner', 'tag'].includes(i)) {
        node.setAttribute(i, object[i])
      }
    }
    for (const i in object.inner) {
      render(node, object.inner[i])
    }
    target.appendChild(node)
  }
}

window.onload = function () {
  const md = document.querySelector('#markdown')
  md.innerHTML = 'Loading README.md...'
  const input = document.querySelector('#input')
  fetch('README.md')
    .then(function (response) { return response.text() })
    .then(function (text) {
      md.innerHTML = ''
      render(md, Parser(text))
      if (input) {
        input.value = text
        input.onkeyup = function () {
          document.querySelector('#markdown').innerHTML = ''
          render(document.querySelector('#markdown'), Parser(input.value))
        }
      }
    })
}
