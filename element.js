import elementData from './element-data.js';

/**
 * Provide information about atomic elements.
 *
 * @property {Map} groups - Element groups: columns on the periodic table
 * @property {Map} groupElements - Which elements belong to each group
 * @property {Map} groupURLs - Wikipedia URLs for each group
 * @property {Map} periods - Element periods: rows on the periodic table
 * @property {Object} symbols - Atomic numbers keyed by element symbols
 * @property {Object} typeURLs - Wikipedia URLs for each element type
 */
export default class Element {
    // The key is the group number.
    // The value is the former group designation.
    static groups = new Map([
        [1, 'IA'],
        [2, 'IIA'],
        [3, 'IIIB'],
        [4, 'IVB'],
        [5, 'VB'],
        [6, 'VIB'],
        [7, 'VIIB'],
        [8, 'VIIIB'],
        [9, 'VIIIB'],
        [10, 'VIIIB'],
        [11, 'IB'],
        [12, 'IIB'],
        [13, 'IIIA'],
        [14, 'IVA'],
        [15, 'VA'],
        [16, 'VIA'],
        [17, 'VIIA'],
        [18, 'VIIIA'],
    ]);

    static groupElements = new Map([
        [1, [1, 3, 11, 19, 37, 55, 87]],
        [2, [4, 12, 20, 38, 56, 88]],
        [3, [21, 39, 71, 103]],
        [4, [22, 40, 72, 104]],
        [5, [23, 41, 73, 105]],
        [6, [24, 42, 74, 106]],
        [7, [25, 43, 75, 107]],
        [8, [26, 44, 76, 108]],
        [9, [27, 45, 77, 109]],
        [10, [28, 46, 78, 110]],
        [11, [29, 47, 79, 111]],
        [12, [30, 48, 80, 112]],
        [13, [5, 13, 31, 49, 81, 113]],
        [14, [6, 14, 32, 50, 82, 114]],
        [15, [7, 15, 33, 51, 83, 115]],
        [16, [8, 16, 34, 52, 84, 116]],
        [17, [9, 17, 35, 53, 85, 117]],
        [18, [2, 10, 18, 36, 54, 86, 118]],
    ]);

    static groupURLs = new Map([
        [1, 'https://en.wikipedia.org/wiki/Group_1_element'],
        [2, 'https://en.wikipedia.org/wiki/Alkaline_earth_metal'],
        [3, 'https://en.wikipedia.org/wiki/Group_3_element'],
        [4, 'https://en.wikipedia.org/wiki/Group_4_element'],
        [5, 'https://en.wikipedia.org/wiki/Group_5_element'],
        [6, 'https://en.wikipedia.org/wiki/Group_6_element'],
        [7, 'https://en.wikipedia.org/wiki/Group_7_element'],
        [8, 'https://en.wikipedia.org/wiki/Group_8_element'],
        [9, 'https://en.wikipedia.org/wiki/Group_9_element'],
        [10, 'https://en.wikipedia.org/wiki/Group_10_element'],
        [11, 'https://en.wikipedia.org/wiki/Group_11_element'],
        [12, 'https://en.wikipedia.org/wiki/Group_12_element'],
        [13, 'https://en.wikipedia.org/wiki/Boron_group'],
        [14, 'https://en.wikipedia.org/wiki/Carbon_group'],
        [15, 'https://en.wikipedia.org/wiki/Pnictogen'],
        [16, 'https://en.wikipedia.org/wiki/Chalcogen'],
        [17, 'https://en.wikipedia.org/wiki/Halogen'],
        [18, 'https://en.wikipedia.org/wiki/Noble_gas'],
    ]);

    static periods = new Map([
        [1, { min: 1, max: 2 }],
        [2, { min: 3, max: 10 }],
        [3, { min: 11, max: 18 }],
        [4, { min: 19, max: 36 }],
        [5, { min: 37, max: 54 }],
        [6, { min: 55, max: 86 }],
        [7, { min: 87, max: 118 }],
        ['lanthanides', { min: 57, max: 70 }],
        ['actinides', { min: 89, max: 102 }],
    ]);

    static symbols = Element.#getSymbols();

