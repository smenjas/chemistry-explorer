'use strict';

class Site {
    static render() {
        const params = new URLSearchParams(window.location.search);
        const formula = params.get('formula');
        const group = params.get('group');
        const period = params.get('period');
        const protons = params.get('protons');
        const view = params.get('view');
        let html = '';

        if (formula) {
            html += Compounds.render(formula);
        }
        else if (group) {
            document.title = `Group ${group}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderGroupNav(group);
            html += Elements.renderGroup(group);
            html += '</main>';
        }
        else if (period) {
            document.title = `Period ${period}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderPeriodNav(period);
            html += Elements.renderPeriod(period);
            html += '</main>';
        }
        else if (view === 'isotopes') {
            html += Isotopes.render();
        }
        else {
            html += Elements.render(protons);
        }

        document.body.insertAdjacentHTML('beforeend', html);
    }
}

class Link {
    static create(url, content, newTab = false) {
        const target = (newTab) ? ' target="_blank"' : '';
        return `<a href="${url}"${target}>${content}</a>`;
    }

    static toWikipedia(path, content) {
        path = path.replaceAll(' ', '_');
        path = encodeURIComponent(path);
        path = path.replace('%23', '#'); // Allow fragments.
        const wikiURL = 'https://en.wikipedia.org/wiki/';
        const url = `${wikiURL}${path}`;
        return Link.create(url, content, true);
    }
}

