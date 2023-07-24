import Elements from './elements.js';
import Isotopes from './isotopes.js';
import Molecules from './molecules.js';
import Search from './search.js';
import Test from './test.js';

/**
 * Create a web page.
 */
export default class Page {
    /**
     * Create HTML based on the URL.
     *
     * @param {Object} params - URLSearchParams representing the URL's query string
     * @returns {string} HTML
     */
    static render(params) {
        const formula = params.get('formula');
        const group = parseInt(params.get('group'));
        const period = parseInt(params.get('period'));
        const protons = parseInt(params.get('protons'));
        const search = params.get('search');
        const view = params.get('view');

        if (formula) {
            return Molecules.renderFormula(formula);
        }

        if (group && Elements.groups.has(group)) {
            document.title = `Group ${group}`;
            let html = '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderGroupNav(group);
            html += Elements.renderGroup(group);
            html += '</main>';
            return html;
        }

        if (period && Elements.periods.has(period)) {
            document.title = `Period ${period}`;
            let html = '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderPeriodNav(period);
            html += Elements.renderPeriod(period);
            html += '</main>';
            return html;
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

    static display() {
        const params = new URLSearchParams(window.location.search);
        const html = Page.render(params);
        document.body.insertAdjacentHTML('beforeend', html);
        Elements.addEventHandlers();
        Search.addEventHandlers();
    }
}
