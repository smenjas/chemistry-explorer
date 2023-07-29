import * as common from '../common.js';
import Element from '../element.js';
import elementData from '../element-data.js';
import isotopeData from '../isotope-data.js';
import IsotopeView from '../view/isotope.js';
import Link from '../link.js';
import MoleculeView from '../view/molecule.js';

/**
 * Show information about atomic elements.
 */
export default class ElementView {
    /**
     * Add event handlers to the page.
     */
    static addEventHandlers() {
        const abundanceScale = document.querySelector('form#abundance-scale');
        if (abundanceScale) {
            abundanceScale.addEventListener('change', ElementView.handleAbundanceScale);
        }
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
        const element = elementData.get(protons);

        let html = `<span class="atomic">${protons}<br></span>`;
        html += `<span class="symbol">${element.symbol}</span>`;
        html += `<span class="name"><br>${element.name}</span>`;
        html += `<span class="weight"><br>${ElementView.formatWeight(element.weight)}</span>`;

        if (link) {
            html = `<a href="?protons=${protons}">${html}<span class="link"></span></a>`;
        }

        const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
        const title = element.type;
        html = `<article class="${typeClass} element" title="${title}">${html}</article>`;

        return html;
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
        const groupURL = Element.groupURLs.get(group);
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
        const element = elementData.get(protons);
        let html = '';

        if (protons && !element) {
            console.warn('Unknown element with atomic number:', protons);
        }

        if (element) {
            document.title = `${element.symbol}: ${element.name}`;
            html += ElementView.renderElementNav(protons);
            html += ElementView.renderElement(protons);
        }
        else {
            document.title = 'Periodic Table of the Elements';
            html += ElementView.renderElements();
        }

        return `<main><h1>${document.title}</h1>${html}</main>`;
    }

