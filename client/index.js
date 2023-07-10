import elementsData from './elementsData.js';
import isotopesData from './isotopesData.js';
import moleculesData from './moleculesData.js';

String.prototype.toSpliced = function (start, deleteCount, ...items) {
    return this.split('').toSpliced(start, deleteCount, ...items).join('');
};

/**
 * @class Page
 */
class Page {
    /**
     * Generate HTML based on the URL.
     */
    static render() {
        const params = new URLSearchParams(window.location.search);
        const molecule = params.get('molecule');
        const formula = params.get('formula');
        const group = params.get('group');
        const period = params.get('period');
        const protons = params.get('protons');
        const view = params.get('view');
        let html = '';

        if (formula) {
            html += Molecules.renderFormula(formula);
        }
        else if (molecule) {
            html += Molecules.renderMolecule(molecule);
        }
        else if (group && Elements.groups.has(parseInt(group))) {
            document.title = `Group ${group}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderGroupNav(group);
            html += Elements.renderGroup(group);
            html += '</main>';
        }
        else if (period && Elements.periods.has(parseInt(period))) {
            document.title = `Period ${period}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderPeriodNav(period);
            html += Elements.renderPeriod(period);
            html += '</main>';
        }
        else if (view === 'abundance') {
            html += Elements.renderAbundance();
        }
        else if (view === 'molecules') {
            html += Molecules.render();
        }
        else if (view === 'isotopes') {
            html += Isotopes.render();
        }
        else if (view === 'test') {
            html += Test.render();
        }
        else {
            html += Elements.render(protons);
        }

        document.body.insertAdjacentHTML('beforeend', html);
        Page.addEventHandlers();
    }

    /**
     * Add event handlers to the page.
     */
    static addEventHandlers() {
        const abundanceScale = document.querySelector('form#abundance-scale');
        if (abundanceScale) {
            abundanceScale.addEventListener('change', Elements.handleAbundanceScale);
        }
    }
}

/**
 * @class Link
 */
class Link {
    /**
     * Create a hyperlink.
     * @param {string} url
     * @param {string} content
     * @param {boolean} [newTab=false]
     * @returns {string} HTML
     */
    static create(url, content, newTab = false) {
        const target = (newTab) ? ' target="_blank"' : '';
        return `<a href="${url}"${target}>${content}</a>`;
    }

    /**
     * Create a hyperlink to Wikipedia.
     * @param {string} path
     * @param {string} content
     * @returns {string} HTML
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

/**
 * @class Elements
 * @property {Map} groups
 * @property {Object} groupElements
 * @property {Object} groupURLs
 * @property {Map} periods
 * @property {Object} symbols
 * @property {Object} typeURLs
 */
class Elements {
    static groups = Elements.#getGroups();

    /**
     * Get element groups.
     * @private
     */
    static #getGroups() {
        // The key is the group number.
        // The value is the former group designation.
        const groups = new Map();
        groups.set(1, 'IA');
        groups.set(2, 'IIA');
        groups.set(3, 'IIIB');
        groups.set(4, 'IVB');
        groups.set(5, 'VB');
        groups.set(6, 'VIB');
        groups.set(7, 'VIIB');
        groups.set(8, 'VIIIB');
        groups.set(9, 'VIIIB');
        groups.set(10, 'VIIIB');
        groups.set(11, 'IB');
        groups.set(12, 'IIB');
        groups.set(13, 'IIIA');
        groups.set(14, 'IVA');
        groups.set(15, 'VA');
        groups.set(16, 'VIA');
        groups.set(17, 'VIIA');
        groups.set(18, 'VIIIA');
        return groups;
    }

    static groupElements = {
        1: [1, 3, 11, 19, 37, 55, 87],
        2: [4, 12, 20, 38, 56, 88],
        3: [21, 39, 71, 103],
        4: [22, 40, 72, 104],
        5: [23, 41, 73, 105],
        6: [24, 42, 74, 106],
        7: [25, 43, 75, 107],
        8: [26, 44, 76, 108],
        9: [27, 45, 77, 109],
        10: [28, 46, 78, 110],
        11: [29, 47, 79, 111],
        12: [30, 48, 80, 112],
        13: [5, 13, 31, 49, 81, 113],
        14: [6, 14, 32, 50, 82, 114],
        15: [7, 15, 33, 51, 83, 115],
        16: [8, 16, 34, 52, 84, 116],
        17: [9, 17, 35, 53, 85, 117],
        18: [2, 10, 18, 36, 54, 86, 118],
    };

    static groupURLs = {
        1: 'https://en.wikipedia.org/wiki/Group_1_element',
        2: 'https://en.wikipedia.org/wiki/Alkaline_earth_metal',
        3: 'https://en.wikipedia.org/wiki/Group_3_element',
        4: 'https://en.wikipedia.org/wiki/Group_4_element',
        5: 'https://en.wikipedia.org/wiki/Group_5_element',
        6: 'https://en.wikipedia.org/wiki/Group_6_element',
        7: 'https://en.wikipedia.org/wiki/Group_7_element',
        8: 'https://en.wikipedia.org/wiki/Group_8_element',
        9: 'https://en.wikipedia.org/wiki/Group_9_element',
        10: 'https://en.wikipedia.org/wiki/Group_10_element',
        11: 'https://en.wikipedia.org/wiki/Group_11_element',
        12: 'https://en.wikipedia.org/wiki/Group_12_element',
        13: 'https://en.wikipedia.org/wiki/Boron_group',
        14: 'https://en.wikipedia.org/wiki/Carbon_group',
        15: 'https://en.wikipedia.org/wiki/Pnictogen',
        16: 'https://en.wikipedia.org/wiki/Chalcogen',
        17: 'https://en.wikipedia.org/wiki/Halogen',
        18: 'https://en.wikipedia.org/wiki/Noble_gas',
    };

    static periods = Elements.#getPeriods();

