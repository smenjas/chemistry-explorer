/**
 * Create hyperlinks.
 */
export default class Link {
    /**
     * Create a hyperlink.
     *
     * @param {string} url - The URL target
     * @param {string} content - The link text (or other HTML content) to click
     * @param {boolean} [newTab=false] - Whether to open the link in a new tab
     * @returns {string} HTML: an anchor tag
     */
    static create(url, content, newTab = false) {
        const target = (newTab) ? ' target="_blank"' : '';
        return `<a href="${url}"${target}>${content}</a>`;
    }

    /**
     * Create a hyperlink to Wikipedia.
     *
     * @param {string} path - The Wikipedia page (or section) target
     * @param {string} content - The link text (or other HTML content) to click
     * @returns {string} HTML: an anchor tag
     */
    static toWikipedia(path, content) {
        path = path.replaceAll(' ', '_');
        path = encodeURIComponent(path);
        path = path.replace('%23', '#'); // Allow fragments.
        const wikiURL = 'https://en.wikipedia.org/wiki/';
        const url = `${wikiURL}${path}`;
        return Link.create(url, content, true);
    }
}
