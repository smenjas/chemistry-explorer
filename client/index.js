import Elements from './elements.js';
import Isotopes from './isotopes.js';
import Molecules from './molecules.js';
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
        return Molecules.renderFormula(formula);
    }

    if (Elements.groups.has(group)) {
        return Elements.renderGroupPage(group);
    }

    if (Elements.periods.has(period)) {
        return Elements.renderPeriodPage(period);
    }

    if (params.has('search')) {
        return Search.render(search);
    }

    switch (view) {
    case 'abundance':
        return Elements.renderAbundance();
    case 'molecules':
        return Molecules.render();
    case 'isotopes':
        return Isotopes.render();
    case 'test':
        return Test.render();
    }

    // Show the periodic table by default.
    return Elements.render(protons);
}

const params = new URLSearchParams(window.location.search);
const html = render(params);

document.body.insertAdjacentHTML('beforeend', html);
Elements.addEventHandlers();
Search.addEventHandlers();
