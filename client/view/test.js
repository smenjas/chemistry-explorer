import Test from '../test.js';

/**
 * Run automated tests and report the results.
 */
export default class TestView {
    /**
     * Create a report for automated test results.
     *
     * @returns {string} HTML: a main block
     */
    static render() {
        const failures = Test.runAll();
        const color = failures ? 'red' : 'green';
        document.title = 'Automated Tests';
        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += `<p>Failures: <span style="color: ${color}">${failures}</span></p>`;
        html += '</main>';
        return html;
    }
}
