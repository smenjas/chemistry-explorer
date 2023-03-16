'use strict';

class Elements {
    static data = {
        1: { symbol: 'H', name: 'Hydrogen', weight: 1.00794, period: 1, group: 1, density: 0.071, melts: -259.3, boils: -252.9, type: 'Other Nonmetal' },
        2: { symbol: 'He', name: 'Helium', weight: 4.0026, period: 1, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        3: { symbol: 'Li', name: 'Lithium', weight: 6.939, period: 2, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        4: { symbol: 'Be', name: 'Beryllium', weight: 9.0122, period: 2, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        5: { symbol: 'B', name: 'Boron', weight: 10.811, period: 2, group: 13, density: null, melts: null, boils: null, type: 'Metalloid' },
        6: { symbol: 'C', name: 'Carbon', weight: 12.0111, period: 2, group: 14, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        7: { symbol: 'N', name: 'Nitrogen', weight: 14.0067, period: 2, group: 15, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        8: { symbol: 'O', name: 'Oxygen', weight: 15.9994, period: 2, group: 16, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        9: { symbol: 'F', name: 'Flourine', weight: 18.9984, period: 2, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        10: { symbol: 'Ne', name: 'Neon', weight: 20.180, period: 2, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        11: { symbol: 'Na', name: 'Sodium', weight: 22.9898, period: 3, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        12: { symbol: 'Mg', name: 'Magnesium', weight: 24.305, period: 3, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        13: { symbol: 'Al', name: 'Aluminum', weight: 26.9815, period: 3, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        14: { symbol: 'Si', name: 'Silicon', weight: 28.086, period: 3, group: 14, density: null, melts: null, boils: null, type: 'Metalloid' },
        15: { symbol: 'P', name: 'Phosphorus', weight: 30.9738, period: 3, group: 15, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        16: { symbol: 'S', name: 'Sulfur', weight: 32.064, period: 3, group: 16, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        17: { symbol: 'Cl', name: 'Chlorine', weight: 35.453, period: 3, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        18: { symbol: 'Ar', name: 'Argon', weight: 39.948, period: 3, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        19: { symbol: 'K', name: 'Potassium', weight: 39.098, period: 4, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        20: { symbol: 'Ca', name: 'Calcium', weight: 40.08, period: 4, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        21: { symbol: 'Sc', name: 'Scandium', weight: 44.956, period: 4, group: 3, density: null, melts: null, boils: null, type: 'Transition Metal' },
        22: { symbol: 'Ti', name: 'Titanium', weight: 47.90, period: 4, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        23: { symbol: 'V', name: 'Vanadium', weight: 50.942, period: 4, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        24: { symbol: 'Cr', name: 'Chromium', weight: 51.996, period: 4, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        25: { symbol: 'Mn', name: 'Manganese', weight: 54.938, period: 4, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        26: { symbol: 'Fe', name: 'Iron', weight: 55.847, period: 4, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        27: { symbol: 'Co', name: 'Cobalt', weight: 58.933, period: 4, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        28: { symbol: 'Ni', name: 'Nickel', weight: 58.69, period: 4, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        29: { symbol: 'Cu', name: 'Copper', weight: 63.54, period: 4, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        30: { symbol: 'Zn', name: 'Zinc', weight: 65.37, period: 4, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        31: { symbol: 'Ga', name: 'Gallium', weight: 69.72, period: 4, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        32: { symbol: 'Ge', name: 'Germanium', weight: 72.59, period: 4, group: 14, density: null, melts: null, boils: null, type: 'Metalloid' },
        33: { symbol: 'As', name: 'Arsenic', weight: 74.922, period: 4, group: 15, density: null, melts: null, boils: null, type: 'Metalloid' },
        34: { symbol: 'Se', name: 'Selenium', weight: 78.96, period: 4, group: 16, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        35: { symbol: 'Br', name: 'Bromine', weight: 79.904, period: 4, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        36: { symbol: 'Kr', name: 'Krypton', weight: 83.80, period: 4, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        37: { symbol: 'Rb', name: 'Rubidium', weight: 85.47, period: 5, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        38: { symbol: 'Sr', name: 'Strontium', weight: 87.62, period: 5, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        39: { symbol: 'Y', name: 'Yttrium', weight: 88.905, period: 5, group: 3, density: null, melts: null, boils: null, type: 'Transition Metal' },
        40: { symbol: 'Zr', name: 'Zirconium', weight: 91.22, period: 5, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        41: { symbol: 'Nb', name: 'Niobium', weight: 92.906, period: 5, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        42: { symbol: 'Mo', name: 'Molybdenum', weight: 95.94, period: 5, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        43: { symbol: 'Tc', name: 'Technetium', weight: 99, period: 5, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        44: { symbol: 'Ru', name: 'Ruthenium', weight: 101.07, period: 5, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        45: { symbol: 'Rh', name: 'Rhodium', weight: 102.905, period: 5, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        46: { symbol: 'Pd', name: 'Palladium', weight: 106.4, period: 5, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        47: { symbol: 'Ag', name: 'Silver', weight: 107.870, period: 5, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        48: { symbol: 'Cd', name: 'Cadmium', weight: 112.41, period: 5, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        49: { symbol: 'In', name: 'Indium', weight: 114.82, period: 5, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        50: { symbol: 'Sn', name: 'Tin', weight: 118.69, period: 5, group: 14, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        51: { symbol: 'Sb', name: 'Antimony', weight: 121.76, period: 5, group: 15, density: null, melts: null, boils: null, type: 'Metalloid' },
        52: { symbol: 'Te', name: 'Tellurium', weight: 127.60, period: 5, group: 16, density: null, melts: null, boils: null, type: 'Metalloid' },
        53: { symbol: 'I', name: 'Iodine', weight: 126.904, period: 5, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        54: { symbol: 'Xe', name: 'Xenon', weight: 131.30, period: 5, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        55: { symbol: 'Cs', name: 'Cesium', weight: 132.905, period: 6, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        56: { symbol: 'Ba', name: 'Barium', weight: 137.33, period: 6, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        57: { symbol: 'La', name: 'Lanthanum', weight: 138.91, period: 6, group: 1, density: null, melts: null, boils: null, type: 'Lanthanide' },
        58: { symbol: 'Ce', name: 'Cerium', weight: 140.12, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        59: { symbol: 'Pr', name: 'Praseodymium', weight: 140.907, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        60: { symbol: 'Nd', name: 'Neodymium', weight: 144.24, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        61: { symbol: 'Pm', name: 'Prometheum', weight: 145, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        62: { symbol: 'Sm', name: 'Samarium', weight: 150.36, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        63: { symbol: 'Eu', name: 'Europium', weight: 151.964, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        64: { symbol: 'Gd', name: 'Gadolinium', weight: 157.25, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        65: { symbol: 'Tb', name: 'Terbium', weight: 158.925, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        66: { symbol: 'Dy', name: 'Dysprosium', weight: 162.50, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        67: { symbol: 'Ho', name: 'Holmium', weight: 164.930, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        68: { symbol: 'Er', name: 'Erbium', weight: 167.259, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        69: { symbol: 'Tm', name: 'Thulium', weight: 168.934, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        70: { symbol: 'Yb', name: 'Ytterbium', weight: 173.054, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        71: { symbol: 'Lu', name: 'Lutetium', weight: 174.97, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        72: { symbol: 'Hf', name: 'Hafnium', weight: 178.49, period: 6, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        73: { symbol: 'Ta', name: 'Tantalum', weight: 180.948, period: 6, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        74: { symbol: 'W', name: 'Tungsten', weight: 183.85, period: 6, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        75: { symbol: 'Re', name: 'Rhenium', weight: 186.2, period: 6, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        76: { symbol: 'Os', name: 'Osmium', weight: 190.2, period: 6, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        77: { symbol: 'Ir', name: 'Iridium', weight: 192.2, period: 6, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        78: { symbol: 'Pt', name: 'Platinum', weight: 195.09, period: 6, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        79: { symbol: 'Au', name: 'Gold', weight: 196.967, period: 6, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        80: { symbol: 'Hg', name: 'Mercury', weight: 200.59, period: 6, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        81: { symbol: 'Tl', name: 'Thallium', weight: 204.38, period: 6, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        82: { symbol: 'Pb', name: 'Lead', weight: 207.19, period: 6, group: 14, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        83: { symbol: 'Bi', name: 'Bismuth', weight: 208.980, period: 6, group: 15, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        84: { symbol: 'Po', name: 'Polonium', weight: 209, period: 6, group: 16, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        85: { symbol: 'At', name: 'Astatine', weight: 210, period: 6, group: 17, density: null, melts: null, boils: null, type: 'Metalloid' },
        86: { symbol: 'Rn', name: 'Radon', weight: 222, period: 6, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        87: { symbol: 'Fr', name: 'Francium', weight: 223, period: 7, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        88: { symbol: 'Ra', name: 'Radium', weight: 226, period: 7, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        89: { symbol: 'Ac', name: 'Actinium', weight: 227, period: 7, group: 3, density: null, melts: null, boils: null, type: 'Actinide' },
        90: { symbol: 'Th', name: 'Thorium', weight: 232.038, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        91: { symbol: 'Pa', name: 'Protactinium', weight: 231.035, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        92: { symbol: 'U', name: 'Uranium', weight: 238.028, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        93: { symbol: 'Np', name: 'Neptunium', weight: 237, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        94: { symbol: 'Pu', name: 'Plutonium', weight: 244, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        95: { symbol: 'Am', name: 'Americium', weight: 243, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        96: { symbol: 'Cm', name: 'Curium', weight: 247, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        97: { symbol: 'Bk', name: 'Berkelium', weight: 247, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        98: { symbol: 'Cf', name: 'Californium', weight: 251, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        99: { symbol: 'Es', name: 'Einsteinium', weight: 252, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        100: { symbol: 'Fm', name: 'Fermium', weight: 257, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        101: { symbol: 'Md', name: 'Mendelevium', weight: 258, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        102: { symbol: 'No', name: 'Nobelium', weight: 259, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        103: { symbol: 'Lr', name: 'Lawrencium', weight: 262, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        104: { symbol: 'Rf', name: 'Rutherfordium', weight: 267, period: 7, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        105: { symbol: 'Db', name: 'Dubnium', weight: 268, period: 7, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        106: { symbol: 'Sg', name: 'Seaborgium', weight: 271, period: 7, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        107: { symbol: 'Bh', name: 'Bohrium', weight: 272, period: 7, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        108: { symbol: 'Hs', name: 'Hassium', weight: 270, period: 7, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        109: { symbol: 'Mt', name: 'Meitnerium', weight: 276, period: 7, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        110: { symbol: 'Ds', name: 'Darmstadtium', weight: 281, period: 7, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        111: { symbol: 'Rg', name: 'Roentgenium', weight: 280, period: 7, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        112: { symbol: 'Cn', name: 'Copernicium', weight: 285, period: 7, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        113: { symbol: 'Nh', name: 'Nihonium', weight: 284, period: 7, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        114: { symbol: 'Fl', name: 'Flerovium', weight: 289, period: 7, group: 14, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        115: { symbol: 'Mc', name: 'Moscovium', weight: 288, period: 7, group: 15, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        116: { symbol: 'Lv', name: 'Livermorium', weight: 293, period: 7, group: 16, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        117: { symbol: 'Ts', name: 'Tennessine', weight: 294, period: 7, group: 17, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        118: { symbol: 'Og', name: 'Oganesson', weight: 294, period: 7, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
    };

    static groups = Elements.#getGroups();
    static #getGroups() {
        // The key is the group number.
        // The value is the former group designation.
        const groups = new Map();
        groups.set(1, 'IA');
        groups.set(2, 'IIA');
        groups.set(3, 'IIIB');
        groups.set(4, 'IVB');
        groups.set(5, 'VB');
        groups.set(6, 'VIB');
        groups.set(7, 'VIIB');
        groups.set(8, 'VIIIB');
        groups.set(9, 'VIIIB');
        groups.set(10, 'VIIIB');
        groups.set(11, 'IB');
        groups.set(12, 'IIB');
        groups.set(13, 'IIIA');
        groups.set(14, 'IVA');
        groups.set(15, 'VA');
        groups.set(16, 'VIA');
        groups.set(17, 'VIIA');
        groups.set(18, 'VIIIA');
        return groups;
    }

    static periods = Elements.#getPeriods();
    static #getPeriods() {
        const periods = new Map();
        periods.set(1, { min: 1, max: 2 });
        periods.set(2, { min: 3, max: 10 });
        periods.set(3, { min: 11, max: 18 });
        periods.set(4, { min: 19, max: 36 });
        periods.set(5, { min: 37, max: 54 });
        periods.set(6, { min: 55, max: 86 });
        periods.set(7, { min: 87, max: 118 });
        periods.set("Lanthanides", { min: 58, max: 71 });
        periods.set("Actinides", { min: 90, max: 103 });
        return periods;
    }

    static render() {
        document.title = "Periodic Table of the Elements";

        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += Elements.renderElements();
        html += '</main>';

        document.body.insertAdjacentHTML('beforeend', html);
    }

    static renderElements() {
        const gaps = {
            // The key is the atomic number of the element after the gap.
            // The value is the size of the gap.
            2: 16,
            5: 10,
            13: 10,
            58: 3,
            90: 3,
        };
        let html = `<table class="elements"><thead><tr>`;

        for (const [group, oldgroup] of Elements.groups) {
            const thTitle = `Group ${group} (formerly ${oldgroup})`;
            html += `<th class="group-${group}" title="${thTitle}">${group}<br>${oldgroup}</th>`;
        }

        html += '</tr></thead><tbody>';

        for (const [period, bounds] of Elements.periods) {
            const min = bounds['min'];
            const max = bounds['max'];
            let tr = '';
            let protons = min; // The atomic number of the element.
            let gapCount = 1;

            for (protons = min; protons <= max;) {
                let td = '';
                let tdClass = '';
                let tdTitle = '';

                if (period === 6 && protons === 58) {
                    // Skip the lanthanides.
                    protons = 72;
                }
                else if (period === 7 && protons === 90) {
                    // Skip the actinides.
                    protons = 104;
                }

                const element = Elements.data[protons];

                if (protons in gaps && gapCount <= gaps[protons]) {
                    // Skip gaps in the first 3 rows/periods.
                    gapCount++;
                    tdClass = 'empty';
                }
                else {
                    td = `<span class="atomic">${protons}</span><br>`;
                    td += `<span class="symbol">${element.symbol}</span><br>`;
                    td += `<span class="name">${element.name}</span><br>`;
                    const weight = (element.weight.toString().indexOf('.') === -1) ? `(${element.weight})` : element.weight;
                    td += `<span class="weight">${weight}</span>`;
                    tdClass = element.type.toLowerCase().replaceAll(' ', '-');
                    tdTitle = element.type;
                    protons++;
                }

                tr += `<td class="${tdClass}" title="${tdTitle}">${td}</td>`;
            }

            html += `<tr>${tr}</tr>`;
        }

        html += '</tbody></table>';

        return html;
    }
}

Elements.render();