class Elements {
    static data = {
        1:   { symbol: 'H',  name: 'Hydrogen',      weight:   1.00794, period: 1, group:  1,   block: 's', density:  0.071, melts: -259.3,  boils: -252.9,  type: 'Other Nonmetal' },
        2:   { symbol: 'He', name: 'Helium',        weight:   4.0026,  period: 1, group: 18,   block: 's', density:  0.126, melts: null,    boils: -268.9,  type: 'Noble Gas' },
        3:   { symbol: 'Li', name: 'Lithium',       weight:   6.939,   period: 2, group:  1,   block: 's', density:  0.53,  melts:  180.6,  boils: 1342,    type: 'Alkali Metal' },
        4:   { symbol: 'Be', name: 'Beryllium',     weight:   9.0122,  period: 2, group:  2,   block: 's', density:  1.85,  melts: 1289,    boils: 2472,    type: 'Alkaline Earth Metal' },
        5:   { symbol: 'B',  name: 'Boron',         weight:  10.811,   period: 2, group: 13,   block: 'p', density:  2.34,  melts: 2092,    boils: 4002,    type: 'Metalloid' },
        6:   { symbol: 'C',  name: 'Carbon',        weight:  12.0111,  period: 2, group: 14,   block: 'p', density:  2.26,  melts: null,    boils: 3827,    type: 'Other Nonmetal' },
        7:   { symbol: 'N',  name: 'Nitrogen',      weight:  14.0067,  period: 2, group: 15,   block: 'p', density:  0.81,  melts: -210,    boils: -195.8,  type: 'Other Nonmetal' },
        8:   { symbol: 'O',  name: 'Oxygen',        weight:  15.9994,  period: 2, group: 16,   block: 'p', density:  1.14,  melts: -218.79, boils: -182.97, type: 'Other Nonmetal' },
        9:   { symbol: 'F',  name: 'Fluorine',      weight:  18.9984,  period: 2, group: 17,   block: 'p', density:  1.11,  melts: -219.6,  boils: -188.1,  type: 'Halogen Nonmetal' },
        10:  { symbol: 'Ne', name: 'Neon',          weight:  20.180,   period: 2, group: 18,   block: 'p', density:  1.20,  melts: -248.6,  boils: -246,    type: 'Noble Gas' },
        11:  { symbol: 'Na', name: 'Sodium',        weight:  22.9898,  period: 3, group:  1,   block: 's', density:  0.97,  melts:   97.8,  boils:  883,    type: 'Alkali Metal' },
        12:  { symbol: 'Mg', name: 'Magnesium',     weight:  24.305,   period: 3, group:  2,   block: 's', density:  1.74,  melts:  650,    boils: 1090,    type: 'Alkaline Earth Metal' },
        13:  { symbol: 'Al', name: 'Aluminum',      weight:  26.9815,  period: 3, group: 13,   block: 'p', density:  2.70,  melts:  660,    boils: 2520,    type: 'Post Transition Metal' },
        14:  { symbol: 'Si', name: 'Silicon',       weight:  28.086,   period: 3, group: 14,   block: 'p', density:  2.33,  melts: 1414,    boils: 3267,    type: 'Metalloid' },
        15:  { symbol: 'P',  name: 'Phosphorus',    weight:  30.9738,  period: 3, group: 15,   block: 'p', density:  1.82,  melts:   44.1,  boils:  280,    type: 'Other Nonmetal' },
        16:  { symbol: 'S',  name: 'Sulfur',        weight:  32.064,   period: 3, group: 16,   block: 'p', density:  2.07,  melts:  115.2,  boils:  444.7,  type: 'Other Nonmetal' },
        17:  { symbol: 'Cl', name: 'Chlorine',      weight:  35.453,   period: 3, group: 17,   block: 'p', density:  1.56,  melts: -101,    boils:  -33.9,  type: 'Halogen Nonmetal' },
        18:  { symbol: 'Ar', name: 'Argon',         weight:  39.948,   period: 3, group: 18,   block: 'p', density:  1.40,  melts: -189.4,  boils: -185.9,  type: 'Noble Gas' },
        19:  { symbol: 'K',  name: 'Potassium',     weight:  39.098,   period: 4, group:  1,   block: 's', density:  0.86,  melts:   63.7,  boils:  759,    type: 'Alkali Metal' },
        20:  { symbol: 'Ca', name: 'Calcium',       weight:  40.08,    period: 4, group:  2,   block: 's', density:  1.55,  melts:  842,    boils: 1494,    type: 'Alkaline Earth Metal' },
        21:  { symbol: 'Sc', name: 'Scandium',      weight:  44.956,   period: 4, group:  3,   block: 'd', density:  3.0,   melts: 1541,    boils: 2836,    type: 'Transition Metal' },
        22:  { symbol: 'Ti', name: 'Titanium',      weight:  47.90,    period: 4, group:  4,   block: 'd', density:  4.51,  melts: 1670,    boils: 3289,    type: 'Transition Metal' },
        23:  { symbol: 'V',  name: 'Vanadium',      weight:  50.942,   period: 4, group:  5,   block: 'd', density:  6.1,   melts: 1910,    boils: 3409,    type: 'Transition Metal' },
        24:  { symbol: 'Cr', name: 'Chromium',      weight:  51.996,   period: 4, group:  6,   block: 'd', density:  7.19,  melts: 1863,    boils: 2672,    type: 'Transition Metal' },
        25:  { symbol: 'Mn', name: 'Manganese',     weight:  54.938,   period: 4, group:  7,   block: 'd', density:  7.43,  melts: 1246,    boils: 2062,    type: 'Transition Metal' },
        26:  { symbol: 'Fe', name: 'Iron',          weight:  55.847,   period: 4, group:  8,   block: 'd', density:  7.86,  melts: 1538,    boils: 2862,    type: 'Transition Metal' },
        27:  { symbol: 'Co', name: 'Cobalt',        weight:  58.933,   period: 4, group:  9,   block: 'd', density:  8.9,   melts: 1495,    boils: 2928,    type: 'Transition Metal' },
        28:  { symbol: 'Ni', name: 'Nickel',        weight:  58.69,    period: 4, group: 10,   block: 'd', density:  8.9,   melts: 1455,    boils: 2914,    type: 'Transition Metal' },
        29:  { symbol: 'Cu', name: 'Copper',        weight:  63.54,    period: 4, group: 11,   block: 'd', density:  8.96,  melts: 1085,    boils: 2563,    type: 'Transition Metal' },
        30:  { symbol: 'Zn', name: 'Zinc',          weight:  65.37,    period: 4, group: 12,   block: 'd', density:  7.14,  melts:  419.6,  boils:  907,    type: 'Transition Metal' },
        31:  { symbol: 'Ga', name: 'Gallium',       weight:  69.72,    period: 4, group: 13,   block: 'p', density:  5.91,  melts:   29.8,  boils: 2205,    type: 'Post Transition Metal' },
        32:  { symbol: 'Ge', name: 'Germanium',     weight:  72.59,    period: 4, group: 14,   block: 'p', density:  5.32,  melts:  938.4,  boils: 2834,    type: 'Metalloid' },
        33:  { symbol: 'As', name: 'Arsenic',       weight:  74.922,   period: 4, group: 15,   block: 'p', density:  5.72,  melts: null,    boils:  615,    type: 'Metalloid' },
        34:  { symbol: 'Se', name: 'Selenium',      weight:  78.96,    period: 4, group: 16,   block: 'p', density:  4.79,  melts:  221,    boils:  685,    type: 'Other Nonmetal' },
        35:  { symbol: 'Br', name: 'Bromine',       weight:  79.904,   period: 4, group: 17,   block: 'p', density:  3.12,  melts:   -7.2,  boils:   58.7,  type: 'Halogen Nonmetal' },
        36:  { symbol: 'Kr', name: 'Krypton',       weight:  83.80,    period: 4, group: 18,   block: 'p', density:  2.6,   melts: -157.3,  boils: -153.2,  type: 'Noble Gas' },
        37:  { symbol: 'Rb', name: 'Rubidium',      weight:  85.47,    period: 5, group:  1,   block: 's', density:  1.53,  melts:   39.48, boils:  688,    type: 'Alkali Metal' },
        38:  { symbol: 'Sr', name: 'Strontium',     weight:  87.62,    period: 5, group:  2,   block: 's', density:  2.6,   melts:  769,    boils: 1382,    type: 'Alkaline Earth Metal' },
        39:  { symbol: 'Y',  name: 'Yttrium',       weight:  88.905,   period: 5, group:  3,   block: 'd', density:  4.47,  melts: 1522,    boils: 3338,    type: 'Transition Metal' },
        40:  { symbol: 'Zr', name: 'Zirconium',     weight:  91.22,    period: 5, group:  4,   block: 'd', density:  6.49,  melts: 1855,    boils: 4409,    type: 'Transition Metal' },
        41:  { symbol: 'Nb', name: 'Niobium',       weight:  92.906,   period: 5, group:  5,   block: 'd', density:  8.4,   melts: 2469,    boils: 4744,    type: 'Transition Metal' },
        42:  { symbol: 'Mo', name: 'Molybdenum',    weight:  95.94,    period: 5, group:  6,   block: 'd', density: 10.2,   melts: 2623,    boils: 4639,    type: 'Transition Metal' },
        43:  { symbol: 'Tc', name: 'Technetium',    weight:  99,       period: 5, group:  7,   block: 'd', density: 11.5,   melts: 2204,    boils: 4265,    type: 'Transition Metal' },
        44:  { symbol: 'Ru', name: 'Ruthenium',     weight: 101.07,    period: 5, group:  8,   block: 'd', density: 12.2,   melts: 2334,    boils: 4150,    type: 'Transition Metal' },
        45:  { symbol: 'Rh', name: 'Rhodium',       weight: 102.905,   period: 5, group:  9,   block: 'd', density: 12.4,   melts: 1963,    boils: 3697,    type: 'Transition Metal' },
        46:  { symbol: 'Pd', name: 'Palladium',     weight: 106.4,     period: 5, group: 10,   block: 'd', density: 12.0,   melts: 1555,    boils: 2964,    type: 'Transition Metal' },
        47:  { symbol: 'Ag', name: 'Silver',        weight: 107.870,   period: 5, group: 11,   block: 'd', density: 10.5,   melts:  962,    boils: 2163,    type: 'Transition Metal' },
        48:  { symbol: 'Cd', name: 'Cadmium',       weight: 112.41,    period: 5, group: 12,   block: 'd', density:  2.65,  melts:  321.11, boils:  767,    type: 'Transition Metal' },
        49:  { symbol: 'In', name: 'Indium',        weight: 114.82,    period: 5, group: 13,   block: 'p', density:  7.31,  melts:  157,    boils: 2073,    type: 'Post Transition Metal' },
        50:  { symbol: 'Sn', name: 'Tin',           weight: 118.69,    period: 5, group: 14,   block: 'p', density:  7.30,  melts:  232,    boils: 2603,    type: 'Post Transition Metal' },
        51:  { symbol: 'Sb', name: 'Antimony',      weight: 121.76,    period: 5, group: 15,   block: 'p', density:  6.62,  melts:  630.8,  boils: 1587,    type: 'Metalloid' },
        52:  { symbol: 'Te', name: 'Tellurium',     weight: 127.60,    period: 5, group: 16,   block: 'p', density:  6.24,  melts:  450,    boils:  988,    type: 'Metalloid' },
        53:  { symbol: 'I',  name: 'Iodine',        weight: 126.904,   period: 5, group: 17,   block: 'p', density:  4.94,  melts:  113.5,  boils:  184.3,  type: 'Halogen Nonmetal' },
        54:  { symbol: 'Xe', name: 'Xenon',         weight: 131.30,    period: 5, group: 18,   block: 'p', density:  3.06,  melts: -111.8,  boils: -108,    type: 'Noble Gas' },
        55:  { symbol: 'Cs', name: 'Cesium',        weight: 132.905,   period: 6, group:  1,   block: 's', density:  1.90,  melts:   28.4,  boils:  671,    type: 'Alkali Metal' },
        56:  { symbol: 'Ba', name: 'Barium',        weight: 137.33,    period: 6, group:  2,   block: 's', density:  3.5,   melts:  729,    boils: 1805,    type: 'Alkaline Earth Metal' },
        57:  { symbol: 'La', name: 'Lanthanum',     weight: 138.91,    period: 6, group: null, block: 'f', density:  6.17,  melts:  918,    boils: 3464,    type: 'Lanthanide' },
        58:  { symbol: 'Ce', name: 'Cerium',        weight: 140.12,    period: 6, group: null, block: 'f', density:  6.67,  melts:  798,    boils: 3443,    type: 'Lanthanide' },
        59:  { symbol: 'Pr', name: 'Praseodymium',  weight: 140.907,   period: 6, group: null, block: 'f', density:  6.77,  melts:  931,    boils: 3520,    type: 'Lanthanide' },
        60:  { symbol: 'Nd', name: 'Neodymium',     weight: 144.24,    period: 6, group: null, block: 'f', density:  7.00,  melts: 1021,    boils: 3074,    type: 'Lanthanide' },
        61:  { symbol: 'Pm', name: 'Promethium',    weight: 145,       period: 6, group: null, block: 'f', density: null,   melts: 1042,    boils: 3000,    type: 'Lanthanide' },
        62:  { symbol: 'Sm', name: 'Samarium',      weight: 150.36,    period: 6, group: null, block: 'f', density:  7.54,  melts: 1074,    boils: 1794,    type: 'Lanthanide' },
        63:  { symbol: 'Eu', name: 'Europium',      weight: 151.964,   period: 6, group: null, block: 'f', density:  5.26,  melts:  822,    boils: 1527,    type: 'Lanthanide' },
        64:  { symbol: 'Gd', name: 'Gadolinium',    weight: 157.25,    period: 6, group: null, block: 'f', density:  7.89,  melts: 1313,    boils: 3273,    type: 'Lanthanide' },
        65:  { symbol: 'Tb', name: 'Terbium',       weight: 158.925,   period: 6, group: null, block: 'f', density:  8.27,  melts: 1356,    boils: 3230,    type: 'Lanthanide' },
        66:  { symbol: 'Dy', name: 'Dysprosium',    weight: 162.50,    period: 6, group: null, block: 'f', density:  8.54,  melts: 1412,    boils: 2567,    type: 'Lanthanide' },
        67:  { symbol: 'Ho', name: 'Holmium',       weight: 164.930,   period: 6, group: null, block: 'f', density:  8.80,  melts: 1474,    boils: 2700,    type: 'Lanthanide' },
        68:  { symbol: 'Er', name: 'Erbium',        weight: 167.259,   period: 6, group: null, block: 'f', density:  9.05,  melts: 1529,    boils: 2868,    type: 'Lanthanide' },
        69:  { symbol: 'Tm', name: 'Thulium',       weight: 168.934,   period: 6, group: null, block: 'f', density:  9.33,  melts: 1545,    boils: 1950,    type: 'Lanthanide' },
        70:  { symbol: 'Yb', name: 'Ytterbium',     weight: 173.054,   period: 6, group: null, block: 'f', density:  6.98,  melts:  819,    boils: 1196,    type: 'Lanthanide' },
        71:  { symbol: 'Lu', name: 'Lutetium',      weight: 174.97,    period: 6, group:  3,   block: 'd', density:  9.84,  melts: 1663,    boils: 3402,    type: 'Transition Metal' },
        72:  { symbol: 'Hf', name: 'Hafnium',       weight: 178.49,    period: 6, group:  4,   block: 'd', density: 13.1,   melts: 2231,    boils: 4603,    type: 'Transition Metal' },
        73:  { symbol: 'Ta', name: 'Tantalum',      weight: 180.948,   period: 6, group:  5,   block: 'd', density: 16.6,   melts: 3020,    boils: 5458,    type: 'Transition Metal' },
        74:  { symbol: 'W',  name: 'Tungsten',      weight: 183.85,    period: 6, group:  6,   block: 'd', density: 19.3,   melts: 3422,    boils: 5555,    type: 'Transition Metal' },
        75:  { symbol: 'Re', name: 'Rhenium',       weight: 186.2,     period: 6, group:  7,   block: 'd', density: 21.0,   melts: 3186,    boils: 5596,    type: 'Transition Metal' },
        76:  { symbol: 'Os', name: 'Osmium',        weight: 190.2,     period: 6, group:  8,   block: 'd', density: 22.6,   melts: 3033,    boils: 5012,    type: 'Transition Metal' },
        77:  { symbol: 'Ir', name: 'Iridium',       weight: 192.2,     period: 6, group:  9,   block: 'd', density: 22.5,   melts: 2447,    boils: 4428,    type: 'Transition Metal' },
        78:  { symbol: 'Pt', name: 'Platinum',      weight: 195.09,    period: 6, group: 10,   block: 'd', density: 21.4,   melts: 1769,    boils: 3827,    type: 'Transition Metal' },
        79:  { symbol: 'Au', name: 'Gold',          weight: 196.967,   period: 6, group: 11,   block: 'd', density: 19.3,   melts: 1064.4,  boils: 2857,    type: 'Transition Metal' },
        80:  { symbol: 'Hg', name: 'Mercury',       weight: 200.59,    period: 6, group: 12,   block: 'd', density: 13.6,   melts:  -38.8,  boils:  357,    type: 'Transition Metal' },
        81:  { symbol: 'Tl', name: 'Thallium',      weight: 204.38,    period: 6, group: 13,   block: 'p', density: 11.85,  melts:  304,    boils: 1473,    type: 'Post Transition Metal' },
        82:  { symbol: 'Pb', name: 'Lead',          weight: 207.19,    period: 6, group: 14,   block: 'p', density: 11.4,   melts:  327.5,  boils: 1750,    type: 'Post Transition Metal' },
        83:  { symbol: 'Bi', name: 'Bismuth',       weight: 208.980,   period: 6, group: 15,   block: 'p', density:  9.8,   melts:  271.4,  boils: 1564,    type: 'Post Transition Metal' },
        84:  { symbol: 'Po', name: 'Polonium',      weight: 209,       period: 6, group: 16,   block: 'p', density:  9.2,   melts:  254,    boils: null,    type: 'Post Transition Metal' },
        85:  { symbol: 'At', name: 'Astatine',      weight: 210,       period: 6, group: 17,   block: 'p', density: null,   melts:  302,    boils: null,    type: 'Metalloid' },
        86:  { symbol: 'Rn', name: 'Radon',         weight: 222,       period: 6, group: 18,   block: 'p', density: null,   melts:  -71,    boils:  -61.7,  type: 'Noble Gas' },
        87:  { symbol: 'Fr', name: 'Francium',      weight: 223,       period: 7, group:  1,   block: 's', density: null,   melts:   27,    boils: null,    type: 'Alkali Metal' },
        88:  { symbol: 'Ra', name: 'Radium',        weight: 226,       period: 7, group:  2,   block: 's', density:  5.0,   melts:  700,    boils: null,    type: 'Alkaline Earth Metal' },
        89:  { symbol: 'Ac', name: 'Actinium',      weight: 227,       period: 7, group:  3,   block: 'd', density: null,   melts: 1051,    boils: 3200,    type: 'Actinide' },
        90:  { symbol: 'Th', name: 'Thorium',       weight: 232.038,   period: 7, group: null, block: 'f', density: 11.7,   melts: 1755,    boils: 4788,    type: 'Actinide' },
        91:  { symbol: 'Pa', name: 'Protactinium',  weight: 231.035,   period: 7, group: null, block: 'f', density: 15.4,   melts: 1572,    boils: null,    type: 'Actinide' },
        92:  { symbol: 'U',  name: 'Uranium',       weight: 238.028,   period: 7, group: null, block: 'f', density: 19.07,  melts: 1135,    boils: 4134,    type: 'Actinide' },
        93:  { symbol: 'Np', name: 'Neptunium',     weight: 237,       period: 7, group: null, block: 'f', density: 19.5,   melts:  639,    boils: null,    type: 'Actinide' },
        94:  { symbol: 'Pu', name: 'Plutonium',     weight: 244,       period: 7, group: null, block: 'f', density: null,   melts:  640,    boils: 3230,    type: 'Actinide' },
        95:  { symbol: 'Am', name: 'Americium',     weight: 243,       period: 7, group: null, block: 'f', density: null,   melts: 1176,    boils: null,    type: 'Actinide' },
        96:  { symbol: 'Cm', name: 'Curium',        weight: 247,       period: 7, group: null, block: 'f', density: null,   melts: 1345,    boils: null,    type: 'Actinide' },
        97:  { symbol: 'Bk', name: 'Berkelium',     weight: 247,       period: 7, group: null, block: 'f', density: null,   melts: 1050,    boils: null,    type: 'Actinide' },
        98:  { symbol: 'Cf', name: 'Californium',   weight: 251,       period: 7, group: null, block: 'f', density: null,   melts:  900,    boils: null,    type: 'Actinide' },
        99:  { symbol: 'Es', name: 'Einsteinium',   weight: 252,       period: 7, group: null, block: 'f', density: null,   melts:  860,    boils: null,    type: 'Actinide' },
        100: { symbol: 'Fm', name: 'Fermium',       weight: 257,       period: 7, group: null, block: 'f', density: null,   melts: 1527,    boils: null,    type: 'Actinide' },
        101: { symbol: 'Md', name: 'Mendelevium',   weight: 258,       period: 7, group: null, block: 'f', density: null,   melts:  827,    boils: null,    type: 'Actinide' },
        102: { symbol: 'No', name: 'Nobelium',      weight: 259,       period: 7, group: null, block: 'f', density: null,   melts:  827,    boils: null,    type: 'Actinide' },
        103: { symbol: 'Lr', name: 'Lawrencium',    weight: 262,       period: 7, group:  3,   block: 'd', density: null,   melts: 1627,    boils: null,    type: 'Transition Metal' },
        104: { symbol: 'Rf', name: 'Rutherfordium', weight: 267,       period: 7, group:  4,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        105: { symbol: 'Db', name: 'Dubnium',       weight: 268,       period: 7, group:  5,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        106: { symbol: 'Sg', name: 'Seaborgium',    weight: 271,       period: 7, group:  6,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        107: { symbol: 'Bh', name: 'Bohrium',       weight: 272,       period: 7, group:  7,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        108: { symbol: 'Hs', name: 'Hassium',       weight: 270,       period: 7, group:  8,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        109: { symbol: 'Mt', name: 'Meitnerium',    weight: 276,       period: 7, group:  9,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        110: { symbol: 'Ds', name: 'Darmstadtium',  weight: 281,       period: 7, group: 10,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        111: { symbol: 'Rg', name: 'Roentgenium',   weight: 280,       period: 7, group: 11,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        112: { symbol: 'Cn', name: 'Copernicium',   weight: 285,       period: 7, group: 12,   block: 'd', density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        113: { symbol: 'Nh', name: 'Nihonium',      weight: 284,       period: 7, group: 13,   block: 'p', density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        114: { symbol: 'Fl', name: 'Flerovium',     weight: 289,       period: 7, group: 14,   block: 'p', density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        115: { symbol: 'Mc', name: 'Moscovium',     weight: 288,       period: 7, group: 15,   block: 'p', density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        116: { symbol: 'Lv', name: 'Livermorium',   weight: 293,       period: 7, group: 16,   block: 'p', density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        117: { symbol: 'Ts', name: 'Tennessine',    weight: 294,       period: 7, group: 17,   block: 'p', density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        118: { symbol: 'Og', name: 'Oganesson',     weight: 294,       period: 7, group: 18,   block: 'p', density: null,   melts: null,    boils: null,    type: 'Noble Gas' },
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

    static groupElements = {
        1: [1, 3, 11, 19, 37, 55, 87],
        2: [4, 12, 20, 38, 56, 88],
        3: [21, 39, 71, 103],
        4: [22, 40, 72, 104],
        5: [23, 41, 73, 105],
        6: [24, 42, 74, 106],
        7: [25, 43, 75, 107],
        8: [26, 44, 76, 108],
        9: [27, 45, 77, 109],
        10: [28, 46, 78, 110],
        11: [29, 47, 79, 111],
        12: [30, 48, 80, 112],
        13: [5, 13, 31, 49, 81, 113],
        14: [6, 14, 32, 50, 82, 114],
        15: [7, 15, 33, 51, 83, 115],
        16: [8, 16, 34, 52, 84, 116],
        17: [9, 17, 35, 53, 85, 117],
        18: [2, 10, 18, 36, 54, 86, 118],
    }

    static groupURLs = {
        1: 'https://en.wikipedia.org/wiki/Group_1_element',
        2: 'https://en.wikipedia.org/wiki/Alkaline_earth_metal',
        3: 'https://en.wikipedia.org/wiki/Group_3_element',
        4: 'https://en.wikipedia.org/wiki/Group_4_element',
        5: 'https://en.wikipedia.org/wiki/Group_5_element',
        6: 'https://en.wikipedia.org/wiki/Group_6_element',
        7: 'https://en.wikipedia.org/wiki/Group_7_element',
        8: 'https://en.wikipedia.org/wiki/Group_8_element',
        9: 'https://en.wikipedia.org/wiki/Group_9_element',
        10: 'https://en.wikipedia.org/wiki/Group_10_element',
        11: 'https://en.wikipedia.org/wiki/Group_11_element',
        12: 'https://en.wikipedia.org/wiki/Group_12_element',
        13: 'https://en.wikipedia.org/wiki/Boron_group',
        14: 'https://en.wikipedia.org/wiki/Carbon_group',
        15: 'https://en.wikipedia.org/wiki/Pnictogen',
        16: 'https://en.wikipedia.org/wiki/Chalcogen',
        17: 'https://en.wikipedia.org/wiki/Halogen',
        18: 'https://en.wikipedia.org/wiki/Noble_gas',
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
        periods.set("lanthanides", { min: 57, max: 70 });
        periods.set("actinides", { min: 89, max: 102 });
        return periods;
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

    static render(protons = null) {
        const element = Elements.data[protons];
        let html = '';

        if (protons && !element) {
            console.log("Unknown element:", protons);
        }

        if (element) {
            document.title = `${element.symbol}: ${element.name}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderElementNav(protons);
            html += Elements.renderElement(protons);
            html += '</main>';
        }
        else {
            document.title = "Periodic Table of the Elements";
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderElements();
            html += '</main>';
        }

        return html;
    }

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

    static findPreviousInGroup(protons) {
        const element = Elements.data[protons];
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

    static findProtons(symbol) {
        for (const protons in Elements.data) {
             const element = Elements.data[protons];
             if (element.symbol === symbol) {
                 return protons;
             }
        }
    }

    static formatCelsius(temperature) {
        return (temperature) ? `${temperature} °C` : "Unknown";
    }

    static formatDensity(density) {
        // The element data use grams per cubic centimeter for density.
        // See: https://en.wikipedia.org/wiki/Density#Unit
        return (density) ? `${density} g/cm<sup>3</sup>` : "Unknown";
    }

    static formatElement(protons, link = false) {
        const element = Elements.data[protons];

        let html = `<span class="atomic">${protons}<br></span>`;
        html += `<span class="symbol">${element.symbol}</span>`;
        html += `<span class="name"><br>${element.name}</span>`;
        html += `<span class="weight"><br>${Elements.formatWeight(element.weight)}</span>`;

        if (link) {
            html = `<a href="?protons=${protons}">${html}<span class="link"></span></a>`;
        }

        const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
        const title = element.type;
        html = `<article class="${typeClass} element" title="${title}">${html}</article>`;

        return html;
    }

    static formatIsotope(protons, mass) {
        const element = Elements.data[protons];
        if (!element) {
            return '';
        }
        return `${element.symbol}-${mass}`;
    }

    static formatScientificNotation(value) {
        return value.replace(/\^(\d+)/g, "<sup>$1</sup>");
    }

    static formatWeight(weight) {
        return (weight.toString().indexOf('.') === -1) ? `(${weight})` : `${weight}`;
    }

    static linkBlock(block = null) {
        // All elements have a block, so if block is null, link to the Block
        // page instead of a specific block.
        const blockPath = 'Block_(periodic_table)';
        if (!block) {
            return Link.toWikipedia(blockPath, "Block");
        }
        return Link.toWikipedia(`${blockPath}#${block}-block`, `${block}-block`);
    }

    static linkGroup(group) {
        // Lanthanides & actinides don't belong to a group, so don't link those.
        if (!group) {
            return "None";
        }
        const groupURL = Elements.groupURLs[group];
        return Link.create(groupURL, group, true);
    }

    static linkPeriod(period) {
        // All elements have a period, so if period is null, link to the Period
        // page instead of a specific period.
        const periodPath = 'Period_(periodic_table)';
        if (!period) {
            return Link.toWikipedia(periodPath, "Period");
        }
        return Link.toWikipedia(`${periodPath}#Period_${period}`, period);
    }

    static renderCompoundsList(symbol) {
        const compounds = Compounds.find(symbol);

        if (compounds.length < 1) {
            return '';
        }

        let html = '<ul>';
        for (const formula of compounds) {
            const names = Compounds.data[formula];
            const linkText = `${Compounds.format(formula)}: ${names.join(', ')}`;
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }

    static renderElements() {
        const gaps = {
            // The key is the atomic number of the element after the gap.
            // The value is the size of the gap.
            2: 16,
            5: 10,
            13: 10,
            57: 2,
            89: 2,
        };
        let html = '<section>';
        html += '<table class="all elements"><thead><tr>';
        html += '<th class="empty"></th>';

        for (const [group, oldgroup] of Elements.groups) {
            const title = `Group ${group} (formerly ${oldgroup})`;
            const link = `<a href="?group=${group}">${group}<br>${oldgroup}<span class="link"></span></a>`;
            html += `<th class="group group-${group}" title="${title}">${link}</th>`;
        }

        html += '<td class="empty"></td>';
        html += '</tr></thead><tbody>';

        for (const [period, bounds] of Elements.periods) {
            const min = bounds['min'];
            const max = bounds['max'];
            let tr = '';
            let gapCount = 1;

            for (let protons = min; protons <= max;) {
                let td = '';
                let tdClass = '';

                if (period === 6 && protons === Elements.periods.get('lanthanides').min) {
                    // Skip the lanthanides.
                    protons = Elements.periods.get('lanthanides').max + 1;
                }
                else if (period === 7 && protons === Elements.periods.get('actinides').min) {
                    // Skip the actinides.
                    protons = Elements.periods.get('actinides').max + 1;
                }

                const element = Elements.data[protons];

                if (protons in gaps && gapCount <= gaps[protons]) {
                    // Skip gaps in the first 3 rows/periods.
                    gapCount++;
                    tdClass = 'empty';
                }
                else {
                    td = Elements.formatElement(protons, true);
                    protons++;
                }

                tr += `<td class="${tdClass}">${td}</td>`;
            }

            const thLink = `<a href="?period=${period}">${period}<span class="link"></span></a>`;
            const th = `<th title="Period ${period}">${thLink}</th>`;
            html += `<tr>${th}${tr}${th}</tr>`;

            if (period === 7) {
                break;
            }
        }

        html += '</tbody></table>';

        html += '<table class="all rare-earth elements"><tbody>';

        for (const [category, bounds] of Elements.periods) {
            if (category !== 'lanthanides' && category !== 'actinides') {
                continue;
            }

            const min = bounds['min'];
            const max = bounds['max'];
            let tr = '';

            for (let protons = min; protons <= max;) {
                const td = Elements.formatElement(protons, true);
                protons++;

                tr += `<td>${td}</td>`;
            }

            const period = (category === 'lanthanides') ? 6 : 7;
            const thLink = `<a href="?period=${period}">${period}<span class="link"></span></a>`;
            const th = `<th title="Period ${period}">${thLink}</th>`;
            html += `<tr>${th}${tr}${th}</tr>`;
        }

        html += '</tbody></table>';
        html += '</section>';

        html += '<nav><a href="?view=isotopes">Isotopes</a></nav>';

        return html;
    }

    static renderElement(protons) {
        const element = Elements.data[protons];

        let html = '<section class="element">';
        html += Elements.formatElement(protons, false);

        html += '<aside>';
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${element.name}#History`, "Name")}: ${element.name}</li>`;
        html += `<li>${Link.toWikipedia('Chemical_symbol', "Symbol")}: ${element.symbol}</li>`;
        html += `<li>${Link.toWikipedia('Atomic_number', "Atomic Number")}: ${protons}</li>`;
        html += `<li>${Link.toWikipedia('Standard_atomic_weight', "Weight")}: ${element.weight}</li>`;
        html += `<li>${Link.toWikipedia('Density', "Density")}: ${Elements.formatDensity(element.density)}</li>`;
        html += `<li>${Elements.linkBlock()}: ${Elements.linkBlock(element.block)}</li>`;
        html += `<li>${Link.toWikipedia('Group_(periodic_table)', "Group")}: ${Elements.linkGroup(element.group)}</li>`;
        html += `<li>${Elements.linkPeriod()}: ${Elements.linkPeriod(element.period)}</li>`;
        html += `<li>${Link.toWikipedia('Melting_point', "Melting Point")}: ${Elements.formatCelsius(element.melts)}</li>`;
        html += `<li>${Link.toWikipedia('Boiling_point', "Boiling Point")}: ${Elements.formatCelsius(element.boils)}</li>`;
        html += `<li>Type: ${Link.create(Elements.typeURLs[element.type], element.type, true)}</li>`;
        html += '</ul>';

        html += '<ul>';
        html += `<li>${Link.toWikipedia(element.name, "More info on Wikipedia")}</a></li>`;
        html += '<li><a href="./index.html">Go back to the periodic table</a></li>';
        html += '</ul>';
        html += '</aside>';
        html += '</section>';

        html += '<section class="isotopes">';
        html += '<h2>Isotopes</h2>';
        const isotopesPath = `Isotopes of ${element.name.toLowerCase()}`;
        html += `<p>${Link.toWikipedia(isotopesPath, `Wikipedia: ${isotopesPath}`)}</p>`;

        if (protons in Isotopes.primordial) {
            const isotopes = Isotopes.primordial[protons];
            html += '<ul>';
            for (const mass of isotopes) {
                const isotopeName = Elements.formatIsotope(protons, mass);
                const isotopeLink = Link.toWikipedia(`${element.name}-${mass}`, `${isotopeName}`);
                html += `<li>${isotopeLink}</li>`;
            }
            html += '</ul>';
        }
        else if (protons in Isotopes.synthetic) {
            const isotopes = Isotopes.synthetic[protons];
            const mass = Object.keys(isotopes)[0];
            const time = Elements.formatScientificNotation(isotopes[mass]);
            const isotopeName = Elements.formatIsotope(protons, mass);
            const syntheticElement = Link.toWikipedia('Synthetic_element', "synthetic element");
            html += `<p>${element.name} is a ${syntheticElement}. Its longest
            lived isotope, ${isotopeName}, has a half-life of ${time}.</p>`;
        }

        html += '<section class="compounds">';
        html += '<h2>Compounds</h2>';

        const compoundsPath = (protons < 103) ? `${element.name}_compounds` : `${element.name}#Chemical`;
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${compoundsPath}`, `Wikipedia: ${element.name} compounds`)}</li>`;
        if (protons < 100) {
            html += `<li>${Link.toWikipedia(`Category:${compoundsPath}`, `Wikipedia: Category: ${element.name} compounds`)}</li>`;
        }
        html += '</ul>';

        if (element.type === 'Noble Gas') {
            const nobleGasCompoundsLink = Link.toWikipedia('Noble_gas_compound', "Noble gas compounds");
            html += `<p>${nobleGasCompoundsLink} do not form easily. Although
            not impossible, it usually requires very low temperatures, high
            pressures, or both.</p>`;
        }

        html += Elements.renderCompoundsList(element.symbol);
        html += '</section>';

        return html;
    }

    static renderElementNav(protons) {
        protons = parseInt(protons);
        const prev = Elements.data[protons - 1];
        const next = Elements.data[protons + 1];

        const up = Elements.findPreviousInGroup(protons);
        const down = Elements.findNextInGroup(protons);

        const groupPrev = Elements.data[up];
        const groupNext = Elements.data[down];

        let html = '<nav>';
        html += '<span class="previous">';
        if (prev) {
            html += `<a href="?protons=${protons - 1}">&larr; ${prev.symbol}: ${prev.name}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (next) {
            html += `<a href="?protons=${protons + 1}">${next.symbol}: ${next.name} &rarr;</a>`;
        }
        html += '</span>';
        html += '<br>';
        html += '<span class="previous">';
        if (groupPrev) {
            html += `<a href="?protons=${up}">&uarr; ${groupPrev.symbol}: ${groupPrev.name}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (groupNext) {
            html += `<a href="?protons=${down}">${groupNext.symbol}: ${groupNext.name} &darr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }

    static renderGroup(group) {
        if (!(group in Elements.groupElements)) {
            console.log('hello');
            return '';
        }

        let html = '<table class="elements group"><tbody>';
        const elements = Elements.groupElements[group];
        for (const protons of elements) {
            const element = Elements.data[protons];
            html += '<tr>';
            html += `<td>${Elements.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">Density: ${Elements.formatDensity(element.density, true)}<br>`;
            html += `Melting Point: ${Elements.formatCelsius(element.melts)}<br>`;
            html += `Boiling Point: ${Elements.formatCelsius(element.boils)}</td>`;
            html += '</tr>';
        }
        html += '</tbody></table>';

        return html;
    }

    static renderGroupNav(group) {
        group = parseInt(group);
        if (group < 1 || group > 18) {
            return '';
        }

        let html = '<nav>';
        html += '<span class="previous">';
        if (group > 1) {
            const prev = group - 1;
            html += `<a href="?group=${group - 1}">&larr; Group ${prev}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (group < 18) {
            const next = group + 1;
            html += `<a href="?group=${group + 1}">Group ${next} &rarr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }

    static renderPeriod(period) {
        period = parseInt(period);
        if (!Elements.periods.has(period)) {
            return '';
        }

        let html = '<table class="elements period"><tbody>';
        const { min, max } = Elements.periods.get(period);
        console.log(min, max);
        for (let protons = min; protons <= max; protons++) {
            const element = Elements.data[protons];
            html += '<tr>';
            html += `<td>${Elements.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">Density: ${Elements.formatDensity(element.density)}<br>`;
            html += `Melting Point: ${Elements.formatCelsius(element.melts)}<br>`;
            html += `Boiling Point: ${Elements.formatCelsius(element.boils)}</td>`;
            html += '</tr>';
        }
        html += '</tbody></table>';

        return html;
    }

    static renderPeriodNav(period) {
        period = parseInt(period);
        if (period < 1 || period > 7) {
            return '';
        }

        let html = '<nav>';
        html += '<span class="previous">';
        if (period > 1) {
            const prev = period - 1;
            html += `<a href="?period=${period - 1}">&larr; Period ${prev}</a>`;
        }
        html += '</span> ';
        html += '<span class="next">';
        if (period < 7) {
            const next = period + 1;
            html += `<a href="?period=${period + 1}">Period ${next} &rarr;</a>`;
        }
        html += '</span>';
        html += '</nav>';

        return html;
    }
}

class Compounds {
    static data = {
        HNO3: ["Nitric acid"],
        HNCO: ["Isocyanic acid"],
        HOBr: ["Hypobromous acid"],
        HF: ["Hydrogen fluoride"],
        HCl: ["Hydrogen chloride"],
        HClO: ["Hypochlorous acid"],
        HArF: ["Argon fluorohydride"],
        HBr: ["Hydrogen bromide"],
        HBrO2: ["Bromous acid"],
        HTcO4: ["Pertechnetic acid"],
        HI: ["Hydrogen iodide"],
        HIO: ["Hypoiodous acid"],
        HIO2: ["Iodous acid"],
        HIO3: ["Iodic acid"],
        HIO4: ["Metaperiodic acid"],
        HReO4: ["Perrhenic acid"],
        "H[AuCl4]": ["Chloroauric acid"],
        HAt: ["Hydrogen astatide"],
        H2: ["Dihydrogen"],
        H2O: ["Water"],
        H2O2: ["Hydrogen peroxide"],
        H2S: ["Hydrogen sulfide"],
        H2SO3: ["Sulfurous acid"],
        H2SO4: ["Sulfuric acid"],
        H2CrO4: ["Chromic acid"],
        H2Cr2O7: ["Chromic acid"],
        H2Se: ["Hydrogen selenide"],
        H2SeO3: ["Selenous acid"],
        H2SeO4: ["Selenic acid"],
        H2Te: ["Hydrogen telluride"],
        H2TeO3: ["Tellurous acid"],
        H2WO4: ["Tungstic acid"],
        H3PO2: ["Hypophosphorous acid"],
        H3PO3: ["Phosphorous acid"],
        H3PO4: ["Phosphoric acid"],
        H3PW12O40: ["Phosphotungstic acid"],
        H3AsO3: ["Arsenous acid", "Arsonic acid"],
        H3AsO4: ["Arsenic acid"],
        H4Re2O9: ["Perrhenic acid"],
        H5IO6: ["Orthoperiodic acid"],
        H6Cl6O2Pt: ["Chloroplatinic acid"],
        H18N6Cl3Co: ["Hexamminecobalt(III) chloride"],
        H20N4S4O18Ce: ["Ammonium cerium(IV) sulfate"],

        LiOH: ["Lithium hydroxide"],
        LiPF6: ["Lithium hexafluorophosphate"],
        LiCl: ["Lithium chloride"],
        LiNbO3: ["Lithium niobate"],
        LiTaO3: ["Lithium tantalate"],
        Li2BeF4: ["FLiBe"],
        Li2CO3: ["Lithium carbonate"],
        Li2SO4: ["Lithium sulfate"],
        Li2Te: ["Lithium telluride"],
        Li2IrO3: ["Lithium iridate"],
        Li2Po: ["Lithium polonide"],
        Li3N: ["Lithium nitride"],

        BeH: ["Beryllium monohydride"],
        BeH2: ["Beryllium hydride"],
        BeH2O2: ["Beryllium hydroxide"],
        "Be(BH4)2": ["Beryllium borohydride"],
        BeCO3: ["Beryllium carbonate"],
        "Be(NO3)2": ["Beryllium nitrate"],
        BeN6: ["Beryllium azide"],
        BeO: ["Beryllium oxide"],
        BeF2: ["Beryllium fluoride"],
        BeS: ["Beryllium sulfide"],
        BeSO4: ["Beryllium sulfate"],
        BeCl2: ["Beryllium chloride"],
        BeBr2: ["Beryllium bromide"],
        BeTe: ["Beryllium telluride"],
        BeI2: ["Beryllium iodide"],
        Be2C: ["Beryllium carbide"],
        Be3N2: ["Beryllium nitride"],

        BH2N: ["Iminoborane"],
        BH3: ["Borane"],
        BH3O3: ["Boric acid"],
        BN: ["Boron nitride"],
        BF3: ["Boron trifluoride"],
        BCl3: ["Boron trichloride"],
        BBr3: ["Boron tribromide"],
        B2H6: ["Diborane"],
        B2O3: ["Boron trioxide"],
        B2F4: ["Diboron tetrafluoride"],
        B3H3O3: ["Boroxine"],
        B3H3O6: ["Metaboric acid"],
        B3H6N3: ["Borazine"],
        B4H2O7: ["Tetraboric acid"],
        B4H8N4: ["Borazocine"],
        B4H10: ["Tetraborane"],
        B4C: ["Boron carbide"],
        B5H9: ["Pentaborane(9)"],
        B5H11: ["Pentaborane(11)"],
        B6O: ["Boron suboxide"],
        B10H14: ["Decaborane"],

        C: ["Carbon black", "Diamond", "Graphene", "Graphite"],
        CHF3: ["Fluoroform"],
        CHCl3: ["Chloroform"],
        CHBr3: ["Bromoform"],
        CHI3: ["Iodoform"],
        CH2N2: ["Cyanamide"],
        CH2O: ["Formaldehyde"],
        CH2O2: ["Formic acid"],
        CH2F2: ["Difluoromethane"],
        CH2BrCl: ["Bromochloromethane"],
        CH2Br2: ["Dibromomethane"],
        CH2I2: ["Diiodomethane"],
        CH3Li: ["Methyllithium"],
        CH3NH2: ["Methylamine"],
        CH3Br: ["Bromomethane"],
        CH3I: ["Iodomethane"],
        CH3ReO3: ["Methylrhenium trioxide"],
        CH3Hg: ["Methylmercury"],
        CH4: ["Methane"],
        CH4O: ["Methanol"],
        CH5NO: ["Aminomethanol"],
        CH8N2O3: ["Ammonium carbonate"],
        CBe2: ["Beryllium carbide"],
        CO: ["Carbon monoxide"],
        CO2: ["Carbon dioxide"],
        CSi: ["Silicon carbide"],
        CCl2F2: ["Dichlorodifluoromethane"],
        CBrF3: ["Bromotrifluoromethane"],
        CBr4: ["Carbon tetrabromide"],
        CI4: ["Carbon tetraiodide"],

        C2H: ["Ethynyl radical"],
        C2HF5: ["Pentafluoroethane"],
        C2H2: ["Acetylene"],
        C2H2O2: ["Glyoxal"],
        C2H2F2: ["1,1-Difluoroethene"],
        C2H2F4: ["Norflurane"],
        C2H3N: ["Acetonitrile"],
        C2H3NO2: ["Dehydroglycine"],
        C2H3F: ["Vinyl fluoride"],
        C2H3F3: ["1,1,1-Trifluoroethane"],
        C2H3Cl: ["Vinyl chloride"],
        C2H3ClO2: ["Chloroacetic acid"],
        C2H3BrO: ["Acetyl bromide"],
        C2H3BrO2: ["Bromoacetic acid"],
        C2H3IO2: ["Iodoacetic acid"],
        C2H3CsO2: ["Cesium acetate"],
        C2H4: ["Ethylene"],
        C2H4O2: ["Acetic acid"],
        C2H4INO: ["Iodoacetamide"],
        C2H5NO2: ["Glycine"],
        C2H6O: ["Ethanol", "Dimethyl ether"],
        C2H6Cl3KOPt: ["Zeise's salt"],
        C2H6Cd: ["Dimethylcadmium"],
        C2H6Te: ["Dimethyl telluride"],
        C2H6AuClS: ["Chloro(dimethyl sulfide)gold(I)"],
        C2H6Hg: ["Dimethylmercury"],
        C2H7NO3S: ["Taurine"],
        C2H7AsO2: ["Cacodylic acid"],
        C2H10I2N2: ["Ethylenediamine dihydroiodide"],
        C2N2O2Hg: ["Mercury(II) fulminate"],
        C2BeO4: ["Beryllium oxalate"],
        C2F4: ["Tetrafluoroethylene"],
        C2Ag2: ["Silver acetylide"],
        C2Cs2O4: ["Cesium oxalate"],

        C3H2O2: ["Propiolic acid"],
        C3H3N: ["Acrylonitrile"],
        C3H3N3O3: ["Cyanuric acid"],
        C3H3Cl: ["Propargyl chloride"],
        C3H3Br: ["Propargyl bromide"],
        C3H4O: ["Propargyl alcohol"],
        C3H5Cl: ["Allyl chloride"],
        C3H4N2: ["Imidazole"],
        C3H4O2: ["Acrylic acid"],
        C3H5NO2: ["Dehydroalanine"],
        C3H6: ["Propylene"],
        C3H6N6: ["Melamine"],
        C3H6O: ["Acetone"],
        C3H6O3: ["Lactic acid"],
        C3H6O6S3Ce: ["Cerium(III) methanesulfonate"],
        C3H7NO2: ["Alanine", "Β-Alanine", "Sarcosine"],
        C3H7NO2S: ["Cysteine"],
        C3H7NO2Se: ["Selenocysteine"],
        C3H7NO2Te: ["Tellurocysteine"],
        C3H7NO3: ["Serine", "Isoserine"],
        C3H7O6P: ["Glyceraldehyde 3-phosphate"],
        C3H8: ["Propane"],
        C3H8O3: ["Glycerol"],
        C3H9In: ["Trimethylindium"],
        C3H9SnCl: ["Trimethyltin chloride"],
        C3F9O9S3Sc: ["Scandium(III) trifluoromethanesulfonate"],
        C3F9O9S3Ce: ["Cerium(III) trifluoromethanesulfonate"],
        C3CoNO4: ["Cobalt tricarbonyl nitrosyl"],
        C3Br3N3: ["Cyanuric bromide"],

        C4HCoO4: ["Cobalt tetracarbonyl hydride"],
        C4H4N2: ["Pyrimidine"],
        C4H4N2O2: ["Uracil"],
        C4H5N: ["Pyrrole"],
        C4H5N3O: ["Cytosine"],
        C4H6: ["Butadiene"],
        C4H6O2: ["Vinyl acetate"],
        C4H6O4Pd: ["Palladium(II) acetate"],
        C4H6O4Ba: ["Barium acetate"],
        C4H6O4Pt: ["Platinum(II) acetate"],
        C4H6O6Pb: ["Lead(II) acetate"],
        C4H6Sn: ["Stannole"],
        C4H7NO2: ["Azetidine-2-carboxylic acid"],
        C4H7NO4: ["Aspartic acid"],
        C4H7BrO2: ["Ethyl bromoacetate"],
        C4H8: ["Butene", "Isobutylene"],
        C4H8N2O3: ["Asparagine"],
        C4H8O: ["Tetrahydrofuran"],
        C4H8O2: ["1,4-Dioxane"],
        C4H8Cl2GeO2: ["Germanium dichloride dioxane"],
        C4H9NO2: ["2-Aminoisobutyric acid", "GABA"],
        C4H9NO2S: ["Homocysteine"],
        C4H9NO3: ["Threonine", "Homoserine"],
        C4H9SnCl3: ["Butyltin trichloride"],
        C4H10: ["Butane"],
        C4H10N2O3: ["Canaline"],
        C4H10O8Pb3: ["Basic lead acetate"],
        C4H10Zn: ["Diethylzinc"],
        C4H12FN: ["Tetramethylammonium fluoride"],
        C4H12Ge: ["Isobutylgermane"],
        C4H12Pb: ["Tetramethyllead"],
        C4FeNa2O4: ["Disodium tetracarbonylferrate"],

        C5H4N4: ["Purine"],
        C5H5Li: ["Lithium cyclopentadienide"],
        C5H5N: ["Pyridine"],
        C5H5N5: ["Adenine"],
        C5H5N5O: ["Guanine"],
        C5H5In: ["Cyclopentadienylindium(I)"],
        C5H6N2O2: ["Thymine"],
        C5H6Sn: ["Stannabenzene"],
        C5H7NO3: ["Pyroglutamic acid"],
        C5H7N3O: ["5-Methylcytosine"],
        C5H7N3O2: ["5-Hydroxymethylcytosine"],
        C5H7N3O5: ["Quisqualic acid"],
        C5H9NO2: ["Proline"],
        C5H9NO3: ["Hydroxyproline", "Aminolevulinic acid"],
        C5H9NO4: ["Glutamic acid"],
        C5H9N3: ["Histamine"],
        C5H10N2O3: ["Glutamine"],
        C5H10O4: ["Deoxyribose"],
        C5H10O5: ["Ribose"],
        C5H11NO2: ["Valine", "Norvaline", "Isovaline", "Trimethylglycine"],
        C5H11NO2S: ["Methionine", "Penicillamine"],
        C5H11NO2Se: ["Selenomethionine"],
        C5H12N2O2: ["Ornithine"],
        C5H12N2O2S: ["Thialysine"],
        C5H12N4O3: ["Canavanine"],
        C5H15Ta: ["Pentamethyltantalum"],
        C5O5Os: ["Osmium pentacarbonyl"],

        C6H5I: ["Iodobenzene"],
        C6H5Cl2I: ["Iodobenzene dichloride"],
        C6H6: ["Benzene"],
        C6H6O: ["Phenol"],
        C6H6O2Ce: ["Cerium(III) acetate"],
        C6H6MgO7: ["Magnesium citrate"],
        C6H6Se: ["Benzeneselenol"],
        C6H7N: ["Aniline"],
        C6H8O7: ["Citric acid"],
        C6H8O6: ["Vitamin C"],
        C6H9NO6: ["Carboxyglutamic acid"],
        C6H9O6Eu: ["Europium(III) acetate"],
        C6H9O6Gd: ["Gadolinium acetate"],
        C6H9O6Tb: ["Terbium acetate"],
        C6H9O6Dy: ["Dysprosium(III) acetate"],
        C6H9O6Ho: ["Holmium acetate"],
        C6H9O6Er: ["Erbium(III) acetate"],
        C6H9O6Tm: ["Thulium(III) acetate"],
        C6H9O6Yb: ["Ytterbium(III) acetate"],
        C6H9O6lu: ["Lutetium(III) acetate"],
        C6H9N3O2: ["Histidine"],
        C6H9MnO6: ["Manganese(III) acetate"],
        C6H10O5: ["Starch"],
        C6H10O6Cu: ["Copper(II) lactate"],
        C6H10O7Ge2: ["Propagermanium"],
        C6H11NO: ["Caprolactam"],
        C6H11NO2: ["Pipecolic acid"],
        C6H11NO3S: ["N-Formylmethionine"],
        C6H12N2O4S: ["Lanthionine"],
        C6H12N2O4S2: ["Cystine"],
        C6H12N2O4Pt: ["Carboplatin"],
        C6H12O6: ["Glucose", "Fructose"],
        C6H13NO2: ["Leucine", "Isoleucine", "Norleucine", "Β-Leucine"],
        C6H13NO2S: ["Ethionine"],
        C6H13N3O3: ["Citrulline"],
        C6H14N2O2: ["Lysine"],
        C6H14N2O3: ["Hydroxylysine"],
        C6H14N4O2: ["Arginine"],
        C6H15In: ["Triethylindium"],
        C6H18W: ["Hexamethyltungsten"],
        C6O6V: ["Vanadium hexacarbonyl"],
        C6O6W: ["Tungsten hexacarbonyl"],
        C6O12Pr2: ["Praseodymium(III) oxalate"],
        C6O12Sm2: ["Samarium(III) oxalate"],

        C7H5IO4: ["2-Iodoxybenzoic acid"],
        C7H6O5: ["Gallic acid"],
        C7H7K: ["Benzyl potassium"],
        C7H11N3O6S: ["Avibactam"],
        C7H14N2O3: ["Theanine"],
        C7H14N2O4: ["Diaminopimelic acid"],
        C7H14N2O4S: ["Cystathionine"],
        C7H14N2O4S2: ["Djenkolic acid"],
        C7H16NO2: ["Acetylcholine"],
        C7H19N3: ["Spermidine"],

        C8H8: ["Styrene"],
        C8H9NO2: ["Phenylglycine", "Paracetamol"],
        C8H9N1O4: ["Dihydroxyphenylglycine"],
        C8H9NO5: ["Clavulanic acid"],
        C8H10NO6P: ["Pyridoxal phosphate"],
        C8H10N4O2: ["Caffeine"],
        C8H10O2: ["Phenoxyethanol"],
        C8H11N: ["Phenethylamine"],
        C8H11NO: ["Tyramine"],
        C8H11NO2: ["Dopamine", "Octopamine"],
        C8H11NO3: ["Norepinephrine"],
        C8H11NO5S: ["Sulbactam"],
        C8H12N2O3S: ["6-APA"],
        C8H12O8Pb: ["Lead(IV) acetate"],
        C8H12ClO8Ru2: ["Diruthenium tetraacetate chloride"],
        C8H12Cl2Pt: ["Dichloro(cycloocta-1,5-diene)platinum(II)"],
        C8H12Mo2O8: ["Molybdenum(II) acetate"],
        C8H14N4NiO4: ["Nickel bis(dimethylglyoximate)"],
        C8H16Cl2Rh2: ["Chlorobis(ethylene)rhodium dimer"],
        C8H20Ge: ["Tetraethylgermanium"],
        C8H20Pb: ["Tetraethyllead"],

        C9H8O4: ["Aspirin"],
        C9H9HgNaO2S: ["Thiomersal"],
        C9H10O2: ["Paracoumaryl alcohol"],
        C9H11NO2: ["Phenylalanine"],
        C9H11NO3: ["Tyrosine"],
        C9H12: ["Cumene", "n-Propylbenzene"],
        C9H13N: ["N-Methylphenethylamine"],
        C9H13NO2: ["Synephrine"],
        C9H13NO3: ["Adrenaline"],
        C9H14N4O3: ["Carnosine"],

        C10HO9Co3: ["Methylidynetricobaltnonacarbonyl"],
        C10H5F6IO4: ["(Bis(trifluoroacetoxy)iodo)benzene"],
        C10H8: ["Naphthalene"],
        C10H8N2O2S2Zn: ["Zinc pyrithione"],
        C10H8O4: ["Ethylene terephthalate"],
        C10H8MoO3: ["Cycloheptatrienemolybdenum tricarbonyl"],
        C10H10Cl2Ti: ["Titanocene dichloride"],
        C10H10Cl2V: ["Vanadocene dichloride"],
        C10H10Cl2Zr: ["Zirconocene dichloride"],
        C10H10Cl2Nb: ["Niobocene dichloride"],
        C10H10Cl2Mo: ["Molybdocene dichloride"],
        C10H10Ni: ["Nickelocene"],
        C10H10Ru: ["Ruthenocene"],
        C10H10Os: ["Osmocene"],
        C10H11IO4: ["(Diacetoxyiodo)benzene"],
        C10H12N2: ["Tryptamine"],
        C10H12N2O: ["Serotonin"],
        C10H12N4O5S: ["Tazobactam"],
        C10H12O3: ["Coniferyl alcohol"],
        C10H12MgN2O6: ["Magnesium pidolate"],
        C10H12Mo: ["Molybdocene dihydride"],
        C10H13N5O4: ["Adenosine"],
        C10H14NO5PS: ["Parathion"],
        C10H14N5O7P: ["Adenosine monophosphate"],
        C10H14O5V: ["Vanadyl acetylacetonate"],
        C10H14BaO4: ["Barium acetylacetonate"],
        C10H15N5O10P2: ["Adenosine diphosphate"],
        C10H16N5O13P3: ["Adenosine triphosphate"],
        C10H19O6PS2: ["Malathion"],
        C10H23N3O3: ["Hypusine"],
        C10H25O5Nb: ["Niobium(V) ethoxide"],
        C10H25O5Ta: ["Tantalum(V) ethoxide"],
        C10H30N5Ta: ["Pentakis(dimethylamido)tantalum"],

        C11H8O2: ["Menadione"],
        C11H12N2O2: ["Tryptophan"],
        C11H13NO4: ["Bendiocarb"],
        C11H14N2: ["N-Methyltryptamine"],
        C11H14O4: ["Sinapyl alcohol"],

        C12H10Se2: ["Diphenyl diselenide"],
        C12H12MoO3: ["(Mesitylene)molybdenum tricarbonyl"],
        C12H16BNO5S: ["Vaborbactam"],
        C12H17N3O4S: ["Imipenem"],
        C12H18Be4O13: ["Basic beryllium acetate"],
        C12H20N4O6S: ["Relebactam"],
        C12H20O10: ["Cellulose"],
        C12H21N3O3: ["Pyrrolysine"],
        C12H22O11: ["Sucrose", "Lactose"],
        C12H22O14Zn: ["Zinc gluconate"],
        C12H24O2: ["Lauric acid"],
        C12H26: ["Dodecane"],
        C12H27N3Sn: ["Tributyltin azide"],
        C12H28O4Ti: ["Titanium isopropoxide"],
        C12H28Sn: ["Tributyltin hydride"],
        C12H36I4Pt4: ["Trimethylplatinum iodide"],
        C12O12Ru3: ["Triruthenium dodecacarbonyl"],
        C12O12Os3: ["Triosmium dodecacarbonyl"],

        C13H13IO8: ["Dess–Martin periodinane"],
        C13H16N2O2: ["Melatonin"],
        C13H16N2O4S2: ["Almecillin"],
        C13H18O2: ["Ibuprofen"],

        C14H14INO: ["o-Phenyl-3-iodotyramine"],
        C14H14INO2: ["3-Iodothyronamine"],
        C14H28O2: ["Myristic acid"],

        C15H11I3NNaO4: ["Liothyronine"],
        C15H12Br4O2: ["Tetrabromobisphenol A"],
        C15H12I3NO4: ["Triiodothyronine"],
        C15H16N2O6S2: ["Ticarcillin"],
        C15H16O2: ["Bisphenol A"],
        C15H21O6Ce: ["Cerium(III) acetylacetonate"],
        C15H21O6Dy: ["Dysprosium acetylacetonate"],
        C15H21O6Ho: ["Holmium acetylacetonate"],
        C15H21O6Ir: ["Iridium acetylacetonate"],
        C15H23N3O3S: ["Mecillinam"],

        C16H16N2O6S2: ["Cefalotin"],
        C16H17N3O4S: ["Cefalexin"],
        C16H18N2O4S: ["Benzylpenicillin"],
        C16H18N2O5S: ["Phenoxymethylpenicillin"],
        C16H18N2O7S2: ["Temocillin"],
        C16H19N3O4S: ["Ampicillin"],
        C16H19N3O5S: ["Amoxicillin"],
        C16H21N3O8S: ["Cephalosporin C"],
        C16H24Cl2Rh2: ["Cyclooctadiene rhodium chloride dimer"],
        C16H24Cl2Ir2: ["Cyclooctadiene iridium chloride dimer"],
        C16H24Ni: ["Bis(cyclooctadiene)nickel(0)"],
        C16H26N2O5S: ["Cilastatin"],
        C16H30O2: ["Palmitoleic acid"],
        C16H32O2: ["Palmitic acid"],
        C16H36NF: ["Tetra-n-butylammonium fluoride"],

        C17H14O: ["Dibenzylideneacetone"],
        C17H18N2O6S: ["Carbenicillin"],
        C17H20N2O6S: ["Methicillin"],
        C17H25N3O5S: ["Meropenem"],

        C18H15O3P: ["Triphenyl phosphite"],
        C18H15O4P: ["Triphenyl phosphate"],
        C18H15Sb: ["Triphenylstibine"],
        C18H24I3N3O9: ["Ioversol"],
        C18H30O2: ["alpha-Linolenic acid", "gamma-Linolenic acid"],
        C18H30O2Ir2: ["Cyclooctadiene iridium methoxide dimer"],
        C18H33SnOH: ["Cyhexatin"],
        C18H34O2: ["Oleic acid"],
        C18H34O3: ["Ricinoleic acid"],
        C18H36O2: ["Stearic acid"],
        C18Fe7N18: ["Prussian blue"],

        C19H17ClFN3O5S: ["Flucloxacillin"],
        C19H17Cl2N3O5S: ["Dicloxacillin"],
        C19H18ClN3O5S: ["Cloxacillin"],
        C19H19N3O5S: ["Oxacillin"],
        C19H19N7O6: ["Folate"],

        C20H6I4Na2O5: ["Erythrosine"],
        C20H8Br2HgNa2O6: ["Merbromin"],
        C20H16N4: ["Chlorin"],
        C20H16Cl2N4Ru: ["cis-Dichlorobis(bipyridine)ruthenium(II)"],
        C20H20Cl3N4Rh: ["Dichlorotetrakis(pyridine)rhodium(III) chloride"],
        C20H20U: ["Tetrakis(cyclopentadienyl)uranium(IV)"],
        C20H23N5O6S: ["Azlocillin"],
        C20H28O8Hf: ["Hafnium acetylacetonate"],
        C20H30O: ["Vitamin A"],
        C20H30O2: ["Eicosapentaenoic acid"],
        C20H30Cl4Rh2: ["Pentamethylcyclopentadienyl rhodium dichloride dimer"],
        C20H30Cl4Ir2: ["Pentamethylcyclopentadienyl iridium dichloride dimer"],
        C20H30Cl2Zr: ["Decamethylzirconocene dichloride"],
        C20H30Zn2: ["Decamethyldizincocene"],
        C21H21O4P: ["Tricresyl phosphate"],
        C21H22N2O5S: ["Nafcillin"],
        C21H25N5O8S2: ["Mezlocillin"],
        C21H28N7O14P2: ["Nicotinamide adenine dinucleotide"],
        C21H36N7O16P3S: ["Coenzyme A"],
        C22H19Br2NO3: ["Deltamethrin"],
        C22H32O2: ["Docosahexaenoic acid"],
        C22H37NO2: ["Anandamide", "Virodhamine"],
        C23H27N5O7S: ["Piperacillin"],
        C23H30N12O8S2: ["Ceftolozane"],
        C23H38N7O17P3S: ["Acetyl-CoA"],
        C23H38O4: ["2-Arachidonoylglycerol"],
        C23H40O3: ["2-Arachidonyl glyceryl ether"],
        C23H46N6O13: ["Neomycin"],
        C24H38O4: ["Diethylhexyl phthalate"],
        C24H40O32Zr6: ["Zirconyl acetate"],
        C24H4604Cu: ["Copper(II) laurate"],
        C24H54OSn2: ["Tributyltin oxide"],
        C24H54Mo2O6: ["Hexa(tert-butoxy)dimolybdenum(III)"],
        C27H44O: ["Cholecalciferol"],
        C27H46O: ["Cholesterol"],
        C28H41NO3: ["N-Arachidonoyl dopamine"],
        C28H44O: ["Ergocalciferol"],
        C28H44Co: ["Tetrakis(1-norbornyl)cobalt(IV)"],

        C30H24N6Cl2Ru: ["Tris(bipyridine)ruthenium(II) chloride"],
        C30H25Sb: ["Pentaphenylantimony"],
        C30H42Ni3O12: ["Nickel(II) bis(acetylacetonate)"],
        C31H46O2: ["Phytomenadione"],
        C31H50F6IrNP2: ["Crabtree's catalyst"],
        C32H56Cl2Ir2: ["Chlorobis(cyclooctene)iridium dimer"],
        C33H24IrN3: ["Tris(2-phenylpyridine)iridium"],
        C34H32O4N4Fe: ["Heme B"],
        C34H36O4N4S2Fe: ["Heme C"],
        C35H54GdN7O15: ["Gadopiclenol"],
        C36H30Cl2P2Pd: ["Bis(triphenylphosphine)palladium chloride"],
        C36H66O6Zn: ["Zinc ricinoleate"],
        C36H70O4Cu: ["Copper(II) stearate"],
        C36H70O4Zn: ["Zinc stearate"],
        C37H30OPClIr: ["Vaska's complex"],
        C41H64O14: ["Digoxin"],
        C49H56O6N4Fe: ["Heme A"],
        C49H58O5N4Fe: ["Heme O"],
        C51H98O6: ["Tripalmitin"],
        C51H42O3Pd2: ["Tris(dibenzylideneacetone)dipalladium(0)"],
        C54H45ClP3Rh: ["Wilkinson's catalyst"],
        C54H45Cl2P3Ru: ["Dichlorotris(triphenylphosphine)ruthenium(II)"],
        C54H90N6O18: ["Valinomycin"],
        C54H105CeO6: ["Cerium stearate"],
        C55H46OP3Rh: ["Tris(triphenylphosphine)rhodium carbonyl hydride"],
        C56H45O2P3Ru: ["Dicarbonyltris(triphenylphosphine)ruthenium(0)"],
        C56H100N16O17S: ["Polymyxin B"],
        C57H110O6: ["Stearin"],
        C60: ["Buckminsterfullerene"],
        C60H92N12O10: ["Gramicidin S"],
        C62H89CoN13O15P: ["Hydroxocobalamin"],
        C63H88CoN14O14P: ["Cyanocobalamin"],
        C63H91CoN13O14P: ["Methylcobalamin"],
        C64H32N16Lu: ["Lutetium phthalocyanine"],
        C66H75Cl2N9O24: ["Vancomycin"],
        C66H87N13O13: ["Tyrocidine"],
        C66H103N17O16S: ["Bacitracin"],
        C72H60P4Pd: ["Tetrakis(triphenylphosphine)palladium(0)"],
        C72H60P4Pt: ["Tetrakis(triphenylphosphine)platinum(0)"],
        C72H100CoN18O17P: ["Adenosylcobalamin"],
        C99H140N20O17: ["Gramicidin"],
        C156H216Al12Cu43: ["Heterometallic copper-aluminum superatom"],

        NH3: ["Ammonia"],
        NH4ClO3: ["Ammonium chlorate"],
        NH4VO3: ["Ammonium metavanadate"],
        "(NH4)2PtCl6": ["Ammonium hexachloroplatinate"],
        NO: ["Nitric oxide"],
        NBr3: ["Nitrogen tribromide"],
        NI3: ["Nitrogen triiodide"],
        N2: ["Dinitrogen"],
        N2H4: ["Hydrazine"],

        O2: ["Dioxygen"],
        O2PtF6: ["Dioxygenyl hexafluoroplatinate"],
        O3: ["Ozone"],

        F2: ["Difluorine"],
        F2Kr: ["Krypton difluoride"],
        F6H2Si: ["Hexafluorosilicic acid"],

        NaHCO3: ["Sodium bicarbonate"],
        NaHSO3: ["Sodium bisulfite"],
        NaH2PO4: ["Monosodium phosphate"],
        NaN3: ["Sodium azide"],
        NaNO3: ["Sodium nitrate"],
        NaOH: ["Sodium hydroxide"],
        NaOCl: ["Sodium hypochlorite"],
        NaF: ["Sodium fluoride"],
        NaCl: ["Sodium chloride"],
        NaClO3: ["Sodium chlorate"],
        NaClO4: ["Sodium perchlorate"],
        NaMnO4: ["Sodium permanganate"],
        NaAsO2: ["Sodium arsenite"],
        NaBr: ["Sodium bromide"],
        NaBrO3: ["Sodium bromate"],
        NaTcO4: ["Sodium pertechnetate"],
        NaI: ["Sodium iodide"],
        NaIO4: ["Sodium periodate"],
        NaReO4: ["Sodium perrhenate"],
        NaBiO3: ["Sodium bismuthate"],
        Na2Po: ["Sodium polonide"],
        Na2HPO4: ["Disodium phosphate"],
        Na2He: ["Disodium helide"],
        Na2B4O7: ["Borax"],
        Na2CO3: ["Sodium carbonate"],
        Na2O3Se: ["Sodium selenite"],
        Na2SiO3: ["Sodium metasilicate"],
        Na2SO3: ["Sodium sulfite"],
        Na2S2O5: ["Sodium metabisulfite"],
        Na2S2O8: ["Sodium persulfate"],
        Na2CrO4: ["Sodium chromate"],
        Na2Se: ["Sodium selenide"],
        Na2MoO4: ["Sodium molybdate"],
        Na2PdCl4: ["Sodium tetrachloropalladate"],
        Na2Te: ["Sodium telluride"],
        Na2TeO3: ["Sodium tellurite"],
        Na2OsCl6: ["Sodium hexachloroosmate"],
        Na2WO4: ["Sodium tungstate"],
        Na2PtCl6: ["Sodium hexachloroplatinate"],
        Na3AlF6: ["Sodium aluminum hexafluoride"],
        Na3PO4: ["Trisodium phosphate"],
        Na3As: ["Sodium arsenide"],
        Na3SbS4: ["Sodium thioantimoniate"],
        Cl6IrNa3: ["Sodium hexachloroiridate(III)"],
        Na4O4Si: ["Sodium orthosilicate"],
        Na5P3O10: ["Sodium triphosphate"],
        Na6O7Si2: ["Sodium pyrosilicate"],

        MgCO3: ["Magnesium carbonate"],
        MgO: ["Magnesium oxide"],
        "Mg(OH)2": ["Magnesium hydroxide"],
        MgSO3: ["Magnesium sulfite"],
        MgSO4: ["Magnesium sulfate"],
        MgCl2: ["Magnesium chloride"],
        MgCu2: ["Magnesium copper"],
        MgPo: ["Magnesium polonide"],

        AlHO2: ["Aluminum hydroxide oxide"],
        AlF: ["Aluminum monofluoride"],
        AlF3: ["Aluminum fluoride"],
        AlP: ["Aluminum phosphide"],
        AlCl: ["Aluminum monochloride"],
        AlCl3: ["Aluminum chloride"],
        AlBr: ["Aluminium monobromide"],
        AlBr3: ["Aluminum bromide"],
        AlI: ["Aluminium monoiodide"],
        AlI3: ["Aluminium iodide"],
        Al2O3: ["Aluminum oxide"],
        Al2Br6: ["Aluminum bromide"],
        Al2I6: ["Aluminium iodide"],

        SiH4: ["Silane"],
        SiO2: ["Silicon dioxide"],
        SiS2: ["Silicon disulfide"],
        SiCl4: ["Silicon tetrachloride"],
        Si3N4: ["Silicon nitride"],

        PH3: ["Phosphine"],
        POCl3: ["Phosphoryl chloride"],
        PF5: ["Phosphorus pentafluoride"],
        PCl3: ["Phosphorus trichloride"],
        PCl5: ["Phosphorus pentachloride"],
        PBr3: ["Phosphorus tribromide"],
        PI3: ["Phosphorus triiodide"],
        P2H4: ["Diphosphane"],
        P2S5: ["Phosphorus pentasulfide"],
        P2I4: ["Diphosphorus tetraiodide"],
        P3N5: ["Triphosphorus pentanitride"],
        P4O6: ["Phosphorus trioxide"],
        P4O10: ["Phosphorus pentoxide"],
        P4S3: ["Phosphorus sesquisulfide"],
        P4S10: ["Phosphorus pentasulfide"],

        SOCl2: ["Thionyl chloride"],
        SO2: ["Sulfur dioxide"],
        SO2F2: ["Sulfuryl fluoride"],
        S2Se: ["Selenium disulfide"],
        S4N4: ["Tetrasulfur tetranitride"],

        ClH4N: ["Ammonium chloride"],
        ClF3: ["Chlorine trifluoride"],
        Cl2: ["Dichlorine"],
        Cl2H18N6Ni: ["Hexaamminenickel chloride"],
        Cl2O: ["Dichlorine monoxide"],
        Cl6H8IrN2: ["Ammonium hexachloroiridate(IV)"],

        ArH: ["Argon monohydride"],
        Ar1C60: ["Argon buckminsterfullerene"],

        KHCO3: ["Potassium bicarbonate"],
        "K[HF2]": ["Potassium bifluoride"],
        KCNO: ["Potassium cyanate"],
        KC8: ["Potassium graphite"],
        KNH2: ["Potassium amide"],
        KNO3: ["Potassium nitrate"],
        KN3: ["Potassium azide"],
        KOH: ["Potassium hydroxide"],
        KO2: ["Potassium superoxide"],
        KO3: ["Potassium ozonide"],
        KF: ["Potassium fluoride"],
        KNaC4H4O6: ["Potassium sodium tartrate"],
        KCl: ["Potassium chloride"],
        KClO3: ["Potassium chlorate"],
        KClO4: ["Potassium perchlorate"],
        KMnO4: ["Potassium permanganate"],
        KBr: ["Potassium bromide"],
        KBrO3: ["Potassium bromate"],
        KI: ["Potassium iodide"],
        KIO3: ["Potassium iodate"],
        K2CO3: ["Potassium carbonate"],
        K2O: ["Potassium oxide"],
        K2O2: ["Potassium peroxide"],
        K2O5S2: ["Potassium metabisulfite"],
        K2SO4: ["Potassium sulfate"],
        K2FeO4: ["Potassium ferrate"],
        K2SeO4: ["Potassium selenate"],
        K2Te: ["Potassium telluride"],
        K2TeO3: ["Potassium tellurite"],
        "K2[TaF7]": ["Potassium heptafluorotantalate"],
        K2ReH9: ["Potassium nonahydridorhenate"],
        K2Re2Cl8: ["Potassium octachlorodirhenate"],
        K2PtCl4: ["Potassium tetrachloroplatinate"],
        K2PtCl6: ["Potassium hexachloroplatinate"],
        "K2[HgI4]": ["Potassium tetraiodomercurate(II)"],
        K2Po: ["Potassium polonide"],
        K3C6H5O7: ["Potassium citrate"],
        K3CrO8: ["Potassium tetraperoxochromate(V)"],
        "K3[Fe(C2O4)3]": ["Potassium ferrioxalate"],
        K3CuF6: ["Potassium hexafluorocuprate(III)"],

        CaH2: ["Calcium hydride"],
        CaCN2: ["Calcium cyanamide"],
        CaCO3: ["Calcium carbonate"],
        CaC2: ["Calcium carbide"],
        CaC2O4: ["Calcium oxalate"],
        CaO: ["Calcium oxide"],
        "Ca(OH)2": ["Calcium hydroxide"],
        "Ca(OCl)2": ["Calcium hypochlorite"],
        CaF2: ["Calcium fluoride"],
        CaSi: ["Calcium monosilicide"],
        CaS: ["Calcium sulfide"],
        CaSO3: ["Calcium sulfite"],
        CaSO4: ["Calcium sulfate"],
        CaClHO: ["Calcium hydroxychloride"],
        CaCl: ["Calcium(I) chloride"],
        CaPo: ["Calcium polonide"],
        "Ca(ClO3)2": ["Calcium chlorate"],
        "Ca(ClO4)2": ["Calcium perchlorate"],
        CaCl2: ["Calcium chloride"],
        "Ca(MnO4)2": ["Calcium permanganate"],
        CaCrO4: ["Calcium chromate"],
        CaBr2: ["Calcium bromide"],
        "Ca(IO3)2": ["Calcium iodate"],
        CaI2: ["Calcium iodide"],
        CaWO4: ["Scheelite"],
        Ca2O4Si: ["Calcium silicate"],
        Ca3N2: ["Calcium nitride"],
        Ca3SiO5: ["Alite"],
        Ca3P2: ["Calcium phosphide"],
        "Ca3(AsO4)2": ["Calcium arsenate"],
        "Ca5(PO4)3OH": ["Hydroxyapatite"],

        ScH3: ["Scandium(III) hydride"],
        Sc2O3: ["Scandium oxide"],
        ScF3: ["Scandium fluoride"],
        ScCl3: ["Scandium chloride"],
        ScBr3: ["Scandium bromide"],
        ScI3: ["Scandium triiodide"],

        TiC: ["Titanium carbide"],
        TiN: ["Titanium nitride"],
        TiO2: ["Titanium dioxide"],
        TiCl3: ["Titanium(III) chloride"],
        TiCl4: ["Titanium tetrachloride"],
        Ti2O3: ["Titanium(III) oxide"],

        VOF3: ["Vanadium(V) oxytrifluoride"],
        VOCl3: ["Vanadium oxytrichloride"],
        VCl4: ["Vanadium tetrachloride"],
        VBr3: ["Vanadium(III) bromide"],
        V2O5: ["Vanadium(V) oxide"],

        CrO: ["Chromium(II) oxide"],
        CrO2: ["Chromium(IV) oxide"],
        CrO3: ["Chromium trioxide"],
        CrF3: ["Chromium(III) fluoride"],
        CrCl3: ["Chromium(III) chloride"],
        Cr2Te3: ["Chromium(III) telluride"],

        "Mn(CH3CO2)2": ["Manganese(II) acetate"],
        MnCO3: ["Manganese(II) carbonate"],
        MnO2: ["Manganese dioxide"],
        MnSO4: ["Manganese(II) sulfate"],
        MnCl2: ["Manganese(II) chloride"],
        MnTe: ["Manganese(II) telluride"],

        FeCO3: ["Iron(II) carbonate"],
        "Fe(CO)5": ["Iron pentacarbonyl"],
        FeSO4: ["Iron(II) sulfate"],
        FeS2: ["Pyrite"],
        "Fe(ClO4)2": ["Iron(II) perchlorate"],
        FeCl2: ["Iron(II) chloride"],
        FeCl3: ["Iron(III) chloride"],
        Fe2C9O9: ["Diiron nonacarbonyl"],
        Fe2O3: ["Ferric oxide"],
        "Fe2(SO4)3": ["Iron(III) sulfate"],
        Fe7MoS9C: ["FeMoco"],
        Fe16N2: ["Iron nitride"],

        CoCO3: ["Cobalt(II) carbonate"],
        "Co(C5H5)2": ["Cobaltocene"],
        "Co(NO3)2": ["Cobalt(II) nitrate"],
        CoO: ["Cobalt(II) oxide"],
        "Co(OH)2": ["Cobalt(II) hydroxide"],
        CoF2: ["Cobalt(II) fluoride"],
        CoF3: ["Cobalt(III) fluoride"],
        CoS: ["Cobalt sulfide"],
        CoSO4: ["Cobalt(II) sulfate"],
        CoS2: ["Cobalt sulfide"],
        CoCl2: ["Cobalt(II) chloride"],
        CoCl3: ["Cobalt(III) chloride"],
        CoBr2: ["Cobalt(II) bromide"],
        CoI2: ["Cobalt(II) iodide"],
        "Co2(CO)8": ["Dicobalt octacarbonyl"],
        Co2O3: ["Cobalt(III) oxide"],
        Co3O4: ["Cobalt(II,III) oxide"],
        Co3S4: ["Cobalt sulfide"],
        "Co4(CO)12": ["Tetracobalt dodecacarbonyl"],
        Co9S8: ["Cobalt sulfide"],

        NiCO3: ["Nickel(II) carbonate"],
        "Ni(CO)4": ["Nickel tetracarbonyl"],
        "Ni(NO3)2": ["Nickel(II) nitrate"],
        NiO: ["Nickel(II) oxide"],
        "Ni(OH)2": ["Nickel(II) hydroxide"],
        "NiO(OH)": ["Nickel oxide hydroxide"],
        NiF2: ["Nickel(II) fluoride"],
        NiF3: ["Nickel(III) fluoride"],
        NiAl: ["Nickel aluminide"],
        NiS: ["Nickel sulfide"],
        NiSO4: ["Nickel(II) sulfate"],
        NiCl2: ["Nickel(II) chloride"],
        NiAs: ["Nickel arsenide"],
        NiSe: ["Nickel selenide"],
        NiBr2: ["Nickel(II) bromide"],
        NiI2: ["Nickel(II) iodide"],
        Ni2B: ["Dinickel boride"],
        Ni2O3: ["Nickel(III) oxide"],
        Ni2Si: ["Nickel silicide"],
        Ni3B: ["Trinickel boride"],
        Ni3Al: ["Nickel aluminide"],
        "Ni3(PO4)2": ["Nickel(II) phosphate"],

        Cu: ["Native copper"],
        CuCN: ["Copper(I) cyanide"],
        CuCO3: ["Copper(II) carbonate"],
        CuC2O4: ["Copper oxalate"],
        CuO: ["Copper(II) oxide"],
        CuO2: ["Copper peroxide"],
        "Cu(OH)2": ["Copper(II) hydroxide"],
        CuS: ["Copper monosulfide"],
        CuSO4: ["Copper(II) sulfate"],
        CuCl: ["Copper(I) chloride"],
        CuCl2: ["Copper(II) chloride"],
        CuBr2: ["Copper(II) bromide"],
        CuTe: ["Copper(II) telluride"],
        CuTe2: ["Copper ditelluride"],
        "Cu2CO3(OH)2": ["Basic copper carbonate"],
        Cu2O: ["Copper(I) oxide"],
        Cu2O3: ["Copper(III) oxide"],
        "Cu2(OH)3Cl": ["Dicopper chloride trihydroxide"],
        Cu2SO4: ["Copper(I) sulfate"],
        Cu2Se: ["Copper selenide"],
        Cu2Te: ["Copper(I) telluride"],
        Cu3H4O8S2: ["Chevreul's salt"],
        "Cu3(CO3)2(OH)2": ["Basic copper carbonate"],
        Cu4O3: ["Paramelaconite"],
        Cu5Si: ["Copper silicide"],

        "Zn(CH3)2": ["Dimethylzinc"],
        "Zn(CH3CO2)2": ["Zinc acetate"],
        "Zn(CN)2": ["Zinc cyanide"],
        ZnCO3: ["Zinc carbonate"],
        "Zn(NO3)2": ["Zinc nitrate"],
        ZnO: ["Zinc oxide"],
        "Zn(OH)2": ["Zinc hydroxide"],
        ZnO2: ["Zinc peroxide"],
        ZnF2: ["Zinc fluoride"],
        ZnP2: ["Zinc diphosphide"],
        ZnS: ["Zinc sulfide"],
        ZnSO4: ["Zinc sulfate"],
        "Zn[(S2P(OR)2]2": ["Zinc dithiophosphate"],
        "Zn(ClO3)2": ["Zinc chlorate"],
        ZnCl2: ["Zinc chloride"],
        ZnCrO4: ["Zinc chromate"],
        ZnSe: ["Zinc selenide"],
        ZnBr2: ["Zinc bromide"],
        ZnMoO4: ["Zinc molybdate"],
        ZnSb: ["Zinc antimonide"],
        ZnTe: ["Zinc telluride"],
        ZnI2: ["Zinc iodide"],
        Zn3N2: ["Zinc nitride"],
        "Zn3(PO4)2": ["Zinc phosphate"],
        Zn3P2: ["Zinc phosphide"],
        Zn3As2: ["Zinc arsenide"],
        Zn3Sb2: ["Zinc antimonide"],
        Zn4Sb3: ["Zinc antimonide"],

        GaH3: ["Gallane"],
        "Ga(CH3)3": ["Trimethylgallium"],
        GaN: ["Gallium nitride"],
        "Ga(NO3)3": ["Gallium nitrate"],
        "Ga(OH)3": ["Gallium(III) hydroxide"],
        GaF3: ["Gallium(III) fluoride"],
        GaP: ["Gallium phosphide"],
        GaS: ["Gallium(II) sulfide"],
        GaCl3: ["Gallium trichloride"],
        GaAs: ["Gallium arsenide"],
        GaAsP: ["Gallium arsenide phosphide"],
        GaSe: ["Gallium(II) selenide"],
        GaBr3: ["Gallium(III) bromide"],
        GaPd: ["Gallium palladide"],
        GaSb: ["Gallium antimonide"],
        GaTe: ["Gallium(II) telluride"],
        GaI: ["Gallium monoiodide"],
        GaI3: ["Gallium(III) iodide"],
        Ga2H6: ["Digallane"],
        Ga2O: ["Gallium(I) oxide"],
        Ga2O3: ["Gallium(III) oxide"],
        Ga2S3: ["Gallium(III) sulfide"],
        Ga2Te3: ["Gallium(III) telluride"],
        Ga4I4: ["Gallium monoiodide"],

        GeH4: ["Germane"],
        GeO: ["Germanium monoxide"],
        GeO2: ["Germanium dioxide"],
        GeS: ["Germanium monosulfide"],
        GeS2: ["Germanium disulfide"],
        GeCl2: ["Germanium dichloride"],
        GeCl4: ["Germanium tetrachloride"],
        GeSe2: ["Germanium diselenide"],
        GeTe: ["Germanium telluride"],
        Ge2H2: ["Digermyne"],

        AsH3: ["Arsine"],
        AsO2: ["Arsenic dioxide"],
        AsF3: ["Arsenic trifluoride"],
        AsF5: ["Arsenic pentafluoride"],
        AsS: ["Realgar"],
        AsCl3: ["Arsenic trichloride"],
        AsKO2: ["Potassium arsenite"],
        AsCuHO3: ["Scheele's Green"],
        AsBr3: ["Arsenic tribromide"],
        AsI3: ["Arsenic triiodide"],
        As2O3: ["Arsenic trioxide"],
        As2O4: ["Arsenic dioxide"],
        As2O5: ["Arsenic pentoxide"],
        As2S3: ["Arsenic trisulfide"],
        As2Te3: ["Arsenic(III) telluride"],
        As4S4: ["Realgar"],

        SeCl4: ["Selenium tetrachloride"],
        SeOCl2: ["Selenium oxydichloride"],
        SeOBr2: ["Selenium oxybromide"],
        SeO2: ["Selenium dioxide"],
        SeO2F2: ["Selenoyl fluoride"],
        SeO3: ["Selenium trioxide"],
        SeF6: ["Selenium hexafluoride"],
        SeBr4: ["Selenium tetrabromide"],
        Se2S6: ["Selenium hexasulfide"],
        Se2Cl2: ["Selenium monochloride"],
        Se4N4: ["Tetraselenium tetranitride"],

        BrHO3: ["Bromic acid"],
        BrHO4: ["Perbromic acid"],
        BrCN: ["Cyanogen bromide"],
        BrO2: ["Bromine dioxide"],
        BrF: ["Bromine monofluoride"],
        BrF3: ["Bromine trifluoride"],
        BrF5: ["Bromine pentafluoride"],
        BrCl: ["Bromine monochloride"],
        Br2: ["Dibromine"],
        Br2O: ["Dibromine monoxide"],
        Br2O3: ["Dibromine trioxide"],
        Br2O5: ["Dibromine pentoxide"],

        KrF: ["Krypton fluoride"],

        RbOH: ["Rubidium hydroxide"],
        RbO2: ["Rubidium superoxide"],
        RbO3: ["Rubidium ozonide"],
        RbF: ["Rubidium fluoride"],
        RbCl: ["Rubidium chloride"],
        RbBr: ["Rubidium bromide"],
        RbAg4I5: ["Rubidium silver iodide"],
        RbI: ["Rubidium iodide"],
        Rb2CO3: ["Rubidium carbonate"],
        Rb2O2: ["Rubidium peroxide"],
        Rb2Te: ["Rubidium telluride"],

        SrCO3: ["Strontium carbonate"],
        "Sr(NO3)2": ["Strontium nitrate"],
        SrO: ["Strontium oxide"],
        SrO2: ["Strontium peroxide"],
        "Sr(OH)2": ["Strontium hydroxide"],
        SrF2: ["Strontium fluoride"],
        SrAl2O4: ["Strontium aluminate"],
        SrS: ["Strontium sulfide"],
        SrSO4: ["Strontium sulfate"],
        SrCl2: ["Strontium chloride"],
        SrCrO4: ["Strontium chromate"],
        Sr3N2: ["Strontium nitride"],

        YH2: ["Yttrium hydride"],
        YH3: ["Yttrium hydride"],
        YB6: ["Yttrium boride"],
        YN: ["Yttrium nitride"],
        "Y(NO3)3": ["Yttrium(III) nitrate"],
        YO: ["Yttrium(II) oxide"],
        "Y(OH)3": ["Yttrium hydroxide"],
        YP: ["Yttrium phosphide"],
        YCl3: ["Yttrium(III) chloride"],
        YBa2Cu3O7: ["Yttrium barium copper oxide"],
        "Y2(C2O4)3": ["Yttrium oxalate"],
        Y2O3: ["Yttrium(III) oxide"],
        Y3Al5O12: ["Yttrium aluminium garnet"],

        ZrH2: ["Zirconium hydride"],
        ZrB2: ["Zirconium diboride"],
        ZrC: ["Zirconium carbide"],
        ZrN: ["Zirconium nitride"],
        ZrOCl2: ["Zirconyl chloride"],
        ZrO2: ["Zirconium dioxide"],
        ZrF4: ["Zirconium tetrafluoride"],
        ZrSiO4: ["Zirconium(IV) silicate"],
        ZrCl3: ["Zirconium(III) chloride"],
        ZrCl4: ["Zirconium(IV) chloride"],
        ZrBr4: ["Zirconium(IV) bromide"],
        ZrI4: ["Zirconium(IV) iodide"],
        "Zr(WO4)2": ["Zirconium tungstate"],

        NbC: ["Niobium carbide"],
        NbN: ["Niobium nitride"],
        NbO: ["Niobium monoxide"],
        NbO2: ["Niobium dioxide"],
        NbCl5: ["Niobium(V) chloride"],
        NbBr5: ["Niobium(V) bromide"],
        Nb2O5: ["Niobium pentoxide"],
        Nb2I10: ["Niobium pentaiodide"],

        "Mo(CO)6": ["Molybdenum hexacarbonyl"],
        MoO2: ["Molybdenum dioxide"],
        MoO3: ["Molybdenum trioxide"],
        MoF6: ["Molybdenum hexafluoride"],
        MoS2: ["Molybdenum disulfide"],
        MoCl2: ["Molybdenum(II) chloride"],
        MoCl3: ["Molybdenum(III) chloride"],
        MoCl4: ["Molybdenum tetrachloride"],
        MoCl5: ["Molybdenum(V) chloride"],
        MoCl6: ["Molybdenum(VI) chloride"],
        MoBr3: ["Molybdenum(III) bromide"],
        MoBr4: ["Molybdenum(IV) bromide"],
        MoTe: ["Molybdenum ditelluride"],

        TcF6: ["Technetium hexafluoride"],
        TcCl3: ["Technetium trichloride"],
        TcCl4: ["Technetium(IV) chloride"],
        TiI3: ["Titanium(III) iodide"],
        Tc2O7: ["Technetium(VII) oxide"],

        "Ru(CO)5": ["Ruthenium pentacarbonyl"],
        RuO2: ["Ruthenium(IV) oxide"],
        RuO4: ["Ruthenium tetroxide"],
        RuF3: ["Ruthenium(III) fluoride"],
        RuF5: ["Ruthenium pentafluoride"],
        RuF6: ["Ruthenium hexafluoride"],
        RuS2: ["Laurite"],
        RuCl3: ["Ruthenium(III) chloride"],

        RhO2: ["Rhodium(IV) oxide"],
        RhF3: ["Rhodium trifluoride"],
        RhF5: ["Rhodium pentafluoride"],
        RhF6: ["Rhodium hexafluoride"],
        RhCl3: ["Rhodium(III) chloride"],
        Rh2O3: ["Rhodium(III) oxide"],

        PdCl2: ["Palladium(II) chloride"],

        AgBF4: ["Silver tetrafluoroborate"],
        AgCNO: ["Silver fulminate"],
        AgNO3: ["Silver nitrate"],
        AgN3: ["Silver azide"],
        AgF: ["Silver(I) fluoride"],
        AgFH6N2: ["Silver diammine fluoride"],
        AgF2: ["Silver(II) fluoride"],
        AgF3: ["Silver(III) fluoride"],
        AgPF6: ["Silver hexafluorophosphate"],
        AgCl: ["Silver chloride"],
        AgBr: ["Silver bromide"],
        AgBrO3: ["Silver bromate"],
        AgI: ["Silver iodide"],
        Ag2CO3: ["Silver carbonate"],
        Ag2O: ["Silver oxide"],
        Ag2F: ["Silver subfluoride"],
        Ag2S: ["Silver sulfide"],
        Ag2SeO3: ["Silver selenite"],
        Ag2Te: ["Silver telluride"],
        Ag3N: ["Silver nitride"],
        Ag3Sb: ["Silver antimonide"],
        Ag3SbS3: ["Silver sulfantimonite"],
        Ag4O4: ["Silver(I,III) oxide"],

        "Cd(CN)2": ["Cadmium cyanide"],
        "Cd(NO3)2": ["Cadmium nitrate"],
        CdO: ["Cadmium oxide"],
        "Cd(OH)2": ["Cadmium hydroxide"],
        CdS: ["Cadmium sulfide"],
        CdSO4: ["Cadmium sulfate"],
        CdCl2: ["Cadmium chloride"],
        CdZnTe: ["Cadmium zinc telluride"],
        CdSe: ["Cadmium selenide"],
        CdBr2: ["Cadmium bromide"],
        CdI2: ["Cadmium iodide"],
        CdTe: ["Cadmium telluride"],
        Cd3As2: ["Cadmium arsenide"],

        InN: ["Indium nitride"],
        InN3O9: ["Indium(III) nitrate"],
        "In(OH)3": ["Indium(III) hydroxide"],
        InF3: ["Indium(III) fluoride"],
        InP: ["Indium phosphide"],
        InCl3: ["Indium(III) chloride"],
        InGaN: ["Indium gallium nitride"],
        InBr3: ["Indium(III) bromide"],
        InSb: ["Indium antimonide"],
        InI3: ["Indium(III) iodide"],
        In2O3: ["Indium(III) oxide"],
        In2Se3: ["Indium(III) selenide"],
        In2Te3: ["Indium(III) telluride"],

        SnH4: ["Stannane"],
        SnO2: ["Tin(IV) oxide"],
        "Sn(OH)2": ["Tin(II) hydroxide"],
        SnF2: ["Tin(II) fluoride"],
        SnF4: ["Tin(IV) fluoride"],
        SnS: ["Tin(II) sulfide"],
        SnCl2: ["Tin(II) chloride"],
        SnCl4: ["Tin(IV) chloride"],
        SnBr2: ["Tin(II) bromide"],
        SnBr4: ["Tin(IV) bromide"],
        SnI2: ["Tin(II) iodide"],
        SnI4: ["Tin(IV) iodide"],
        S2Sn: ["Tin(IV) sulfide"],
        SnTe: ["Tin telluride"],

        SbOCl: ["Antimony oxychloride"],
        SbF3: ["Antimony trifluoride"],
        SbF5: ["Antimony pentafluoride"],
        SbCl3: ["Antimony trichloride"],
        SbCl5: ["Antimony pentachloride"],
        SbBr3: ["Antimony tribromide"],
        SbI3: ["Antimony triiodide"],
        Sb2O3: ["Antimony trioxide"],
        Sb2O4: ["Antimony tetroxide"],
        Sb2O5: ["Antimony pentoxide"],
        Sb2S3: ["Antimony trisulfide"],
        Sb2S5: ["Antimony pentasulfide"],
        Sb2Te3: ["Antimony telluride"],

        TeO2: ["Tellurium dioxide"],
        TeO3: ["Tellurium trioxide"],
        "Te(OH)6": ["Telluric acid"],
        TeF4: ["Tellurium tetrafluoride"],
        TeF5OH: ["Teflic acid"],
        TeF6: ["Tellurium hexafluoride"],
        TeCl4: ["Tellurium tetrachloride"],
        TeBr4: ["Tellurium tetrabromide"],
        TeI4: ["Tellurium tetraiodide"],

        ICN: ["Cyanogen iodide"],
        I2O: ["Diiodine oxide"],
        I2O5: ["Iodine pentoxide"],
        IF: ["Iodine monofluoride"],
        IF3: ["Iodine trifluoride"],
        IF5: ["Iodine pentafluoride"],
        IF7: ["Iodine heptafluoride"],
        INaO3: ["Sodium iodate"],
        ICl: ["Iodine monochloride"],
        IBr: ["Iodine monobromide"],
        I2Cl6: ["Iodine trichloride"],
        I4O9: ["Tetraiodine nonoxide"],

        XeOF4: ["Xenon oxytetrafluoride"],
        XeO2: ["Xenon dioxide"],
        XeO2F2: ["Xenon dioxydifluoride"],
        XeO3: ["Xenon trioxide"],
        XeO4: ["Xenon tetroxide"],
        XeF2: ["Xenon difluoride"],
        XeF4: ["Xenon tetrafluoride"],
        XeF6: ["Xenon hexafluoride"],
        XeCl2: ["Xenon dichloride"],
        XeCl4: ["Xenon tetrachloride"],
        XeBr2: ["Xenon dibromide"],

        CsH: ["Cesium hydride"],
        CsHCO2: ["Cesium formate"],
        CsHO4S: ["Cesium bisulfate"],
        CsNO3: ["Cesium nitrate"],
        CsOH: ["Cesium hydroxide"],
        CsO2: ["Cesium superoxide"],
        CsO3: ["Cesium ozonide"],
        CsF: ["Cesium fluoride"],
        CsCl: ["Cesium chloride"],
        CsClO4: ["Cesium perchlorate"],
        CsBr: ["Cesium bromide"],
        CsCdCl3: ["Cesium cadmium chloride"],
        CsCdBr3: ["Cesium cadmium bromide"],
        CsI: ["Cesium iodide"],
        Cs2CO3: ["Cesium carbonate"],
        Cs2O: ["Cesium monoxide"],
        Cs2O2: ["Cesium peroxide"],
        Cs2Al2Si4O12: ["Pollucite"],
        Cs2S: ["Cesium sulfide"],
        Cs2SO4: ["Cesium sulfate"],
        Cs2CuF6: ["Cesium hexafluorocuprate(IV)"],
        Cs2Te: ["Cesium telluride"],
        Cs4O6: ["Cesium sesquioxide"],

        BaH2: ["Barium hydride"],
        BaB2O4: ["Barium borate"],
        BaB6: ["Barium boride"],
        BaCO3: ["Barium carbonate"],
        BaC2: ["Barium carbide"],
        "Ba(CN)2": ["Barium cyanide"],
        BaC2O4: ["Barium oxalate"],
        "Ba(NO3)2": ["Barium nitrate"],
        "Ba(N3)2": ["Barium azide"],
        BaO: ["Barium oxide"],
        BaO2: ["Barium peroxide"],
        "Ba(OH)2": ["Barium hydroxide"],
        BaF2: ["Barium fluoride"],
        "Ba(PO3)2": ["Barium metaphosphate"],
        BaS: ["Barium sulfide"],
        BaSO3: ["Barium sulfite"],
        BaSO4: ["Barium sulfate"],
        "Ba(SCN)2": ["Barium thiocyanate"],
        BaCl2: ["Barium chloride"],
        "Ba(ClO)2": ["Barium hypochlorite"],
        "Ba(ClO3)2": ["Barium chlorate"],
        "Ba(ClO4)2": ["Barium perchlorate"],
        BaTiO3: ["Barium titanate"],
        BaCrO4: ["Barium chromate"],
        "Ba(MnO4)2": ["Barium permanganate"],
        BaCuSi2O6: ["Han purple"],
        BaCuSi4O10: ["Han blue"],
        BaZnGa: ["Barium zinc gallide"],
        BaBr2: ["Barium bromide"],
        BaBr2O6: ["Barium bromate"],
        BaSnO3: ["Barium stannate"],
        BaI2: ["Barium iodide"],
        "Ba(IO3)2": ["Barium iodate"],
        BaMnO4: ["Barium manganate"],
        BaFeO4: ["Barium ferrate"],
        BaFe12O19: ["Barium ferrite"],
        BaWO4: ["Barium tungstate"],
        Ba2TiO4: ["Barium orthotitanate"],

        "La2(C2O4)3": ["Lanthanum oxalate"],
        "La(NO3)3": ["Lanthanum(III) nitrate"],
        "La(OH)3": ["Lanthanum hydroxide"],
        LaF3: ["Lanthanum trifluoride"],
        LaCl3: ["Lanthanum(III) chloride"],
        LaYbO3: ["Lanthanum ytterbium oxide"],
        La2Hf2O7: ["Lanthanum hafnate"],
        La2O3: ["Lanthanum oxide"],

        CeB6: ["Cerium hexaboride"],
        "Ce2(C2O4)3": ["Cerium oxalate"],
        "Ce(C8H8)2": ["Cerocene"],
        "Ce(NO3)3": ["Cerium(III) nitrate"],
        "Ce(OH)3": ["Cerium(III) hydroxide"],
        "Ce(OH)4": ["Cerium(IV) hydroxide"],
        CeO2: ["Cerium(IV) oxide"],
        CeF3: ["Cerium(III) fluoride"],
        CeF4: ["Cerium(IV) fluoride"],
        "Ce(SO4)2": ["Cerium(IV) sulfate"],
        CeCl3: ["Cerium(III) chloride"],
        "Ce(ClO4)4": ["Cerium(IV) perchlorate"],
        CeBr3: ["Cerium(III) bromide"],
        CeI2: ["Cerium diiodide"],
        CeI3: ["Cerium(III) iodide"],
        CeCoIn5: ["Cerium-Cobalt-Indium 5"],
        Ce2O3: ["Cerium(III) oxide"],
        "Ce2(CO3)3": ["Cerium(III) carbonate"],
        "Ce2O(NO3)6": ["Dicerium nitrate"],
        "Ce(SO4)2": ["Cerium(IV) sulfate"],
        Ce2S3: ["Cerium(III) sulfide"],
        "Ce2(SO4)3": ["Cerium(III) sulfate"],
        Ce3O4: ["Cerium(III, IV) oxide"],

        PrN: ["Praseodymium(III) nitride"],
        "Pr(NO3)3": ["Praseodymium(III) nitrate"],
        PrO2: ["Praseodymium(IV) oxide"],
        PrF3: ["Praseodymium(III) fluoride"],
        PrF4: ["Praseodymium(IV) fluoride"],
        PrCl3: ["Praseodymium(III) chloride"],
        PrBr3: ["Praseodymium(III) bromide"],
        PrI3: ["Praseodymium(III) iodide"],
        Pr2O3: ["Praseodymium(III) oxide"],
        Pr6O11: ["Praseodymium(III,IV) oxide"],

        NdN: ["Neodymium nitride"],
        "Nd(NO3)3": ["Neodymium nitrate"],
        "Nd(OH)3": ["Neodymium(III) hydroxide"],
        "Nd(O2C2H3)3": ["Neodymium acetate"],
        NdCl2: ["Neodymium(II) chloride"],
        NdCl3: ["Neodymium(III) chloride"],
        NdAsO4: ["Neodymium arsenate"],
        NdBr2: ["Neodymium(II) bromide"],
        NdI2: ["Neodymium(II) iodide"],
        NdI3: ["Neodymium(III) iodide"],
        NdTaO4: ["Neodymium tantalate"],
        "Nd2(CO3)3": ["Neodymium(III) carbonate"],
        "Nd2(C2O4)3": ["Neodymium(III) oxalate"],
        "Nd2(SO4)3": ["Neodymium(III) sulfate"],
        Nd2O3: ["Neodymium(III) oxide"],

        "Pm(NO3)3": ["Promethium(III) nitrate"],
        "Pm(OH)3": ["Promethium(III) hydroxide"],
        PmF3: ["Promethium(III) fluoride"],
        PmPO4: ["Promethium(III) phosphate"],
        PmCl3: ["Promethium(III) chloride"],
        PmBr3: ["Promethium(III) bromide"],
        PmI3: ["Promethium(III) iodide"],
        Pm2O3: ["Promethium(III) oxide"],

        SmB6: ["Samarium hexaboride"],
        "Sm(NO3)3": ["Samarium(III) nitrate"],
        "Sm(OH)3": ["Samarium(III) hydroxide"],
        SmF3: ["Samarium(III) fluoride"],
        SmCl3: ["Samarium(III) chloride"],
        SmAs: ["Samarium arsenide"],
        SmSe: ["Selenium(II) selenide"],
        SmBr2: ["Samarium(II) bromide"],
        SmBr3: ["Samarium(III) bromide"],
        SmTe: ["Samarium(II) telluride"],
        SmI2: ["Samarium(II) iodide"],
        Sm2O3: ["Samarium(III) oxide"],
        Sm2S3: ["Samarium(III) sulfide"],

        EuH2: ["Europium hydride"],
        "Eu(NO3)3": ["Europium(III) nitrate"],
        "Eu2(C2O4)3": ["Europium(III) oxalate"],
        EuO: ["Europium(II) oxide"],
        "Eu(OH)3": ["Europium(III) hydroxide"],
        EuF2: ["Europium(II) fluoride"],
        EuF3: ["Europium(III) fluoride"],
        EuP: ["Europium(III) phosphide"],
        EuS: ["Europium(II) sulfide"],
        EuSO4: ["Europium(II) sulfate"],
        EuCl2: ["Europium dichloride"],
        EuCl3: ["Europium(III) chloride"],
        EuAsO4: ["Europium(III) arsenate"],
        EuBr2: ["Europium(II) bromide"],
        EuBr3: ["Europium(III) bromide"],
        EuI: ["Europium(III) iodide"],
        EuI2: ["Europium(II) iodide"],
        Eu2O3: ["Europium(III) oxide"],

        "Gd(NO3)3": ["Gadolinium(III) nitrate"],
        GdF3: ["Gadolinium(III) fluoride"],
        "Gd(OH)3": ["Gadolinium(III) hydroxide"],
        GdP: ["Gadolinium phosphide"],
        GdCl3: ["Gadolinium(III) chloride"],
        GdBr3: ["Gadolinium(III) bromide"],
        GdI2: ["Gadolinium diiodide"],
        GdI3: ["Gadolinium(III) iodide"],
        Gd2O2S: ["Gadolinium oxysulfide"],
        Gd2O3: ["Gadolinium(III) oxide"],
        Gd2O5Si: ["Gadolinium oxyorthosilicate"],
        Gd3Ga5O12: ["Gadolinium gallium garnet"],

        "Tb(NO3)3": ["Terbium(III) nitrate"],
        TbO2: ["Terbium(IV) oxide"],
        "Tb(OH)3": ["Terbium(III) hydroxide"],
        TbF3: ["Terbium(III) fluoride"],
        TbF4: ["Terbium(IV) fluoride"],
        TbP: ["Terbium phosphide"],
        TbCl3: ["Terbium(III) chloride"],
        TbBr3: ["Terbium(III) bromide"],
        TbI3: ["Terbium(III) iodide"],
        Tb2O3: ["Terbium(III) oxide"],
        Tb4O7: ["Terbium(III,IV) oxide"],

        "Dy(NO3)3": ["Dysprosium(III) nitrate"],
        "Dy(OH)3": ["Dysprosium(III) hydroxide"],
        DyF3: ["Dysprosium(III) fluoride"],
        DyP: ["Dysprosium phosphide"],
        DyCl2: ["Dysprosium(II) chloride"],
        DyCl3: ["Dysprosium(III) chloride"],
        DyBr3: ["Dysprosium(III) bromide"],
        Dy2O3: ["Dysprosium(III) oxide"],
        Dy2O5Ti: ["Dysprosium titanate"],
        Dy2O7Ti2: ["Dysprosium titanate"],
        Dy2O7Sn2: ["Dysprosium stannate"],

        HoF3: ["Holmium(III) fluoride"],
        "Ho(NO3)3": ["Holmium(III) nitrate"],
        HoP: ["Holmium phosphide"],
        HoCl3: ["Holmium(III) chloride"],
        HoBr3: ["Holmium(III) bromide"],
        HoI3: ["Holmium(III) iodide"],
        Ho2O3: ["Holmium(III) oxide"],
        Ho2S3: ["Holmium(III) sulfide"],
        Ho2O7Ti2: ["Holmium titanate"],

        ErB4: ["Erbium tetraboride"],
        "Er(NO3)3": ["Erbium(III) nitrate"],
        "Er(OH)3": ["Erbium(III) hydroxide"],
        ErF3: ["Erbium(III) fluoride"],
        ErP: ["Erbium phosphide"],
        ErCl3: ["Erbium(III) chloride"],
        ErBr3: ["Erbium(III) bromide"],
        ErI3: ["Erbium(III) iodide"],
        Er2O3: ["Erbium(III) oxide"],

        "Tm(NO3)3": ["Thulium(III) nitrate"],
        "Tm(OH)3": ["Thulium(III) hydroxide"],
        TmF2: ["Thulium(II) fluoride"],
        TmF3: ["Thulium(III) fluoride"],
        TmP: ["Thulium phosphide"],
        TmCl2: ["Thulium(II) chloride"],
        TmCl3: ["Thulium(III) chloride"],
        TmBr2: ["Thulium dibromide"],
        TmBr3: ["Thulium(III) bromide"],
        TmI3: ["Thulium(III) iodide"],
        Tm2O3: ["Thulium(III) oxide"],

        YbH2: ["Ytterbium hydride"],
        "Yb(NO3)3": ["Ytterbium(III) nitrate"],
        YbF3: ["Ytterbium(III) fluoride"],
        YbP: ["Ytterbium phosphide"],
        YbCl2: ["Ytterbium(II) chloride"],
        YbCl3: ["Ytterbium(III) chloride"],
        YbBr3: ["Ytterbium(III) bromide"],
        YbI2: ["Ytterbium(II) iodide"],
        YbI3: ["Ytterbium(III) iodide"],
        YbRh2Si2: ["Ytterbium dirhodium disilicide"],
        Yb2O3: ["Ytterbium(III) oxide"],
        "Yb2(SO4)3": ["Ytterbium(III) sulfate"],

        LuH3: ["Lutetium hydride"],
        "Lu(NO3)3": ["Lutetium(III) nitrate"],
        "Lu(OH)3": ["Lutetium(III) hydroxide"],
        LuF3: ["Lutetium(III) fluoride"],
        Lu3Al5O12: ["Lutetium aluminium garnet"],
        LuP: ["Lutetium phosphide"],
        LuCl3: ["Lutetium(III) chloride"],
        LuBr3: ["Lutetium(III) bromide"],
        LuI3: ["Lutetium(III) iodide"],
        LuTaO4: ["Lutetium tantalate"],
        Lu2O3: ["Lutetium(III) oxide"],
        Lu2V2O7: ["Lutetium vanadate"],

        HfB2: ["Hafnium diboride"],
        HfC: ["Hafnium carbide"],
        "Hf(NO3)4": ["Hafnium nitrate"],
        HfO2: ["Hafnium(IV) oxide"],
        HfF4: ["Hafnium tetrafluoride"],
        HfSiO4: ["Hafnium(IV) silicate"],
        HfS2: ["Hafnium disulfide"],
        HfCl4: ["Hafnium tetrachloride"],
        HfBr4: ["Hafnium tetrabromide"],
        HfI3: ["Hafnium(III) iodide"],
        HfI4: ["Hafnium(IV) iodide"],
        Hf2CN: ["Hafnium carbonitride"],

        TaB: ["Tantalum boride"],
        TaB2: ["Tantalum diboride"],
        TaC: ["Tantalum carbide"],
        TaN: ["Tantalum nitride"],
        TaF5: ["Tantalum pentafluoride"],
        TaAl3: ["Tantalum trialuminide"],
        TaS2: ["Tantalum(IV) sulfide"],
        TaCl5: ["Tantalum(V) chloride"],
        TaAs: ["Tantalum arsenide"],
        TaSe2: ["Tantalum diselenide"],
        TaTe2: ["Tantalum telluride"],
        Ta2O5: ["Tantalum pentoxide"],
        Ta2Br10: ["Tantalum(V) bromide"],
        Ta2I10: ["Tantalum(V) iodide"],
        Ta4HfC5: ["Tantalum hafnium carbide"],

        WB: ["Tungsten boride"],
        WB2: ["Tungsten boride"],
        WB4: ["Tungsten boride"],
        WC: ["Tungsten carbide"],
        WN: ["Tungsten nitride"],
        WN2: ["Tungsten nitride"],
        WOF4: ["Tungsten(VI) oxytetrafluoride"],
        WOCl4: ["Tungsten(VI) oxytetrachloride"],
        WOBr4: ["Tungsten(VI) oxytetrabromide"],
        WO2Cl2: ["Tungsten dichloride dioxide"],
        WO2: ["Tungsten(IV) oxide"],
        WO3: ["Tungsten trioxide"],
        WF6: ["Tungsten hexafluoride"],
        WSi2: ["Tungsten disilicide"],
        WS2: ["Tungsten disulfide"],
        WS3: ["Tungsten trisulfide"],
        WCl4: ["Tungsten(IV) chloride"],
        WCl6: ["Tungsten hexachloride"],
        WSe2: ["Tungsten diselenide"],
        WTe2: ["Tungsten ditelluride"],
        W2: ["Ditungsten"],
        W2B: ["Tungsten boride"],
        W2N: ["Tungsten nitride"],
        W2O3: ["Tungsten(III) oxide"],
        W2Cl10: ["Tungsten(V) chloride"],
        W6Cl12: ["Tungsten(II) chloride"],
        W6Cl18: ["Tungsten(III) chloride"],

        "ReH(CO)5": ["Pentacarbonylhydridorhenium"],
        ReB2: ["Rhenium diboride"],
        "ReOCl3(PPh3)2": ["Oxotrichlorobis(triphenylphosphine)rhenium(V)"],
        ReO2: ["Rhenium(IV) oxide"],
        ReO3: ["Rhenium trioxide"],
        ReF6: ["Rhenium hexafluoride"],
        ReF7: ["Rhenium heptafluoride"],
        ReS2: ["Rhenium disulfide"],
        ReCl4: ["Rhenium(IV) chloride"],
        ReCl5: ["Rhenium pentachloride"],
        ReCl6: ["Rhenium(VI) chloride"],
        ReSe2: ["Rhenium diselenide"],
        "ReBr(CO)5": ["Bromopentacarbonylrhenium(I)"],
        ReTe2: ["Rhenium ditelluride"],
        ReI4: ["Rhenium tetraiodide"],
        "Re2(CO)10": ["Dirhenium decacarbonyl"],
        Re2O7: ["Rhenium(VII) oxide"],
        Re2S7: ["Rhenium(VII) sulfide"],
        Re3Cl9: ["Trirhenium nonachloride"],
        Re3Br9: ["Rhenium(III) bromide"],

        OsB2: ["Osmium diboride"],
        OsO2: ["Osmium dioxide"],
        OsO4: ["Osmium tetroxide"],
        OsF5: ["Osmium pentafluoride"],
        OsF6: ["Osmium hexafluoride"],
        OsCl4: ["Osmium(IV) chloride"],
        OsBr4: ["Osmium tetrabromide"],
        OsI: ["Osmium(I) iodide"],
        OsI2: ["Osmium(II) iodide"],
        OsI3: ["Osmium(III) iodide"],
        "Os3H2(CO)10": ["Decacarbonyldihydridotriosmium"],

        IrH3: ["Iridium trihydride"],
        IrO2: ["Iridium(IV) oxide"],
        IrO4: ["Iridium tetroxide"],
        IrF4: ["Iridium tetrafluoride"],
        IrF5: ["Iridium(V) fluoride"],
        IrF6: ["Iridium hexafluoride"],
        IrCl3: ["Iridium(III) chloride"],
        IrCl4: ["Iridium tetrachloride"],
        IrS2: ["Iridium disulfide"],
        Ir2S3: ["Iridium(III) sulfide"],
        "Ir4(CO)12": ["Tetrairidium dodecacarbonyl"],

        "Pt(NH3)2Cl2": ["Cisplatin"],
        PtO2: ["Adams' catalyst"],
        PtF4: ["Platinum tetrafluoride"],
        PtF5: ["Platinum pentafluoride"],
        PtF6: ["Platinum hexafluoride"],
        PtCl2: ["Platinum(II) chloride"],
        PtCl4: ["Platinum(IV) chloride"],
        PtBr2: ["Platinum(II) bromide"],
        PtBr4: ["Platinum(IV) bromide"],

        AuF5: ["Gold(V) fluoride"],
        AuF7: ["Gold heptafluoride"],
        AuCl: ["Gold(I) chloride"],
        AuBr3: ["Gold(III) bromide"],
        AuI: ["Gold monoiodide"],
        AuCs: ["Cesium auride"],
        Au2O3: ["Gold(III) oxide"],
        Au2S: ["Gold(I) sulfide"],
        Au2S3: ["Gold(III) sulfide"],
        "Au2(SO4)2": ["Gold(II) sulfate"],
        Au2Cl6: ["Gold(III) chloride"],
        Au2Te3: ["Gold telluride"],
        Au3Te5: ["Gold telluride"],
        Au4Cl8: ["Gold(I,III) chloride"],

        HgH: ["Mercury(I) hydride"],
        HgO: ["Mercury(II) oxide"],
        HgF4: ["Mercury(IV) fluoride"],
        HgS: ["Mercury sulfide"],
        HgSO4: ["Mercury(II) sulfate"],
        HgCl2: ["Mercury(II) chloride"],
        HgZnTe: ["Mercury zinc telluride"],
        HgSe: ["Mercury selenide"],
        HgTe: ["Mercury telluride"],
        Hg2Cl2: ["Mercury(I) chloride"],

        TlH3: ["Thallane"],
        TlH3O3: ["Thallium(III) hydroxide"],
        TlNO3: ["Thallium(I) nitrate"],
        TlOH: ["Thallium(I) hydroxide"],
        TlF: ["Thallium(I) fluoride"],
        TlF3: ["Thallium trifluoride"],
        TlCl: ["Thallium(I) chloride"],
        TlBr: ["Thallium(I) bromide"],
        TlI: ["Thallium(I) iodide"],
        TlI3: ["Thallium triiodide"],
        Tl2CO3: ["Thallium(I) carbonate"],
        Tl2O: ["Thallium(I) oxide"],
        Tl2O3: ["Thallium(III) oxide"],
        Tl2SO4: ["Thallium(I) sulfate"],
        Tl2Te: ["Thallium(I) telluride"],
        Tl2Ba2Ca2Cu3O10: ["Thallium barium calcium copper oxide"],

        PbHAsO4: ["Lead hydrogen arsenate"],
        PbCO3: ["Lead carbonate"],
        "Pb(NO3)2": ["Lead(II) nitrate"],
        PbO: ["Lead(II) oxide"],
        PbO2: ["Lead dioxide"],
        "Pb(OH)2": ["Lead(II) hydroxide"],
        PbS: ["Lead(II) sulfide"],
        PbSO4: ["Lead(II) sulfate"],
        PbS2: ["Lead(IV) sulfide"],
        PbCrO4: ["Lead(II) chromate"],
        PbSe: ["Lead selenide"],
        PbTe: ["Lead telluride"],
        Pb3O4: ["Lead(II,IV) oxide"],
        Pb4FeSb6S14: ["Jamesonite"],
        Pb5Sb4S11: ["Boulangerite"],
        Pb9Sb22S42: ["Lead anitmony sulfide"],

        BiH3: ["Bismuthine"],
        BiOCl: ["Bismuth oxychloride"],
        BiO4V: ["Bismuth vanadate"],
        BiF3: ["Bismuth trifluoride"],
        BiF5: ["Bismuth pentafluoride"],
        BiCl3: ["Bismuth chloride"],
        BiMn: ["Bismanol"],
        BiBr3: ["Bismuth tribromide"],
        BiI3: ["Bismuth(III) iodide"],
        "Bi2O2(CO3)": ["Bismuth subcarbonate"],
        Bi2O3: ["Bismuth(III) oxide"],
        Bi2S3: ["Bismuth(III) sulfide"],
        Bi2Ge3O9: ["Bismuth germanate"],
        Bi2Br9Cs3: ["Cesium enneabromodibismuthate"],
        Bi2Te3: ["Bismuth telluride"],
        Bi4Ge3O12: ["Bismuth germanate"],
        Bi5H9N4O22: ["Bismuth oxynitrate"],
        Bi12GeO20: ["Bismuth germanate"],

        PoH2: ["Polonium hydride"],
        PoO: ["Polonium monoxide"],
        PoO2: ["Polonium dioxide"],
        PoO3: ["Polonium trioxide"],
        PoF6: ["Polonium hexafluoride"],
        PoCl2: ["Polonium dichloride"],
        PoCl4: ["Polonium tetrachloride"],
        PoBr2: ["Polonium dibromide"],
        PoI4: ["Polonium tetraiodide"],

        AtBr: ["Astatine bromide"],
        AtI: ["Astatine iodide"],

        RnO3: ["Radon trioxide"],
        RnF2: ["Radon difluoride"],

        FrOH: ["Francium hydroxide"],
        FrCl: ["Francium chloride"],

        RaCO3: ["Radium carbonate"],
        "Ra(NO3)2": ["Radium nitrate"],
        RaF2: ["Radium fluoride"],
        RaSO4: ["Radium sulfate"],
        RaCl2: ["Radium chloride"],
        RaBr2: ["Radium bromide"],

        "Ac(NO3)3": ["Actinium(III) nitrate"],
        AcF3: ["Actinium(III) fluoride"],
        AcPO4: ["Actinium(III) phosphate"],
        AcCl3: ["Actinium(III) chloride"],
        AcBr3: ["Actinium(III) bromide"],
        AcI3: ["Actinium(III) iodide"],
        Ac2O3: ["Actinium(III) oxide"],
        Ac2S3: ["Actinium(III) sulfide"],

        ThC: ["Thorium(IV) carbide"],
        "Th(C2O4)2": ["Thorium oxalate"],
        "Th(C8H8)2": ["Thorocene"],
        "Th(NO3)4": ["Thorium(IV) nitrate"],
        ThO: ["Thorium monoxide"],
        ThOF2: ["Thorium oxyfluoride"],
        ThO2: ["Thorium dioxide"],
        "Th(OH)4": ["Thorium(IV) hydroxide"],
        ThF4: ["Thorium tetrafluoride"],
        ThSiO4: ["Thorium(IV) orthosilicate"],
        ThS2: ["Thorium(IV) sulfide"],
        ThCl4: ["Thorium(IV) chloride"],
        ThI4: ["Thorium(IV) iodide"],

        "Pa(C8H8)2": ["Protactinocene"],
        PaO2: ["Protactinium(IV) oxide"],
        PaF5: ["Protactinium(V) fluoride"],
        PaCl4: ["Protactinium(IV) chloride"],
        PaCl5: ["Protactinium(V) chloride"],
        PaBr4: ["Protactinium(IV) bromide"],
        PaBr5: ["Protactinium(V) bromide"],
        PaI5: ["Protactinium(V) iodide"],
        Pa2O5: ["Protactinium(V) oxide"],

        UB2: ["Uranium diboride"],
        UC: ["Uranium carbide"],
        "U(C8H8)2": ["Uranocene"],
        UO2: ["Uranium dioxide"],
        UO2F2: ["Uranyl fluoride"],
        UO3: ["Uranium trioxide"],
        UO4: ["Uranyl peroxide"],
        UO6: ["Uranium hexoxide"],
        UF3: ["Uranium trifluoride"],
        UF4: ["Uranium tetrafluoride"],
        UF5: ["Uranium pentafluoride"],
        UF6: ["Uranium hexafluoride"],
        USi2: ["Uranium disilicide"],
        US: ["Uranium monosulfide"],
        UCl3: ["Uranium(III) chloride"],
        UCl4: ["Uranium tetrachloride"],
        UCl5: ["Uranium pentachloride"],
        UCl6: ["Uranium hexachloride"],
        UBr4: ["Uranium tetrabromide"],
        UBr5: ["Uranium pentabromide"],
        URu2Si2: ["Uranium ruthenium silicide"],
        URhGe: ["Uranium rhodium germanium"],
        UPd2Al3: ["Uranium palladium aluminide"],
        UI3: ["Uranium(III) iodide"],
        UI4: ["Uranium(IV) iodide"],
        UI4: ["Uranium(V) iodide"],
        UPt3: ["Uranium platinide"],
        U2N3: ["Uranium nitrides"],
        U2O5: ["Diuranium pentoxide"],
        U3O8: ["Triuranium octoxide"],

        "Np(C2O4)2": ["Neptunium(IV) oxalate"],
        "Np(C8H8)2": ["Neptunocene"],
        "Np(NO3)4": ["Neptunium(IV) nitrate"],
        NpO2: ["Neptunium(IV) oxide"],
        "NpO2(OH)3": ["Neptunium(VII) oxide-hydroxide"],
        NpF3: ["Neptunium(III) fluoride"],
        NpF4: ["Neptunium(IV) fluoride"],
        NpF5: ["Neptunium(V) fluoride"],
        NpF6: ["Neptunium(VI) fluoride"],
        NpSi2: ["Neptunium silicide"],
        NpCl3: ["Neptunium(III) chloride"],
        NpAs: ["Neptunium arsenide"],
        NpAs2: ["Neptunium diarsenide"],

        PuH2: ["Plutonium hydride"],
        PuB2: ["Plutonium diboride"],
        PuB4: ["Plutonium tetraboride"],
        PuB6: ["Plutonium hexaboride"],
        PuC: ["Plutonium carbide"],
        "Pu(C8H8)2": ["Plutonocene"],
        "Pu(NO3)4": ["Plutonium(IV) nitrate"],
        PuO2: ["Plutonium(IV) oxide"],
        PuF3: ["Plutonium(III) fluoride"],
        PuF4: ["Plutonium tetrafluoride"],
        PuF6: ["Plutonium hexafluoride"],
        PuSi: ["Plutonium silicide"],
        PuP: ["Plutonium(III) phosphide"],
        PuCl3: ["Plutonium(III) chloride"],
        PuAs: ["Plutonium(III) arsenide"],
        PuSe: ["Plutonium selenide"],
        PuBr3: ["Plutonium(III) bromide"],
        Pu2C3: ["Plutonium carbide"],

        "Am(NO3)3": ["Americium(III) nitrate"],
        AmO2: ["Americium dioxide"],
        "Am(OH)3": ["Americium(III) hydroxide"],
        AmF3: ["Americium(III) fluoride"],
        AmF4: ["Americium(IV) fluoride"],
        AmCl2: ["Americium(II) chloride"],
        AmCl3: ["Americium(III) chloride"],
        AmBr2: ["Americium(II) bromide"],
        AmBr3: ["Americium(III) bromide"],
        AmI2: ["Americium(II) iodide"],
        AmI3: ["Americium(III) iodide"],
        Am2O3: ["Americium(III) oxide"],

        CmH3O3: ["Curium hydroxide"],
        "Cm(NO3)3": ["Curium(III) nitrate"],
        CmF3: ["Curium(III) fluoride"],
        CmCl3: ["Curium(III) chloride"],
        CmBr3: ["Curium(III) bromide"],
        Cm2O3: ["Curium(III) oxide"],

        "Bk(NO3)3": ["Berkelium(III) nitrate"],
        BkO2: ["Berkelium(IV) oxide"],
        BkCl3: ["Berkelium(III) chloride"],

        "Cf[B6O8(OH)5]": ["Californium(III) polyborate"],
        CfFO: ["Californium(III) oxyfluoride"],
        CfClO: ["Californium(III) oxychloride"],
        CfCl3: ["Californium(III) chloride"],
        CfBr3: ["Californium(III) bromide"],

        EsCl3: ["Einsteinium(III) chloride"],
        EsBr3: ["Einsteinium(III) bromide"],
        EsI3: ["Einsteinium(III) iodide"],
        Es2O3: ["Einsteinium(III) oxide"],
    };

    static find(symbol) {
        const compounds = [];
        for (const formula in Compounds.data) {
            const elements = Compounds.parse(formula);
            if (symbol in elements) {
                compounds.push(formula);
            }
        }
        return compounds;
    }

    static format(formula) {
        return formula.replaceAll(/\d+/g, '<sub>$&</sub>');
    }

    static getChemSpiderURL(formula) {
        return `https://www.chemspider.com/Search.aspx?q=${formula}`;
    }

    static getPubChemURL(formula) {
        return `https://pubchem.ncbi.nlm.nih.gov/#query=${formula}`;
    }

    static getWebBookURL(formula) {
        return `https://webbook.nist.gov/cgi/cbook.cgi?Formula=${formula}&NoIon=on&Units=SI`;
    }

    static parse(formula) {
        formula = formula.toString();
        const re = /([A-Z][a-z]?)(\d*)/g
        const matches = formula.matchAll(re);
        const elements = {};
        for (const components of matches) {
            const element = components[1];
            const count = (components[2] === '') ? 1 : parseInt(components[2]);
            if (Object.hasOwn(elements, element)) {
                elements[element] += count;
            }
            else {
                elements[element] = count;
            }
        }
        return elements;
    }

    static render(formula) {
        const pretty = Compounds.format(formula);

        document.title = formula;

        let html = `<h1>${pretty}</h1>`;

        html += '<h2>Links</h2>';

        if (formula in Compounds.data) {
            html += '<ul>';
            for (const chemical of Compounds.data[formula]) {
                html += `<li>${Link.toWikipedia(chemical, `Wikipedia: ${chemical}`)}</li>`;
            }
            html += '</ul>';
        }
        else {
            html += '<p>Chemical formula not found.</p>';
        }

        html += '<ul>';
        html += `<li>${Link.create(Compounds.getWebBookURL(formula), "NIST WebBook", true)}</li>`;
        html += `<li>${Link.create(Compounds.getChemSpiderURL(formula), "ChemSpider", true)}</li>`;
        html += `<li>${Link.create(Compounds.getPubChemURL(formula), "PubChem", true)}</li>`;
        html += '</ul>';

        const elements = Compounds.parse(formula);

        html += '<h2>Contains</h2>';
        html += '<section class="elements">';
        for (const symbol in elements) {
            const protons = Elements.findProtons(symbol);
            html += Elements.formatElement(protons, true);
        }
        html += '</section>';

        return html;
    }
}

class Isotopes {
    // Source: https://en.wikipedia.org/wiki/List_of_elements_by_stability_of_isotopes

    static primordial = {
        1: [1, 2],
        2: [4, 3],
        3: [7, 6],
        4: [9],
        5: [11, 10],
        6: [12, 13],
        7: [14, 15],
        8: [16, 18, 17],
        9: [19],
        10: [20, 22, 21],
        11: [23],
        12: [24, 26, 25],
        13: [27],
        14: [28, 29, 30],
        15: [31],
        16: [32, 34, 33, 36],
        17: [35, 37],
        18: [40, 36, 38],
        19: [39, 41, 40],
        20: [40, 44, 42, 48, 43, 46],
        21: [45],
        22: [48, 46, 47, 49, 50],
        23: [51, 50],
        24: [52, 53, 50, 54],
        25: [55],
        26: [56, 54, 57, 58],
        27: [59],
        28: [58, 60, 62, 61, 64],
        29: [63, 65],
        30: [64, 66, 68, 67, 70],
        31: [69, 71],
        32: [74, 72, 70, 73, 76],
        33: [75],
        34: [80, 78, 76, 82, 77, 74],
        35: [79, 81],
        36: [84, 86, 82, 83, 80, 78],
        37: [85, 87],
        38: [88, 86, 87, 84],
        39: [89],
        40: [90, 94, 92, 91, 96],
        41: [93],
        42: [98, 96, 95, 92, 100, 97, 94],
        44: [102, 104, 101, 99, 100, 96, 98],
        45: [103],
        46: [106, 108, 105, 110, 104, 102],
        47: [107, 109],
        48: [114, 112, 111, 110, 113, 116, 106, 108],
        49: [115, 113],
        50: [120, 118, 116, 119, 117, 124, 122, 112, 114, 115],
        51: [121, 123],
        52: [130, 128, 126, 125, 124, 122, 123, 120],
        53: [127],
        54: [132, 129, 131, 134, 136, 130, 128, 124, 126],
        55: [133],
        56: [138, 137, 136, 135, 134, 132, 130],
        57: [139, 138],
        58: [140, 142, 138, 136],
        59: [141],
        60: [142, 144, 146, 143, 145, 148, 150],
        62: [152, 154, 147, 149, 148, 150, 144],
        63: [153, 151],
        64: [158, 160, 156, 157, 155, 154, 152],
        65: [159],
        66: [164, 162, 163, 161, 160, 158, 156],
        67: [165],
        68: [166, 168, 167, 170, 164, 162],
        69: [169],
        70: [174, 172, 173, 171, 176, 170, 168],
        71: [175, 176],
        72: [180, 178, 177, 179, 176, 174],
        73: [181, 180],
        74: [184, 186, 182, 183, 180],
        75: [187, 185],
        76: [192, 190, 189, 188, 187, 186, 184],
        77: [193, 191],
        78: [195, 194, 196, 198, 192, 190],
        79: [197],
        80: [202, 200, 199, 201, 198, 204, 196],
        81: [205, 203],
        82: [208, 206, 207, 204],
        83: [209],
        90: [232],
        92: [235, 238],
    };

    static synthetic = {
        43: {97: '4.21×10^6 years'},
        61: {145: '17.7 years'},
        84: {209: '125 years'},
        85: {210: '8.1 hours'},
        86: {222: '3.823 days'},
        87: {223: '22 minutes'},
        88: {226: '1,600 years'},
        89: {227: '21.772 years'},
        91: {231: '32,760 years'},
        93: {237: '2.14×10^6 years'},
        94: {244: '8.08×10^7 years'},
        95: {243: '7,370 years'},
        96: {247: '1.56×10^7 years'},
        97: {247: '1,380 years'},
        98: {251: '900 years'},
        99: {252: '1.293 years'},
        100: {257: '100.5 days'},
        101: {258: '51.3 days'},
        102: {259: '58 minutes'},
        103: {266: '11 hours'},
        104: {267: '48 minutes'},
        105: {268: '16 hours'},
        106: {269: '14 minutes'},
        107: {270: '2.4 minutes'},
        108: {269: '16 seconds'},
        109: {278: '4.5 seconds'},
        110: {281: '12.7 seconds'},
        111: {282: '1.7 minutes'},
        112: {285: '28 seconds'},
        113: {286: '9.5 seconds'},
        114: {289: '1.9 seconds'},
        115: {290: '650 ms'},
        116: {293: '57 ms'},
        117: {294: '51 ms'},
        118: {294: '690 μs'},
    };

    static getAll() {
        const all = {};

        for (let protons in Isotopes.primordial) {
            protons = parseInt(protons);
            for (const isotope of Isotopes.primordial[protons]) {
                const neutrons = isotope - protons;
                if (neutrons in all) {
                    all[neutrons].push(protons);
                }
                else {
                    all[neutrons] = [protons];
                }
            }
        }

        for (let protons in Isotopes.synthetic) {
            protons = parseInt(protons);
            for (const isotope in Isotopes.synthetic[protons]) {
                const neutrons = isotope - protons;
                if (neutrons in all) {
                    all[neutrons].push(protons);
                }
                else {
                    all[neutrons] = [protons];
                }
            }
        }

        return all;
    }

    static render() {
        const all = Isotopes.getAll();

        document.title = "Isotopes";

        let html = `<h1>Most Stable Isotopes of Each Element</h1>`;
        html += '<table class="isotopes">';

        for (let neutrons = 177; neutrons >= 0; neutrons--) {
            neutrons = parseInt(neutrons);
            html += '<tr>';

            if (neutrons === 177) {
                html += '<th class="y-axis max" rowspan="19">177</th>';
            }
            else if (neutrons === 158) {
                html += '<th class="y-axis label" rowspan="139">Neutrons</th>';
            }
            else if (neutrons === 19) {
                html += '<th class="y-axis min" rowspan="19">1</th>';
            }
            else if (neutrons === 0) {
                html += `<th class="empty"></th>`;
                html += '<th class="x-axis min" colspan="19">1</th>';
                html += '<th class="x-axis label" colspan="80">Protons</th>';
                html += '<th class="x-axis max" colspan="19">118</th>';
                continue;
            }

            for (let protons = 1; protons < 119; protons++) {
                const elements = all[neutrons];
                const element = Elements.data[protons];
                if (!(neutrons in all) || elements.indexOf(protons) === -1) {
                    const title = `\n\nNeutrons: ${neutrons}`;
                    html += `<td class="empty" title="${title}"></td>`;
                }
                else {
                    const tdClass = (protons in Isotopes.synthetic) ? 'synthetic' : 'primordial';
                    const nucleons = neutrons + protons;
                    const title = `${element.symbol}: ${element.name}\nProtons: ${protons}\nNeutrons: ${neutrons}\nNucleons: ${nucleons}`;
                    const link = `<a href="?protons=${protons}"><span class="link"></span></a>`;
                    html += `<td class="${tdClass}" title="${title}">${link}</td>`;
                }
            }

            html += '</tr>';
        }

        html += '</table>';

        return html;
    }
}

Site.render();