    /**
     * Get element periods.
     * @private
     */
    static #getPeriods() {
        const periods = new Map();
        periods.set(1, { min: 1, max: 2 });
        periods.set(2, { min: 3, max: 10 });
        periods.set(3, { min: 11, max: 18 });
        periods.set(4, { min: 19, max: 36 });
        periods.set(5, { min: 37, max: 54 });
        periods.set(6, { min: 55, max: 86 });
        periods.set(7, { min: 87, max: 118 });
        periods.set('lanthanides', { min: 57, max: 70 });
        periods.set('actinides', { min: 89, max: 102 });
        return periods;
    }

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
     * @param {string} symbolA - An element symbol
     * @param {string} symbolB - An element symbol
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
     * Find the next atomic number in a given element's group.
     * @param {integer} protons - An atomic number
     * @returns {integer}
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
     * @param {integer} protons - An atomic number
     * @returns {integer}
     */
    static findPreviousInGroup(protons) {
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
     * @param {string} symbol - An element symbol
     * @returns {integer}
     */
    static findProtons(symbol) {
        return Elements.symbols[symbol] ?? 0;
    }

    /**
     * Fix floating point numbers that have been mangled.
     * @param {number} number
     * @returns {number}
     */
    static fixFloat(number) {
        let [integer, decimal, exponent] = number.toString().split(/[.e]/);
        if (decimal === undefined) {
            return number;
        }

        const zeros = decimal.indexOf('00000');
        if (zeros !== -1) {
            decimal = decimal.substring(0, zeros);
        }

        const nines = decimal.indexOf('99999');
        if (nines === 0) {
            integer = `${parseInt(integer) + 1}`;
            decimal = '';
        }
        else if (nines !== -1) {
            decimal = decimal.substring(0, nines);
            const lastDigit = parseInt(decimal.at(-1)) + 1;
            decimal = decimal.substring(0, decimal.length - 1) + lastDigit.toString();
        }

        if (zeros === -1 && nines === -1) {
            return number;
        }

        let string = integer;
        if (decimal.length > 0) {
            string += `.${decimal}`;
        }
        if (exponent !== undefined) {
            string += `e${exponent}`;
        }
        const f = parseFloat(string);
        return f;
    }

    /**
     * Format a number representing an element's abundance.
     * @param {number} abundance
     * @returns {string} HTML
     */
    static formatAbundance(abundance) {
        if (abundance === 0) {
            return '0';
        }

        if (abundance < 1e-12) {
            const ppq = Elements.fixFloat(abundance * 1e15);
            return `<span title="${abundance}">${ppq}</span> <abbr title="parts per quadrillion">ppq</abbr>`;
        }

        if (abundance < 1e-9) {
            const ppt = Elements.fixFloat(abundance * 1e12);
            return `<span title="${abundance}">${ppt}</span> <abbr title="parts per trillion">ppt</abbr>`;
        }

        if (abundance < 1e-6) {
            const ppb = Elements.fixFloat(abundance * 1e9);
            return `<span title="${abundance}">${ppb}</span> <abbr title="parts per billion">ppb</abbr>`;
        }

        if (abundance < 1e-3) {
            const ppm = Elements.fixFloat(abundance * 1e6);
            return `<span title="${abundance}">${ppm}</span> <abbr title="parts per million">ppm</abbr>`;
        }

        const percent = Elements.fixFloat(abundance * 100);
        return `<span title="${abundance}">${percent}%</span>`;
    }

    /**
     * Format a temperature in degrees celsius.
     * @param {number|null} temperature - Degrees celsius
     * @returns {string}
     */
    static formatCelsius(temperature) {
        return (temperature) ? `${temperature} °C` : 'Unknown';
    }

    /**
     * Format a density value.
     * @param {number|null} density - Grams per cubic centimeter
     * @returns {string} HTML
     */
    static formatDensity(density) {
        // The element data use grams per cubic centimeter for density.
        // See: https://en.wikipedia.org/wiki/Density#Unit
        return (density) ? `${density} g/cm<sup>3</sup>` : 'Unknown';
    }

    /**
     * Format element data for display.
     * @param {integer} protons - An atomic number
     * @param {boolean} [link=false] - Optional, whether to return a link
     * @returns {string} HTML
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
     * @param {integer} protons - An atomic number
     * @param {number} mass - Whether to return a link
     * @returns {string}
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
     * @param {string} value
     * @returns {string} HTML
     */
    static formatScientificNotation(value) {
        return value.replace(/\^(\d+)/g, '<sup>$1</sup>');
    }

    /**
     * Format a standard atomic weight.
     * @param {number} weight
     * @returns {string}
     */
    static formatWeight(weight) {
        return (weight.toString().indexOf('.') === -1) ? `(${weight})` : `${weight}`;
    }

    /**
     * Link to Wikipedia's page for a given element block.
     * @param {boolean|null} [block=null]
     * @returns {string}
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
     * @param {integer|null} group
     * @returns {string} HTML
     */
    static linkGroup(group) {
        // Lanthanides & actinides don't belong to a group, so don't link those.
        if (!group) {
            return 'None';
        }
        const groupURL = Elements.groupURLs[group];
        return Link.create(groupURL, group, true);
    }

    /**
     * Link to Wikipedia's page for a given element period.
     * @param {integer} period
     * @returns {string} HTML
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
     * Generate HTML for a given element.
     * @param {integer|null} protons
     * @returns {string} HTML
     */
    static render(protons = null) {
        const element = elementsData.get(protons);
        let html = '';

        if (protons && !element) {
            console.warn('Unknown element with atomic number:', protons);
        }

        if (element) {
            document.title = `${element.symbol}: ${element.name}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderElementNav(protons);
            html += Elements.renderElement(protons);
            html += '</main>';
        }
        else {
            document.title = 'Periodic Table of the Elements';
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderElements();
            html += '</main>';
        }

        return html;
    }

    /**
     * Calculate the width of a bar, for a bar chart.
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
     * @param {Object} event - A browser event object
     */
    static handleAbundanceScale(event) {
        const log = (event.target.value === 'log');
        document.body.innerHTML = Elements.renderAbundance(log);
        Page.addEventHandlers();
        document.querySelector('#scale-linear').checked = !log;
        document.querySelector('#scale-log').checked = log;
    }

    /**
     * @param {boolean} [log=true] - Whether to use a logarithmic scale
     * @returns {string} HTML
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
     * @returns {string} HTML: a nav block
     */
    static renderElementsNav() {
        let html = '<nav>';
        html += '<a href="?view=abundance">Abundance</a> ';
        html += '<a href="?view=isotopes">Isotopes</a>';
        html += '<a href="?view=molecules">Molecules</a> ';
        html += '</nav>';

        return html;
    }

    /**
     * Generate HTML describing an element in detail
     * @param {integer} protons - An atomic number
     * @returns {string} HTML: sections describing an element in detail
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
     * Generate HTML to navigate between elements
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
     * Generate HTML with basic element data
     * @param {Object} element - Element data
     * @returns {string} HTML
     */
    static renderElementHighlights(element) {
        let html = `Density: ${Elements.formatDensity(element.density, true)}`;
        html += `<br>Melting Point: ${Elements.formatCelsius(element.melts)}`;
        html += `<br>Boiling Point: ${Elements.formatCelsius(element.boils)}`;
        html += `<br>Abundance: ${Elements.formatAbundance(element.crust)}`;
        return html;
    }

    /**
     * Generate HTML showing an entire group of elements
     * @param {integer} group - An element group number
     * @returns {string} HTML: a table
     */
    static renderGroup(group) {
        if (!(group in Elements.groupElements)) {
            return '';
        }

        let html = '<table class="elements group"><tbody>';
        const elements = Elements.groupElements[group];
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
     * Generate HTML to navigate between element groups
     * @param {integer} group - An element group number
     * @returns {string} HTML: a nav block
     */
    static renderGroupNav(group) {
        group = parseInt(group);
        if (group < 1 || group > 18) {
            return '';
        }

        let html = '<nav>';
        html += '<span class="previous">';
        if (group > 1) {
            const prev = group - 1;
            html += `<a href="?group=${group - 1}">&larr; Group ${prev}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (group < 18) {
            const next = group + 1;
            html += `<a href="?group=${group + 1}">Group ${next} &rarr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }

    /**
     * Generate HTML showing an entire period of elements
     * @param {integer} period
     * @returns {string} HTML
     */
    static renderPeriod(period) {
        period = parseInt(period);
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
     * Generate HTML to navigate between element periods
     * @param {integer} period
     * @returns {string} HTML
     */
    static renderPeriodNav(period) {
        period = parseInt(period);
        if (period < 1 || period > 7) {
            return '';
        }

        let html = '<nav>';
        html += '<span class="previous">';
        if (period > 1) {
            const prev = period - 1;
            html += `<a href="?period=${period - 1}">&larr; Period ${prev}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (period < 7) {
            const next = period + 1;
            html += `<a href="?period=${period + 1}">Period ${next} &rarr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }
}

/**
 * @class Molecules
 * @property {Object} #foundElements
 * @property {Object} #foundNames
 * @property {Object} #parsed
 */
class Molecules {
    /**
     * @param {Object} elements
     * @param {integer} [multiplier=1]
     * @returns {string}
     */
    static combine(elements, multiplier = 1) {
        let newFormula = '';
        for (const element in elements) {
            const count = elements[element] * multiplier ;
            newFormula += element;
            newFormula += (count > 1) ? count: '';
        }
        return newFormula;
    }

    /**
     * Compare two molecular formulas, for sorting.
     * @param {string} formulaA - A molecular formula
     * @param {string} formulaB - A molecular formula
     * @param {string} [prioritySymbol='H'] - An element symbol to prioritize
     * @param {boolean} [debug=false] - Whether to generate debugging output
     * @returns {integer}
     */
    static compare(formulaA, formulaB, prioritySymbol = 'H', debug = false) {
        // Return early when formulas are identical.
        if (formulaA === formulaB) {
            if (debug) {
                console.log(`${formulaA} === ${formulaB}`);
            }
            return 0;
        }

        // Allow the caller to identify a priority element to sort by.
        let priority = Elements.findProtons(prioritySymbol);
        if (priority === 0) {
            console.warn('Invalid priority element symbol:', prioritySymbol);
            prioritySymbol = 'H';
            priority = 1;
        }

        // Parse formulas into constituent elements.
        const aComponents = Molecules.parse(formulaA);
        const bComponents = Molecules.parse(formulaB);

        // Build maps keyed by atomic numbers, not atomic symbols.
        const a = Molecules.#convertSymbols(aComponents);
        const b = Molecules.#convertSymbols(bComponents);

        const result = Molecules.#compareElements(a, b, priority, true);
        if (result !== 0) {
            if (debug) {
                const inequality = (result < 0) ? '<' : '>';
                console.log(`${formulaA} ${inequality} ${formulaB}: ${prioritySymbol} is the priority`);
            }
            return result;
        }

        // Ignore the priority element, since we've already checked it.
        a.delete(priority);
        b.delete(priority);

        // Build an array of atomic numbers in each formula.
        const aKeys = [...a.keys()];
        const bKeys = [...b.keys()];

        // Build a sorted array of atomic numbers in both formulas, without duplicates.
        const unique = new Set(aKeys.concat(bKeys));
        const all = [...unique].sort((a, b) => a - b);

        // Find the highest atomic number in each formula's elements.
        const aMax = Math.max(...aKeys);
        const bMax = Math.max(...bKeys);

        // Limit comparisons to the lesser maximum atomic number of the two formulas.
        const upperBound = Math.min(aMax, bMax);
        if (upperBound === -Infinity) {
            console.warn('upperBound =', upperBound);
        }
        all.splice(all.indexOf(upperBound) + 1);

        // Compare formulas by their elements' atomic numbers; lowest comes first.
        for (const protons of all) {
            const symbol = elementsData.get(protons).symbol;
            const result = Molecules.#compareElements(a, b, protons);
            if (result !== 0) {
                if (debug) {
                    const inequality = (result < 0) ? '<' : '>';
                    console.log(`${formulaA} ${inequality} ${formulaB}: ${symbol}`);
                }
                return result;
            }
            // Stop when we're past either formula's highest element.
            if (protons === upperBound && aMax !== bMax) {
                const positivity = (upperBound === aMax) ? -1 : 1;
                if (debug) {
                    const inequality = (positivity < 0) ? '<' : '>';
                    console.log(`${formulaA} ${inequality} ${formulaB}: ${formulaA} has fewer protons`);
                }
                return positivity;
            }
        }

        if (debug) {
            console.log(`${formulaA} == ${formulaB}`);
        }
        return 0;
    }

    /**
     * Compare two molecular formulas based on one element.
     *
     * @param {Map} a - A Map object describing a formula, keyed by atomic number
     * @param {Map} b - A Map object describing a formula, keyed by atomic number
     * @param {integer} protons - The atomic number of the element being compared
     * @param {boolean} priority - Whether the element takes priority over smaller elements
     *
     * @returns {integer} how the formulas should be sorted, with regard to the
     * given element:
     * - -1 if a comes before b
     * - 1 if a comes after b
     * - 0 if the formulas are equivalent
     *
     * @private
     */
    static #compareElements(a, b, protons, priority = false) {
        const inA = a.has(protons);
        const inB = b.has(protons);
        if (!inA && !inB) {
            return 0;
        }

        // When a lower element is in only one formula, it comes first.
        if (inA && !inB) {
            return -1;
        }
        if (!inA && inB) {
            return 1;
        }

        // When both formulas contain an element, sort based on the element count.
        const aCount = a.get(protons);
        const bCount = b.get(protons);
        if (aCount > bCount) {
            return 1;
        }
        if (aCount < bCount) {
            return -1;
        }
        if (priority) {
            // When one formula contains only the priority element, it comes first.
            if (a.size === 1) {
                return -1;
            }
            if (b.size === 1) {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Test the compare method.
     * @returns {integer} How many tests failed
     */
    static compareTest() {
        const tests = [
            [['H2', 'O2', 'H'], -1], // H2 < O2: H in H2, not in O2
            [['O2', 'H2', 'H'], 1], // O2 > H2: H in H2, not in O2
            [['H2', 'O2', 'X'], -1], // H2 < O2: H in H2, not in O2
            [['H2', 'H2O2', 'H'], -1], // H2 < H2O2: H2 contains only the priority element
            [['H2O2', 'H2', 'H'], 1], // H2O2 > H2: H2 contains only the priority element
            [['O2', 'H2O2', 'O'], -1], // O2 < H2O2: O2 contains only the priority element
            [['H2O2', 'O2', 'O'], 1], // H2O2 > O2: O2 contains only the priority element
            [['HN', 'HNCO', 'H'], 1], // C in HNCO, not in HN
            [['H2', 'H2', 'H'], 0], // H2 === H2
            [['H2O', 'OH2', 'H'], 0], // H2O == OH2: formulas are equivalent
            [['LiPF6', 'LiYF4', 'Li'], 1], // F6 > F4
            [['LiNH2', 'Li2NH', 'Li'], -1], // Li1 < Li2
            //[['BeF2', 'BeSO4', 'Be'], 1], // O in BeSO4, not in BeF2
            //[['BN', 'BNH6', 'B'], 1], // H in BNH6, not in BN
            //[['CHF3', 'CHClO2', 'C'], 1], // O in CHClO2, not in CHF3
            [['C2H2', 'C2H2B2N2', 'C'], -1], // compared every element in C2H2
            //[['C2H3B', 'C2H3LiO2', 'C'], 1], // Li in C2H3LiO2, not in C2H3B
            [['NH4ClO4', 'NH4VO3', 'N'], 1], // O4 > O3
            [['NH4VO3', 'NH4ClO4', 'N'], -1], // O3 < O4
            //[['NH4SCN', 'NH4ClO3', 'N'], 1], // N2 > N1
            //[['NaOH', 'NaHCO3', 'Na'], 1], // C in NaHCO3, not in NaOH
            //[['Mg2O8Si3', 'MgSO3', 'Mg'], 1], // Mg2 > Mg1
            //[['S4N4', 'S2Sn', 'S'], 1], // S4 > S2
            //[['KHSO3', 'KOH', 'K'], 1], // O1 < O3
            //[['CaH2O2', 'CaH2C2O4', 'Ca'], 1], // C in CaH2C2O4, not in CaH2O2
            //[['Ti2O3', 'TiI3', 'Ti'], 1], // Ti2 > Ti1
            //[['FeCl2', 'FeKS2', 'Fe'], 1], // S in FeKS2, not in FeCl2
            //[['CoB', 'CoC10H10', 'Co'], 1], // H in CoC10H10, not in CoB
            //[['CuS', 'CuSO4', 'Cu'], 1], // O in CuSO4, not in CuS
            //[['GaS', 'GaAsP', 'Ga'], 1], // P in GaAsP, not in GaS
            //[['AsH3', 'AsCuHO3', 'As'], 1], // H1 < H3
            //[['SeCl4', 'SeOCl2', 'Se'], 1], // O in SeOCl2, not in SeCl4
            //[['YB6', 'YH3O3', 'Y'], 1], // H in YH3O3, not in YB6
            //[['Ag2SeO3', 'Ag2O', 'Ag'], 1], // O1 < O3
            //[['InN3O9', 'InGaN', 'In'], 1], // N1 < N3
            //[['SnI2', 'SnTe', 'Sn'], 1], // Te in SnTe, not in SnI2
            //[['IF', 'INaO3', 'I'], 1], // O in INaO3, not in IF
            //[['CsHO4S', 'CsOH', 'Cs'], 1], // O1 < O4
            //[['BaP2O6', 'BaSO3', 'Ba'], 1], // O3 < O6
            //[['La2O3', 'La2C6O12', 'La'], 1], // C in La2C6O12, not in La2O3
            //[['CeBr3', 'CeCoIn5', 'Ce'], 1], // Co in CeCoIn5, not in CeBr3
            //[['Ho2S3', 'Ho2O7Ti2', 'Ho'], 1], // O in Ho2O7Ti2, not in Ho2S3
            //[['YbP', 'YbRh2Si2', 'Yb'], 1], // Si in YbRh2Si2, not in YbP
            //[['LuF3', 'LuTaO4', 'Lu'], 1], // O in LuTaO4, not in LuF3
            //[['HfF4', 'HfSiO4', 'Hf'], 1], // O in HfSiO4, not in HfF4
            //[['WO2Cl2', 'WO2', 'W'], 1], // compared every element in WO2
            //[['IrCl3', 'IrS2', 'Ir'], 1], // S in IrS2, not in IrCl3
            //[['HgF4', 'HgSO4', 'Hg'], 1], // O in HgSO4, not in HgF4
            //[['TlH3', 'TlOH', 'Tl'], 1], // H1 < H3
            //[['PbS', 'PbSO4', 'Pb'], 1], // O in PbSO4, not in PbS
            //[['Bi2CO5', 'BiOCl', 'Bi'], 1], // Bi2 > Bi1
            //[['RaF2', 'RaSO4', 'Ra'], 1], // O in RaSO4, not in RaF2
            //[['ThF4', 'ThSiO4', 'Th'], 1], // O in ThSiO4, not in ThF4
            //[['UB2', 'UB4H16', 'U'], 1], // H in UB4H16, not in UB2
        ];

        let failed = 0;
        let passed = 0;
        for (const test of tests) {
            const args = test[0];
            const expected = test[1];
            const actual = Molecules.compare(...args, true);
            console.assert(actual === expected, args[0], args[1], 'not sorted correctly.');
            if (actual === expected) {
                passed += 1;
            }
            else {
                failed += 1;
            }
        }
        console.log(`${failed} tests failed, ${passed} passed.`);

        return failed;
    }

    /**
     * Convert a semistructural chemical formula to a molecular formula.
     * @param {string} formula - A molecular or semistructural formula
     * @param {boolean} [sort=false] - Whether to sort elements by atomic number
     * @param {...string} priorities - Element symbols to prioritize
     * @returns string - A molecular formula
     */
    static convertFormula(formula, sort = false, ...priorities) {
        formula = formula.toString();

        // Extract parenthetical substrings and their multipliers, ungreedily.
        // This handles the most deeply nested parentheses first.
        const re = /\(([^\(\)]+)\)(\d*)/g; // eslint-disable-line
        const matches = formula.matchAll(re);

        // Replace parentheses and multipliers with molecular formulas.
        let offset = 0;
        for (const match of matches) {
            const count = (match[2] === '') ? 1 : parseInt(match[2]);
            const index = match.index - offset;
            const length = match[0].length;
            const parts = Molecules.parse(match[1]);
            const substr = Molecules.combine(parts, count);
            formula = formula.toSpliced(index, length, substr);
            offset += length - substr.length;
        }

        // Recurse if there are more parentheses.
        if (formula.indexOf('(') !== -1) {
            formula = Molecules.convertFormula(formula);
        }

        let elements = Molecules.parse(formula);

        if (sort) {
            elements = Molecules.sortElements(elements);
        }

        if (priorities.length > 0) {
            elements = Molecules.prioritizeElements(elements, ...priorities);
        }

        // Combine duplicate elements.
        return Molecules.combine(elements);
    }

    /**
     * Test the convertFormula method.
     * @returns {integer} How many tests failed
     */
    static convertFormulaTest() {
        const tests = [
            [['H2O'], 'H2O'], // No parentheses
            [['CH3(CH2)17COOH'], 'C19H38O2'], // Parentheses, repeated elements
            [['HO(CH2CH2O)20(CH2CH(CH3)O)70(CH2CH2O)20H'], 'H582O111C290'], // Nested parentheses
            [['Be(BH4)2'], 'BeB2H8'],
            [['Be(NO3)2'], 'BeN2O6'],
            [['Mn(CH3CO2)2', true, 'C'], 'C4H6O4Mn'], // Sort, prioritize carbon
            [['H2(CO)10Os3', false, 'C'], 'C10H2O10Os3'], // Don't sort, prioritize carbon
            /*
            //[['ReOCl3(PPh3)2', 'C'], 'C36H30OP2Cl3Re'],
            [['Fe(NO3)3', true, 'Fe'], 'FeN3O9'],
            [['Fe(CO)5', true, 'Fe'], 'FeC5O5'],
            [['Fe(ClO4)2'], 'FeCl2O8'],
            [['Fe2(SO4)3'], 'Fe2S3O12'],
            [['Co(OH)2', true, 'Co'], 'CoH2O2'],
            [['Co(C5H5)2', true, 'Co', 'C'], 'CoC10H10'],
            [['Co(NO3)2', true, 'Co'], 'CoN2O6'],
            [['Co2(CO)8', true, 'Co'], 'Co2C8O8'],
            [['Co4(CO)12', true, 'Co'], 'Co4C12O12'],
            [['NiO(OH)', true, 'Ni'], 'NiHO2'],
            [['Ni(OH)2', true, 'Ni'], 'NiH2O2'],
            [['Ni(NO3)2', true, 'Ni'], 'NiN2O6'],
            [['Ni(CO)4', true, 'Ni'], 'NiC4O4'],
            [['Ni3(PO4)2', false, 'Ni'], 'Ni3P2O8'],
            [['Cu(OH)2', true, 'Cu'], 'CuH2O2'],
            [['Cu2CO3(OH)2', true, 'Cu', 'C'], 'Cu2CH2O5'],
            [['Cu2(OH)3Cl', true, 'Cu'], 'Cu2H3O3Cl'],
            */
            [['Cu3(CO3)2(OH)2', true, 'Cu', 'C'], 'Cu3C2H2O8'], // Sort, prioritize copper & carbon
            /*
            [['Zn(CH3)2', true, 'Zn', 'C'], 'ZnC2H6'],
            [['Zn(CH3CO2)2', true, 'Zn', 'C'], 'ZnC4H6O4'],
            [['Zn(CN)2', true, 'Zn'], 'ZnC2N2'],
            [['Zn(OH)2', true, 'Zn'], 'ZnH2O2'],
            [['Zn(NO3)2', true, 'Zn'], 'ZnN2O6'],
            [['Zn(ClO3)2', false, 'Zn'], 'ZnCl2O6'],
            [['Zn3(PO4)2', false, 'Zn'], 'Zn3P2O8'],
            [['Ga(CH3)3', false, 'Ga'], 'GaC3H9'],
            [['Ga(OH)3', true, 'Ga'], 'GaH3O3'],
            [['Ga(NO3)3', true, 'Ga'], 'GaN3O9'],
            [['Sr(OH)2', true, 'Sr'], 'SrH2O2'],
            [['Sr(NO3)2', true, 'Sr'], 'SrN2O6'],
            [['Y(NO3)3', true, 'Y'], 'YN3O9'],
            [['Y(OH)3', true, 'Y'], 'YH3O3'],
            [['Y2(C2O4)3', true, 'Y'], 'Y2C6O12'],
            [['Zr(WO4)2', false, 'Zr'], 'ZrW2O8'],
            [['Mo(CO)6', true, 'Mo'], 'MoC6O6'],
            [['Ru(CO)5', true, 'Ru'], 'RuC5O5'],
            [['Cd(CN)2', true, 'Cd'], 'CdC2N2'],
            [['Cd(NO3)2', true, 'Cd'], 'CdN2O6'],
            [['Cd(OH)2', true, 'Cd'], 'CdH2O2'],
            [['In(OH)3', true, 'In'], 'InH3O3'],
            [['Sn(OH)2', true, 'Sn'], 'SnH2O2'],
            [['Te(OH)6', true, 'Te'], 'TeH6O6'],
            [['Ba(OH)2', true, 'Ba'], 'BaH2O2'],
            [['Ba(CN)2', true, 'Ba'], 'BaC2N2'],
            [['Ba(SCN)2', true, 'Ba'], 'BaC2N2S2'],
            [['Ba(NO3)2', true, 'Ba'], 'BaN2O6'],
            [['Ba(N3)2', true, 'Ba'], 'BaN6'],
            [['Ba(ClO)2', false, 'Ba'], 'BaCl2O2'],
            [['Ba(PO3)2', false, 'Ba'], 'BaP2O6'],
            [['Ba(ClO3)2', false, 'Ba'], 'BaCl2O6'],
            [['Ba(IO3)2', false, 'Ba'], 'BaI2O6'],
            [['Ba(ClO4)2', false, 'Ba'], 'BaCl2O8'],
            [['Ba(MnO4)2', false, 'Ba'], 'BaMn2O8'],
            [['La(OH)3', true, 'La'], 'LaH3O3'],
            [['La(NO3)3', false, 'La'], 'LaN3O9'],
            [['La2(C2O4)3', false, 'La'], 'La2C6O12'],
            [['Ce(OH)3', true, 'Ce'], 'CeH3O3'],
            [['Ce(OH)4', true, 'Ce'], 'CeH4O4'],
            [['Ce(C8H8)2', false, 'Ce'], 'CeC16H16'],
            [['Ce(NO3)3', true, 'Ce'], 'CeN3O9'],
            [['Ce(SO4)2', false, 'Ce'], 'CeS2O8'],
            [['Ce(ClO4)4', false, 'Ce'], 'CeCl4O16'],
            [['Ce2(CO3)3', true, 'Ce'], 'Ce2C3O9'],
            [['Ce2(C2O4)3', true, 'Ce'], 'Ce2C6O12'],
            [['Ce2O(NO3)6', true, 'Ce'], 'Ce2N6O19'],
            [['Ce2(SO4)3', false, 'Ce'], 'Ce2S3O12'],
            [['Pr(NO3)3', true, 'Pr'], 'PrN3O9'],
            [['Nd(OH)3', true, 'Nd'], 'NdH3O3'],
            [['Nd(O2C2H3)3', true, 'Nd', 'C'], 'NdC6H9O6'],
            [['Nd(NO3)3', true, 'Nd'], 'NdN3O9'],
            [['Nd2(CO3)3', true, 'Nd'], 'Nd2C3O9'],
            [['Nd2(C2O4)3', true, 'Nd'], 'Nd2C6O12'],
            [['Nd2(SO4)3', false, 'Nd'], 'Nd2S3O12'],
            [['Pm(OH)3', true, 'Pm'], 'PmH3O3'],
            [['Pm(NO3)3', true, 'Pm'], 'PmN3O9'],
            [['Sm(OH)3', true, 'Sm'], 'SmH3O3'],
            [['Sm(NO3)3', true, 'Sm'], 'SmN3O9'],
            [['Eu(OH)3', true, 'Eu'], 'EuH3O3'],
            [['Eu(NO3)3', true, 'Eu'], 'EuN3O9'],
            [['Eu2(C2O4)3', true, 'Eu', 'C'], 'Eu2C6O12'],
            [['Gd(OH)3', true, 'Gd'], 'GdH3O3'],
            [['Gd(NO3)3', true, 'Gd'], 'GdN3O9'],
            [['Tb(NO3)3', true, 'Tb'], 'TbN3O9'],
            [['Tb(OH)3', true, 'Tb'], 'TbH3O3'],
            [['Dy(OH)3', true, 'Dy'], 'DyH3O3'],
            [['Dy(NO3)3', true, 'Dy'], 'DyN3O9'],
            [['Ho(NO3)3', true, 'Ho'], 'HoN3O9'],
            [['Er(OH)3', true, 'Er'], 'ErH3O3'],
            [['Er(NO3)3', true, 'Er'], 'ErN3O9'],
            [['Tm(OH)3', true, 'Tm'], 'TmH3O3'],
            [['Tm(NO3)3', true, 'Tm'], 'TmN3O9'],
            [['Yb(NO3)3', false, 'Yb'], 'YbN3O9'],
            [['Yb2(SO4)3', false, 'Yb'], 'Yb2S3O12'],
            [['Lu(OH)3', true, 'Lu'], 'LuH3O3'],
            [['Lu(NO3)3', true, 'Lu'], 'LuN3O9'],
            [['Hf(NO3)4', true, 'Hf'], 'HfN4O12'],
            */
            [['ReH(CO)5', true, 'Re', 'C'], 'ReC5HO5'],
            [['ReBr(CO)5', false, 'Re'], 'ReBrC5O5'],
            /*
            [['Re2(CO)10', true, 'Re'], 'Re2C10O10'],
            [['Ir4(CO)12', true, 'Ir'], 'Ir4C12O12'],
            [['Pt(NH3)2Cl2', false, 'Pt'], 'PtN2H6Cl2'],
            [['Au2(SO4)2', false, 'Au'], 'Au2S2O8'],
            [['Pb(OH)2', true, 'Pb'], 'PbH2O2'],
            [['Pb(NO3)2', true, 'Pb'], 'PbN2O6'],
            [['Bi2O2(CO3)', true, 'Bi'], 'Bi2CO5'],
            [['Ra(NO3)2', true, 'Ra'], 'RaN2O6'],
            [['Ac(NO3)3', true, 'Ac'], 'AcN3O9'],
            [['Th(OH)4', true, 'Th'], 'ThH4O4'],
            [['Th(C8H8)2', true, 'Th', 'C'], 'ThC16H16'],
            [['Th(C2O4)2', true, 'Th', 'C'], 'ThC4O8'],
            [['Th(NO3)4', true, 'Th', 'N'], 'ThN4O12'],
            [['Pa(C8H8)2', true, 'Pa', 'C'], 'PaC16H16'],
            */
            [['U(C8H8)2', true, 'U', 'C'], 'UC16H16'],
            [['Np(C8H8)2', true, 'Np', 'C'], 'NpC16H16'],
            [['Np(NO3)4', true, 'Np', 'N'], 'NpN4O12'],
            /*
            [['NpO2(OH)3', true, 'Np'], 'NpH3O5'],
            [['Np(C2O4)2', true, 'Np'], 'NpC4O8'],
            [['Pu(C8H8)2', false, 'Pu'], 'PuC16H16'],
            [['Pu(NO3)4', true, 'Pu'], 'PuN4O12'],
            [['Am(OH)3', true, 'Am'], 'AmH3O3'],
            [['Am(NO3)3', true, 'Am'], 'AmN3O9'],
            [['Cm(NO3)3', true, 'Cm'], 'CmN3O9'],
            [['Bk(NO3)3', true, 'Bk'], 'BkN3O9'],
            */
            [['Cf[B6O8(OH)5]', true, 'Cf', 'B'], 'CfB6H5O13'],
        ];

        let failed = 0;
        let passed = 0;
        for (const test of tests) {
            const args = test[0];
            const expected = test[1];
            const actual = Molecules.convertFormula(...args);
            console.assert(actual === expected, args, `${actual} !== ${expected}`, 'not converted correctly.');
            if (actual === expected) {
                passed += 1;
            }
            else {
                failed += 1;
            }
        }
        console.log(`${failed} tests failed, ${passed} passed.`);

        return failed;
    }

    /**
     * Convert an object keyed by element symbols to a map keyed by atomic numbers.
     * @param {Object} components - Element counts, keyed by element symbols
     * @return {Map} Element counts, keyed by atomic numbers
     * @private
     */
    static #convertSymbols(components) {
        const atomic = new Map();
        for (const symbol in components) {
            const protons = Elements.findProtons(symbol);
            if (protons in atomic) {
                atomic.set(protons, atomic.get(protons) + components[symbol]);
            }
            else {
                atomic.set(protons, components[symbol]);
            }
        }
        return atomic;
    }

    static #foundElements = {};

    /**
     * Find molecular formulas that contain a given element.
     * @param {string} symbol - An element symbol
     * @returns {Array} Molecular formulas that contain the given symbol
     */
    static findElement(symbol) {
        if (symbol in Molecules.#foundElements) {
            return Molecules.#foundElements[symbol];
        }
        const formulas = [];
        for (const formula in moleculesData) {
            const elements = Molecules.parse(formula);
            if (symbol in elements) {
                formulas.push(formula);
            }
        }
        Molecules.#foundElements[symbol] = formulas;
        return formulas;
    }

    static #foundNames = {};

    /**
     * Find molecular formulas that have a given name.
     * @param {string} name - A molecule name
     * @returns {Array} Molecular formulas that match the given name
     */
    static findName(name) {
        if (name in Molecules.#foundNames) {
            return Molecules.#foundNames[name];
        }
        const formulas = [];
        for (const formula in moleculesData) {
            const molecules = moleculesData[formula];
            if (molecules.includes(name)) {
                formulas.push(formula);
            }
        }
        Molecules.#foundNames[name] = formulas;
        return formulas;
    }

    /**
     * Find duplicate molecule names in our database.
     * @returns {object} Molecular formulas, keyed by molecule names
     */
    static findDuplicateNames() {
        console.time('findDuplicateNames');
        const dupes = {};
        for (const formula in moleculesData) {
            const names = moleculesData[formula];
            for (const name of names) {
                const formulas = Molecules.findName(name);
                if (formulas.length < 2) {
                    continue;
                }
                if (!(name in dupes)) {
                    dupes[name] = [];
                }
                for (const f of formulas) {
                    if (!dupes[name].includes(f)) {
                        dupes[name].push(f);
                    }
                }
            }
        }
        console.timeEnd('findDuplicateNames');
        return dupes;
    }

    /**
     * Find duplicate formulas in our database.
     * @returns {object} Molecular formulas that have duplicates
     */
    static findDuplicateFormulas() {
        console.time('findDuplicateFormulas');
        const dupes = {};
        for (const formula in moleculesData) {
            const matches = Molecules.findEquivalentFormulas(formula);
            if (matches.length < 1) {
                continue;
            }
            if (!(formula in dupes)) {
                dupes[formula] = [];
            }
            for (const match of matches) {
                if (!dupes[formula].includes(match)) {
                    dupes[formula].push(match);
                }
            }
        }
        console.timeEnd('findDuplicateFormulas');
        return dupes;
    }

    /**
     * Find equivalent molecular formulas in our database.
     * @param {string} formula - A molecular formula
     * @returns {Array<string>} An array of formulas equivalent to the one given
     */
    static findEquivalentFormulas(formula) {
        const formulas = [];
        for (const f in moleculesData) {
            if (formula === f) {
                continue;
            }
            const result = Molecules.compare(formula, f);
            if (result === 0) {
                formulas.push(f);
            }
        }
        return formulas;
    }

    /**
     * Format a molecular formula for output to HTML.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} HTML
     */
    static format(formula) {
        return formula.replaceAll(/\d+/g, '<sub>$&</sub>');
    }

    /**
     * Generate a URL for a molecular formula on the ChemSpider site.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} URL
     */
    static getChemSpiderURL(formula) {
        return `https://www.chemspider.com/Search.aspx?q=${formula}`;
    }

    /**
     * Generate a URL for a molecular formula on NIH's PubChem site.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} URL
     */
    static getPubChemURL(formula) {
        return `https://pubchem.ncbi.nlm.nih.gov/#query=${formula}`;
    }

    /**
     * Generate a URL for a molecular formula on NIST's WebBook site.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} URL
     */
    static getWebBookURL(formula) {
        return `https://webbook.nist.gov/cgi/cbook.cgi?Formula=${formula}&NoIon=on&Units=SI`;
    }

    /**
     * List molecular formulas.
     *
     * @param {string|null} symbol - An element symbol
     * @returns {Array<string>} A list of molecular formulas
     */
    static list(symbol = null) {
        return symbol ? Molecules.findElement(symbol) : Object.keys(moleculesData);
    }

    static #parsed = {};

    /**
     * Parse a molecular formula into its component elements.
     *
     * @param {string} formula - A molecular formula
     * @returns {object} Element counts, keyed by element symbols
     */
    static parse(formula) {
        if (formula in Molecules.#parsed) {
            return Molecules.#parsed[formula];
        }
        formula = formula.toString();
        const re = /([A-Z][a-z]?)(\d*)/g;
        const matches = formula.matchAll(re);
        const elements = {};
        for (const components of matches) {
            const element = components[1];
            const count = (components[2] === '') ? 1 : parseInt(components[2]);
            if (Object.hasOwn(elements, element)) {
                //console.log(formula, 'repeats', element);
                elements[element] += count;
            }
            else {
                elements[element] = count;
            }
        }
        Molecules.#parsed[formula] = elements;
        return elements;
    }

    /**
     * Order object properties that represent a molecular formula.
     *
     * @param {object} elements - Element counts, keyed by element symbols
     * @param {...string} priorities - Element symbols to prioritize
     * @returns {object} An object with prioritized elements first
     */
    static prioritizeElements(elements, ...priorities) {
        const clone = structuredClone(elements);
        if (priorities.length < 1) {
            return clone;
        }
        const components = {};
        for (const priority of priorities) {
            if (!(priority in elements)) {
                continue;
            }
            components[priority] = elements[priority];
            delete clone[priority];
        }
        for (const element in clone) {
            components[element] = clone[element];
        }
        return components;
    }

    /**
     * Order an objects properties according to atomic number, ascending.
     *
     * @param {object} elements - Element counts, keyed by element symbols
     * @returns {object} An object with keys in order of atomic number, ascending
     */
    static sortElements(elements) {
        // Accepts an object of element counts, keyed by element symbols.
        // Returns a copy of the object with the keys sorted.
        const keys = Object.keys(elements).sort(Elements.compare);
        const components = {};
        for (const element of keys) {
            components[element] = elements[element];
        }
        return components;
    }

    /**
     * Sort molecular formulas according to their elements.
     *
     * @param {Array<string>} formulas - Molecular formulas to be sorted
     * @param {string} priority - An atomic symbol to prioritize
     */
    static sort(formulas = [], priority = 'H') {
        if (formulas.length < 1) {
            formulas = Object.keys(moleculesData);
        }
        const sorted = formulas.toSorted((a, b) => Molecules.compare(a, b, priority));

        for (let i = 0; i < formulas.length; i++) {
            if (formulas[i] !== sorted[i]) {
                Molecules.compare(formulas[i], sorted[i], priority, true);
                break;
            }
        }

        return sorted;
    }

    /**
     * Sort all molecular formulas in our database, prioritizing the first element.
     */
    static sortByFirstElement() {
        console.time('Molecules.sortByFirstElement()');
        const byElement = {};
        for (const formula in moleculesData) {
            const components = Molecules.parse(formula);
            const element = Object.keys(components)[0];
            if (element in byElement) {
                byElement[element].push(formula);
            }
            else {
                byElement[element] = [formula];
            }
        }
        for (const element in byElement) {
            const formulas = byElement[element];
            Molecules.sort(formulas, element);
        }
        console.timeEnd('Molecules.sortByFirstElement()');
    }

    /**
     * Calculate the weight of a molecular formula.
     *
     * @param {string} formula - A molecular formula
     * @returns {integer} The molecular weight of the formula, rounded to the
     * nearest integer
     */
    static weigh(formula) {
        const elements = Molecules.parse(formula);
        let weight = 0;
        for (const symbol in elements) {
            const protons = Elements.findProtons(symbol);
            const element = elementsData.get(protons);
            weight += Math.round(element.weight) * elements[symbol];
        }
        return weight;
    }

    /**
     * Generate the HTML for the molecules page.
     *
     * @returns {string} HTML
     */
    static render() {
        document.title = 'Molecules';
        let html = `<h1>${document.title}</h1>`;
        html += Molecules.renderChart();
        html += Molecules.renderList();
        Molecules.sortByFirstElement();
        //console.log(Molecules.findDuplicateNames());
        //console.log(Molecules.findDuplicateFormulas());
        return html;
    }

    /**
     * Generate the HTML for the molecules chart.
     *
     * @returns {string} HTML
     */
    static renderChart() {
        console.time('molecules-chart');
        const counts = new Map();
        let max = 0;
        for (const [protons, element] of elementsData) {
            const formulas = Molecules.list(element.symbol);
            let count = 0;
            for (const formula of formulas) {
                const molecules = moleculesData[formula];
                count += molecules.length;
            }
            if (count > max) {
                max = count;
            }
            counts.set(protons, count);
        }

        let html = '<section class="molecules-chart">';
        for (const [protons, count] of counts) {
            const element = elementsData.get(protons);
            const percent = ((count / max) * 100).toFixed(1);
            const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
            html += `<div class="${typeClass}" style="width: calc(${percent}% + var(--molecules-width-min))">`;
            html += `<a href="?protons=${protons}" title="${element.name}">`;
            html += `${element.symbol}: ${count}`;
            html += '<span class="link"></span></a></div>';
        }
        html += '</section>';
        console.timeEnd('molecules-chart');

        return html;
    }

    /**
     * Generate the HTML for the molecule page.
     *
     * @param {string} molecule - A molecule name
     * @returns {string} HTML
     */
    static renderMolecule(molecule) {
        const formulas = Molecules.findName(molecule);

        if (formulas.length === 1) {
            return Molecules.renderFormula(formulas[0]);
        }

        let html = `<h1>${molecule}</h1>`;

        if (formulas.length === 0) {
            html += '<p>No formulas found.</p>';
            return html;
        }

        html += '<ul>';
        for (const formula of formulas) {
            const linkText = Molecules.format(formula);
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }

    /**
     * Generate the HTML for the formula page.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} HTML
     */
    static renderFormula(formula) {
        const pretty = Molecules.format(formula);

        document.title = formula;

        let html = `<h1>${pretty}</h1>`;
        html += `<p>Molecular weight: ${Molecules.weigh(formula)}</p>`;
        html += '<h2>Links</h2>';

        if (formula in moleculesData) {
            html += '<ul>';
            for (const chemical of moleculesData[formula]) {
                html += `<li>${Link.toWikipedia(chemical, `Wikipedia: ${chemical}`)}</li>`;
            }
            html += '</ul>';
        }
        else {
            html += '<p>Chemical formula not found.</p>';
        }

        html += '<ul>';
        html += `<li>${Link.create(Molecules.getWebBookURL(formula), 'NIST WebBook', true)}</li>`;
        html += `<li>${Link.create(Molecules.getChemSpiderURL(formula), 'ChemSpider', true)}</li>`;
        html += `<li>${Link.create(Molecules.getPubChemURL(formula), 'PubChem', true)}</li>`;
        html += '</ul>';

        const elements = Molecules.parse(formula);

        html += '<h2>Contains</h2>';
        html += '<section class="elements">';
        for (const symbol in elements) {
            const protons = Elements.findProtons(symbol);
            html += Elements.formatElement(protons, true);
        }
        html += '</section>';

        return html;
    }

    /**
     * Generate the HTML for a list of molecular formulas.
     * @param {string|null} [symbol=null] - An element symbol
     * @returns {string} HTML
     */
    static renderList(symbol = null) {
        const formulas = Molecules.list(symbol);
        if (formulas.length < 1) {
            return '';
        }

        let moleculesCount = 0;
        for (const formula of formulas) {
            const names = moleculesData[formula];
            moleculesCount += names.length;
        }

        const formulasTally = `${formulas.length} Formula${(formulas.length === 1) ? '' : 's'}`;
        const moleculesTally = `${moleculesCount} Molecule${(moleculesCount === 1) ? '' : 's'}`;
        let html = `<h3>${formulasTally}, ${moleculesTally}</h3>`;
        html += '<ul>';
        for (const formula of formulas) {
            const names = moleculesData[formula];
            const linkText = `${Molecules.format(formula)}: ${names.join(', ')}`;
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }
}

/**
 * @class Isotopes
 */
class Isotopes {
    /**
     * Get all isotopes in our database: the most stable for each element.
     * @returns {Object} Atomic numbers keyed by neutron counts
     */
    static getAll() {
        const all = {};

        for (const [protons, isotopes] of isotopesData.primordial) {
            for (const isotope of isotopes) {
                const neutrons = isotope - protons;
                if (neutrons in all) {
                    all[neutrons].push(protons);
                }
                else {
                    all[neutrons] = [protons];
                }
            }
        }

        for (const [protons, isotopes] of isotopesData.synthetic) {
            for (const isotope in isotopes) {
                const neutrons = isotope - protons;
                if (neutrons in all) {
                    all[neutrons].push(protons);
                }
                else {
                    all[neutrons] = [protons];
                }
            }
        }

        return all;
    }

    /**
     * Generate a chart of the most stable isotopes for each element.
     * @returns {string} HTML
     */
    static render() {
        const all = Isotopes.getAll();

        document.title = 'Isotopes';

        let html = '<h1>Most Stable Isotopes of Each Element</h1>';
        html += '<table class="isotopes">';

        for (let neutrons = 177; neutrons >= -1; neutrons--) {
            html += '<tr>';

            if (neutrons === 177) {
                html += '<th class="y-axis max" rowspan="19">177</th>';
            }
            else if (neutrons === 158) {
                html += '<th class="y-axis label" rowspan="140">Neutrons</th>';
            }
            else if (neutrons === 18) {
                html += '<th class="y-axis min" rowspan="19">0</th>';
            }
            else if (neutrons === -1) {
                // Work around a colspan border rendering bug in Safari.
                // See: https://bugs.webkit.org/show_bug.cgi?id=20840
                html += '<th class="empty"></th>';
                html += '<th class="empty"></th>';
                html += '<th class="x-axis min" colspan="18">1</th>';
                html += '<th class="x-axis label" colspan="80">Protons</th>';
                html += '<th class="x-axis max" colspan="19">118</th>';
                continue;
            }

            for (const [protons, element] of elementsData) {
                const elements = all[neutrons];
                if (!(neutrons in all) || elements.indexOf(protons) === -1) {
                    const title = `\n\nNeutrons: ${neutrons}`;
                    html += `<td class="empty" title="${title}"></td>`;
                }
                else {
                    const tdClass = (isotopesData.synthetic.has(protons)) ? 'synthetic' : 'primordial';
                    const nucleons = neutrons + protons;
                    const title = `${element.symbol}: ${element.name}\nProtons: ${protons}\nNeutrons: ${neutrons}\nNucleons: ${nucleons}`;
                    const link = `<a href="?protons=${protons}"><span class="link"></span></a>`;
                    html += `<td class="${tdClass}" title="${title}">${link}</td>`;
                }
            }

            html += '</tr>';
        }

        html += '</table>';

        return html;
    }
}

/**
 * @class Test
 */
class Test {
    /**
     * Generate a report for automated test results.
     * @returns {string} HTML
     */
    static render() {
        const failures = Test.run();
        const color = failures ? 'red' : 'green';
        document.title = 'Automated Tests';
        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += `<p>Failures: <span style="color: ${color}">${failures}</span></p>`;
        html += '</main>';
        return html;
    }

    /**
     * Run automated tests.
     * @returns {integer} How many tests failed
     */
    static run() {
        let failures = 0;
        failures += Molecules.compareTest();
        failures += Molecules.convertFormulaTest();
        return failures;
    }
}

Page.render();
