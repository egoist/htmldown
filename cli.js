#!/usr/bin/env node
'use strict'
const fs = require('fs')
const htmldown = require('./')

const file = process.argv[2]

if (!file) {
	console.log('No input file.')
	process.exit()
}

let data = fs.readFileSync(file, 'utf8')
data = htmldown(data)
console.log(data)
