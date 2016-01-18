require('babel-core/register')({
	presets: ['es2015']
})
const htmldown = require('./src/htmldown').default
import test from 'ava'

test('a', t => {
	const text = htmldown('<a href="http://google.com"></a><a href="http://google.com">wow</a>')
	t.same(text, '[](http://google.com)[wow](http://google.com)')
})

test('b', t => {
	const text = htmldown('<b>foo</b>')
	t.same(text, '**foo**')
})

test('hr', t => {
	const text = htmldown('foo<hr>bar')
	t.same(text, 'foo\n\n---\n\nbar')
})
