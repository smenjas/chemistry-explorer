import ElementView from '../view/element.js';
import MoleculeView from '../view/molecule.js';
import Search from '../search.js';

/**
 * Search for elements and molecules.
 */
export default class SearchView {
    /**
     * Add event handlers to the page.
     */
    static addEventHandlers() {
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', SearchView.handleForm);
        }
    }

    /**
     * Handle input events in the search box.
     *
     * @param {Object} event - A browser event
     */
    static handleForm(event) {
        const search = event.target.value;
        document.getElementById('search-results').innerHTML = SearchView.renderResults(search);
        const url = new URL(location);
        url.searchParams.set('search', search);
        history.replaceState({}, '', url);
    }

    /**
     * Create the HTML for the search page.
     *
     * @param {string} search - The search query
     * @returns {string} HTML: a search page
     */
    static render(search) {
        document.title = 'Chemistry Search';
        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += SearchView.renderForm(search);
        html += '<section id="search-results">';
        html += SearchView.renderResults(search);
        html += '</section>';
        html += '</main>';
        return html;
    }

    /**
     * Create the HTML for the search form.
     *
     * @param {string} search - The search query
     * @returns {string} HTML: a form
     */
    static renderForm(search) {
        let html = '<form id="search">';
        html += `<input name="search" type="text" size="50" value="${search}">`;
        html += '</form>';
        return html;
    }

    /**
     * Create the HTML for the search results.
     *
     * @param {string} search - The search query
     * @returns {string} HTML: search results
     */
    static renderResults(search) {
        search = search.trim();

        // Show a word cloud by default.
        if (search.length < 1) {
            return MoleculeView.renderWords();
        }

        const { elements, molecules } = Search.process(search, true);
        const formulas = Object.keys(molecules);

        if (elements.size === 0 && formulas.length === 0) {
            if (search.length < 3) {
                return '<p>Try a different search.</p>';
            }
            else {
                return '<p>No matches found.</p>';
            }
        }

        let html = '';
        const elementResults = `${elements.size} Element${(elements.size === 1) ? '' : 's'}`;
        html += `<h2>${elementResults}</h2>`;
        html += '<section class="elements">';
        for (const protons of elements) {
            html += ElementView.formatElement(protons, true);
        }
        html += '</section>';

        let moleculesCount = 0;
        for (const formula in molecules) {
            moleculesCount += molecules[formula].length;
        }

        const formulaResults = `${formulas.length} Formula${(formulas.length === 1) ? '' : 's'}`;
        const moleculeResults = `${moleculesCount} Molecule${(moleculesCount === 1) ? '' : 's'}`;
        html += `<h2>${formulaResults}, ${moleculeResults}</h2>`;
        html += '<ul>';
        for (const formula in molecules) {
            const moleculeNames = molecules[formula].join(', ');
            const linkText = `${MoleculeView.format(formula)}: ${moleculeNames}`;
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }

    /**
     * Create the HTML for a word cloud.
     *
     * @returns {string} HTML: a paragraph block
     */
    static renderWords(words) {
        //console.time('SearchView.renderWords()');
        const sortedWords = Object.keys(words).sort();
        const counts = Object.values(words);
        const countMax = Math.max(...counts);
        const countMin = Math.min(...counts);
        const countRange = countMax - countMin;
        const sizeMax = 500;
        const sizeMin = 85;
        const sizeRange = sizeMax - sizeMin;

        let html = '<p>';
        for (const word of sortedWords) {
            const position = (words[word] - countMin) / countRange;
            const size = Math.ceil((position * sizeRange) + sizeMin);
            html += `<a href="?search=${word}" style="font-size: ${size}%">${word}</a> `;
        }
        html += '</p>';

        //console.timeEnd('SearchView.renderWords()');
        return html;
    }
}
