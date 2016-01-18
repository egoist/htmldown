import cheerio from 'cheerio'
import {minify} from 'html-minifier'
import tags from './tags.json'
import defaultEscapeTags from './defaultEscapeTags.json'

/**
 * Regex - Test if is html heading 1 to 5
 */
const isHeading = /^h(\d)$/

/**
 * Replace html heading with markdown heading
 */
function parseHeading(tag, el) {
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

export default function htmldown(html, {
	escapeTags = [],
	getLanguage = defaultGetLanguage
} = {}) {
	const $ = cheerio.load(minify(html, {
		collapseWhitespace: true
	}), {
		decodeEntities: false
	})

	tags.forEach(tag => {
		$(tag).each(function () {
			const el = $(this)
			const content = el.html()

			const solutions = {
				a() {
					const href = el.attr('href')
					el.replaceWith(
						`[${content}](${href})`
					)
				},
				img() {
					const src = el.attr('src')
					const alt = el.attr('alt')
					el.replaceWith(
						`![${alt}](${src})`
					)
				},
				b() {
					el.replaceWith(
						wrapWith(content, '**')
					)
				},
				p() {
					el.replaceWith(
						ensureBlock(content)
					)
				},
				hr() {
					el.replaceWith(
						ensureBlock('---')
					)
				},
				br() {
					el.replaceWith('\n')
				},
				ul() {
					el.find('li').each(function () {
						const li = $(this)
						const liContent = li.html()
						li.replaceWith(
							`${tag === 'ul' ? '-' : `${index + 1}.`} ${liContent} \n`
						)
					})
					// Refetch html
					const listContent = el.html()
					el.replaceWith(
						ensureBlock(listContent)
					)
				},
				i() {
					el.replaceWith(`*${content}*`)
				},
				blockquote() {
					el.replaceWith(
						ensureBlock(`> ${content.trim()}`)
					)
				},
				pre() {
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
				},
				code() {
					const codeSep = '`'
					const codeContent = el.text()
					el.replaceWith(
						wrapWith(codeContent, codeSep)
					)
				},
				h1() {
					parseHeading(isHeading.exec(tag)[1], el)
				}
			}

			/**
			 * Alias tags
			 */
			solutions.ol = solutions.ul
			solutions.h2 = solutions.h3 = solutions.h4 = solutions.h5 = solutions.h1

			/**
			 * Apply solution to available tags
			 */
			solutions[tag]()
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
	text = text.replace(/\n{3,}/g, '\n\n')

	/**
	 * Return text
	 */
	return text
}
