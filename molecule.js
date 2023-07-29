import * as common from './common.js';
import Element from './element.js';
import elementData from './element-data.js';
import moleculeData from './molecule-data.js';
import Search from './search.js';

/**
 * Process information about molecules.
 */
export default class Molecule {
    /**
     * Combine element counts into a molecular formula.
     *
     * @param {Object} elements - Element counts keyed by element symbols
     * @param {integer} [multiplier=1] - What to multiply the element counts by
     * @returns {string} A molecular formula
     */
    static combine(elements, multiplier = 1) {
        let newFormula = '';
        for (const element in elements) {
            const count = elements[element] * multiplier ;
            newFormula += element;
            newFormula += (count > 1) ? count : '';
        }
        return newFormula;
    }

    /**
     * Compare two molecular formulas, for sorting.
     *
     * @param {string} formulaA - A molecular formula
     * @param {string} formulaB - A molecular formula
     * @param {string} [prioritySymbol='H'] - An element symbol to prioritize
     * @param {boolean} [debug=false] - Whether to generate debugging output
     *
     * @returns {integer} how the formulas should be sorted, with regard to the
     * given element:
     * - -1 if a comes before b
     * - 1 if a comes after b
     * - 0 if the formulas are equivalent
     */
    static compare(formulaA, formulaB, prioritySymbol = 'H', debug = false) {
        // Return early when formulas are identical.
        if (formulaA === formulaB) {
            if (debug) {
                console.log(`${formulaA} === ${formulaB}`);
            }
            return 0;
        }

        // Allow the caller to identify a priority element to sort by.
        let priority = Element.findProtons(prioritySymbol);
        if (priority === 0) {
            console.warn('Invalid priority element symbol:', prioritySymbol);
            prioritySymbol = 'H';
            priority = 1;
        }

        // Parse formulas into constituent elements.
        const aComponents = Molecule.parse(formulaA);
        const bComponents = Molecule.parse(formulaB);

        // Build maps keyed by atomic numbers, not atomic symbols.
        const a = Molecule.#convertSymbols(aComponents);
        const b = Molecule.#convertSymbols(bComponents);

        const result = Molecule.#compareElement(a, b, priority, true);
        if (result !== 0) {
            if (debug) {
                const inequality = (result < 0) ? '<' : '>';
                console.log(`${formulaA} ${inequality} ${formulaB}: ${prioritySymbol} is the priority`);
            }
            return result;
        }

        // Ignore the priority element, since we've already checked it.
        a.delete(priority);
        b.delete(priority);

        // Build an array of atomic numbers in each formula.
        const aKeys = [...a.keys()];
        const bKeys = [...b.keys()];

        // Build a sorted array of atomic numbers in both formulas, without duplicates.
        const unique = new Set(aKeys.concat(bKeys));
        const all = [...unique].sort((a, b) => a - b);

        // Find the highest atomic number in each formula's elements.
        const aMax = Math.max(...aKeys);
        const bMax = Math.max(...bKeys);

        // Limit comparisons to the lesser maximum atomic number of the two formulas.
        const upperBound = Math.min(aMax, bMax);
        if (upperBound === -Infinity) {
            console.warn('upperBound =', upperBound);
        }
        all.splice(all.indexOf(upperBound) + 1);

        // Compare formulas by their elements' atomic numbers; lowest comes first.
        for (const protons of all) {
            const symbol = elementData.get(protons).symbol;
            const result = Molecule.#compareElement(a, b, protons);
            if (result !== 0) {
                if (debug) {
                    const inequality = (result < 0) ? '<' : '>';
                    console.log(`${formulaA} ${inequality} ${formulaB}: ${symbol}`);
                }
                return result;
            }
            // Stop when we're past either formula's highest element.
            if (protons === upperBound && aMax !== bMax) {
                const positivity = (upperBound === aMax) ? -1 : 1;
                if (debug) {
                    const inequality = (positivity < 0) ? '<' : '>';
                    console.log(`${formulaA} ${inequality} ${formulaB}: ${formulaA} has fewer protons`);
                }
                return positivity;
            }
        }

        if (debug) {
            console.log(`${formulaA} == ${formulaB}`);
        }
        return 0;
    }

