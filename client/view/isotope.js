import elementData from '../element-data.js';
import isotopeData from '../isotope-data.js';
import Isotope from '../isotope.js';

/**
 * Show information about atomic isotopes: elements whose neutron numbers vary.
 */
export default class IsotopeView {
    /**
     * Create a chart of the most stable isotopes for each element.
     *
     * @returns {string} HTML: a heading and a table
     */
    static render() {
        const all = Isotope.getAll();

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

            for (const [protons, element] of elementData) {
                const elements = all[neutrons];
                if (!(neutrons in all) || elements.indexOf(protons) === -1) {
                    const title = `\n\nNeutrons: ${neutrons}`;
                    html += `<td class="empty" title="${title}"></td>`;
                }
                else {
                    const tdClass = (isotopeData.synthetic.has(protons)) ? 'synthetic' : 'primordial';
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
