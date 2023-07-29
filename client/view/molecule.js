import Element from '../element.js';
import elementData from '../element-data.js';
import ElementView from '../view/element.js';
import Link from '../link.js';
import moleculeData from '../molecule-data.js';
import Molecule from '../molecule.js';
import Search from '../search.js';
import SearchView from '../view/search.js';

/**
 * Show information about molecules.
 */
export default class MoleculeView {
    /**
     * Format a molecular formula for output to HTML.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} HTML: inline text
     */
    static format(formula) {
        return formula.replaceAll(/\d+/g, '<sub>$&</sub>');
    }

    /**
     * Create the HTML for the molecules page.
     *
     * @returns {string} HTML: a chart and a list
     */
    static render() {
        document.title = 'Molecules';
        let html = `<h1>${document.title}</h1>`;
        html += MoleculeView.renderChart();
        html += MoleculeView.renderList();
        Molecule.sortByFirstElement();
        //console.log(Molecule.findDuplicateNames());
        //console.log(Molecule.findDuplicateFormulas());
        return html;
    }

    /**
     * Create the HTML for the molecules chart.
     *
     * @returns {string} HTML: a chart
     */
    static renderChart() {
        console.time('molecules-chart');
        const counts = new Map();
        let max = 0;
        for (const [protons, element] of elementData) {
            const formulas = Molecule.list(element.symbol);
            let count = 0;
            for (const formula of formulas) {
                const molecules = moleculeData[formula];
                count += molecules.length;
            }
            if (count > max) {
                max = count;
            }
            counts.set(protons, count);
        }

        let html = '<section class="molecules-chart">';
        for (const [protons, count] of counts) {
            const element = elementData.get(protons);
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
     * Create the HTML for the formula page.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} HTML: headings and blocks
     */
    static renderFormula(formula) {
        const pretty = MoleculeView.format(formula);

        document.title = formula;

        let html = `<h1>${pretty}</h1>`;
        html += `<p>Molecular weight: ${Molecule.weigh(formula)}</p>`;
        html += '<h2>Links</h2>';

        if (formula in moleculeData) {
            html += '<ul>';
            for (const chemical of moleculeData[formula]) {
                html += `<li>${Link.toWikipedia(chemical, `Wikipedia: ${chemical}`)}</li>`;
            }
            html += '</ul>';
        }
        else {
            html += '<p>Chemical formula not found.</p>';
        }

        html += '<ul>';
        html += `<li>${Link.create(Molecule.getWebBookURL(formula), 'NIST WebBook', true)}</li>`;
        html += `<li>${Link.create(Molecule.getChemSpiderURL(formula), 'ChemSpider', true)}</li>`;
        html += `<li>${Link.create(Molecule.getPubChemURL(formula), 'PubChem', true)}</li>`;
        html += '</ul>';

        const elements = Molecule.parse(formula);

        html += '<h2>Contains</h2>';
        html += '<section class="elements">';
        for (const symbol in elements) {
            const protons = Element.findProtons(symbol);
            html += ElementView.formatElement(protons, true);
        }
        html += '</section>';

        return html;
    }

    /**
     * Create the HTML for a list of molecular formulas.
     *
     * @param {string|null} [symbol=null] - An element symbol
     * @returns {string} HTML: a heading and a list
     */
    static renderList(symbol = null) {
        const formulas = Molecule.list(symbol);
        if (formulas.length < 1) {
            return '';
        }

        let moleculesCount = 0;
        for (const formula of formulas) {
            const names = moleculeData[formula];
            moleculesCount += names.length;
        }

        const formulasTally = `${formulas.length} Formula${(formulas.length === 1) ? '' : 's'}`;
        const moleculesTally = `${moleculesCount} Molecule${(moleculesCount === 1) ? '' : 's'}`;
        let html = `<h3>${formulasTally}, ${moleculesTally}</h3>`;
        html += '<ul>';
        for (const formula of formulas) {
            const names = moleculeData[formula];
            const linkText = `${MoleculeView.format(formula)}: ${names.join(', ')}`;
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }

    /**
     * Create the HTML for a word cloud of molecule names.
     *
     * @returns {string} HTML: a paragraph block
     */
    static renderWords() {
        console.time('MoleculeView.renderWords()');
        //console.time('MoleculeView.renderWords() collecting');
        const strings = [];
        for (const names of Object.values(moleculeData)) {
            for (const name of names) {
                const string = name.replace(/\([IV,]+\)/i, '').replace('′', '\'',);
                strings.push(string);
            }
        }
        //console.timeEnd('MoleculeView.renderWords() collecting');

        const words = Search.countWords(strings);

        //console.time('MoleculeView.renderWords() pruning');
        for (const [word, count] of Object.entries(words)) {
            if (count === 1 || word.length < 3) {
                delete words[word];
            }
        }
        //console.timeEnd('MoleculeView.renderWords() pruning');

        const html = SearchView.renderWords(words);

        console.timeEnd('MoleculeView.renderWords()');
        return html;
    }
}
