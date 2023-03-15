'use strict';

class Elements {
    static data = {
        1: { symbol: 'H', name: 'Hydrogen', weight: 1.00794, period: 1, group: 1, density: 0.071, melts: -259.3, boils: -252.9, type: 'Other Nonmetal' },
        2: { symbol: 'He', name: 'Helium', weight: null, period: 1, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        3: { symbol: 'Li', name: 'Lithium', weight: null, period: 2, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        4: { symbol: 'Be', name: 'Beryllium', weight: null, period: 2, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        5: { symbol: 'B', name: 'Boron', weight: null, period: 2, group: 13, density: null, melts: null, boils: null, type: 'Metalloid' },
        6: { symbol: 'C', name: 'Carbon', weight: null, period: 2, group: 14, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        7: { symbol: 'N', name: 'Nitrogen', weight: null, period: 2, group: 15, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        8: { symbol: 'O', name: 'Oxygen', weight: null, period: 2, group: 16, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        9: { symbol: 'F', name: 'Flourine', weight: null, period: 2, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        10: { symbol: 'Ne', name: 'Neon', weight: null, period: 2, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        11: { symbol: 'Na', name: 'Sodium', weight: null, period: 3, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        12: { symbol: 'Mg', name: 'Magnesium', weight: null, period: 3, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        13: { symbol: 'Al', name: 'Aluminum', weight: null, period: 3, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        14: { symbol: 'Si', name: 'Silicon', weight: null, period: 3, group: 14, density: null, melts: null, boils: null, type: 'Metalloid' },
        15: { symbol: 'P', name: 'Phosphorus', weight: null, period: 3, group: 15, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        16: { symbol: 'S', name: 'Sulfur', weight: null, period: 3, group: 16, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        17: { symbol: 'Cl', name: 'Chlorine', weight: null, period: 3, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        18: { symbol: 'Ar', name: 'Argon', weight: null, period: 3, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        19: { symbol: 'K', name: 'Potassium', weight: null, period: 4, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        20: { symbol: 'Ca', name: 'Calcium', weight: null, period: 4, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        21: { symbol: 'Sc', name: 'Scandium', weight: null, period: 4, group: 3, density: null, melts: null, boils: null, type: 'Transition Metal' },
        22: { symbol: 'Ti', name: 'Titanium', weight: null, period: 4, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        23: { symbol: 'V', name: 'Vanadium', weight: null, period: 4, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        24: { symbol: 'Cr', name: 'Chromium', weight: null, period: 4, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        25: { symbol: 'Mn', name: 'Manganese', weight: null, period: 4, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        26: { symbol: 'Fe', name: 'Iron', weight: null, period: 4, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        27: { symbol: 'Co', name: 'Cobalt', weight: null, period: 4, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        28: { symbol: 'Ni', name: 'Nickel', weight: null, period: 4, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        29: { symbol: 'Cu', name: 'Copper', weight: null, period: 4, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        30: { symbol: 'Zn', name: 'Zinc', weight: null, period: 4, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        31: { symbol: 'Ga', name: 'Gallium', weight: null, period: 4, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        32: { symbol: 'Ge', name: 'Germanium', weight: null, period: 4, group: 14, density: null, melts: null, boils: null, type: 'Metalloid' },
        33: { symbol: 'As', name: 'Arsenic', weight: null, period: 4, group: 15, density: null, melts: null, boils: null, type: 'Metalloid' },
        34: { symbol: 'Se', name: 'Selenium', weight: null, period: 4, group: 16, density: null, melts: null, boils: null, type: 'Other Nonmetal' },
        35: { symbol: 'Br', name: 'Bromine', weight: null, period: 4, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        36: { symbol: 'Kr', name: 'Krypton', weight: null, period: 4, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        37: { symbol: 'Rb', name: 'Rubidium', weight: null, period: 5, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        38: { symbol: 'Sr', name: 'Strontium', weight: null, period: 5, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        39: { symbol: 'Y', name: 'Yttrium', weight: null, period: 5, group: 3, density: null, melts: null, boils: null, type: 'Transition Metal' },
        40: { symbol: 'Zr', name: 'Zirconium', weight: null, period: 5, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        41: { symbol: 'Nb', name: 'Niobium', weight: null, period: 5, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        42: { symbol: 'Mo', name: 'Molybdenum', weight: null, period: 5, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        43: { symbol: 'Tc', name: 'Technetium', weight: null, period: 5, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        44: { symbol: 'Ru', name: 'Ruthenium', weight: null, period: 5, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        45: { symbol: 'Rh', name: 'Rhodium', weight: null, period: 5, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        46: { symbol: 'Pd', name: 'Palladium', weight: null, period: 5, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        47: { symbol: 'Ag', name: 'Silver', weight: null, period: 5, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        48: { symbol: 'Cd', name: 'Cadmium', weight: null, period: 5, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        49: { symbol: 'In', name: 'Indium', weight: null, period: 5, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        50: { symbol: 'Sn', name: 'Tin', weight: null, period: 5, group: 14, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        51: { symbol: 'Sb', name: 'Antimony', weight: null, period: 5, group: 15, density: null, melts: null, boils: null, type: 'Metalloid' },
        52: { symbol: 'Te', name: 'Tellurium', weight: null, period: 5, group: 16, density: null, melts: null, boils: null, type: 'Metalloid' },
        53: { symbol: 'I', name: 'Iodine', weight: null, period: 5, group: 17, density: null, melts: null, boils: null, type: 'Halogen Nonmetal' },
        54: { symbol: 'Xe', name: 'Xenon', weight: null, period: 5, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        55: { symbol: 'Cs', name: 'Cesium', weight: null, period: 6, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        56: { symbol: 'Ba', name: 'Barium', weight: null, period: 6, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        57: { symbol: 'La', name: 'Lanthanum', weight: null, period: 6, group: 1, density: null, melts: null, boils: null, type: 'Lanthanide' },
        58: { symbol: 'Ce', name: 'Cerium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        59: { symbol: 'Pr', name: 'Praseodymium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        60: { symbol: 'Nd', name: 'Neodymium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        61: { symbol: 'Pm', name: 'Prometheum', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        62: { symbol: 'Sm', name: 'Samarium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        63: { symbol: 'Eu', name: 'Europium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        64: { symbol: 'Gd', name: 'Gadolinium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        65: { symbol: 'Tb', name: 'Terbium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        66: { symbol: 'Dy', name: 'Dysprosium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        67: { symbol: 'Ho', name: 'Holmium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        68: { symbol: 'Er', name: 'Erbium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        69: { symbol: 'Tm', name: 'Thulium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        70: { symbol: 'Yb', name: 'Ytterbium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        71: { symbol: 'Lu', name: 'Lutetium', weight: null, period: 6, group: null, density: null, melts: null, boils: null, type: 'Lanthanide' },
        72: { symbol: 'Hf', name: 'Hafnium', weight: null, period: 6, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        73: { symbol: 'Ta', name: 'Tantalum', weight: null, period: 6, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        74: { symbol: 'W', name: 'Tungsten', weight: null, period: 6, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        75: { symbol: 'Re', name: 'Rhenium', weight: null, period: 6, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        76: { symbol: 'Os', name: 'Osmium', weight: null, period: 6, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        77: { symbol: 'Ir', name: 'Iridium', weight: null, period: 6, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        78: { symbol: 'Pt', name: 'Platinum', weight: null, period: 6, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        79: { symbol: 'Au', name: 'Gold', weight: null, period: 6, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        80: { symbol: 'Hg', name: 'Mercury', weight: null, period: 6, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        81: { symbol: 'Tl', name: 'Thallium', weight: null, period: 6, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        82: { symbol: 'Pb', name: 'Lead', weight: null, period: 6, group: 14, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        83: { symbol: 'Bi', name: 'Bismuth', weight: null, period: 6, group: 15, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        84: { symbol: 'Po', name: 'Polonium', weight: null, period: 6, group: 16, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        85: { symbol: 'At', name: 'Astatine', weight: null, period: 6, group: 17, density: null, melts: null, boils: null, type: 'Metalloid' },
        86: { symbol: 'Rn', name: 'Radon', weight: null, period: 6, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
        87: { symbol: 'Fr', name: 'Francium', weight: null, period: 7, group: 1, density: null, melts: null, boils: null, type: 'Alkali Metal' },
        88: { symbol: 'Ra', name: 'Radium', weight: null, period: 7, group: 2, density: null, melts: null, boils: null, type: 'Alkaline Earth Metal' },
        89: { symbol: 'Ac', name: 'Actinium', weight: null, period: 7, group: 3, density: null, melts: null, boils: null, type: 'Actinide' },
        90: { symbol: 'Th', name: 'Thorium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        91: { symbol: 'Pa', name: 'Protactinium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        92: { symbol: 'U', name: 'Uranium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        93: { symbol: 'Np', name: 'Neptunium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        94: { symbol: 'Pu', name: 'Plutonium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        95: { symbol: 'Am', name: 'Americium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        96: { symbol: 'Cm', name: 'Curium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        97: { symbol: 'Bk', name: 'Berkelium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        98: { symbol: 'Cf', name: 'Californium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        99: { symbol: 'Es', name: 'Einsteinium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        100: { symbol: 'Fm', name: 'Fermium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        101: { symbol: 'Md', name: 'Mendelevium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        102: { symbol: 'No', name: 'Nobelium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        103: { symbol: 'Lr', name: 'Lawrencium', weight: null, period: 7, group: null, density: null, melts: null, boils: null, type: 'Actinide' },
        104: { symbol: 'Rf', name: 'Rutherfordium', weight: null, period: 7, group: 4, density: null, melts: null, boils: null, type: 'Transition Metal' },
        105: { symbol: 'Db', name: 'Dubnium', weight: null, period: 7, group: 5, density: null, melts: null, boils: null, type: 'Transition Metal' },
        106: { symbol: 'Sg', name: 'Seaborgium', weight: null, period: 7, group: 6, density: null, melts: null, boils: null, type: 'Transition Metal' },
        107: { symbol: 'Bh', name: 'Bohrium', weight: null, period: 7, group: 7, density: null, melts: null, boils: null, type: 'Transition Metal' },
        108: { symbol: 'Hs', name: 'Hassium', weight: null, period: 7, group: 8, density: null, melts: null, boils: null, type: 'Transition Metal' },
        109: { symbol: 'Mt', name: 'Meitnerium', weight: null, period: 7, group: 9, density: null, melts: null, boils: null, type: 'Transition Metal' },
        110: { symbol: 'Ds', name: 'Darmstadtium', weight: null, period: 7, group: 10, density: null, melts: null, boils: null, type: 'Transition Metal' },
        111: { symbol: 'Rg', name: 'Roentgenium', weight: null, period: 7, group: 11, density: null, melts: null, boils: null, type: 'Transition Metal' },
        112: { symbol: 'Cn', name: 'Copernicium', weight: null, period: 7, group: 12, density: null, melts: null, boils: null, type: 'Transition Metal' },
        113: { symbol: 'Nh', name: 'Nihonium', weight: null, period: 7, group: 13, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        114: { symbol: 'Fl', name: 'Flerovium', weight: null, period: 7, group: 14, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        115: { symbol: 'Mc', name: 'Moscovium', weight: null, period: 7, group: 15, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        116: { symbol: 'Lv', name: 'Livermorium', weight: null, period: 7, group: 16, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        117: { symbol: 'Ts', name: 'Tennessine', weight: null, period: 7, group: 17, density: null, melts: null, boils: null, type: 'Post Transition Metal' },
        118: { symbol: 'Og', name: 'Oganesson', weight: null, period: 7, group: 18, density: null, melts: null, boils: null, type: 'Noble Gas' },
    };

    static groups = {
        // The key is the group number.
        // The value is the former group designation.
        1: 'IA',
        2: 'IIA',
        3: 'IIIB',
        4: 'IVB',
        5: 'VB',
        6: 'VIB',
        7: 'VIIB',
        8: 'VIIIB',
        9: 'VIIIB',
        10: 'VIIIB',
        11: 'IB',
        12: 'IIB',
        13: 'IIIA',
        14: 'IVA',
        15: 'VA',
        16: 'VIA',
        17: 'VIIA',
        18: 'VIIIA',
    };

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

        for (const group in Elements.groups) {
            html += `<th class="group-${group}">${group}</th>`;
        }

        html += '</tr></thead><tbody>';

        for (const [period, bounds] of Elements.periods) {
            const min = bounds['min'];
            const max = bounds['max'];
            let tr = '';
            let protons = min; // The atomic number of the element.
            let gapCount = 1;
            console.log("period:", period, "min:", min, "max:", max, "protons:", protons);

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
                    //console.log(protons, gaps[protons], gapCount);
                    tdClass = 'empty';
                }
                else {
                    td = `<span class="atomic">${protons}</span><br>`;
                    td += `<span class="symbol">${element.symbol}</span><br>`;
                    td += `<span class="name">${element.name}</span><br>`;
                    if (element.weight) {
                        td += `<span class="weight">${element.weight}</span>`;
                    }
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
