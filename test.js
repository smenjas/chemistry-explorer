import ElementTest from './test/element.js';
import MoleculeTest from './test/molecule.js';
import SearchTest from './test/search.js';

/**
 * Run automated tests.
 */
export default class Test {
    /**
     * Compare two values.
     * @todo Compare (weak) maps, (weak) sets, and typed arrays.
     *
     * @param {null|undefined|boolean|number|bigint|string|Array|Object|Set} a - A value
     * @param {null|undefined|boolean|number|bigint|string|Array|Object|Set} b - A value
     * @returns {boolean} True if the values are equal
     */
    static compare(a, b) {
        if (a === b) {
            return true;
        }
        if (typeof a !== typeof b) {
            return false;
        }
        if (Array.isArray(a)) {
            return Test.compareArrays(a, b);
        }
        if (a instanceof Set) {
            return Test.compareSets(a, b);
        }
        if (Test.isObject(a)) {
            return Test.compareObjects(a, b);
        }
        return false;
    }

    /**
     * Test the compare method.
     *
     * @returns {integer} How many tests failed
     */
    static compareTest() {
        const tests = [
            [[null, null], true],
            [[null, undefined], false],
            [[null, false], false],
            [[null, 0], false],
            [[null, ''], false],
            [[undefined, undefined], true],
            [[undefined, false], false],
            [[undefined, 0], false],
            [[undefined, ''], false],
            [[true, true], true],
            [[false, false], true],
            [[true, false], false],
            [[0, false], false],
            [[0, 0], true],
            [[0, 1], false],
            [[0.1, 0.1], true],
            [[0.1, 0.2], false],
            [[0n, 0n], true],
            [[0n, 1n], false],
            [['', ''], true],
            [['', 'x'], false],
            [['x', 'x'], true],
            [['x', 'X'], false],
            [[ [], [] ], true],
            [[ [], [1] ], false],
            [[ [1], [1] ], true],
            [[ {}, {} ], true],
            [[ {}, {a: 1} ], false],
            [[ {a: 1}, {a: 1} ], true],
            [[ {a: 1}, {b: 1} ], false],
            [[ {a: 1}, {a: 2} ], false],
            [[new Set(), new Set()], true],
            [[new Set([]), new Set([])], true],
            [[new Set([1]), new Set([1])], true],
        ];

        return Test.run(Test.compare, tests);
    }

