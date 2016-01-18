# htmldown [![Build Status](https://travis-ci.org/egoist/htmldown.svg?branch=master)](https://travis-ci.org/egoist/htmldown)

> Convert HTML to Markdown-format text

## Install

```
$ npm install --save htmldown
```

## Usage

```js
const htmldown = require('htmldown')

htmldown('unicorns')
```

## API

### htmldown(input, [options])

#### input

Type: `string`

HTML string

#### options

**escapeTags**

Type: `Array`

Add more tags to escape. eg: `<span>foo</span>` => `foo`

**getLanguage**

Type: `Function`

Define a function to tell it how to extract code block language from a className.

## License

MIT © [](https://github.com/egoist)
