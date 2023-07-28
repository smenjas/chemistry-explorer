import Element from './element.js';
import ElementView from './view/element.js';
import IsotopeView from './view/isotope.js';
import Molecule from './molecule.js';
import Search from './search.js';
import Test from './test.js';

/**
 * Create HTML based on the URL.
 *
 * @param {Object} params - URLSearchParams representing the URL's query string
 * @returns {string} HTML
 */
function render(params) {
    const formula = params.get('formula');
    const group = parseInt(params.get('group'));
    const period = parseInt(params.get('period'));
    const protons = parseInt(params.get('protons'));
    const search = params.get('search');
    const view = params.get('view');

    if (formula) {
        return Molecule.renderFormula(formula);
    }

    if (Element.groups.has(group)) {
        return ElementView.renderGroupPage(group);
    }

    if (Element.periods.has(period)) {
        return ElementView.renderPeriodPage(period);
    }

    if (params.has('search')) {
        return Search.render(search);
    }

    switch (view) {
    case 'abundance':
        return ElementView.renderAbundance();
    case 'molecules':
        return Molecule.render();
    case 'isotopes':
        return IsotopeView.render();
    case 'test':
        return Test.render();
    }

    // Show the periodic table by default.
    return ElementView.render(protons);
}

const params = new URLSearchParams(window.location.search);
const html = render(params);

document.body.insertAdjacentHTML('beforeend', html);
ElementView.addEventHandlers();
Search.addEventHandlers();