    /**
     * Get element symbols.
     * @private
     */
    static #getSymbols() {
        const symbols = {};
        for (const [protons, element] of elementData) {
            symbols[element.symbol] = protons;
        }
        return symbols;
    }

    static typeURLs = {
        'Actinide': 'https://en.wikipedia.org/wiki/Actinide',
        'Alkali Metal': 'https://en.wikipedia.org/wiki/Alkali_metal',
        'Alkaline Earth Metal': 'https://en.wikipedia.org/wiki/Alkaline_earth_metal',
        'Halogen Nonmetal': 'https://en.wikipedia.org/wiki/Halogen',
        'Lanthanide': 'https://en.wikipedia.org/wiki/Lanthanide',
        'Metalloid': 'https://en.wikipedia.org/wiki/Metalloid',
        'Noble Gas': 'https://en.wikipedia.org/wiki/Noble_gas',
        'Other Nonmetal': 'https://en.wikipedia.org/wiki/Nonmetal#Unclassified_nonmetal',
        'Post Transition Metal': 'https://en.wikipedia.org/wiki/Post_transition_metal',
        'Transition Metal': 'https://en.wikipedia.org/wiki/Transition_metal',
    };

    /**
     * Compare two element symbols.
     *
     * @param {string} symbolA - An element symbol
     * @param {string} symbolB - An element symbol
     *
     * @returns {integer} A number indicating how the given elements should be sorted:
     * - negative if symbolA should come before symbolB
     * - positive if symbolA should come after symbolB
     * - zero if the elements are equivalent
     */
    static compare(symbolA, symbolB) {
        const a = Element.findProtons(symbolA);
        const b = Element.findProtons(symbolB);
        return a - b;
    }

    /**
     * Convert an array of atomic numbers to element symbols.
     *
     * @param {Array<integer>} elements - Atomic numbers
     * @returns {Array<string>} Element symbols
     */
    static convertProtons(elements) {
        const symbols = [];
        for (const protons of elements) {
            symbols.push(elementData.get(protons).symbol);
        }
        return symbols;
    }

    /**
     * Find elements by symbol or by name.
     * @todo Add tests.
     *
     * @param {string} search - The search query
     * @returns {Set<integer>} Atomic numbers of matching elements
     */
    static find(search) {
        search = search.trim();
        const elements = new Set();
        if (search.length === 0) {
            return elements;
        }

        const upper = search.toUpperCase();

        if (search.length < 3) {
            // Search for elements by symbol.
            for (const [protons, element] of elementData) {
                const symbol = element.symbol.toUpperCase();
                if (upper === symbol) {
                    elements.add(protons);
                }
            }
            return elements;
        }

        // Search for elements by name.
        for (const [protons, element] of elementData) {
            const name = element.name.toUpperCase();
            if (name.includes(upper)) {
                elements.add(protons);
            }
        }

        return elements;
    }

    /**
     * Find the next atomic number in a given element's group.
     *
     * @param {integer} protons - An atomic number
     * @returns {integer} An atomic number, or zero
     */
    static findNextInGroup(protons) {
        protons = parseInt(protons);
        if (protons === 1) {
            return 3;
        }
        if (protons < 13) {
            return protons + 8;
        }
        if (protons < 39) {
            return protons + 18;
        }
        if (protons < 119) {
            return protons + 32;
        }
        return 0;
    }

    /**
     * Find the previous atomic number in a given element's group.
     *
     * @param {integer} protons - An atomic number
     * @returns {integer} An atomic number, or zero
     */
    static findPreviousInGroup(protons) {
        protons = parseInt(protons);
        if (protons === 3) {
            return 1;
        }
        if (protons > 70) {
            return protons - 32;
        }
        if (protons > 30 && protons < 57) {
            return protons - 18;
        }
        if (protons > 20) {
            return 0;
        }
        if (protons > 9) {
            return protons - 8;
        }
        return 0;
    }

    /**
     * Find the atomic number for a given element symbol.
     *
     * @param {string} symbol - An element symbol
     * @returns {integer} An atomic number, or zero
     */
    static findProtons(symbol) {
        return Element.symbols[symbol] ?? 0;
    }

    /**
     * Find the element symbol for a given atomic number.
     *
     * @param {integer} symbol - An atomic number
     * @returns {string} An element symbol, or the empty string
     */
    static findSymbol(protons) {
        const element = elementData.get(protons);
        return element ? element.symbol : '';
    }

    /**
     * Calculate the width of a bar, for a bar chart.
     *
     * @param {number} value - A number that is less than or equal to the max
     * @param {number} max - The maximum value in the dataset
     * @param {boolean} [log=true] - Whether to use a logarithmic scale
     * @returns {number} A fraction of the max value
     */
    static calculateBarWidth(value, max, log = true) {
        if (value === 0) {
            return 0;
        }
        if (!log) {
            return value / max;
        }
        return 1 / (Math.log(value) / Math.log(max));
    }
}
