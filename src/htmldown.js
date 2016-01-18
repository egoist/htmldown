import cheerio from 'cheerio'
import tags from './tags.json'
import defaultEscapeTags from './defaultEscapeTags.json'

/**
 * Regex - Test if is html heading 1 to 5
 */
const isHeading = /^h(\d)$/

/**
 * Replace html heading with markdown heading
 */
function parseHeading(el, tag) {
	const content = el.html()
	el.replaceWith(`${'#'.repeat(tag)} ${content}`)
}

/**
 * Make sure text is a block instead of a inline element
 */
function ensureBlock(text) {
	return `\n\n${text}\n\n`
}

/**
 * Wrap text with chars
 */
function wrapWith(text, char, endChar) {
	return char + text + (endChar || char)
}

/**
 * Default function to define how to extract code language from code block
 */
function defaultGetLanguage(className) {
	const re = /[\w]+\-([\w]+)/
	if (re.test(className)) {
		return re.exec(className)[1]
	}
	return null
}

/**
 * Minify html
 */
function minify(html) {
	return html.replace(/[\t\n\r]+/g, '')
}

export default function htmldown(html, {
	escapeTags = [],
	getLanguage = defaultGetLanguage
} = {}) {
	const $ = cheerio.load(minify(html), {
		decodeEntities: false
	})

	class Parser {
		constructor($) {
			this.$ = $
		}

		a(el, content) {
			const href = el.attr('href')
			el.replaceWith(
				`[${content}](${href})`
			)
		}

		img(el) {
			const src = el.attr('src')
			const alt = el.attr('alt')
			el.replaceWith(
				`![${alt}](${src})`
			)
		}

		b(el, content) {
			el.replaceWith(
				wrapWith(content, '**')
			)
		}

		p(el, content) {
			el.replaceWith(
				ensureBlock(content)
			)
		}

		hr(el) {
			el.replaceWith(
				ensureBlock('---')
			)
		}

		br(el) {
			el.replaceWith('\n')
		}

		ul(el, content, tag) {
			const $ = this.$
			el.find('li').each(function (index) {
				const li = $(this)
				const liContent = li.html()
				li.replaceWith(
					`${tag === 'ul' ? '-' : `${index + 1}.`} ${liContent}\n`
				)
			})
			// Refetch html
			const listContent = el.html()
			el.replaceWith(
				ensureBlock(listContent)
			)
		}

		em(el, content) {
			el.replaceWith(`*${content}*`)
		}

		blockquote(el, content) {
			el.replaceWith(
				ensureBlock(`> ${content.trim()}`)
			)
		}

		pre(el) {
			const preSep = '```'
			const code = el.find('code')
			const lang = getLanguage(code.attr('class'))
			const preContent = code.text().trim()
			el.replaceWith(
				wrapWith(
					wrapWith(preContent, '\n'),
					lang ? preSep + lang : preSep,
					preSep
				)
			)
		}

		code(el) {
			const codeSep = '`'
			const codeContent = el.text()
			el.replaceWith(
				wrapWith(codeContent, codeSep)
			)
		}

		h1(el, content, tag) {
			parseHeading(el, isHeading.exec(tag)[1])
		}
	}

	/**
	 * Initial an instance of the parser
	 */
	const parser = new Parser($)

	/**
	 * Alias tags
	 */
	parser.ol = parser.ul
	parser.h2 = parser.h3 = parser.h4 = parser.h5 = parser.h1

	/**
	 * Parse html
	 */
	tags.forEach(tag => {
		$(tag).each(function () {
			const el = $(this)
			const content = el.html()

			/**
			 * Apply solution to available tags
			 */
			parser[tag](el, content, tag)
		})
	})

	/**
	 * Escape other html tags
	 */
	const shouldEscapeTags = [
		defaultEscapeTags,
		...escapeTags
	]

	shouldEscapeTags.forEach(tag => {
		$(tag).each(function () {
			const el = $(this)
			const content = el.html()
			el.replaceWith(content)
		})
	})

	let text = $.root().html()

	/**
	 * Compress 3 or more \n to 2
	 */
	text = text.replace(/([\r?\n]){3,}/g, '\n\n')

	/**
	 * Return text
	 */
	return text
}
