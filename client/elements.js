import * as common from './common.js';
import elementsData from './elementsData.js';
import isotopesData from './isotopesData.js';
import Link from './link.js';
import Molecules from './molecules.js';
import Test from './test.js';

/**
 * Show information about atomic elements.
 *
 * @property {Map} groups - Element groups: columns on the periodic table
 * @property {Map} groupElements - Which elements belong to each group
 * @property {Map} groupURLs - Wikipedia URLs for each group
 * @property {Map} periods - Element periods: rows on the periodic table
 * @property {Object} symbols - Atomic numbers keyed by element symbols
 * @property {Object} typeURLs - Wikipedia URLs for each element type
 */
export default class Elements {
    /**
     * Add event handlers to the page.
     */
    static addEventHandlers() {
        const abundanceScale = document.querySelector('form#abundance-scale');
        if (abundanceScale) {
            abundanceScale.addEventListener('change', Elements.handleAbundanceScale);
        }
    }

    // The key is the group number.
    // The value is the former group designation.
    static groups = new Map([
        [1, 'IA'],
        [2, 'IIA'],
        [3, 'IIIB'],
        [4, 'IVB'],
        [5, 'VB'],
        [6, 'VIB'],
        [7, 'VIIB'],
        [8, 'VIIIB'],
        [9, 'VIIIB'],
        [10, 'VIIIB'],
        [11, 'IB'],
        [12, 'IIB'],
        [13, 'IIIA'],
        [14, 'IVA'],
        [15, 'VA'],
        [16, 'VIA'],
        [17, 'VIIA'],
        [18, 'VIIIA'],
    ]);

    static groupElements = new Map([
        [1, [1, 3, 11, 19, 37, 55, 87]],
        [2, [4, 12, 20, 38, 56, 88]],
        [3, [21, 39, 71, 103]],
        [4, [22, 40, 72, 104]],
        [5, [23, 41, 73, 105]],
        [6, [24, 42, 74, 106]],
        [7, [25, 43, 75, 107]],
        [8, [26, 44, 76, 108]],
        [9, [27, 45, 77, 109]],
        [10, [28, 46, 78, 110]],
        [11, [29, 47, 79, 111]],
        [12, [30, 48, 80, 112]],
        [13, [5, 13, 31, 49, 81, 113]],
        [14, [6, 14, 32, 50, 82, 114]],
        [15, [7, 15, 33, 51, 83, 115]],
        [16, [8, 16, 34, 52, 84, 116]],
        [17, [9, 17, 35, 53, 85, 117]],
        [18, [2, 10, 18, 36, 54, 86, 118]],
    ]);

    static groupURLs = new Map([
        [1, 'https://en.wikipedia.org/wiki/Group_1_element'],
        [2, 'https://en.wikipedia.org/wiki/Alkaline_earth_metal'],
        [3, 'https://en.wikipedia.org/wiki/Group_3_element'],
        [4, 'https://en.wikipedia.org/wiki/Group_4_element'],
        [5, 'https://en.wikipedia.org/wiki/Group_5_element'],
        [6, 'https://en.wikipedia.org/wiki/Group_6_element'],
        [7, 'https://en.wikipedia.org/wiki/Group_7_element'],
        [8, 'https://en.wikipedia.org/wiki/Group_8_element'],
        [9, 'https://en.wikipedia.org/wiki/Group_9_element'],
        [10, 'https://en.wikipedia.org/wiki/Group_10_element'],
        [11, 'https://en.wikipedia.org/wiki/Group_11_element'],
        [12, 'https://en.wikipedia.org/wiki/Group_12_element'],
        [13, 'https://en.wikipedia.org/wiki/Boron_group'],
        [14, 'https://en.wikipedia.org/wiki/Carbon_group'],
        [15, 'https://en.wikipedia.org/wiki/Pnictogen'],
        [16, 'https://en.wikipedia.org/wiki/Chalcogen'],
        [17, 'https://en.wikipedia.org/wiki/Halogen'],
        [18, 'https://en.wikipedia.org/wiki/Noble_gas'],
    ]);

    static periods = new Map([
        [1, { min: 1, max: 2 }],
        [2, { min: 3, max: 10 }],
        [3, { min: 11, max: 18 }],
        [4, { min: 19, max: 36 }],
        [5, { min: 37, max: 54 }],
        [6, { min: 55, max: 86 }],
        [7, { min: 87, max: 118 }],
        ['lanthanides', { min: 57, max: 70 }],
        ['actinides', { min: 89, max: 102 }],
    ]);