    /**
     * Compare two molecular formulas based on one element.
     *
     * @param {Map} a - A Map object describing a formula, keyed by atomic number
     * @param {Map} b - A Map object describing a formula, keyed by atomic number
     * @param {integer} protons - The atomic number of the element being compared
     * @param {boolean} priority - Whether the element takes priority over smaller elements
     *
     * @returns {integer} how the formulas should be sorted, with regard to the
     * given element:
     * - -1 if a comes before b
     * - 1 if a comes after b
     * - 0 if the formulas are equivalent
     *
     * @private
     */
    static #compareElement(a, b, protons, priority = false) {
        const inA = a.has(protons);
        const inB = b.has(protons);
        if (!inA && !inB) {
            return 0;
        }

        // When a lower element is in only one formula, it comes first.
        if (inA && !inB) {
            return -1;
        }
        if (!inA && inB) {
            return 1;
        }

        // When both formulas contain an element, sort based on the element count.
        const aCount = a.get(protons);
        const bCount = b.get(protons);
        if (aCount > bCount) {
            return 1;
        }
        if (aCount < bCount) {
            return -1;
        }
        if (priority) {
            // When one formula contains only the priority element, it comes first.
            if (a.size === 1) {
                return -1;
            }
            if (b.size === 1) {
                return 1;
            }
        }

