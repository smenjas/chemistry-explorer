import * as common from './common.js';
import Elements from './elements.js';
import elementsData from './elementsData.js';
import Link from './link.js';
import moleculesData from './moleculesData.js';
import Search from './search.js';
import Test from './test.js';

/**
 * Show information about molecules.
 */
export default class Molecules {
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
        let priority = Elements.findProtons(prioritySymbol);
        if (priority === 0) {
            console.warn('Invalid priority element symbol:', prioritySymbol);
            prioritySymbol = 'H';
            priority = 1;
        }

        // Parse formulas into constituent elements.
        const aComponents = Molecules.parse(formulaA);
        const bComponents = Molecules.parse(formulaB);

        // Build maps keyed by atomic numbers, not atomic symbols.
        const a = Molecules.#convertSymbols(aComponents);
        const b = Molecules.#convertSymbols(bComponents);

        const result = Molecules.#compareElement(a, b, priority, true);
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
            const symbol = elementsData.get(protons).symbol;
            const result = Molecules.#compareElement(a, b, protons);
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
     * Test the compare method.
     *
     * @returns {integer} How many tests failed
     */
    static compareTest() {
        const tests = [
            [['H2', 'O2', 'H'], -1], // H2 < O2: H in H2, not in O2
            [['O2', 'H2', 'H'], 1], // O2 > H2: H in H2, not in O2
            [['H2', 'O2', 'X'], -1], // H2 < O2: H in H2, not in O2
            [['H2', 'H2O2', 'H'], -1], // H2 < H2O2: H2 contains only the priority element
            [['H2O2', 'H2', 'H'], 1], // H2O2 > H2: H2 contains only the priority element
            [['O2', 'H2O2', 'O'], -1], // O2 < H2O2: O2 contains only the priority element
            [['H2O2', 'O2', 'O'], 1], // H2O2 > O2: O2 contains only the priority element
            [['HN', 'HNCO', 'H'], 1], // C in HNCO, not in HN
            [['H2', 'H2', 'H'], 0], // H2 === H2
            [['H2O', 'OH2', 'H'], 0], // H2O == OH2: formulas are equivalent
            [['LiPF6', 'LiYF4', 'Li'], 1], // F6 > F4
            [['LiNH2', 'Li2NH', 'Li'], -1], // Li1 < Li2
            //[['BeF2', 'BeSO4', 'Be'], 1], // O in BeSO4, not in BeF2
            //[['BN', 'BNH6', 'B'], 1], // H in BNH6, not in BN
            //[['CHF3', 'CHClO2', 'C'], 1], // O in CHClO2, not in CHF3
            [['C2H2', 'C2H2B2N2', 'C'], -1], // compared every element in C2H2
            //[['C2H3B', 'C2H3LiO2', 'C'], 1], // Li in C2H3LiO2, not in C2H3B
            [['NH4ClO4', 'NH4VO3', 'N'], 1], // O4 > O3
            [['NH4VO3', 'NH4ClO4', 'N'], -1], // O3 < O4
            //[['NH4SCN', 'NH4ClO3', 'N'], 1], // N2 > N1
            //[['NaOH', 'NaHCO3', 'Na'], 1], // C in NaHCO3, not in NaOH
            //[['Mg2O8Si3', 'MgSO3', 'Mg'], 1], // Mg2 > Mg1
            //[['S4N4', 'S2Sn', 'S'], 1], // S4 > S2
            //[['KHSO3', 'KOH', 'K'], 1], // O1 < O3
            //[['CaH2O2', 'CaH2C2O4', 'Ca'], 1], // C in CaH2C2O4, not in CaH2O2
            //[['Ti2O3', 'TiI3', 'Ti'], 1], // Ti2 > Ti1
            //[['FeCl2', 'FeKS2', 'Fe'], 1], // S in FeKS2, not in FeCl2
            //[['CoB', 'CoC10H10', 'Co'], 1], // H in CoC10H10, not in CoB
            //[['CuS', 'CuSO4', 'Cu'], 1], // O in CuSO4, not in CuS
            //[['GaS', 'GaAsP', 'Ga'], 1], // P in GaAsP, not in GaS
            //[['AsH3', 'AsCuHO3', 'As'], 1], // H1 < H3
            //[['SeCl4', 'SeOCl2', 'Se'], 1], // O in SeOCl2, not in SeCl4
            //[['YB6', 'YH3O3', 'Y'], 1], // H in YH3O3, not in YB6
            //[['Ag2SeO3', 'Ag2O', 'Ag'], 1], // O1 < O3
            //[['InN3O9', 'InGaN', 'In'], 1], // N1 < N3
            //[['SnI2', 'SnTe', 'Sn'], 1], // Te in SnTe, not in SnI2
            //[['IF', 'INaO3', 'I'], 1], // O in INaO3, not in IF
            //[['CsHO4S', 'CsOH', 'Cs'], 1], // O1 < O4
            //[['BaP2O6', 'BaSO3', 'Ba'], 1], // O3 < O6
            //[['La2O3', 'La2C6O12', 'La'], 1], // C in La2C6O12, not in La2O3
            //[['CeBr3', 'CeCoIn5', 'Ce'], 1], // Co in CeCoIn5, not in CeBr3
            //[['Ho2S3', 'Ho2O7Ti2', 'Ho'], 1], // O in Ho2O7Ti2, not in Ho2S3
            //[['YbP', 'YbRh2Si2', 'Yb'], 1], // Si in YbRh2Si2, not in YbP
            //[['LuF3', 'LuTaO4', 'Lu'], 1], // O in LuTaO4, not in LuF3
            //[['HfF4', 'HfSiO4', 'Hf'], 1], // O in HfSiO4, not in HfF4
            //[['WO2Cl2', 'WO2', 'W'], 1], // compared every element in WO2
            //[['IrCl3', 'IrS2', 'Ir'], 1], // S in IrS2, not in IrCl3
            //[['HgF4', 'HgSO4', 'Hg'], 1], // O in HgSO4, not in HgF4
            //[['TlH3', 'TlOH', 'Tl'], 1], // H1 < H3
            //[['PbS', 'PbSO4', 'Pb'], 1], // O in PbSO4, not in PbS
            //[['Bi2CO5', 'BiOCl', 'Bi'], 1], // Bi2 > Bi1
            //[['RaF2', 'RaSO4', 'Ra'], 1], // O in RaSO4, not in RaF2
            //[['ThF4', 'ThSiO4', 'Th'], 1], // O in ThSiO4, not in ThF4
            //[['UB2', 'UB4H16', 'U'], 1], // H in UB4H16, not in UB2
        ];

        /*
        for (const [index, test] of tests.entries()) {
            // Turn on debugging output.
            test[0].push(true);
            tests[index] = test;
        }
        */

        return Test.run(Molecules.compare, tests);
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
            const parts = Molecules.parse(match[1]);
            const substr = Molecules.combine(parts, count);
            formula = common.spliceString(formula, index, length, substr);
            offset += length - substr.length;
        }