    static symbols = Elements.#getSymbols();

    /**
     * Get element symbols.
     * @private
     */
    static #getSymbols() {
        const symbols = {};
        for (const [protons, element] of elementsData) {
            symbols[element.symbol] = protons;
        }
        return symbols;
    }

    static typeURLs = {
        'Actinide': 'https://en.wikipedia.org/wiki/Actinide',
        'Alkali Metal': 'https://en.wikipedia.org/wiki/Alkali_metal',
        'Alkaline Earth Metal': 'https://en.wikipedia.org/wiki/Alkaline_earth_metal',
        'Halogen Nonmetal': 'https://en.wikipedia.org/wiki/Halogen',
        'Lanthanide': 'https://en.wikipedia.org/wiki/Lanthanide',
        'Metalloid': 'https://en.wikipedia.org/wiki/Metalloid',
        'Noble Gas': 'https://en.wikipedia.org/wiki/Noble_gas',
        'Other Nonmetal': 'https://en.wikipedia.org/wiki/Nonmetal#Unclassified_nonmetal',
        'Post Transition Metal': 'https://en.wikipedia.org/wiki/Post_transition_metal',
        'Transition Metal': 'https://en.wikipedia.org/wiki/Transition_metal',
    };

    /**
     * Compare two element symbols.
     *
     * @param {string} symbolA - An element symbol
     * @param {string} symbolB - An element symbol
     *
     * @returns {integer} A number indicating how the given elements should be sorted:
     * - negative if symbolA should come before symbolB
     * - positive if symbolA should come after symbolB
     * - zero if the elements are equivalent
     */
    static compare(symbolA, symbolB) {
        const a = Elements.findProtons(symbolA);
        const b = Elements.findProtons(symbolB);
        return a - b;
    }

    /**
     * Convert an array of atomic numbers to element symbols.
     *
     * @param {Array<integer>} elements - Atomic numbers
     * @returns {Array<string>} Element symbols
     */
    static convertProtons(elements) {
        const symbols = [];
        for (const protons of elements) {
            symbols.push(elementsData.get(protons).symbol);
        }
        return symbols;
    }

    /**
     * Find elements by symbol or by name.
     * @todo Add tests.
     *
     * @param {string} search - The search query
     * @returns {Set<integer>} Atomic numbers of matching elements
     */
    static find(search) {
        search = search.trim();
        const elements = new Set();
        if (search.length === 0) {
            return elements;
        }

        const upper = search.toUpperCase();

        if (search.length < 3) {
            // Search for elements by symbol.
            for (const [protons, element] of elementsData) {
                const symbol = element.symbol.toUpperCase();
                if (upper === symbol) {
                    elements.add(protons);
                }
            }
            return elements;
        }

        // Search for elements by name.
        for (const [protons, element] of elementsData) {
            const name = element.name.toUpperCase();
            if (name.includes(upper)) {
                elements.add(protons);
            }
        }

        return elements;
    }

    /**
     * Test the find method.
     *
     * @returns {integer} How many tests failed
     */
    static findTest(){
        const tests = [
            [[''], new Set([])],
            [[' '], new Set([])],
            [['x'], new Set([])],
            [['h'], new Set([1])],
            [['he'], new Set([2])],
            [['heli'], new Set([2])],
            [['bor'], new Set([5, 106])],
        ];

        return Test.run(Elements.find, tests);
    }

    /**
     * Find the next atomic number in a given element's group.
     *
     * @param {integer} protons - An atomic number
     * @returns {integer} An atomic number, or zero
     */
    static findNextInGroup(protons) {
        protons = parseInt(protons);
        if (protons === 1) {
            return 3;
        }
        if (protons < 13) {
            return protons + 8;
        }
        if (protons < 39) {
            return protons + 18;
        }
        if (protons < 119) {
            return protons + 32;
        }
        return 0;
    }

    /**
     * Find the previous atomic number in a given element's group.
     *
     * @param {integer} protons - An atomic number
     * @returns {integer} An atomic number, or zero
     */
    static findPreviousInGroup(protons) {
        protons = parseInt(protons);
        if (protons === 3) {
            return 1;
        }
        if (protons > 70) {
            return protons - 32;
        }
        if (protons > 30 && protons < 57) {
            return protons - 18;
        }
        if (protons > 20) {
            return 0;
        }
        if (protons > 9) {
            return protons - 8;
        }
        return 0;
    }

    /**
     * Find the atomic number for a given element symbol.
     *
     * @param {string} symbol - An element symbol
     * @returns {integer} An atomic number, or zero
     */
    static findProtons(symbol) {
        return Elements.symbols[symbol] ?? 0;
    }

    /**
     * Find the element symbol for a given atomic number.
     *
     * @param {integer} symbol - An atomic number
     * @returns {string} An element symbol, or the empty string
     */
    static findSymbol(protons) {
        const element = elementsData.get(protons);
        return element ? element.symbol : '';
    }

    /**
     * Format a number representing an element's abundance.
     *
     * @param {number} abundance - The proportion of a substance in a sample
     * @returns {string} HTML: inline text
     */
    static formatAbundance(abundance) {
        if (abundance === 0) {
            return '0';
        }

        if (abundance < 1e-12) {
            const ppq = common.fixFloat(abundance * 1e15);
            return `<span title="${abundance}">${ppq}</span> <abbr title="parts per quadrillion">ppq</abbr>`;
        }

        if (abundance < 1e-9) {
            const ppt = common.fixFloat(abundance * 1e12);
            return `<span title="${abundance}">${ppt}</span> <abbr title="parts per trillion">ppt</abbr>`;
        }

        if (abundance < 1e-6) {
            const ppb = common.fixFloat(abundance * 1e9);
            return `<span title="${abundance}">${ppb}</span> <abbr title="parts per billion">ppb</abbr>`;
        }

        if (abundance < 1e-3) {
            const ppm = common.fixFloat(abundance * 1e6);
            return `<span title="${abundance}">${ppm}</span> <abbr title="parts per million">ppm</abbr>`;
        }

        const percent = common.fixFloat(abundance * 100);
        return `<span title="${abundance}">${percent}%</span>`;
    }

    /**
     * Format a temperature in degrees celsius.
     *
     * @param {number|null} temperature - Degrees celsius
     * @returns {string} Plain text
     */
    static formatCelsius(temperature) {
        return (temperature) ? `${temperature} °C` : 'Unknown';
    }

    /**
     * Format a density value.
     *
     * @param {number|null} density - Grams per cubic centimeter
     * @returns {string} HTML: inline text
     */
    static formatDensity(density) {
        // The element data use grams per cubic centimeter for density.
        // See: https://en.wikipedia.org/wiki/Density#Unit
        return (density) ? `${density} g/cm<sup>3</sup>` : 'Unknown';
    }

    /**
     * Format element data for display.
     *
     * @param {integer} protons - An atomic number
     * @param {boolean} [link=false] - Optional, whether to return a link
     * @returns {string} HTML: inline text
     */
    static formatElement(protons, link = false) {
        const element = elementsData.get(protons);

        let html = `<span class="atomic">${protons}<br></span>`;
        html += `<span class="symbol">${element.symbol}</span>`;
        html += `<span class="name"><br>${element.name}</span>`;
        html += `<span class="weight"><br>${Elements.formatWeight(element.weight)}</span>`;

        if (link) {
            html = `<a href="?protons=${protons}">${html}<span class="link"></span></a>`;
        }

        const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
        const title = element.type;
        html = `<article class="${typeClass} element" title="${title}">${html}</article>`;

        return html;
    }

    /**
     * Format isotope data for display.
     * @see https://en.wikipedia.org/wiki/Mass_number
     *
     * @param {integer} protons - An atomic number
     * @param {number} mass - The number of neutrons and protons
     * @returns {string} Plain text
     */
    static formatIsotope(protons, mass) {
        const element = elementsData.get(protons);
        if (!element) {
            return '';
        }
        return `${element.symbol}-${mass}`;
    }

    /**
     * Format plain text that contains scientific notation, for display to HTML.
     *
     * @param {string} value - A number in scientific notation, perhaps with units
     * @returns {string} HTML: inline text
     */
    static formatScientificNotation(value) {
        return value.replace(/\^(\d+)/g, '<sup>$1</sup>');
    }

    /**
     * Format a standard atomic weight.
     * @see https://en.wikipedia.org/wiki/Standard_atomic_weight
     *
     * @param {number} weight - The standard atomic weight
     * @returns {string} Plain text
     */
    static formatWeight(weight) {
        return (weight.toString().indexOf('.') === -1) ? `(${weight})` : `${weight}`;
    }

    /**
     * Link to Wikipedia's page for a given element block.
     *
     * @param {boolean|null} [block=null] - An atomic orbital block
     * @returns {string} HTML: an anchor tag
     */
    static linkBlock(block = null) {
        // All elements have a block, so if block is null, link to the Block
        // page instead of a specific block.
        const blockPath = 'Block_(periodic_table)';
        if (!block) {
            return Link.toWikipedia(blockPath, 'Block');
        }
        return Link.toWikipedia(`${blockPath}#${block}-block`, `${block}-block`);
    }

    /**
     * Link to Wikipedia's page for a given element group.
     *
     * @param {integer|null} group - A column in the periodic table
     * @returns {string} HTML: an anchor tag
     */
    static linkGroup(group) {
        // Lanthanides & actinides don't belong to a group, so don't link those.
        if (!group) {
            return 'None';
        }
        const groupURL = Elements.groupURLs.get(group);
        return Link.create(groupURL, group, true);
    }

    /**
     * Link to Wikipedia's page for a given element period.
     *
     * @param {integer} period - A row in the periodic table
     * @returns {string} HTML: an anchor tag
     */
    static linkPeriod(period) {
        // All elements have a period, so if period is null, link to the Period
        // page instead of a specific period.
        const periodPath = 'Period_(periodic_table)';
        if (!period) {
            return Link.toWikipedia(periodPath, 'Period');
        }
        return Link.toWikipedia(`${periodPath}#Period_${period}`, period);
    }

    /**
     * Create HTML for a given element, describing it in detail.
     *
     * @param {integer|null} protons - An atomic number
     * @returns {string} HTML: a main block
     */
    static render(protons = null) {
        const element = elementsData.get(protons);
        let html = '';

        if (protons && !element) {
            console.warn('Unknown element with atomic number:', protons);
        }

        if (element) {
            document.title = `${element.symbol}: ${element.name}`;
            html += Elements.renderElementNav(protons);
            html += Elements.renderElement(protons);
        }
        else {
            document.title = 'Periodic Table of the Elements';
            html += Elements.renderElements();
        }

        return `<main><h1>${document.title}</h1>${html}</main>`;
    }

    /**
     * Calculate the width of a bar, for a bar chart.
     *
     * @param {number} value - A number that is less than or equal to the max
     * @param {number} max - The maximum value in the dataset
     * @param {boolean} [log=true] - Whether to use a logarithmic scale
     * @returns {number} A fraction of the max value
     */
    static calculateBarWidth(value, max, log = true) {
        if (value === 0) {
            return 0;
        }
        if (!log) {
            return value / max;
        }
        return 1 / (Math.log(value) / Math.log(max));
    }

    /**
     * Toggle between linear and logarithmic scales for the abundance chart.
     *
     * @param {Object} event - A browser event object
     */
    static handleAbundanceScale(event) {
        const log = (event.target.value === 'log');
        document.body.innerHTML = Elements.renderAbundance(log);
        Elements.addEventHandlers();
        document.querySelector('#scale-linear').checked = !log;
        document.querySelector('#scale-log').checked = log;
    }

    /**
     * Create HTML showing a chart of every element's abundance on Earth.
     *
     * @param {boolean} [log=true] - Whether to use a logarithmic scale
     * @returns {string} HTML: a heading and a chart
     */
    static renderAbundance(log = true) {
        console.time('abundance-chart');
        let max = 0;
        let min = 1;
        for (const element of elementsData.values()) {
            const abundance = element.crust;
            if (abundance > max) {
                max = abundance;
            }
            if (abundance > 0 && abundance < min) {
                min = abundance;
            }
        }

        document.title = 'Abundance of Elements in Earth\'s Crust';

        let html = `<h1>${document.title}</h1>`;
        html += '<form id="abundance-scale">';
        html += '<input id="scale-linear" type="radio" name="scale" value="linear">';
        html += '<label for="scale-linear">linear</label>';
        html += '<input id="scale-log" type="radio" name="scale" value="log" checked>';
        html += '<label for="scale-log">logarithmic</label>';
        html += '</form>';
        html += '<section class="abundance-chart">';
        for (const [protons, element] of elementsData) {
            const abundance = element.crust;
            const width = Elements.calculateBarWidth(abundance, max, log);
            const percent = (width * 100).toFixed(1);
            const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
            const minWidth = (abundance === 0) ? 'var(--abundance-width-none)' : 'var(--abundance-width-min)';
            html += `<div class="${typeClass}" style="width: calc(${percent}% + ${minWidth})">`;
            html += `<a href="?protons=${protons}" title="${element.name}">`;
            html += `${element.symbol}: ${Elements.formatAbundance(abundance)}`;
            html += '<span class="link"></span></a></div>';
        }
        html += '</section>';
        console.timeEnd('abundance-chart');

        return html;
    }

    /**
     * Wrap table cells in a table row, for the periodic table.
     *
     * @param {string} cells - Table data
     * @param {integer} period - An element period
     * @returns {string} HTML: a table row
     */
    static renderPeriodRow(cells, period) {
        const thLink = `<a href="?period=${period}">${period}<span class="link"></span></a>`;
        const th = `<th title="Period ${period}">${thLink}</th>`;
        return `<tr>${th}${cells}${th}</tr>`;
    }

    /**
     * Create HTML showing the periodic table of the elements.
     *
     * @returns {string} HTML: a section containing two tables
     */
    static renderElements() {
        let html = '<section>';
        html += '<table class="all elements"><thead><tr>';
        html += '<th class="empty"></th>';

        for (const [group, oldgroup] of Elements.groups) {
            const title = `Group ${group} (formerly ${oldgroup})`;
            const link = `<a href="?group=${group}">${group}<br>${oldgroup}<span class="link"></span></a>`;
            html += `<th class="group group-${group}" title="${title}">${link}</th>`;
        }

        html += '<th class="empty"></th>';
        html += '</tr></thead><tbody>';

        for (const [period, bounds] of Elements.periods) {
            const min = bounds['min'];
            const max = bounds['max'];
            let cells = '';

            for (let protons = min; protons <= max;) {
                if (protons === 2) {
                    // Skip gaps in period 1.
                    // Work around a colspan border rendering bug in Safari.
                    // See: https://bugs.webkit.org/show_bug.cgi?id=20840
                    cells += '<td class="empty"></td>';
                    cells += '<td class="empty" colspan="10"></td>';
                    cells += '<td class="empty" colspan="5"></td>';
                }
                else if (protons === 5 || protons === 13) {
                    // Skip gaps in periods 2 & 3.
                    cells += '<td class="empty" colspan="10"></td>';
                }
                else if (period === 6 && protons === Elements.periods.get('lanthanides').min) {
                    // Skip the lanthanides.
                    protons = Elements.periods.get('lanthanides').max + 1;
                }
                else if (period === 7 && protons === Elements.periods.get('actinides').min) {
                    // Skip the actinides.
                    protons = Elements.periods.get('actinides').max + 1;
                }

                cells += `<td>${Elements.formatElement(protons, true)}</td>`;
                protons++;
            }

            html += Elements.renderPeriodRow(cells, period);

            if (period === 7) {
                break;
            }
        }

        html += '</tbody></table>';

        html += '<table class="all rare-earth elements"><tbody>';

        for (const [category, bounds] of Elements.periods) {
            if (category !== 'lanthanides' && category !== 'actinides') {
                continue;
            }

            const min = bounds['min'];
            const max = bounds['max'];
            let cells = '';

            for (let protons = min; protons <= max;) {
                cells += `<td>${Elements.formatElement(protons, true)}</td>`;
                protons++;
            }

            const period = (category === 'lanthanides') ? 6 : 7;
            html += Elements.renderPeriodRow(cells, period);
        }

        html += '</tbody></table>';
        html += '</section>';

        html += Elements.renderElementsNav();

        return html;
    }

    /**
     * Create HTML allowing navigation between different top-level pages.
     *
     * @returns {string} HTML: a nav block
     */
    static renderElementsNav() {
        let html = '<nav>';
        html += '<a href="?view=abundance">Abundance</a> ';
        html += '<a href="?view=isotopes">Isotopes</a>';
        html += '<a href="?view=molecules">Molecules</a> ';
        html += '<a href="?search=">Search</a> ';
        html += '</nav>';

        return html;
    }

    /**
     * Create HTML describing an element in detail.
     *
     * @param {integer} protons - An atomic number
     * @returns {string} HTML: section blocks
     */
    static renderElement(protons) {
        const element = elementsData.get(protons);

        let html = '<section class="element">';
        html += Elements.formatElement(protons, false);

        const crustLink = Link.toWikipedia('Abundances_of_the_elements_(data_page)', 'Abundance');

        html += '<aside>';
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${element.name}#History`, 'Name')}: ${element.name}</li>`;
        html += `<li>${Link.toWikipedia('Chemical_symbol', 'Symbol')}: ${element.symbol}</li>`;
        html += `<li>${Link.toWikipedia('Atomic_number', 'Atomic Number')}: ${protons}</li>`;
        html += `<li>${Link.toWikipedia('Standard_atomic_weight', 'Weight')}: ${element.weight}</li>`;
        html += `<li>${Link.toWikipedia('Density', 'Density')}: ${Elements.formatDensity(element.density)}</li>`;
        html += `<li>${Elements.linkBlock()}: ${Elements.linkBlock(element.block)}</li>`;
        html += `<li>${Link.toWikipedia('Group_(periodic_table)', 'Group')}: ${Elements.linkGroup(element.group)}</li>`;
        html += `<li>${Elements.linkPeriod()}: ${Elements.linkPeriod(element.period)}</li>`;
        html += `<li>${Link.toWikipedia('Melting_point', 'Melting Point')}: ${Elements.formatCelsius(element.melts)}</li>`;
        html += `<li>${Link.toWikipedia('Boiling_point', 'Boiling Point')}: ${Elements.formatCelsius(element.boils)}</li>`;
        html += `<li>${crustLink}: ${Elements.formatAbundance(element.crust)}</li>`;
        html += `<li>Type: ${Link.create(Elements.typeURLs[element.type], element.type, true)}</li>`;
        html += '</ul>';

        html += '<ul>';
        html += `<li>${Link.toWikipedia(element.name, 'More info on Wikipedia')}</a></li>`;
        html += '<li><a href="./index.html">Go back to the periodic table</a></li>';
        html += '</ul>';
        html += '</aside>';
        html += '</section>';

        html += '<section class="isotopes">';
        html += '<h2>Isotopes</h2>';
        const isotopesPath = `Isotopes of ${element.name.toLowerCase()}`;
        html += `<p>${Link.toWikipedia(isotopesPath, `Wikipedia: ${isotopesPath}`)}</p>`;

        if (isotopesData.primordial.has(protons)) {
            const isotopes = isotopesData.primordial.get(protons);
            html += '<ul>';
            for (const mass of isotopes) {
                const isotopeName = Elements.formatIsotope(protons, mass);
                const isotopeLink = Link.toWikipedia(`${element.name}-${mass}`, `${isotopeName}`);
                html += `<li>${isotopeLink}</li>`;
            }
            html += '</ul>';
        }
        else if (isotopesData.synthetic.has(protons)) {
            const isotopes = isotopesData.synthetic.get(protons);
            const mass = Object.keys(isotopes)[0];
            const time = Elements.formatScientificNotation(isotopes[mass]);
            const isotopeName = Elements.formatIsotope(protons, mass);
            const syntheticElement = Link.toWikipedia('Synthetic_element', 'synthetic element');
            html += `<p>${element.name} is a ${syntheticElement}. Its longest
            lived isotope, ${isotopeName}, has a half-life of ${time}.</p>`;
        }

        html += '</section>';
        html += '<section class="molecules">';
        html += '<h2>Molecules</h2>';

        const compoundsPath = (protons < 103) ? `${element.name}_compounds` : `${element.name}#Chemical`;
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${compoundsPath}`, `Wikipedia: ${element.name} compounds`)}</li>`;
        if (protons < 100) {
            html += `<li>${Link.toWikipedia(`Category:${compoundsPath}`, `Wikipedia: Category: ${element.name} compounds`)}</li>`;
        }
        html += '</ul>';

        if (element.type === 'Noble Gas') {
            const nobleGasCompoundsLink = Link.toWikipedia('Noble_gas_compound', 'Noble gas compounds');
            html += `<p>${nobleGasCompoundsLink} do not form easily. Although
            not impossible, it usually requires very low temperatures, high
            pressures, or both.</p>`;
        }

        html += Molecules.renderList(element.symbol);
        html += '</section>';

        return html;
    }

    /**
     * Create HTML to navigate between elements.
     *
     * @param {integer} protons - An atomic number
     * @returns {string} HTML: a nav block
     */
    static renderElementNav(protons) {
        protons = parseInt(protons);
        const prev = elementsData.get(protons - 1);
        const next = elementsData.get(protons + 1);

        const up = Elements.findPreviousInGroup(protons);
        const down = Elements.findNextInGroup(protons);

        const groupPrev = elementsData.get(up);
        const groupNext = elementsData.get(down);

        let html = '<nav>';
        html += '<span class="previous">';
        if (prev) {
            html += `<a href="?protons=${protons - 1}">&larr; ${prev.symbol}: ${prev.name}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (next) {
            html += `<a href="?protons=${protons + 1}">${next.symbol}: ${next.name} &rarr;</a>`;
        }
        html += '</span>';
        html += '<br>';
        html += '<span class="previous">';
        if (groupPrev) {
            html += `<a href="?protons=${up}">&uarr; ${groupPrev.symbol}: ${groupPrev.name}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (groupNext) {
            html += `<a href="?protons=${down}">${groupNext.symbol}: ${groupNext.name} &darr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }

    /**
     * Create HTML with basic element data.
     *
     * @param {Object} element - Element data
     * @returns {string} HTML: inline content
     */
    static renderElementHighlights(element) {
        let html = `Density: ${Elements.formatDensity(element.density, true)}`;
        html += `<br>Melting Point: ${Elements.formatCelsius(element.melts)}`;
        html += `<br>Boiling Point: ${Elements.formatCelsius(element.boils)}`;
        html += `<br>Abundance: ${Elements.formatAbundance(element.crust)}`;
        return html;
    }

    /**
     * Create HTML showing an entire group of elements.
     *
     * @param {integer} group - A column in the periodic table
     * @returns {string} HTML: a table
     */
    static renderGroup(group) {
        if (!Elements.groupElements.has(group)) {
            return '';
        }

        let html = '<table class="elements group"><tbody>';
        const elements = Elements.groupElements.get(group);
        for (const protons of elements) {
            const element = elementsData.get(protons);
            html += '<tr>';
            html += `<td>${Elements.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">${Elements.renderElementHighlights(element)}</td>`;
            html += '</tr>';
        }
        html += '</tbody></table>';

        return html;
    }

    /**
     * Create HTML to navigate between element groups.
     *
     * @param {integer} group - A column in the periodic table
     * @returns {string} HTML: a nav block
     */
    static renderGroupNav(group) {
        if (group < 1 || group > 18) {
            return '';
        }

        let html = '<nav>';
        html += '<span class="previous">';
        if (group > 1) {
            const prev = group - 1;
            html += `<a href="?group=${prev}">&larr; Group ${prev}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (group < 18) {
            const next = group + 1;
            html += `<a href="?group=${next}">Group ${next} &rarr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }

    /**
     * Create HTML for an element group.
     *
     * @param {integer} group - A column in the periodic table
     * @returns {string} HTML
     */
    static renderGroupPage(group) {
        document.title = `Group ${group}`;
        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += Elements.renderGroupNav(group);
        html += Elements.renderGroup(group);
        html += '</main>';
        return html;
    }

    /**
     * Create HTML showing an entire period of elements.
     *
     * @param {integer} period - A row in the periodic table
     * @returns {string} HTML: a table
     */
    static renderPeriod(period) {
        if (!Elements.periods.has(period)) {
            return '';
        }

        let html = '<table class="elements period"><tbody>';
        const { min, max } = Elements.periods.get(period);
        for (let protons = min; protons <= max; protons++) {
            const element = elementsData.get(protons);
            html += '<tr>';
            html += `<td>${Elements.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">${Elements.renderElementHighlights(element)}</td>`;
            html += '</tr>';
        }
        html += '</tbody></table>';

        return html;
    }

    /**
     * Create HTML to navigate between element periods.
     *
     * @param {integer} period - A row in the periodic table
     * @returns {string} HTML: a nav block
     */
    static renderPeriodNav(period) {
        if (period < 1 || period > 7) {
            return '';
        }

        let html = '<nav>';
        html += '<span class="previous">';
        if (period > 1) {
            const prev = period - 1;
            html += `<a href="?period=${prev}">&larr; Period ${prev}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (period < 7) {
            const next = period + 1;
            html += `<a href="?period=${next}">Period ${next} &rarr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }

    /**
     * Create HTML for an element period.
     *
     * @param {integer} period - A row in the periodic table
     * @returns {string} HTML
     */
    static renderPeriodPage(period) {
        document.title = `Period ${period}`;
        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += Elements.renderPeriodNav(period);
        html += Elements.renderPeriod(period);
        html += '</main>';
        return html;
    }
}
