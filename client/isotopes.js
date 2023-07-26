import * as common from './common.js';
import elementsData from './elementsData.js';
import isotopesData from './isotopesData.js';

/**
 * Show information about atomic isotopes: elements whose neutron numbers vary.
 */
export default class Isotopes {
    /**
     * Get all isotopes in our database: the most stable for each element.
     *
     * @returns {Object} Atomic numbers keyed by neutron counts
     */
    static getAll() {
        const all = {};

        for (const [protons, isotopes] of isotopesData.primordial) {
            for (const isotope of isotopes) {
                const neutrons = isotope - protons;
                common.pushTo(all, neutrons, protons);
            }
        }

        for (const [protons, isotopes] of isotopesData.synthetic) {
            for (const isotope in isotopes) {
                const neutrons = isotope - protons;
                common.pushTo(all, neutrons, protons);
            }
        }

        return all;
    }

    /**
     * Create a chart of the most stable isotopes for each element.
     *
     * @returns {string} HTML: a heading and a table
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
