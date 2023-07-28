import * as common from './common.js';
import Element from './element.js';
import ElementView from './view/element.js';
import Molecule from './molecule.js';
import MoleculeView from './view/molecule.js';
import moleculeData from './molecule-data.js';
import Test from './test.js';

/**
 * Search for elements and molecules.
 */
export default class Search {
    /**
     * Add event handlers to the page.
     */
    static addEventHandlers() {
        const searchInput = document.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.addEventListener('input', Search.handleForm);
        }
    }

    /**
     * Add atomic numbers from a molecular formula to an existing array.
     * This modifies the first argument by reference, and returns undefined.
     *
     * @param {Set<integer>} elements - Atomic numbers
     * @param {string} A molecular formula
     */
    static addFormulaElements(elements, formula) {
        const symbols = Object.keys(Molecule.parse(formula));
        for (const symbol of symbols) {
            const protons = Element.findProtons(symbol);
            elements.add(protons);
        }
    }

    /**
     * Count the number of unique words in a bunch of strings.
     *
     * @param {Array<string>} strings - A bunch of strings
     * @returns {Object} Word counts keyed by words
     */
    static countWords(strings) {
        //console.time('Search.countWords()');
        const words = {};
        for (const string of strings) {
            const tokens = string.split(/[-,() ]/);
            for (let token of tokens) {
                token = token.toLowerCase();
                common.countKey(words, token);
            }
        }
        //console.timeEnd('Search.countWords()');
        return words;
    }

    /**
     * Find molecules that match the search query.
     *
     * @param {string} search - The search query
     * @param {string} [symbol=''] - An element symbol
     * @returns {Object} Molecule names keyed by molecular formulas
     */
    static findMolecules(search, symbol = '') {
        if (search.length > 2) {
            return Molecule.findNames(search);
        }

        // Show formulas that contain the element.
        const foundFormulas = Molecule.findElement(symbol);
        const molecules = {};
        for (const formula of foundFormulas) {
            molecules[formula] = moleculeData[formula];
        }
        return molecules;
    }

    /**
     * Test the findMolecules method.
     *
     * @returns {integer} How many tests failed
     */
    static findMoleculesTest() {
        const tests = [
            [[''], {}],
            [[' '], {}],
            [['he'], {}],
            [['', 'He'], {HeLi: ['Lithium helium'], Na2He: ['Disodium helide']}],
            [['he', 'He'], {HeLi: ['Lithium helium'], Na2He: ['Disodium helide']}],
            [['heliu', 'He'], {HeLi: ['Lithium helium']}],
            [['magic'], {HSbF6SO3: ['Magic acid']}],
        ];

        return Test.run(Search.findMolecules, tests);
    }

    /**
     * Find molecular formulas that match the search query.
     *
     * @param {string} search - The search query
     * @param {Object} molecules - Molecule names keyed by molecular formulas
     * @param {Set<integer>} elements - Atomic numbers
     * @returns {Object} Molecule names keyed by molecular formulas
     */
    static findFormulas(search, molecules, elements) {
        search = search.trim();
        if (search.length === 0) {
            return molecules;
        }

        const found = Molecule.findFormulas(search);

        if (found.length === 0) {
            return molecules;
        }

        const upper = search.toUpperCase();
        for (const formula of found) {
            molecules[formula] = moleculeData[formula];
            // Show elements when the formula matches exactly.
            if (formula.toUpperCase() === upper) {
                Search.addFormulaElements(elements, formula);
            }
        }

        const sortedFormulas = Molecule.sortByFirstElement(Object.keys(molecules));
        const sortedMolecules = {};
        for (const formula of sortedFormulas) {
            sortedMolecules[formula] = molecules[formula];
        }

        return sortedMolecules;
    }

    /**
     * Test the findFormulas method.
     *
     * @returns {integer} How many tests failed
     */
    static findFormulasTest() {
        const tests = [
            [['', {}, []], {}],
            [[' ', {}, []], {}],
            [['w3', {}, []], {Nd2W3O12: ['Neodymium tungstate']}],
            [['y3', {}, []], {Y3Al5O12: ['Yttrium aluminum garnet']}],
        ];

        return Test.run(Search.findFormulas, tests);
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
        html += Search.renderForm(search);
        html += '<section id="search-results">';
        html += Search.renderResults(search);
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
     * Process a search query, and return the results.
     *
     * @param {string} search - The search query
     * @param {string} [time=false] - Whether to log execution time
     * @returns {Object} The elements and molecules matching the query
     */
    static process(search, time = false) {
        if (time) {
            console.time(`Search.process("${search}")`);
        }
        const elements = Element.find(search);
        const protons = elements.values().next().value;
        const symbol = Element.findSymbol(protons);
        let molecules = Search.findMolecules(search, symbol);

        if (search.length > 1) {
            molecules = Search.findFormulas(search, molecules, elements);
        }

        const formulas = Object.keys(molecules);
        if (elements.size === 0 && formulas.length > 0) {
            const commonElements = Molecule.findCommonElements(formulas);
            for (const protons of commonElements) {
                elements.add(protons);
            }
        }

        if (time) {
            console.timeEnd(`Search.process("${search}")`);
        }
        return {
            elements: elements,
            molecules: molecules,
        };
    }

    /**
     * Test the process method.
     *
     * @returns {integer} How many tests failed
     */
    static processTest() {
        const tests = [
            [[''], {elements: new Set(), molecules: {}}],
            [[' '], {elements: new Set(), molecules: {}}],
            [['he'], {elements: new Set([2]), molecules: {HeLi: ['Lithium helium'], Na2He: ['Disodium helide']}}],
            [['w3'], {elements: new Set([8, 60, 74]), molecules: {Nd2W3O12: ['Neodymium tungstate']}}],
            [['magic'], {elements: new Set([1, 8, 9, 16, 51]), molecules: {HSbF6SO3: ['Magic acid']}}],
        ];

        return Test.run(Search.process, tests);
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
     * Handle input events in the search box.
     *
     * @param {Object} event - A browser event
     */
    static handleForm(event) {
        const search = event.target.value;
        document.getElementById('search-results').innerHTML = Search.renderResults(search);
        const url = new URL(location);
        url.searchParams.set('search', search);
        history.replaceState({}, '', url);
    }

    /**
     * Create the HTML for a word cloud.
     *
     * @returns {string} HTML: a paragraph block
     */
    static renderWords(words) {
        //console.time('Search.renderWords()');
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

        //console.timeEnd('Search.renderWords()');
        return html;
    }
}