    /**
     * Compare two arrays.
     *
     * @param {Array} a - An array
     * @param {Array} b - An array
     * @returns {boolean} True if the arrays are equal
     */
    static compareArrays(a, b) {
        if (!Array.isArray(a)) {
            return false;
        }
        if (!Array.isArray(b)) {
            return false;
        }
        if (a.length !== b.length) {
            return false;
        }
        for (const key in a) {
            if (!Test.compare(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test the compareArrays method.
     *
     * @returns {integer} How many tests failed
     */
    static compareArraysTest() {
        const tests = [
            [[ 0, [] ], false],
            [[ [], 0 ], false],
            [[ [], [] ], true],
            [[ [1], [1] ], true],
            [[ [1], [2] ], false],
            [[ [1], [1, 2] ], false],
            [[ [2, 1], [1, 2] ], false],
            [[ [1, 1, 2], [1, 2, 2] ], false],
            [[ [[]], [[]] ], true],
            [[ [[1]], [[]] ], false],
            [[ [[1]], [[1]] ], true],
            [[ [[1]], [[2]] ], false],
            [[ [[1, 2]], [[1, 2]] ], true],
            [[ [[1, 2]], [[2, 1]] ], false],
            [[ [[1, 1]], [[1, 2]] ], false],
            [[ [{}], [{}] ], true],
            [[ [{}], [{a: 1}] ], false],
            [[ [{a: 1}], [{}] ], false],
            [[ [{a: 1}], [{a: 1}] ], true],
            [[ [{a: 1}], [{a: 2}] ], false],
            [[ [{a: 1}], [{b: 1}] ], false],
        ];

        return Test.run(Test.compareArrays, tests);
    }

    /**
     * Compare two objects, to see if they contain the same properties.
     *
     * @param {Object} a - An object
     * @param {Object} b - An object
     * @returns {boolean} True if the objects' contents are equal
     */
    static compareObjects(a, b) {
        if (!Test.isObject(a)) {
            return false;
        }
        if (!Test.isObject(b)) {
            return false;
        }
        if (Object.keys(a).length !== Object.keys(b).length) {
            return false;
        }
        for (const key in a) {
            if (!(key in b)) {
                return false;
            }
            if (!Test.compare(a[key], b[key])) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test the compareObjects method.
     *
     * @returns {integer} How many tests failed
     */
    static compareObjectsTest() {
        const tests = [
            [[ 0, {} ], false],
            [[ {}, 0 ], false],
            [[ {}, {} ], true],
            [[ {}, {a: 1} ], false],
            [[ {a: 1}, {} ], false],
            [[ {a: 1}, {a: 1} ], true],
            [[ {a: 1}, {a: 1, b: 1} ], false],
            [[ {a: 1, b: 1}, {a: 1} ], false],
            [[ {a: 1}, {a: 2} ], false],
            [[ {a: 1}, {b: 1} ], false],
            [[ {a: []}, {a: []} ], true],
            [[ {a: []}, {b: []} ], false],
            [[ {a: [1]}, {a: [1]} ], true],
            [[ {a: [1]}, {a: [2]} ], false],
            [[ {a: {}}, {a: {}} ], true],
            [[ {a: {}}, {b: {}} ], false],
            [[ {a: {x: 1}}, {a: {x: 1}} ], true],
            [[ {a: {x: 1}}, {a: {x: 2}} ], false],
        ];

        return Test.run(Test.compareObjects, tests);
    }

    /**
     * Compare two sets, to see if they contain the same elements.
     *
     * @param {Set} a - A set
     * @param {Set} b - A set
     * @returns {boolean} True if the sets are equal
     */
    static compareSets(a, b) {
        if (!(a instanceof Set)) {
            return false;
        }
        if (!(b instanceof Set)) {
            return false;
        }
        if (a.size !== b.size) {
            return false;
        }
        for (const value of a) {
            if (!b.has(value)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Test the compareSets method.
     *
     * @returns {integer} How many tests failed
     */
    static compareSetsTest() {
        const tests = [
            [[ 0, new Set()], false],
            [[ new Set(), 0], false],
            [[ new Set(), new Set()], true],
            [[ new Set([]), new Set([])], true],
            [[ new Set([1]), new Set([1])], true],
            [[ new Set([1]), new Set([2])], false],
            [[ new Set([1]), new Set([1, 2])], false],
        ];

        return Test.run(Test.compareSets, tests);
    }

    /**
     * Determine whether the input is an object.
     *
     * @param {null|undefined|boolean|number|bigint|string|Array|Map|Object|Set|Symbol|WeakMap|WeakSet} obj - Anything
     * @returns {boolean} Whether the input is an object
     */
    static isObject(obj) {
        // Handle undefined, booleans, numbers, NaN, bigints, strings, and symbols.
        if (typeof obj !== 'object') {
            return false;
        }
        // Handle null.
        if (!(obj instanceof Object)) {
            return false;
        }
        if (Array.isArray(obj)) {
            return false;
        }
        if (obj instanceof Map) {
            return false;
        }
        if (obj instanceof Set) {
            return false;
        }
        if (obj instanceof WeakMap) {
            return false;
        }
        if (obj instanceof WeakSet) {
            return false;
        }
        return true;
    }

    /**
     * Test the isObject method.
     *
     * @returns {integer} How many tests failed
     */
    static isObjectTest() {
        const tests = [
            [[ null ], false],
            [[ undefined ], false],
            [[ false ], false],
            [[ true ], false],
            [[ NaN ], false],
            [[ 0 ], false],
            [[ 0.1 ], false],
            [[ 0n ], false],
            [[ '' ], false],
            [[ 'a' ], false],
            [[ [] ], false],
            [[ [1] ], false],
            [[ {} ], true],
            [[ {a: 1} ], true],
            [[ Symbol() ], false],
            [[ new Map() ], false],
            [[ new Set() ], false],
            [[ new WeakMap() ], false],
            [[ new WeakSet() ], false],
        ];

        return Test.run(Test.isObject, tests);
    }

    /**
     * Run automated tests.
     *
     * @returns {integer} How many tests failed
     */
    static runAll() {
        console.time('Test.runAll()');

        const methods = [
            ElementTest.find,
            MoleculeTest.compare,
            MoleculeTest.convertFormula,
            MoleculeTest.findElement,
            MoleculeTest.findFormulas,
            MoleculeTest.findNames,
            SearchTest.findFormulas,
            SearchTest.findMolecules,
            SearchTest.process,
            Test.compareTest,
            Test.compareArraysTest,
            Test.compareObjectsTest,
            Test.compareSetsTest,
            Test.isObjectTest,
        ];

        let failures = 0;
        for (const method of methods) {
            failures += method();
        }

        console.timeEnd('Test.runAll()');
        return failures;
    }

    /**
     * Run automated tests for a given function or method.
     *
     * @param {Array} tests - Inputs and the expected output
     * @returns {integer} How many tests failed
     */
    static run(method, tests) {
        console.time(method.name);
        let failed = 0;
        for (const test of tests) {
            const [args, expected] = test;
            const actual = method(...args);
            const result = Test.compare(expected, actual);
            console.assert(result, `${method.name}(`, ...args, '):', actual, '!==', expected);
            failed += !result;
        }
        console.timeEnd(method.name);
        return failed;
    }
}
