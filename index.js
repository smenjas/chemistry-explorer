import Element from './element.js';
import Isotope from './isotope.js';
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
        return Element.renderGroupPage(group);
    }

    if (Element.periods.has(period)) {
        return Element.renderPeriodPage(period);
    }

    if (params.has('search')) {
        return Search.render(search);
    }

    switch (view) {
    case 'abundance':
        return Element.renderAbundance();
    case 'molecules':
        return Molecule.render();
    case 'isotopes':
        return Isotope.render();
    case 'test':
        return Test.render();
    }

    // Show the periodic table by default.
    return Element.render(protons);
}

const params = new URLSearchParams(window.location.search);
const html = render(params);

document.body.insertAdjacentHTML('beforeend', html);
Element.addEventHandlers();
Search.addEventHandlers();
