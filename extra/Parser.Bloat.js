'strict mode'

function text (string) {
  return { tag: 'text', inner: [string] }
}

// List array to nested object
function list (fn, array) {
  const output = { tag: 'ul', inner: [] }
  for (const i in array) {
    let curr = output
    const depth = array[i][0]
      ? array[i][0].replace(/\n|\r/g, '').length : 0
    if (depth !== 0) {
      for (let j = 0; j < depth; j++) {
        // Increase list depth
        if (!curr.inner[curr.inner.length - 1] ||
            curr.inner[curr.inner.length - 1].tag === 'li') {
          curr.inner.push({ tag: 'ul', inner: [] })
        }
        curr = curr.inner[curr.inner.length - 1]
      }
    }
    // Push value into list
    curr.tag = array[i][1] === '*' ? 'ul' : 'ol'
    curr.inner.push({ tag: 'li', inner: [fn(array[i][3])] })
  }
  return output
}

// Markdown rules
const rules = [
  { // Code
    reg: /```([^]+?)```/m,
    fn: function (fn, i) {
      return { tag: 'pre', inner: [text(i[0].trimStart())] }
    }
  },
  { // Headers
    reg: /^(#+) (.*?)$/m,
    fn: function (fn, i) {
      return { tag: 'h' + i[0].length, inner: [fn(i[1])] }
    }
  },
  { // List
    poll: true,
    reg: /^(\s+)?(([0-9]+)\.|\*) (.*?)$/m,
    fn: function (fn, ...i) {
      return list(fn, i)
    }
  },
  { // Paragraphs
    reg: /(.+?)\n/m,
    fn: function (fn, i) {
      return { tag: 'p', inner: [fn(i[0])] }
    }
  },
  { // Links (with Image support)
    reg: /(^|[^!])\[((?:.*!\[.*?\]\(.*?\).*?)?.*?)\]\((.*?)\)/m,
    fn: function (fn, i) {
      return {
        tag: 'text',
        inner: [i[0], { tag: 'a', inner: [fn(i[1])], href: i[2] }]
      }
    }
  },
  { // Images
    reg: /!\[(.*?)\]\((.*?)\)/m,
    fn: function (fn, i) {
      return { tag: 'img', alt: i[0], src: i[1], inner: [] }
    }
  },
  { // Bold
    reg: /\*\*(.*?)\*\*/m,
    fn: function (fn, i) {
      return { tag: 'b', inner: [fn(i[0])] }
    }
  },
  { // Italic
    reg: /\*(.*?)\*/m,
    fn: function (fn, i) {
      return { tag: 'i', inner: [fn(i[0])] }
    }
  }
]

// Recursively splits string into objects
function regSplit (string) {
  const object = text(string)
  for (const j in rules) {
    const { reg, fn, poll } = rules[j]
    if (reg.test(string)) {
      const buffer = []
      let copy = string
      let matches = copy.match(reg)
      const start = matches.index
      do {
        // Push match to buffer
        buffer.push(matches.slice(1))
        // Remove matched part from copy string
        const len = matches.index + matches[0].length
        copy = copy.substr(len)
        matches = copy.match(reg)
      } while (poll && matches && matches.index === 0 &&
              matches[1].split(/\n/).length - 1 <= 1)
      // Recursively split matches
      object.inner = [
        regSplit(string.substr(0, start)),
        fn(regSplit, ...buffer),
        regSplit(copy)
      ]
      break
    }
  }
  return object
}

function Parser (string) {
  return regSplit(string)
}
