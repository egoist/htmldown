require('babel-core/register')({
	presets: ['es2015']
})
const htmldown = require('./src/htmldown').default
import test from 'ava'

test('main', t => {
	const html = `<h1 class="asd">123</h1>
<br>
<h1 class="aesd">443</h1>
<p>
<ul>
	<li>a</li>
	<li>b</li>
</ul>
wer<br><b>sdfs</b><br>
fsdf<span>pan</span>
</p>`
	console.log(htmldown(html))
	t.pass()
})
