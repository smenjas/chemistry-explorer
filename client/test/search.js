import Search from '../search.js';
import Test from '../test.js';

/**
 * Search for elements and molecules.
 */
export default class SearchTest {
    /**
     * Test Search.findMolecules().
     *
     * @returns {integer} How many tests failed
     */
    static findMolecules() {
        const tests = [
            [[''], {}],
            [[' '], {}],
            [['he'], {}],
            [['', 'He'], {HeLi: ['Lithium helium'], Na2He: ['Disodium helide']}],
            [['he', 'He'], {HeLi: ['Lithium helium'], Na2He: ['Disodium helide']}],
            [['heliu', 'He'], {HeLi: ['Lithium helium']}],
            [['magic'], {HSbF6SO3: ['Magic acid']}],
        ];

        return Test.run(Search.findMolecules, tests);
    }

    /**
     * Test Search.findFormulas().
     *
     * @returns {integer} How many tests failed
     */
    static findFormulas() {
        const tests = [
            [['', {}, []], {}],
            [[' ', {}, []], {}],
            [['w3', {}, []], {Nd2W3O12: ['Neodymium tungstate']}],
            [['y3', {}, []], {Y3Al5O12: ['Yttrium aluminum garnet']}],
        ];

        return Test.run(Search.findFormulas, tests);
    }

    /**
     * Test Search.process().
     *
     * @returns {integer} How many tests failed
     */
    static process() {
        const tests = [
            [[''], {elements: new Set(), molecules: {}}],
            [[' '], {elements: new Set(), molecules: {}}],
            [['he'], {elements: new Set([2]), molecules: {HeLi: ['Lithium helium'], Na2He: ['Disodium helide']}}],
            [['w3'], {elements: new Set([8, 60, 74]), molecules: {Nd2W3O12: ['Neodymium tungstate']}}],
            [['magic'], {elements: new Set([1, 8, 9, 16, 51]), molecules: {HSbF6SO3: ['Magic acid']}}],
        ];

        return Test.run(Search.process, tests);
    }
}