    /**
     * Toggle between linear and logarithmic scales for the abundance chart.
     *
     * @param {Object} event - A browser event object
     */
    static handleAbundanceScale(event) {
        const log = (event.target.value === 'log');
        document.body.innerHTML = ElementView.renderAbundance(log);
        ElementView.addEventHandlers();
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
        for (const element of elementData.values()) {
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
        for (const [protons, element] of elementData) {
            const abundance = element.crust;
            const width = Element.calculateBarWidth(abundance, max, log);
            const percent = (width * 100).toFixed(1);
            const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
            const minWidth = (abundance === 0) ? 'var(--abundance-width-none)' : 'var(--abundance-width-min)';
            html += `<div class="${typeClass}" style="width: calc(${percent}% + ${minWidth})">`;
            html += `<a href="?protons=${protons}" title="${element.name}">`;
            html += `${element.symbol}: ${ElementView.formatAbundance(abundance)}`;
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

        for (const [group, oldgroup] of Element.groups) {
            const title = `Group ${group} (formerly ${oldgroup})`;
            const link = `<a href="?group=${group}">${group}<br>${oldgroup}<span class="link"></span></a>`;
            html += `<th class="group group-${group}" title="${title}">${link}</th>`;
        }

        html += '<th class="empty"></th>';
        html += '</tr></thead><tbody>';

        for (const [period, bounds] of Element.periods) {
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
                else if (period === 6 && protons === Element.periods.get('lanthanides').min) {
                    // Skip the lanthanides.
                    protons = Element.periods.get('lanthanides').max + 1;
                }
                else if (period === 7 && protons === Element.periods.get('actinides').min) {
                    // Skip the actinides.
                    protons = Element.periods.get('actinides').max + 1;
                }

                cells += `<td>${ElementView.formatElement(protons, true)}</td>`;
                protons++;
            }

            html += ElementView.renderPeriodRow(cells, period);

            if (period === 7) {
                break;
            }
        }

        html += '</tbody></table>';

        html += '<table class="all rare-earth elements"><tbody>';

        for (const [category, bounds] of Element.periods) {
            if (category !== 'lanthanides' && category !== 'actinides') {
                continue;
            }

            const min = bounds['min'];
            const max = bounds['max'];
            let cells = '';

            for (let protons = min; protons <= max;) {
                cells += `<td>${ElementView.formatElement(protons, true)}</td>`;
                protons++;
            }

            const period = (category === 'lanthanides') ? 6 : 7;
            html += ElementView.renderPeriodRow(cells, period);
        }

        html += '</tbody></table>';
        html += '</section>';

        html += ElementView.renderElementsNav();

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
        const element = elementData.get(protons);

        let html = '<section class="element">';
        html += ElementView.formatElement(protons, false);

        const crustLink = Link.toWikipedia('Abundances_of_the_elements_(data_page)', 'Abundance');

        html += '<aside>';
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${element.name}#History`, 'Name')}: ${element.name}</li>`;
        html += `<li>${Link.toWikipedia('Chemical_symbol', 'Symbol')}: ${element.symbol}</li>`;
        html += `<li>${Link.toWikipedia('Atomic_number', 'Atomic Number')}: ${protons}</li>`;
        html += `<li>${Link.toWikipedia('Standard_atomic_weight', 'Weight')}: ${element.weight}</li>`;
        html += `<li>${Link.toWikipedia('Density', 'Density')}: ${ElementView.formatDensity(element.density)}</li>`;
        html += `<li>${ElementView.linkBlock()}: ${ElementView.linkBlock(element.block)}</li>`;
        html += `<li>${Link.toWikipedia('Group_(periodic_table)', 'Group')}: ${ElementView.linkGroup(element.group)}</li>`;
        html += `<li>${ElementView.linkPeriod()}: ${ElementView.linkPeriod(element.period)}</li>`;
        html += `<li>${Link.toWikipedia('Melting_point', 'Melting Point')}: ${ElementView.formatCelsius(element.melts)}</li>`;
        html += `<li>${Link.toWikipedia('Boiling_point', 'Boiling Point')}: ${ElementView.formatCelsius(element.boils)}</li>`;
        html += `<li>${crustLink}: ${ElementView.formatAbundance(element.crust)}</li>`;
        html += `<li>Type: ${Link.create(Element.typeURLs[element.type], element.type, true)}</li>`;
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

        if (isotopeData.primordial.has(protons)) {
            const isotopes = isotopeData.primordial.get(protons);
            html += '<ul>';
            for (const mass of isotopes) {
                const isotopeName = IsotopeView.formatIsotope(protons, mass);
                const isotopeLink = Link.toWikipedia(`${element.name}-${mass}`, `${isotopeName}`);
                html += `<li>${isotopeLink}</li>`;
            }
            html += '</ul>';
        }
        else if (isotopeData.synthetic.has(protons)) {
            const isotopes = isotopeData.synthetic.get(protons);
            const mass = Object.keys(isotopes)[0];
            const time = ElementView.formatScientificNotation(isotopes[mass]);
            const isotopeName = IsotopeView.formatIsotope(protons, mass);
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

        html += MoleculeView.renderList(element.symbol);
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
        const prev = elementData.get(protons - 1);
        const next = elementData.get(protons + 1);

        const up = Element.findPreviousInGroup(protons);
        const down = Element.findNextInGroup(protons);

        const groupPrev = elementData.get(up);
        const groupNext = elementData.get(down);

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
        let html = `Density: ${ElementView.formatDensity(element.density, true)}`;
        html += `<br>Melting Point: ${ElementView.formatCelsius(element.melts)}`;
        html += `<br>Boiling Point: ${ElementView.formatCelsius(element.boils)}`;
        html += `<br>Abundance: ${ElementView.formatAbundance(element.crust)}`;
        return html;
    }

    /**
     * Create HTML showing an entire group of elements.
     *
     * @param {integer} group - A column in the periodic table
     * @returns {string} HTML: a table
     */
    static renderGroup(group) {
        if (!Element.groupElements.has(group)) {
            return '';
        }

        let html = '<table class="elements group"><tbody>';
        const elements = Element.groupElements.get(group);
        for (const protons of elements) {
            const element = elementData.get(protons);
            html += '<tr>';
            html += `<td>${ElementView.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">${ElementView.renderElementHighlights(element)}</td>`;
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
        html += ElementView.renderGroupNav(group);
        html += ElementView.renderGroup(group);
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
        if (!Element.periods.has(period)) {
            return '';
        }

        let html = '<table class="elements period"><tbody>';
        const { min, max } = Element.periods.get(period);
        for (let protons = min; protons <= max; protons++) {
            const element = elementData.get(protons);
            html += '<tr>';
            html += `<td>${ElementView.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">${ElementView.renderElementHighlights(element)}</td>`;
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
        html += ElementView.renderPeriodNav(period);
        html += ElementView.renderPeriod(period);
        html += '</main>';
        return html;
    }
}