        // Recurse if there are more parentheses.
        if (formula.indexOf('(') !== -1) {
            formula = Molecules.convertFormula(formula);
        }

        let elements = Molecules.parse(formula);

        if (sort) {
            elements = Molecules.sortElements(elements);
        }

        if (priorities.length > 0) {
            elements = Molecules.prioritizeElements(elements, ...priorities);
        }

        // Combine duplicate elements.
        return Molecules.combine(elements);
    }

    /**
     * Test the convertFormula method.
     *
     * @returns {integer} How many tests failed
     */
    static convertFormulaTest() {
        const tests = [
            [['H2O'], 'H2O'], // No parentheses
            [['CH3(CH2)17COOH'], 'C19H38O2'], // Parentheses, repeated elements
            [['HO(CH2CH2O)20(CH2CH(CH3)O)70(CH2CH2O)20H'], 'H582O111C290'], // Nested parentheses
            [['Be(BH4)2'], 'BeB2H8'],
            [['Be(NO3)2'], 'BeN2O6'],
            [['Mn(CH3CO2)2', true, 'C'], 'C4H6O4Mn'], // Sort, prioritize carbon
            [['H2(CO)10Os3', false, 'C'], 'C10H2O10Os3'], // Don't sort, prioritize carbon
            /*
            //[['ReOCl3(PPh3)2', 'C'], 'C36H30OP2Cl3Re'],
            [['Fe(NO3)3', true, 'Fe'], 'FeN3O9'],
            [['Fe(CO)5', true, 'Fe'], 'FeC5O5'],
            [['Fe(ClO4)2'], 'FeCl2O8'],
            [['Fe2(SO4)3'], 'Fe2S3O12'],
            [['Co(OH)2', true, 'Co'], 'CoH2O2'],
            [['Co(C5H5)2', true, 'Co', 'C'], 'CoC10H10'],
            [['Co(NO3)2', true, 'Co'], 'CoN2O6'],
            [['Co2(CO)8', true, 'Co'], 'Co2C8O8'],
            [['Co4(CO)12', true, 'Co'], 'Co4C12O12'],
            [['NiO(OH)', true, 'Ni'], 'NiHO2'],
            [['Ni(OH)2', true, 'Ni'], 'NiH2O2'],
            [['Ni(NO3)2', true, 'Ni'], 'NiN2O6'],
            [['Ni(CO)4', true, 'Ni'], 'NiC4O4'],
            [['Ni3(PO4)2', false, 'Ni'], 'Ni3P2O8'],
            [['Cu(OH)2', true, 'Cu'], 'CuH2O2'],
            [['Cu2CO3(OH)2', true, 'Cu', 'C'], 'Cu2CH2O5'],
            [['Cu2(OH)3Cl', true, 'Cu'], 'Cu2H3O3Cl'],
            */
            [['Cu3(CO3)2(OH)2', true, 'Cu', 'C'], 'Cu3C2H2O8'], // Sort, prioritize copper & carbon
            /*
            [['Zn(CH3)2', true, 'Zn', 'C'], 'ZnC2H6'],
            [['Zn(CH3CO2)2', true, 'Zn', 'C'], 'ZnC4H6O4'],
            [['Zn(CN)2', true, 'Zn'], 'ZnC2N2'],
            [['Zn(OH)2', true, 'Zn'], 'ZnH2O2'],
            [['Zn(NO3)2', true, 'Zn'], 'ZnN2O6'],
            [['Zn(ClO3)2', false, 'Zn'], 'ZnCl2O6'],
            [['Zn3(PO4)2', false, 'Zn'], 'Zn3P2O8'],
            [['Ga(CH3)3', false, 'Ga'], 'GaC3H9'],
            [['Ga(OH)3', true, 'Ga'], 'GaH3O3'],
            [['Ga(NO3)3', true, 'Ga'], 'GaN3O9'],
            [['Sr(OH)2', true, 'Sr'], 'SrH2O2'],
            [['Sr(NO3)2', true, 'Sr'], 'SrN2O6'],
            [['Y(NO3)3', true, 'Y'], 'YN3O9'],
            [['Y(OH)3', true, 'Y'], 'YH3O3'],
            [['Y2(C2O4)3', true, 'Y'], 'Y2C6O12'],
            [['Zr(WO4)2', false, 'Zr'], 'ZrW2O8'],
            [['Mo(CO)6', true, 'Mo'], 'MoC6O6'],
            [['Ru(CO)5', true, 'Ru'], 'RuC5O5'],
            [['Cd(CN)2', true, 'Cd'], 'CdC2N2'],
            [['Cd(NO3)2', true, 'Cd'], 'CdN2O6'],
            [['Cd(OH)2', true, 'Cd'], 'CdH2O2'],
            [['In(OH)3', true, 'In'], 'InH3O3'],
            [['Sn(OH)2', true, 'Sn'], 'SnH2O2'],
            [['Te(OH)6', true, 'Te'], 'TeH6O6'],
            [['Ba(OH)2', true, 'Ba'], 'BaH2O2'],
            [['Ba(CN)2', true, 'Ba'], 'BaC2N2'],
            [['Ba(SCN)2', true, 'Ba'], 'BaC2N2S2'],
            [['Ba(NO3)2', true, 'Ba'], 'BaN2O6'],
            [['Ba(N3)2', true, 'Ba'], 'BaN6'],
            [['Ba(ClO)2', false, 'Ba'], 'BaCl2O2'],
            [['Ba(PO3)2', false, 'Ba'], 'BaP2O6'],
            [['Ba(ClO3)2', false, 'Ba'], 'BaCl2O6'],
            [['Ba(IO3)2', false, 'Ba'], 'BaI2O6'],
            [['Ba(ClO4)2', false, 'Ba'], 'BaCl2O8'],
            [['Ba(MnO4)2', false, 'Ba'], 'BaMn2O8'],
            [['La(OH)3', true, 'La'], 'LaH3O3'],
            [['La(NO3)3', false, 'La'], 'LaN3O9'],
            [['La2(C2O4)3', false, 'La'], 'La2C6O12'],
            [['Ce(OH)3', true, 'Ce'], 'CeH3O3'],
            [['Ce(OH)4', true, 'Ce'], 'CeH4O4'],
            [['Ce(C8H8)2', false, 'Ce'], 'CeC16H16'],
            [['Ce(NO3)3', true, 'Ce'], 'CeN3O9'],
            [['Ce(SO4)2', false, 'Ce'], 'CeS2O8'],
            [['Ce(ClO4)4', false, 'Ce'], 'CeCl4O16'],
            [['Ce2(CO3)3', true, 'Ce'], 'Ce2C3O9'],
            [['Ce2(C2O4)3', true, 'Ce'], 'Ce2C6O12'],
            [['Ce2O(NO3)6', true, 'Ce'], 'Ce2N6O19'],
            [['Ce2(SO4)3', false, 'Ce'], 'Ce2S3O12'],
            [['Pr(NO3)3', true, 'Pr'], 'PrN3O9'],
            [['Nd(OH)3', true, 'Nd'], 'NdH3O3'],
            [['Nd(O2C2H3)3', true, 'Nd', 'C'], 'NdC6H9O6'],
            [['Nd(NO3)3', true, 'Nd'], 'NdN3O9'],
            [['Nd2(CO3)3', true, 'Nd'], 'Nd2C3O9'],
            [['Nd2(C2O4)3', true, 'Nd'], 'Nd2C6O12'],
            [['Nd2(SO4)3', false, 'Nd'], 'Nd2S3O12'],
            [['Pm(OH)3', true, 'Pm'], 'PmH3O3'],
            [['Pm(NO3)3', true, 'Pm'], 'PmN3O9'],
            [['Sm(OH)3', true, 'Sm'], 'SmH3O3'],
            [['Sm(NO3)3', true, 'Sm'], 'SmN3O9'],
            [['Eu(OH)3', true, 'Eu'], 'EuH3O3'],
            [['Eu(NO3)3', true, 'Eu'], 'EuN3O9'],
            [['Eu2(C2O4)3', true, 'Eu', 'C'], 'Eu2C6O12'],
            [['Gd(OH)3', true, 'Gd'], 'GdH3O3'],
            [['Gd(NO3)3', true, 'Gd'], 'GdN3O9'],
            [['Tb(NO3)3', true, 'Tb'], 'TbN3O9'],
            [['Tb(OH)3', true, 'Tb'], 'TbH3O3'],
            [['Dy(OH)3', true, 'Dy'], 'DyH3O3'],
            [['Dy(NO3)3', true, 'Dy'], 'DyN3O9'],
            [['Ho(NO3)3', true, 'Ho'], 'HoN3O9'],
            [['Er(OH)3', true, 'Er'], 'ErH3O3'],
            [['Er(NO3)3', true, 'Er'], 'ErN3O9'],
            [['Tm(OH)3', true, 'Tm'], 'TmH3O3'],
            [['Tm(NO3)3', true, 'Tm'], 'TmN3O9'],
            [['Yb(NO3)3', false, 'Yb'], 'YbN3O9'],
            [['Yb2(SO4)3', false, 'Yb'], 'Yb2S3O12'],
            [['Lu(OH)3', true, 'Lu'], 'LuH3O3'],
            [['Lu(NO3)3', true, 'Lu'], 'LuN3O9'],
            [['Hf(NO3)4', true, 'Hf'], 'HfN4O12'],
            */
            [['ReH(CO)5', true, 'Re', 'C'], 'ReC5HO5'],
            [['ReBr(CO)5', false, 'Re'], 'ReBrC5O5'],
            /*
            [['Re2(CO)10', true, 'Re'], 'Re2C10O10'],
            [['Ir4(CO)12', true, 'Ir'], 'Ir4C12O12'],
            [['Pt(NH3)2Cl2', false, 'Pt'], 'PtN2H6Cl2'],
            [['Au2(SO4)2', false, 'Au'], 'Au2S2O8'],
            [['Pb(OH)2', true, 'Pb'], 'PbH2O2'],
            [['Pb(NO3)2', true, 'Pb'], 'PbN2O6'],
            [['Bi2O2(CO3)', true, 'Bi'], 'Bi2CO5'],
            [['Ra(NO3)2', true, 'Ra'], 'RaN2O6'],
            [['Ac(NO3)3', true, 'Ac'], 'AcN3O9'],
            [['Th(OH)4', true, 'Th'], 'ThH4O4'],
            [['Th(C8H8)2', true, 'Th', 'C'], 'ThC16H16'],
            [['Th(C2O4)2', true, 'Th', 'C'], 'ThC4O8'],
            [['Th(NO3)4', true, 'Th', 'N'], 'ThN4O12'],
            [['Pa(C8H8)2', true, 'Pa', 'C'], 'PaC16H16'],
            */
            [['U(C8H8)2', true, 'U', 'C'], 'UC16H16'],
            [['Np(C8H8)2', true, 'Np', 'C'], 'NpC16H16'],
            [['Np(NO3)4', true, 'Np', 'N'], 'NpN4O12'],
            /*
            [['NpO2(OH)3', true, 'Np'], 'NpH3O5'],
            [['Np(C2O4)2', true, 'Np'], 'NpC4O8'],
            [['Pu(C8H8)2', false, 'Pu'], 'PuC16H16'],
            [['Pu(NO3)4', true, 'Pu'], 'PuN4O12'],
            [['Am(OH)3', true, 'Am'], 'AmH3O3'],
            [['Am(NO3)3', true, 'Am'], 'AmN3O9'],
            [['Cm(NO3)3', true, 'Cm'], 'CmN3O9'],
            [['Bk(NO3)3', true, 'Bk'], 'BkN3O9'],
            */
            [['Cf[B6O8(OH)5]', true, 'Cf', 'B'], 'CfB6H5O13'],
        ];

        return Test.run(Molecules.convertFormula, tests);
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
            const protons = Elements.findProtons(symbol);
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
            const components = Molecules.parse(formula);
            for (const protons of candidates) {
                const symbol = Elements.findSymbol(protons);
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
        if (symbol in Molecules.#foundElements) {
            return Molecules.#foundElements[symbol];
        }
        const formulas = [];
        for (const formula in moleculesData) {
            const elements = Molecules.parse(formula);
            if (symbol in elements) {
                formulas.push(formula);
            }
        }
        Molecules.#foundElements[symbol] = formulas;
        return formulas;
    }

    /**
     * Test the findElement method.
     *
     * @returns {integer} How many tests failed
     */
    static findElementTest() {
        const tests = [
            [[''], []],
            [[' '], []],
            [['X'], []],
            [['He'], ['HeLi', 'Na2He']],
            [['Kr'], ['KrF', 'KrF2']],
            [['Rn'], ['RnO3', 'RnF2']],
            [['Fr'], ['FrOH', 'FrCl']],
        ];

        return Test.run(Molecules.findElement, tests);
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
        if (search in Molecules.#foundFormulas) {
            return Molecules.#foundFormulas[search];
        }
        const formulas = [];
        const upper = search.toUpperCase();

        for (const formula in moleculesData) {
            const f = formula.toUpperCase();
            if ((f === upper) || (f.includes(upper))) {
                formulas.push(formula);
            }
        }

        Molecules.#foundFormulas[search] = formulas;
        return formulas;
    }

    /**
     * Test the findFormulas method.
     *
     * @returns {integer} How many tests failed
     */
    static findFormulasTest() {
        const tests = [
            [[''], []],
            [[' '], []],
            [['w3'], ['Nd2W3O12']],
            [['y3'], ['Y3Al5O12']],
        ];

        return Test.run(Molecules.findFormulas, tests);
    }

    static #foundNames = {};

    /**
     * Find a molecular formula by its exact name, case sensitive.
     *
     * @param {string} name - A molecule name
     * @returns {Array<string>} Molecular formulas that match the given name exactly
     */
    static findName(name) {
        if (name in Molecules.#foundNames) {
            return Molecules.#foundNames[name];
        }
        const formulas = [];
        for (const formula in moleculesData) {
            const names = moleculesData[formula];
            if (names.includes(name)) {
                formulas.push(formula);
            }
        }
        Molecules.#foundNames[name] = formulas;
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
        for (const formula in moleculesData) {
            for (const name of moleculesData[formula]) {
                if (name.toUpperCase().includes(upper)) {
                    common.pushTo(molecules, formula, name);
                }
            }
        }
        return molecules;
    }

    /**
     * Test the findNames method.
     *
     * @returns {integer} How many tests failed
     */
    static findNamesTest() {
        const tests = [
            [[''], {}],
            [[' '], {}],
            [['bifluoride'], {NaHF2: ['Sodium bifluoride'], KHF2: ['Potassium bifluoride']}],
            [['triazan'], {H5N3: ['Triazane']}],
        ];

        return Test.run(Molecules.findNames, tests);
    }

    /**
     * Find duplicate molecule names in our database.
     *
     * @returns {object} Molecular formulas, keyed by molecule names
     */
    static findDuplicateNames() {
        console.time('findDuplicateNames');
        const dupes = {};
        for (const formula in moleculesData) {
            const names = moleculesData[formula];
            for (const name of names) {
                const formulas = Molecules.findName(name);
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
        for (const formula in moleculesData) {
            const matches = Molecules.findEquivalentFormulas(formula);
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
        for (const f in moleculesData) {
            if (formula === f) {
                continue;
            }
            const result = Molecules.compare(formula, f);
            if (result === 0) {
                formulas.push(f);
            }
        }
        return formulas;
    }

    /**
     * Format a molecular formula for output to HTML.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} HTML: inline text
     */
    static format(formula) {
        return formula.replaceAll(/\d+/g, '<sub>$&</sub>');
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
        return symbol ? Molecules.findElement(symbol) : Object.keys(moleculesData);
    }

    static #parsed = {};

    /**
     * Parse a molecular formula into its component elements.
     *
     * @param {string} formula - A molecular formula
     * @returns {object} Element counts, keyed by element symbols
     */
    static parse(formula) {
        if (formula in Molecules.#parsed) {
            return Molecules.#parsed[formula];
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
        Molecules.#parsed[formula] = elements;
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
     * Order an objects properties according to atomic number, ascending.
     *
     * @param {object} elements - Element counts, keyed by element symbols
     * @returns {object} An object with keys in order of atomic number, ascending
     */
    static sortElements(elements) {
        // Accepts an object of element counts, keyed by element symbols.
        // Returns a copy of the object with the keys sorted.
        const keys = Object.keys(elements).sort(Elements.compare);
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
            formulas = Object.keys(moleculesData);
        }
        const sorted = formulas.toSorted((a, b) => Molecules.compare(a, b, priority));

        for (let i = 0; i < formulas.length; i++) {
            if (formulas[i] !== sorted[i]) {
                Molecules.compare(formulas[i], sorted[i], priority, true);
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
    static sortByFirstElement(formulas = Object.keys(moleculesData)) {
        console.time('Molecules.sortByFirstElement()');
        let sorted = [];
        const byElement = {};
        for (const formula of formulas) {
            const components = Molecules.parse(formula);
            const element = Object.keys(components)[0];
            common.pushTo(byElement, element, formula);
        }
        for (const element in byElement) {
            const formulas = byElement[element];
            sorted = sorted.concat(Molecules.sort(formulas, element));
        }
        console.timeEnd('Molecules.sortByFirstElement()');
        return sorted;
    }

    /**
     * Calculate the weight of a molecular formula.
     *
     * @param {string} formula - A molecular formula
     * @returns {integer} The molecular weight of the formula
     */
    static weigh(formula) {
        const elements = Molecules.parse(formula);
        let weight = 0;
        for (const symbol in elements) {
            const protons = Elements.findProtons(symbol);
            const element = elementsData.get(protons);
            weight += Math.round(element.weight) * elements[symbol];
        }
        return weight;
    }

    /**
     * Create the HTML for the molecules page.
     *
     * @returns {string} HTML: a chart and a list
     */
    static render() {
        document.title = 'Molecules';
        let html = `<h1>${document.title}</h1>`;
        html += Molecules.renderChart();
        html += Molecules.renderList();
        Molecules.sortByFirstElement();
        //console.log(Molecules.findDuplicateNames());
        //console.log(Molecules.findDuplicateFormulas());
        return html;
    }

    /**
     * Create the HTML for the molecules chart.
     *
     * @returns {string} HTML: a chart
     */
    static renderChart() {
        console.time('molecules-chart');
        const counts = new Map();
        let max = 0;
        for (const [protons, element] of elementsData) {
            const formulas = Molecules.list(element.symbol);
            let count = 0;
            for (const formula of formulas) {
                const molecules = moleculesData[formula];
                count += molecules.length;
            }
            if (count > max) {
                max = count;
            }
            counts.set(protons, count);
        }

        let html = '<section class="molecules-chart">';
        for (const [protons, count] of counts) {
            const element = elementsData.get(protons);
            const percent = ((count / max) * 100).toFixed(1);
            const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
            html += `<div class="${typeClass}" style="width: calc(${percent}% + var(--molecules-width-min))">`;
            html += `<a href="?protons=${protons}" title="${element.name}">`;
            html += `${element.symbol}: ${count}`;
            html += '<span class="link"></span></a></div>';
        }
        html += '</section>';
        console.timeEnd('molecules-chart');

        return html;
    }

    /**
     * Create the HTML for the formula page.
     *
     * @param {string} formula - A molecular formula
     * @returns {string} HTML: headings and blocks
     */
    static renderFormula(formula) {
        const pretty = Molecules.format(formula);

        document.title = formula;

        let html = `<h1>${pretty}</h1>`;
        html += `<p>Molecular weight: ${Molecules.weigh(formula)}</p>`;
        html += '<h2>Links</h2>';

        if (formula in moleculesData) {
            html += '<ul>';
            for (const chemical of moleculesData[formula]) {
                html += `<li>${Link.toWikipedia(chemical, `Wikipedia: ${chemical}`)}</li>`;
            }
            html += '</ul>';
        }
        else {
            html += '<p>Chemical formula not found.</p>';
        }

        html += '<ul>';
        html += `<li>${Link.create(Molecules.getWebBookURL(formula), 'NIST WebBook', true)}</li>`;
        html += `<li>${Link.create(Molecules.getChemSpiderURL(formula), 'ChemSpider', true)}</li>`;
        html += `<li>${Link.create(Molecules.getPubChemURL(formula), 'PubChem', true)}</li>`;
        html += '</ul>';

        const elements = Molecules.parse(formula);

        html += '<h2>Contains</h2>';
        html += '<section class="elements">';
        for (const symbol in elements) {
            const protons = Elements.findProtons(symbol);
            html += Elements.formatElement(protons, true);
        }
        html += '</section>';

        return html;
    }

    /**
     * Create the HTML for a list of molecular formulas.
     *
     * @param {string|null} [symbol=null] - An element symbol
     * @returns {string} HTML: a heading and a list
     */
    static renderList(symbol = null) {
        const formulas = Molecules.list(symbol);
        if (formulas.length < 1) {
            return '';
        }

        let moleculesCount = 0;
        for (const formula of formulas) {
            const names = moleculesData[formula];
            moleculesCount += names.length;
        }

        const formulasTally = `${formulas.length} Formula${(formulas.length === 1) ? '' : 's'}`;
        const moleculesTally = `${moleculesCount} Molecule${(moleculesCount === 1) ? '' : 's'}`;
        let html = `<h3>${formulasTally}, ${moleculesTally}</h3>`;
        html += '<ul>';
        for (const formula of formulas) {
            const names = moleculesData[formula];
            const linkText = `${Molecules.format(formula)}: ${names.join(', ')}`;
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }

    /**
     * Create the HTML for a word cloud of molecule names.
     *
     * @returns {string} HTML: a paragraph block
     */
    static renderWords() {
        console.time('Molecules.renderWords()');
        //console.time('Molecules.renderWords() collecting');
        const strings = [];
        for (const names of Object.values(moleculesData)) {
            for (const name of names) {
                const string = name.replace(/\([IV,]+\)/i, '').replace('′', '\'',);
                strings.push(string);
            }
        }
        //console.timeEnd('Molecules.renderWords() collecting');

        const words = Search.countWords(strings);

        //console.time('Molecules.renderWords() pruning');
        for (const [word, count] of Object.entries(words)) {
            if (count === 1 || word.length < 3) {
                delete words[word];
            }
        }
        //console.timeEnd('Molecules.renderWords() pruning');

        const html = Search.renderWords(words);

        console.timeEnd('Molecules.renderWords()');
        return html;
    }
}
