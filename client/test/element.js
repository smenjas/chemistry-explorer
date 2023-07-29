import Element from '../element.js';
import Test from '../test.js';

/**
 * Test the elements class.
 */
export default class ElementTest {
    /**
     * Test the find method.
     *
     * @returns {integer} How many tests failed
     */
    static find(){
        const tests = [
            [[''], new Set([])],
            [[' '], new Set([])],
            [['x'], new Set([])],
            [['h'], new Set([1])],
            [['he'], new Set([2])],
            [['heli'], new Set([2])],
            [['bor'], new Set([5, 106])],
        ];

        return Test.run(Element.find, tests);
    }
}