        return 0;
    }

    /**
     * Convert a semistructural chemical formula to a molecular formula.
     *
     * @param {string} formula - A molecular or semistructural formula
     * @param {boolean} [sort=false] - Whether to sort elements by atomic number
     * @param {...string} priorities - Element symbols to prioritize
     * @returns string - A molecular formula
     */
    static convertFormula(formula, sort = false, ...priorities) {
        formula = formula.toString();

        // Extract parenthetical substrings and their multipliers, ungreedily.
        // This handles the most deeply nested parentheses first.
        const re = /\(([^\(\)]+)\)(\d*)/g; // eslint-disable-line
        const matches = formula.matchAll(re);

        // Replace parentheses and multipliers with molecular formulas.
        let offset = 0;
        for (const match of matches) {
            const count = (match[2] === '') ? 1 : parseInt(match[2]);
            const index = match.index - offset;
            const length = match[0].length;
            const parts = Molecule.parse(match[1]);
            const substr = Molecule.combine(parts, count);
            formula = common.spliceString(formula, index, length, substr);
            offset += length - substr.length;
        }

        // Recurse if there are more parentheses.
        if (formula.indexOf('(') !== -1) {
            formula = Molecule.convertFormula(formula);
        }

        let elements = Molecule.parse(formula);

        if (sort) {
            elements = Molecule.sortElements(elements);
        }

        if (priorities.length > 0) {
            elements = Molecule.prioritizeElements(elements, ...priorities);
        }

        // Combine duplicate elements.
        return Molecule.combine(elements);
    }

    /**
     * Convert an object keyed by element symbols to a map keyed by atomic numbers.
     *
     * @param {Object} components - Element counts, keyed by element symbols
     * @return {Map} Element counts, keyed by atomic numbers
     * @private
     */
    static #convertSymbols(components) {
        const atomic = new Map();
        for (const symbol in components) {
            const protons = Element.findProtons(symbol);
            common.countMapKey(atomic, protons, components[symbol]);
        }
        return atomic;
    }

    /**
     * Find elements present in every given formula.
     *
     * @param {Array<string>} formulas - Molecular formulas
     * @returns {Set<integer>} Atomic numbers
     */
    static findCommonElements(formulas) {
        // Add every element present in the matched formulas.
        const candidates = new Set();
        for (const formula of formulas) {
            Search.addFormulaElements(candidates, formula);
        }
        // Count how many formulas contain each element.
        const elementCounts = {};
        for (const formula of formulas) {
            const components = Molecule.parse(formula);
            for (const protons of candidates) {
                const symbol = Element.findSymbol(protons);
                if (!(symbol in components)) {
                    continue;
                }
                common.countKey(elementCounts, protons);
            }
        }
        // Find the elements present in every formula.
        const commonElements = [];
        for (const [protons, count] of Object.entries(elementCounts)) {
            if (count === formulas.length) {
                commonElements.push(parseInt(protons));
            }
        }
        commonElements.sort((a, b) => a - b);
        return new Set([...commonElements]);
    }

    static #foundElements = {};

    /**
     * Find molecular formulas that contain a given element.
     *
     * @param {string} symbol - An element symbol
     * @returns {Array<string>} Molecular formulas that contain the given symbol
     */
    static findElement(symbol) {
        if (!symbol) {
            return [];
        }
        if (symbol in Molecule.#foundElements) {
            return Molecule.#foundElements[symbol];
        }
        const formulas = [];
        for (const formula in moleculeData) {
            const elements = Molecule.parse(formula);
            if (symbol in elements) {
                formulas.push(formula);
            }
        }
        Molecule.#foundElements[symbol] = formulas;
        return formulas;
    }

    static #foundFormulas = {};

    /**
     * Find molecules by formula.
     *
     * @param {string} search - The search query
     * @param {Array<string>} Molecular formulas that include the query
     */
    static findFormulas(search) {
        search = search.trim();
        if (search.length === 0) {
            return [];
        }
        if (search in Molecule.#foundFormulas) {
            return Molecule.#foundFormulas[search];
        }
        const formulas = [];
        const upper = search.toUpperCase();

        for (const formula in moleculeData) {
            const f = formula.toUpperCase();
            if ((f === upper) || (f.includes(upper))) {
                formulas.push(formula);
            }
        }

        Molecule.#foundFormulas[search] = formulas;
        return formulas;
    }

    static #foundNames = {};

    /**
     * Find a molecular formula by its exact name, case sensitive.
     *
     * @param {string} name - A molecule name
     * @returns {Array<string>} Molecular formulas that match the given name exactly
     */
    static findName(name) {
        if (name in Molecule.#foundNames) {
            return Molecule.#foundNames[name];
        }
        const formulas = [];
        for (const formula in moleculeData) {
            const names = moleculeData[formula];
            if (names.includes(name)) {
                formulas.push(formula);
            }
        }
        Molecule.#foundNames[name] = formulas;
        return formulas;
    }

    /**
     * Find molecular formulas by name.
     *
     * @param {string} search - The search query
     * @returns {Object} Molecule names that include the query, keyed by formula
     */
    static findNames(search) {
        search = search.trim();
        if (search.length === 0) {
            return {};
        }
        const molecules = {};
        const upper = search.toUpperCase();
        for (const formula in moleculeData) {
            for (const name of moleculeData[formula]) {
                if (name.toUpperCase().includes(upper)) {
                    common.pushTo(molecules, formula, name);
                }
            }
        }
        return molecules;
    }

    /**
     * Find duplicate molecule names in our database.
     *
     * @returns {object} Molecular formulas, keyed by molecule names
     */
    static findDuplicateNames() {
        console.time('findDuplicateNames');
        const dupes = {};
        for (const formula in moleculeData) {
            const names = moleculeData[formula];
            for (const name of names) {
                const formulas = Molecule.findName(name);
                if (formulas.length < 2) {
                    continue;
                }
                if (!(name in dupes)) {
                    dupes[name] = [];
                }
                for (const f of formulas) {
                    if (!dupes[name].includes(f)) {
                        dupes[name].push(f);
                    }
                }
            }
        }
        console.timeEnd('findDuplicateNames');
        return dupes;
    }

    /**
     * Find duplicate molecular formulas in our database.
     *
     * @returns {object} Formulas and their duplicates
     */
    static findDuplicateFormulas() {
        console.time('findDuplicateFormulas');
        const dupes = {};
        for (const formula in moleculeData) {
            const matches = Molecule.findEquivalentFormulas(formula);
            if (matches.length < 1) {
                continue;
            }
            if (!(formula in dupes)) {
                dupes[formula] = [];
            }
            for (const match of matches) {
                if (!dupes[formula].includes(match)) {
                    dupes[formula].push(match);
                }
            }
        }
        console.timeEnd('findDuplicateFormulas');
        return dupes;
    }

    /**
     * Find equivalent molecular formulas in our database.
     *
     * @param {string} formula - A molecular formula
     * @returns {Array<string>} Formulas equivalent to the one given
     */
    static findEquivalentFormulas(formula) {
        const formulas = [];
        for (const f in moleculeData) {
            if (formula === f) {
                continue;
            }
            const result = Molecule.compare(formula, f);
            if (result === 0) {
                formulas.push(f);
            }
        }
        return formulas;
    }

    /**
     * Create a URL for a molecular formula on the ChemSpider site.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} A URL
     */
    static getChemSpiderURL(formula) {
        return `https://www.chemspider.com/Search.aspx?q=${formula}`;
    }

    /**
     * Create a URL for a molecular formula on NIH's PubChem site.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} A URL
     */
    static getPubChemURL(formula) {
        return `https://pubchem.ncbi.nlm.nih.gov/#query=${formula}`;
    }

    /**
     * Create a URL for a molecular formula on NIST's WebBook site.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} A URL
     */
    static getWebBookURL(formula) {
        return `https://webbook.nist.gov/cgi/cbook.cgi?Formula=${formula}&NoIon=on&Units=SI`;
    }

    /**
     * List molecular formulas.
     *
     * @param {string|null} symbol - An element symbol
     * @returns {Array<string>} A list of molecular formulas
     */
    static list(symbol = null) {
        return symbol ? Molecule.findElement(symbol) : Object.keys(moleculeData);
    }

    static #parsed = {};

    /**
     * Parse a molecular formula into its component elements.
     *
     * @param {string} formula - A molecular formula
     * @returns {object} Element counts, keyed by element symbols
     */
    static parse(formula) {
        if (formula in Molecule.#parsed) {
            return Molecule.#parsed[formula];
        }
        formula = formula.toString();
        const re = /([A-Z][a-z]?)(\d*)/g;
        const matches = formula.matchAll(re);
        const elements = {};
        for (const components of matches) {
            const element = components[1];
            const count = (components[2] === '') ? 1 : parseInt(components[2]);
            common.countKey(elements, element, count);
        }
        Molecule.#parsed[formula] = elements;
        return elements;
    }

    /**
     * Order object properties that represent a molecular formula.
     *
     * @param {object} elements - Element counts, keyed by element symbols
     * @param {...string} priorities - Element symbols to prioritize
     * @returns {object} An object with prioritized elements first
     */
    static prioritizeElements(elements, ...priorities) {
        const clone = structuredClone(elements);
        if (priorities.length < 1) {
            return clone;
        }
        const components = {};
        for (const priority of priorities) {
            if (!(priority in elements)) {
                continue;
            }
            components[priority] = elements[priority];
            delete clone[priority];
        }
        for (const element in clone) {
            components[element] = clone[element];
        }
        return components;
    }

    /**
     * Order an object's properties according to atomic number, ascending.
     *
     * @param {object} elements - Element counts, keyed by element symbols
     * @returns {object} An object with keys in order of atomic number, ascending
     */
    static sortElements(elements) {
        // Accepts an object of element counts, keyed by element symbols.
        // Returns a copy of the object with the keys sorted.
        const keys = Object.keys(elements).sort(Element.compare);
        const components = {};
        for (const element of keys) {
            components[element] = elements[element];
        }
        return components;
    }

    /**
     * Sort molecular formulas according to their elements.
     *
     * @param {Array<string>} formulas - Molecular formulas to be sorted
     * @param {string} priority - An atomic symbol to prioritize
     * @returns {Array<string>} Molecular formulas, in ascending order
     */
    static sort(formulas = [], priority = 'H') {
        if (formulas.length < 1) {
            formulas = Object.keys(moleculeData);
        }
        const sorted = formulas.toSorted((a, b) => Molecule.compare(a, b, priority));

        for (let i = 0; i < formulas.length; i++) {
            if (formulas[i] !== sorted[i]) {
                Molecule.compare(formulas[i], sorted[i], priority, true);
                break;
            }
        }

        return sorted;
    }

    /**
     * Sort molecular formulas, prioritizing the first element.
     *
     * @param {Array<string>} formulas - Molecular formulas to sort
     * @returns {Array<string>} Molecular formulas, sorted in ascending order
     */
    static sortByFirstElement(formulas = Object.keys(moleculeData)) {
        console.time('Molecule.sortByFirstElement()');
        let sorted = [];
        const byElement = {};
        for (const formula of formulas) {
            const components = Molecule.parse(formula);
            const element = Object.keys(components)[0];
            common.pushTo(byElement, element, formula);
        }
        for (const element in byElement) {
            const formulas = byElement[element];
            sorted = sorted.concat(Molecule.sort(formulas, element));
        }
        console.timeEnd('Molecule.sortByFirstElement()');
        return sorted;
    }

    /**
     * Calculate the weight of a molecular formula.
     *
     * @param {string} formula - A molecular formula
     * @returns {integer} The molecular weight of the formula
     */
    static weigh(formula) {
        const elements = Molecule.parse(formula);
        let weight = 0;
        for (const symbol in elements) {
            const protons = Element.findProtons(symbol);
            const element = elementData.get(protons);
            weight += Math.round(element.weight) * elements[symbol];
        }
        return weight;
    }
}
