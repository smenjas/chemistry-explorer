import Molecule from '../molecule.js';
import Test from '../test.js';

/**
 * Process information about molecules.
 */
export default class MoleculeTest {
    /**
     * Test the compare method.
     *
     * @returns {integer} How many tests failed
     */
    static compare() {
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

        return Test.run(Molecule.compare, tests);
    }

    /**
     * Test the convertFormula method.
     *
     * @returns {integer} How many tests failed
     */
    static convertFormula() {
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

        return Test.run(Molecule.convertFormula, tests);
    }

    /**
     * Test the findElement method.
     *
     * @returns {integer} How many tests failed
     */
    static findElement() {
        const tests = [
            [[''], []],
            [[' '], []],
            [['X'], []],
            [['He'], ['HeLi', 'Na2He']],
            [['Kr'], ['KrF', 'KrF2']],
            [['Rn'], ['RnO3', 'RnF2']],
            [['Fr'], ['FrOH', 'FrCl']],
        ];

        return Test.run(Molecule.findElement, tests);
    }

    /**
     * Test the findFormulas method.
     *
     * @returns {integer} How many tests failed
     */
    static findFormulas() {
        const tests = [
            [[''], []],
            [[' '], []],
            [['w3'], ['Nd2W3O12']],
            [['y3'], ['Y3Al5O12']],
        ];

        return Test.run(Molecule.findFormulas, tests);
    }

    /**
     * Test the findNames method.
     *
     * @returns {integer} How many tests failed
     */
    static findNames() {
        const tests = [
            [[''], {}],
            [[' '], {}],
            [['bifluoride'], {NaHF2: ['Sodium bifluoride'], KHF2: ['Potassium bifluoride']}],
            [['triazan'], {H5N3: ['Triazane']}],
        ];

        return Test.run(Molecule.findNames, tests);
    }
}
