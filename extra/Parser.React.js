// React
import React, { Fragment } from 'react'

let key = 0

// List array into nested JSX object
function list (fn, array) {
  let ordered = array[0] && array[0][1] && array[0][1] !== '*'
  const output = ordered
    ? <ol key={ 'md_' + (key++) }>{[]}</ol>
    : <ul key={ 'md_' + (key++) }>{[]}</ul>
  for (const i in array) {
    let curr = output
    const depth = array[i][0]
      ? array[i][0].replace(/\n|\r/g, '').length : 0
    if (depth !== 0) {
      for (let j = 0; j < depth; j++) {
        // Increase list depth
        if (!curr.props.children[curr.props.children.length - 1] ||
            curr.props.children[curr.props.children.length - 1].type === 'li') {
          curr.props.children.push(ordered
            ? <ol key={ 'md_' + (key++) }>{[]}</ol>
            : <ul key={ 'md_' + (key++) }>{[]}</ul>
          )
        }
        curr = curr.props.children[curr.props.children.length - 1]
      }
    }
    // Push value into list
    ordered = array[i][1] !== '*'
    curr.props.children.push(
      <li key={ 'md_' + (key++) }>
        {fn(array[i][3])}
      </li>
    )
  }
  return output
}

// Markdown rules
const rules = [
  { // Headers
    reg: /^(#+) (.*?)$/m,
    fn: function Header (fn, i) {
      switch (i[0].length) {
        case 1:
          return <h1 key={ 'md_' + (key++) }>{fn(i[1])}</h1>
        case 2:
          return <h2 key={ 'md_' + (key++) }>{fn(i[1])}</h2>
        case 3:
          return <h3 key={ 'md_' + (key++) }>{fn(i[1])}</h3>
        case 4: default:
          return <h4 key={ 'md_' + (key++) }>{fn(i[1])}</h4>
      }
    }
  },
  { // List
    poll: true,
    reg: /^(\s+)?(([0-9]+)\.|\*) (.*?)$/m,
    fn: function List (fn, ...i) {
      return list(fn, i)
    }
  },
  { // Paragraphs
    reg: /(.+?)\n/m,
    fn: function Paragraphs (fn, i) {
      return <p key={ 'md_' + (key++) }>{ fn(i[0]) }</p>
    }
  },
  { // Links
    reg: /\[(.*?)\]\((.*?)\)/m,
    fn: function Links (fn, i) {
      return <a href={ i[1] } key={ 'md_' + (key++) }>{ fn(i[0]) }</a>
    }
  },
  { // Bold
    reg: /\*\*(.*?)\*\*/m,
    fn: function Bold (fn, i) {
      return <b key={ 'md_' + (key++) }>{ fn(i[0]) }</b>
    }
  },
  { // Italic
    reg: /\*(.*?)\*/m,
    fn: function Italics (fn, i) {
      return <i key={ 'md_' + (key++) }>{ fn(i[0]) }</i>
    }
  }
]

// Recursively splits string into objects
function regSplit (string) {
  const object = (
    <Fragment key={ 'md_' + (key++) }>
      {[string]}
    </Fragment>
  )
  for (const j in rules) {
    // Test string against rule
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
      object.props.children[0] = [
        regSplit(string.substr(0, start)),
        fn(regSplit, ...buffer),
        regSplit(copy)
      ]
      break
    }
  }
  return object
}

function Parser (props) {
  return regSplit(props.input)
}

export default Parser
