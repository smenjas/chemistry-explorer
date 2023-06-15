'use strict';

String.prototype.toSpliced = function (start, deleteCount, ...items) {
    return this.split('').toSpliced(start, deleteCount, ...items).join('');
};

class Site {
    static render() {
        const params = new URLSearchParams(window.location.search);
        const molecule = params.get('molecule');
        const formula = params.get('formula');
        const group = params.get('group');
        const period = params.get('period');
        const protons = params.get('protons');
        const view = params.get('view');
        let html = '';

        if (formula) {
            html += Molecules.renderFormula(formula);
        }
        else if (molecule) {
            html += Molecules.renderMolecule(molecule);
        }
        else if (group && Elements.groups.has(parseInt(group))) {
            document.title = `Group ${group}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderGroupNav(group);
            html += Elements.renderGroup(group);
            html += '</main>';
        }
        else if (period && Elements.periods.has(parseInt(period))) {
            document.title = `Period ${period}`;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderPeriodNav(period);
            html += Elements.renderPeriod(period);
            html += '</main>';
        }
        else if (view === 'abundance') {
            html += Elements.renderAbundance();
        }
        else if (view === 'molecules') {
            html += Molecules.render();
        }
        else if (view === 'isotopes') {
            html += Isotopes.render();
        }
        else if (view === 'test') {
            html += Test.render();
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
        1:   { symbol: 'H',  name: 'Hydrogen',      weight:   1.00794, period: 1, group:  1,   block: 's', density:  0.071, melts: -259.3,  boils: -252.9,  crust: 1.40e-3,  type: 'Other Nonmetal' },
        2:   { symbol: 'He', name: 'Helium',        weight:   4.0026,  period: 1, group: 18,   block: 's', density:  0.126, melts: null,    boils: -268.9,  crust:    8e-9,  type: 'Noble Gas' },
        3:   { symbol: 'Li', name: 'Lithium',       weight:   6.939,   period: 2, group:  1,   block: 's', density:  0.53,  melts:  180.6,  boils: 1342,    crust:  2.0e-5,  type: 'Alkali Metal' },
        4:   { symbol: 'Be', name: 'Beryllium',     weight:   9.0122,  period: 2, group:  2,   block: 's', density:  1.85,  melts: 1289,    boils: 2472,    crust:  2.8e-6,  type: 'Alkaline Earth Metal' },
        5:   { symbol: 'B',  name: 'Boron',         weight:  10.811,   period: 2, group: 13,   block: 'p', density:  2.34,  melts: 2092,    boils: 4002,    crust:  1.0e-5,  type: 'Metalloid' },
        6:   { symbol: 'C',  name: 'Carbon',        weight:  12.0111,  period: 2, group: 14,   block: 'p', density:  2.26,  melts: null,    boils: 3827,    crust: 2.00e-4,  type: 'Other Nonmetal' },
        7:   { symbol: 'N',  name: 'Nitrogen',      weight:  14.0067,  period: 2, group: 15,   block: 'p', density:  0.81,  melts: -210,    boils: -195.8,  crust:  1.9e-5,  type: 'Other Nonmetal' },
        8:   { symbol: 'O',  name: 'Oxygen',        weight:  15.9994,  period: 2, group: 16,   block: 'p', density:  1.14,  melts: -218.79, boils: -182.97, crust: 4.61e-1,  type: 'Other Nonmetal' },
        9:   { symbol: 'F',  name: 'Fluorine',      weight:  18.9984,  period: 2, group: 17,   block: 'p', density:  1.11,  melts: -219.6,  boils: -188.1,  crust: 5.85e-4,  type: 'Halogen Nonmetal' },
        10:  { symbol: 'Ne', name: 'Neon',          weight:  20.180,   period: 2, group: 18,   block: 'p', density:  1.20,  melts: -248.6,  boils: -246,    crust:    5e-9,  type: 'Noble Gas' },
        11:  { symbol: 'Na', name: 'Sodium',        weight:  22.9898,  period: 3, group:  1,   block: 's', density:  0.97,  melts:   97.8,  boils:  883,    crust: 2.36e-2,  type: 'Alkali Metal' },
        12:  { symbol: 'Mg', name: 'Magnesium',     weight:  24.305,   period: 3, group:  2,   block: 's', density:  1.74,  melts:  650,    boils: 1090,    crust: 2.33e-2,  type: 'Alkaline Earth Metal' },
        13:  { symbol: 'Al', name: 'Aluminum',      weight:  26.9815,  period: 3, group: 13,   block: 'p', density:  2.70,  melts:  660,    boils: 2520,    crust: 8.23e-2,  type: 'Post Transition Metal' },
        14:  { symbol: 'Si', name: 'Silicon',       weight:  28.086,   period: 3, group: 14,   block: 'p', density:  2.33,  melts: 1414,    boils: 3267,    crust: 2.82e-1,  type: 'Metalloid' },
        15:  { symbol: 'P',  name: 'Phosphorus',    weight:  30.9738,  period: 3, group: 15,   block: 'p', density:  1.82,  melts:   44.1,  boils:  280,    crust: 1.05e-3,  type: 'Other Nonmetal' },
        16:  { symbol: 'S',  name: 'Sulfur',        weight:  32.064,   period: 3, group: 16,   block: 'p', density:  2.07,  melts:  115.2,  boils:  444.7,  crust: 3.50e-4,  type: 'Other Nonmetal' },
        17:  { symbol: 'Cl', name: 'Chlorine',      weight:  35.453,   period: 3, group: 17,   block: 'p', density:  1.56,  melts: -101,    boils:  -33.9,  crust: 1.45e-4,  type: 'Halogen Nonmetal' },
        18:  { symbol: 'Ar', name: 'Argon',         weight:  39.948,   period: 3, group: 18,   block: 'p', density:  1.40,  melts: -189.4,  boils: -185.9,  crust:  3.5e-6,  type: 'Noble Gas' },
        19:  { symbol: 'K',  name: 'Potassium',     weight:  39.098,   period: 4, group:  1,   block: 's', density:  0.86,  melts:   63.7,  boils:  759,    crust: 2.09e-2,  type: 'Alkali Metal' },
        20:  { symbol: 'Ca', name: 'Calcium',       weight:  40.08,    period: 4, group:  2,   block: 's', density:  1.55,  melts:  842,    boils: 1494,    crust: 4.15e-2,  type: 'Alkaline Earth Metal' },
        21:  { symbol: 'Sc', name: 'Scandium',      weight:  44.956,   period: 4, group:  3,   block: 'd', density:  3.0,   melts: 1541,    boils: 2836,    crust:  2.2e-5,  type: 'Transition Metal' },
        22:  { symbol: 'Ti', name: 'Titanium',      weight:  47.90,    period: 4, group:  4,   block: 'd', density:  4.51,  melts: 1670,    boils: 3289,    crust: 5.65e-3,  type: 'Transition Metal' },
        23:  { symbol: 'V',  name: 'Vanadium',      weight:  50.942,   period: 4, group:  5,   block: 'd', density:  6.1,   melts: 1910,    boils: 3409,    crust: 1.20e-4,  type: 'Transition Metal' },
        24:  { symbol: 'Cr', name: 'Chromium',      weight:  51.996,   period: 4, group:  6,   block: 'd', density:  7.19,  melts: 1863,    boils: 2672,    crust: 1.02e-4,  type: 'Transition Metal' },
        25:  { symbol: 'Mn', name: 'Manganese',     weight:  54.938,   period: 4, group:  7,   block: 'd', density:  7.43,  melts: 1246,    boils: 2062,    crust: 9.50e-4,  type: 'Transition Metal' },
        26:  { symbol: 'Fe', name: 'Iron',          weight:  55.847,   period: 4, group:  8,   block: 'd', density:  7.86,  melts: 1538,    boils: 2862,    crust: 5.63e-2,  type: 'Transition Metal' },
        27:  { symbol: 'Co', name: 'Cobalt',        weight:  58.933,   period: 4, group:  9,   block: 'd', density:  8.9,   melts: 1495,    boils: 2928,    crust:  2.5e-5,  type: 'Transition Metal' },
        28:  { symbol: 'Ni', name: 'Nickel',        weight:  58.69,    period: 4, group: 10,   block: 'd', density:  8.9,   melts: 1455,    boils: 2914,    crust:  8.4e-5,  type: 'Transition Metal' },
        29:  { symbol: 'Cu', name: 'Copper',        weight:  63.54,    period: 4, group: 11,   block: 'd', density:  8.96,  melts: 1085,    boils: 2563,    crust:  6.0e-5,  type: 'Transition Metal' },
        30:  { symbol: 'Zn', name: 'Zinc',          weight:  65.37,    period: 4, group: 12,   block: 'd', density:  7.14,  melts:  419.6,  boils:  907,    crust:  7.0e-5,  type: 'Transition Metal' },
        31:  { symbol: 'Ga', name: 'Gallium',       weight:  69.72,    period: 4, group: 13,   block: 'p', density:  5.91,  melts:   29.8,  boils: 2205,    crust:  1.9e-5,  type: 'Post Transition Metal' },
        32:  { symbol: 'Ge', name: 'Germanium',     weight:  72.59,    period: 4, group: 14,   block: 'p', density:  5.32,  melts:  938.4,  boils: 2834,    crust:  1.5e-6,  type: 'Metalloid' },
        33:  { symbol: 'As', name: 'Arsenic',       weight:  74.922,   period: 4, group: 15,   block: 'p', density:  5.72,  melts: null,    boils:  615,    crust:  1.8e-6,  type: 'Metalloid' },
        34:  { symbol: 'Se', name: 'Selenium',      weight:  78.96,    period: 4, group: 16,   block: 'p', density:  4.79,  melts:  221,    boils:  685,    crust:    5e-8,  type: 'Other Nonmetal' },
        35:  { symbol: 'Br', name: 'Bromine',       weight:  79.904,   period: 4, group: 17,   block: 'p', density:  3.12,  melts:   -7.2,  boils:   58.7,  crust:  2.4e-6,  type: 'Halogen Nonmetal' },
        36:  { symbol: 'Kr', name: 'Krypton',       weight:  83.80,    period: 4, group: 18,   block: 'p', density:  2.6,   melts: -157.3,  boils: -153.2,  crust:    1e-10, type: 'Noble Gas' },
        37:  { symbol: 'Rb', name: 'Rubidium',      weight:  85.47,    period: 5, group:  1,   block: 's', density:  1.53,  melts:   39.48, boils:  688,    crust:  9.0e-5,  type: 'Alkali Metal' },
        38:  { symbol: 'Sr', name: 'Strontium',     weight:  87.62,    period: 5, group:  2,   block: 's', density:  2.6,   melts:  769,    boils: 1382,    crust: 3.70e-4,  type: 'Alkaline Earth Metal' },
        39:  { symbol: 'Y',  name: 'Yttrium',       weight:  88.905,   period: 5, group:  3,   block: 'd', density:  4.47,  melts: 1522,    boils: 3338,    crust:  3.3e-5,  type: 'Transition Metal' },
        40:  { symbol: 'Zr', name: 'Zirconium',     weight:  91.22,    period: 5, group:  4,   block: 'd', density:  6.49,  melts: 1855,    boils: 4409,    crust: 1.65e-4,  type: 'Transition Metal' },
        41:  { symbol: 'Nb', name: 'Niobium',       weight:  92.906,   period: 5, group:  5,   block: 'd', density:  8.4,   melts: 2469,    boils: 4744,    crust:  2.0e-5,  type: 'Transition Metal' },
        42:  { symbol: 'Mo', name: 'Molybdenum',    weight:  95.94,    period: 5, group:  6,   block: 'd', density: 10.2,   melts: 2623,    boils: 4639,    crust:  1.2e-6,  type: 'Transition Metal' },
        43:  { symbol: 'Tc', name: 'Technetium',    weight:  99,       period: 5, group:  7,   block: 'd', density: 11.5,   melts: 2204,    boils: 4265,    crust:    0,     type: 'Transition Metal' },
        44:  { symbol: 'Ru', name: 'Ruthenium',     weight: 101.07,    period: 5, group:  8,   block: 'd', density: 12.2,   melts: 2334,    boils: 4150,    crust:    1e-9,  type: 'Transition Metal' },
        45:  { symbol: 'Rh', name: 'Rhodium',       weight: 102.905,   period: 5, group:  9,   block: 'd', density: 12.4,   melts: 1963,    boils: 3697,    crust:    1e-9,  type: 'Transition Metal' },
        46:  { symbol: 'Pd', name: 'Palladium',     weight: 106.4,     period: 5, group: 10,   block: 'd', density: 12.0,   melts: 1555,    boils: 2964,    crust:  1.5e-8,  type: 'Transition Metal' },
        47:  { symbol: 'Ag', name: 'Silver',        weight: 107.870,   period: 5, group: 11,   block: 'd', density: 10.5,   melts:  962,    boils: 2163,    crust:  7.5e-8,  type: 'Transition Metal' },
        48:  { symbol: 'Cd', name: 'Cadmium',       weight: 112.41,    period: 5, group: 12,   block: 'd', density:  2.65,  melts:  321.11, boils:  767,    crust:  1.5e-7,  type: 'Transition Metal' },
        49:  { symbol: 'In', name: 'Indium',        weight: 114.82,    period: 5, group: 13,   block: 'p', density:  7.31,  melts:  157,    boils: 2073,    crust:  2.5e-7,  type: 'Post Transition Metal' },
        50:  { symbol: 'Sn', name: 'Tin',           weight: 118.69,    period: 5, group: 14,   block: 'p', density:  7.30,  melts:  232,    boils: 2603,    crust:  2.3e-6,  type: 'Post Transition Metal' },
        51:  { symbol: 'Sb', name: 'Antimony',      weight: 121.76,    period: 5, group: 15,   block: 'p', density:  6.62,  melts:  630.8,  boils: 1587,    crust:    2e-7,  type: 'Metalloid' },
        52:  { symbol: 'Te', name: 'Tellurium',     weight: 127.60,    period: 5, group: 16,   block: 'p', density:  6.24,  melts:  450,    boils:  988,    crust:    1e-9,  type: 'Metalloid' },
        53:  { symbol: 'I',  name: 'Iodine',        weight: 126.904,   period: 5, group: 17,   block: 'p', density:  4.94,  melts:  113.5,  boils:  184.3,  crust:  4.5e-7,  type: 'Halogen Nonmetal' },
        54:  { symbol: 'Xe', name: 'Xenon',         weight: 131.30,    period: 5, group: 18,   block: 'p', density:  3.06,  melts: -111.8,  boils: -108,    crust:    3e-11, type: 'Noble Gas' },
        55:  { symbol: 'Cs', name: 'Cesium',        weight: 132.905,   period: 6, group:  1,   block: 's', density:  1.90,  melts:   28.4,  boils:  671,    crust:    3e-6,  type: 'Alkali Metal' },
        56:  { symbol: 'Ba', name: 'Barium',        weight: 137.33,    period: 6, group:  2,   block: 's', density:  3.5,   melts:  729,    boils: 1805,    crust: 4.25e-4,  type: 'Alkaline Earth Metal' },
        57:  { symbol: 'La', name: 'Lanthanum',     weight: 138.91,    period: 6, group: null, block: 'f', density:  6.17,  melts:  918,    boils: 3464,    crust:  3.9e-5,  type: 'Lanthanide' },
        58:  { symbol: 'Ce', name: 'Cerium',        weight: 140.12,    period: 6, group: null, block: 'f', density:  6.67,  melts:  798,    boils: 3443,    crust: 6.65e-5,  type: 'Lanthanide' },
        59:  { symbol: 'Pr', name: 'Praseodymium',  weight: 140.907,   period: 6, group: null, block: 'f', density:  6.77,  melts:  931,    boils: 3520,    crust:  9.2e-6,  type: 'Lanthanide' },
        60:  { symbol: 'Nd', name: 'Neodymium',     weight: 144.24,    period: 6, group: null, block: 'f', density:  7.00,  melts: 1021,    boils: 3074,    crust: 4.15e-5,  type: 'Lanthanide' },
        61:  { symbol: 'Pm', name: 'Promethium',    weight: 145,       period: 6, group: null, block: 'f', density: null,   melts: 1042,    boils: 3000,    crust:    0,     type: 'Lanthanide' },
        62:  { symbol: 'Sm', name: 'Samarium',      weight: 150.36,    period: 6, group: null, block: 'f', density:  7.54,  melts: 1074,    boils: 1794,    crust: 7.05e-6,  type: 'Lanthanide' },
        63:  { symbol: 'Eu', name: 'Europium',      weight: 151.964,   period: 6, group: null, block: 'f', density:  5.26,  melts:  822,    boils: 1527,    crust:  2.0e-6,  type: 'Lanthanide' },
        64:  { symbol: 'Gd', name: 'Gadolinium',    weight: 157.25,    period: 6, group: null, block: 'f', density:  7.89,  melts: 1313,    boils: 3273,    crust:  6.2e-6,  type: 'Lanthanide' },
        65:  { symbol: 'Tb', name: 'Terbium',       weight: 158.925,   period: 6, group: null, block: 'f', density:  8.27,  melts: 1356,    boils: 3230,    crust:  1.2e-6,  type: 'Lanthanide' },
        66:  { symbol: 'Dy', name: 'Dysprosium',    weight: 162.50,    period: 6, group: null, block: 'f', density:  8.54,  melts: 1412,    boils: 2567,    crust:  5.2e-6,  type: 'Lanthanide' },
        67:  { symbol: 'Ho', name: 'Holmium',       weight: 164.930,   period: 6, group: null, block: 'f', density:  8.80,  melts: 1474,    boils: 2700,    crust:  1.3e-6,  type: 'Lanthanide' },
        68:  { symbol: 'Er', name: 'Erbium',        weight: 167.259,   period: 6, group: null, block: 'f', density:  9.05,  melts: 1529,    boils: 2868,    crust:  3.5e-6,  type: 'Lanthanide' },
        69:  { symbol: 'Tm', name: 'Thulium',       weight: 168.934,   period: 6, group: null, block: 'f', density:  9.33,  melts: 1545,    boils: 1950,    crust:  5.2e-7,  type: 'Lanthanide' },
        70:  { symbol: 'Yb', name: 'Ytterbium',     weight: 173.054,   period: 6, group: null, block: 'f', density:  6.98,  melts:  819,    boils: 1196,    crust:  3.2e-6,  type: 'Lanthanide' },
        71:  { symbol: 'Lu', name: 'Lutetium',      weight: 174.97,    period: 6, group:  3,   block: 'd', density:  9.84,  melts: 1663,    boils: 3402,    crust:    8e-7,  type: 'Transition Metal' },
        72:  { symbol: 'Hf', name: 'Hafnium',       weight: 178.49,    period: 6, group:  4,   block: 'd', density: 13.1,   melts: 2231,    boils: 4603,    crust:  3.0e-6,  type: 'Transition Metal' },
        73:  { symbol: 'Ta', name: 'Tantalum',      weight: 180.948,   period: 6, group:  5,   block: 'd', density: 16.6,   melts: 3020,    boils: 5458,    crust:  2.0e-6,  type: 'Transition Metal' },
        74:  { symbol: 'W',  name: 'Tungsten',      weight: 183.85,    period: 6, group:  6,   block: 'd', density: 19.3,   melts: 3422,    boils: 5555,    crust: 1.25e-6,  type: 'Transition Metal' },
        75:  { symbol: 'Re', name: 'Rhenium',       weight: 186.2,     period: 6, group:  7,   block: 'd', density: 21.0,   melts: 3186,    boils: 5596,    crust:    7e-10, type: 'Transition Metal' },
        76:  { symbol: 'Os', name: 'Osmium',        weight: 190.2,     period: 6, group:  8,   block: 'd', density: 22.6,   melts: 3033,    boils: 5012,    crust:  1.5e-9,  type: 'Transition Metal' },
        77:  { symbol: 'Ir', name: 'Iridium',       weight: 192.2,     period: 6, group:  9,   block: 'd', density: 22.5,   melts: 2447,    boils: 4428,    crust:    1e-9,  type: 'Transition Metal' },
        78:  { symbol: 'Pt', name: 'Platinum',      weight: 195.09,    period: 6, group: 10,   block: 'd', density: 21.4,   melts: 1769,    boils: 3827,    crust:    5e-9,  type: 'Transition Metal' },
        79:  { symbol: 'Au', name: 'Gold',          weight: 196.967,   period: 6, group: 11,   block: 'd', density: 19.3,   melts: 1064.4,  boils: 2857,    crust:    4e-9,  type: 'Transition Metal' },
        80:  { symbol: 'Hg', name: 'Mercury',       weight: 200.59,    period: 6, group: 12,   block: 'd', density: 13.6,   melts:  -38.8,  boils:  357,    crust:  8.5e-8,  type: 'Transition Metal' },
        81:  { symbol: 'Tl', name: 'Thallium',      weight: 204.38,    period: 6, group: 13,   block: 'p', density: 11.85,  melts:  304,    boils: 1473,    crust:  8.5e-7,  type: 'Post Transition Metal' },
        82:  { symbol: 'Pb', name: 'Lead',          weight: 207.19,    period: 6, group: 14,   block: 'p', density: 11.4,   melts:  327.5,  boils: 1750,    crust:  1.4e-5,  type: 'Post Transition Metal' },
        83:  { symbol: 'Bi', name: 'Bismuth',       weight: 208.980,   period: 6, group: 15,   block: 'p', density:  9.8,   melts:  271.4,  boils: 1564,    crust:  8.5e-9,  type: 'Post Transition Metal' },
        84:  { symbol: 'Po', name: 'Polonium',      weight: 209,       period: 6, group: 16,   block: 'p', density:  9.2,   melts:  254,    boils: null,    crust:    2e-16, type: 'Post Transition Metal' },
        85:  { symbol: 'At', name: 'Astatine',      weight: 210,       period: 6, group: 17,   block: 'p', density: null,   melts:  302,    boils: null,    crust:    0,     type: 'Metalloid' },
        86:  { symbol: 'Rn', name: 'Radon',         weight: 222,       period: 6, group: 18,   block: 'p', density: null,   melts:  -71,    boils:  -61.7,  crust:    4e-19, type: 'Noble Gas' },
        87:  { symbol: 'Fr', name: 'Francium',      weight: 223,       period: 7, group:  1,   block: 's', density: null,   melts:   27,    boils: null,    crust:    0,     type: 'Alkali Metal' },
        88:  { symbol: 'Ra', name: 'Radium',        weight: 226,       period: 7, group:  2,   block: 's', density:  5.0,   melts:  700,    boils: null,    crust:    9e-13, type: 'Alkaline Earth Metal' },
        89:  { symbol: 'Ac', name: 'Actinium',      weight: 227,       period: 7, group:  3,   block: 'd', density: null,   melts: 1051,    boils: 3200,    crust:  5.5e-16, type: 'Actinide' },
        90:  { symbol: 'Th', name: 'Thorium',       weight: 232.038,   period: 7, group: null, block: 'f', density: 11.7,   melts: 1755,    boils: 4788,    crust:  9.6e-6,  type: 'Actinide' },
        91:  { symbol: 'Pa', name: 'Protactinium',  weight: 231.035,   period: 7, group: null, block: 'f', density: 15.4,   melts: 1572,    boils: null,    crust:  1.4e-12, type: 'Actinide' },
        92:  { symbol: 'U',  name: 'Uranium',       weight: 238.028,   period: 7, group: null, block: 'f', density: 19.07,  melts: 1135,    boils: 4134,    crust:  2.7e-6,  type: 'Actinide' },
        93:  { symbol: 'Np', name: 'Neptunium',     weight: 237,       period: 7, group: null, block: 'f', density: 19.5,   melts:  639,    boils: null,    crust:    0,     type: 'Actinide' },
        94:  { symbol: 'Pu', name: 'Plutonium',     weight: 244,       period: 7, group: null, block: 'f', density: null,   melts:  640,    boils: 3230,    crust:    0,     type: 'Actinide' },
        95:  { symbol: 'Am', name: 'Americium',     weight: 243,       period: 7, group: null, block: 'f', density: null,   melts: 1176,    boils: null,    crust:    0,     type: 'Actinide' },
        96:  { symbol: 'Cm', name: 'Curium',        weight: 247,       period: 7, group: null, block: 'f', density: null,   melts: 1345,    boils: null,    crust:    0,     type: 'Actinide' },
        97:  { symbol: 'Bk', name: 'Berkelium',     weight: 247,       period: 7, group: null, block: 'f', density: null,   melts: 1050,    boils: null,    crust:    0,     type: 'Actinide' },
        98:  { symbol: 'Cf', name: 'Californium',   weight: 251,       period: 7, group: null, block: 'f', density: null,   melts:  900,    boils: null,    crust:    0,     type: 'Actinide' },
        99:  { symbol: 'Es', name: 'Einsteinium',   weight: 252,       period: 7, group: null, block: 'f', density: null,   melts:  860,    boils: null,    crust:    0,     type: 'Actinide' },
        100: { symbol: 'Fm', name: 'Fermium',       weight: 257,       period: 7, group: null, block: 'f', density: null,   melts: 1527,    boils: null,    crust:    0,     type: 'Actinide' },
        101: { symbol: 'Md', name: 'Mendelevium',   weight: 258,       period: 7, group: null, block: 'f', density: null,   melts:  827,    boils: null,    crust:    0,     type: 'Actinide' },
        102: { symbol: 'No', name: 'Nobelium',      weight: 259,       period: 7, group: null, block: 'f', density: null,   melts:  827,    boils: null,    crust:    0,     type: 'Actinide' },
        103: { symbol: 'Lr', name: 'Lawrencium',    weight: 262,       period: 7, group:  3,   block: 'd', density: null,   melts: 1627,    boils: null,    crust:    0,     type: 'Transition Metal' },
        104: { symbol: 'Rf', name: 'Rutherfordium', weight: 267,       period: 7, group:  4,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        105: { symbol: 'Db', name: 'Dubnium',       weight: 268,       period: 7, group:  5,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        106: { symbol: 'Sg', name: 'Seaborgium',    weight: 271,       period: 7, group:  6,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        107: { symbol: 'Bh', name: 'Bohrium',       weight: 272,       period: 7, group:  7,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        108: { symbol: 'Hs', name: 'Hassium',       weight: 270,       period: 7, group:  8,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        109: { symbol: 'Mt', name: 'Meitnerium',    weight: 276,       period: 7, group:  9,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        110: { symbol: 'Ds', name: 'Darmstadtium',  weight: 281,       period: 7, group: 10,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        111: { symbol: 'Rg', name: 'Roentgenium',   weight: 280,       period: 7, group: 11,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        112: { symbol: 'Cn', name: 'Copernicium',   weight: 285,       period: 7, group: 12,   block: 'd', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Transition Metal' },
        113: { symbol: 'Nh', name: 'Nihonium',      weight: 284,       period: 7, group: 13,   block: 'p', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Post Transition Metal' },
        114: { symbol: 'Fl', name: 'Flerovium',     weight: 289,       period: 7, group: 14,   block: 'p', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Post Transition Metal' },
        115: { symbol: 'Mc', name: 'Moscovium',     weight: 288,       period: 7, group: 15,   block: 'p', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Post Transition Metal' },
        116: { symbol: 'Lv', name: 'Livermorium',   weight: 293,       period: 7, group: 16,   block: 'p', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Post Transition Metal' },
        117: { symbol: 'Ts', name: 'Tennessine',    weight: 294,       period: 7, group: 17,   block: 'p', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Post Transition Metal' },
        118: { symbol: 'Og', name: 'Oganesson',     weight: 294,       period: 7, group: 18,   block: 'p', density: null,   melts: null,    boils: null,    crust:    0,     type: 'Noble Gas' },
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
    };

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
        periods.set('lanthanides', { min: 57, max: 70 });
        periods.set('actinides', { min: 89, max: 102 });
        return periods;
    }

    static symbols = Elements.#getSymbols();
    static #getSymbols() {
        const symbols = {};
        for (const protons in Elements.data) {
            const element = Elements.data[protons];
            symbols[element.symbol] = parseInt(protons);
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

    static compare(symbolA, symbolB) {
        const a = Elements.findProtons(symbolA);
        const b = Elements.findProtons(symbolB);
        return a - b;
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
        return Elements.symbols[symbol] ?? 0;
    }

    static fixFloat(number) {
        let [integer, decimal, exponent] = number.toString().split(/[.e]/);
        if (decimal === undefined) {
            return number;
        }

        const zeros = decimal.indexOf('00000');
        if (zeros !== -1) {
            decimal = decimal.substring(0, zeros);
        }

        const nines = decimal.indexOf('99999');
        if (nines === 0) {
            integer = `${parseInt(integer) + 1}`;
            decimal = '';
        }
        else if (nines !== -1) {
            decimal = decimal.substring(0, nines);
            const lastDigit = parseInt(decimal.at(-1)) + 1;
            decimal = decimal.substring(0, decimal.length - 1) + lastDigit.toString();
        }

        if (zeros === -1 && nines === -1) {
            return number;
        }

        let string = integer;
        if (decimal.length > 0) {
            string += `.${decimal}`;
        }
        if (exponent !== undefined) {
            string += `e${exponent}`;
        }
        const f = parseFloat(string);
        return f;
    }

    static formatAbundance(abundance) {
        if (abundance === 0) {
            return '0';
        }

        if (abundance < 1e-12) {
            const ppq = Elements.fixFloat(abundance * 1e15);
            return `<span title="${abundance}">${ppq}</span> <abbr title="parts per quadrillion">ppq</abbr>`;
        }

        if (abundance < 1e-9) {
            const ppt = Elements.fixFloat(abundance * 1e12);
            return `<span title="${abundance}">${ppt}</span> <abbr title="parts per trillion">ppt</abbr>`;
        }

        if (abundance < 1e-6) {
            const ppb = Elements.fixFloat(abundance * 1e9);
            return `<span title="${abundance}">${ppb}</span> <abbr title="parts per billion">ppb</abbr>`;
        }

        if (abundance < 1e-3) {
            const ppm = Elements.fixFloat(abundance * 1e6);
            return `<span title="${abundance}">${ppm}</span> <abbr title="parts per million">ppm</abbr>`;
        }

        const percent = Elements.fixFloat(abundance * 100);
        return `<span title="${abundance}">${percent}%</span>`;
    }

    static formatCelsius(temperature) {
        return (temperature) ? `${temperature} °C` : 'Unknown';
    }

    static formatDensity(density) {
        // The element data use grams per cubic centimeter for density.
        // See: https://en.wikipedia.org/wiki/Density#Unit
        return (density) ? `${density} g/cm<sup>3</sup>` : 'Unknown';
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
        return value.replace(/\^(\d+)/g, '<sup>$1</sup>');
    }

    static formatWeight(weight) {
        return (weight.toString().indexOf('.') === -1) ? `(${weight})` : `${weight}`;
    }

    static linkBlock(block = null) {
        // All elements have a block, so if block is null, link to the Block
        // page instead of a specific block.
        const blockPath = 'Block_(periodic_table)';
        if (!block) {
            return Link.toWikipedia(blockPath, 'Block');
        }
        return Link.toWikipedia(`${blockPath}#${block}-block`, `${block}-block`);
    }

    static linkGroup(group) {
        // Lanthanides & actinides don't belong to a group, so don't link those.
        if (!group) {
            return 'None';
        }
        const groupURL = Elements.groupURLs[group];
        return Link.create(groupURL, group, true);
    }

    static linkPeriod(period) {
        // All elements have a period, so if period is null, link to the Period
        // page instead of a specific period.
        const periodPath = 'Period_(periodic_table)';
        if (!period) {
            return Link.toWikipedia(periodPath, 'Period');
        }
        return Link.toWikipedia(`${periodPath}#Period_${period}`, period);
    }

    static render(protons = null) {
        const element = Elements.data[protons];
        let html = '';

        if (protons && !element) {
            console.warn('Unknown element with atomic number:', protons);
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
            document.title = 'Periodic Table of the Elements';
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
            html += Elements.renderElements();
            html += '</main>';
        }

        return html;
    }

    static calculateBarWidth(value, max, log = true) {
        if (value === 0) {
            return 0;
        }
        if (!log) {
            return value / max;
        }
        return 1 / (Math.log(value) / Math.log(max));
    }

    static handleAbundanceScale(log) {
        document.body.innerHTML = '';
        const html = Elements.renderAbundance(log);
        document.body.insertAdjacentHTML('beforeend', html);
        document.querySelector('#scale-linear').checked = !log;
        document.querySelector('#scale-log').checked = log;
    }

    static renderAbundance(log = true) {
        console.time('abundance-chart');
        let max = 0;
        let min = 1;
        for (const protons in Elements.data) {
            const element = Elements.data[protons];
            const abundance = element.crust;
            if (abundance > max) {
                max = abundance;
            }
            if (abundance > 0 && abundance < min) {
                min = abundance;
            }
        }

        document.title = 'Abundance of Elements in Earth\'s Crust';

        let html = `<h1>${document.title}</h1>`;
        html += '<form id="abundance-scale">';
        html += '<input id="scale-linear" type="radio" name="scale" value="linear" onchange="Elements.handleAbundanceScale(false)">';
        html += '<label for="scale-linear">linear</label>';
        html += '<input id="scale-log" type="radio" name="scale" value="log" onchange="Elements.handleAbundanceScale(true)" checked>';
        html += '<label for="scale-log">logarithmic</label>';
        html += '</form>';
        html += '<section class="abundance-chart">';
        for (const protons in Elements.data) {
            const element = Elements.data[protons];
            const abundance = element.crust;
            const width = Elements.calculateBarWidth(abundance, max, log);
            const percent = (width * 100).toFixed(1);
            const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
            const minWidth = (abundance === 0) ? '3rem' : '7rem';
            html += `<div class="${typeClass}" style="width: calc(${percent}% + ${minWidth})">`;
            html += `<a href="?protons=${protons}" title="${element.name}">`;
            html += `${element.symbol}: ${Elements.formatAbundance(abundance)}`;
            html += '<span class="link"></span></a></div>';
        }
        html += '</section>';
        console.timeEnd('abundance-chart');

        return html;
    }

    static renderPeriodRow(cells, period) {
        const thLink = `<a href="?period=${period}">${period}<span class="link"></span></a>`;
        const th = `<th title="Period ${period}">${thLink}</th>`;
        return `<tr>${th}${cells}${th}</tr>`;
    }

    static renderElements() {
        let html = '<section>';
        html += '<table class="all elements"><thead><tr>';
        html += '<th class="empty"></th>';

        for (const [group, oldgroup] of Elements.groups) {
            const title = `Group ${group} (formerly ${oldgroup})`;
            const link = `<a href="?group=${group}">${group}<br>${oldgroup}<span class="link"></span></a>`;
            html += `<th class="group group-${group}" title="${title}">${link}</th>`;
        }

        html += '<th class="empty"></th>';
        html += '</tr></thead><tbody>';

        for (const [period, bounds] of Elements.periods) {
            const min = bounds['min'];
            const max = bounds['max'];
            let cells = '';

            for (let protons = min; protons <= max;) {
                if (protons === 2) {
                    // Skip gaps in period 1.
                    // Work around a colspan border rendering bug in Safari.
                    // See: https://bugs.webkit.org/show_bug.cgi?id=20840
                    cells += '<td class="empty"></td>';
                    cells += '<td class="empty" colspan="10"></td>';
                    cells += '<td class="empty" colspan="5"></td>';
                }
                else if (protons === 5 || protons === 13) {
                    // Skip gaps in periods 2 & 3.
                    cells += '<td class="empty" colspan="10"></td>';
                }
                else if (period === 6 && protons === Elements.periods.get('lanthanides').min) {
                    // Skip the lanthanides.
                    protons = Elements.periods.get('lanthanides').max + 1;
                }
                else if (period === 7 && protons === Elements.periods.get('actinides').min) {
                    // Skip the actinides.
                    protons = Elements.periods.get('actinides').max + 1;
                }

                cells += `<td>${Elements.formatElement(protons, true)}</td>`;
                protons++;
            }

            html += Elements.renderPeriodRow(cells, period);

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
            let cells = '';

            for (let protons = min; protons <= max;) {
                cells += `<td>${Elements.formatElement(protons, true)}</td>`;
                protons++;
            }

            const period = (category === 'lanthanides') ? 6 : 7;
            html += Elements.renderPeriodRow(cells, period);
        }

        html += '</tbody></table>';
        html += '</section>';

        html += Elements.renderElementsNav();

        return html;
    }

    static renderElementsNav() {
        let html = '<nav>';
        html += '<a href="?view=abundance">Abundance</a> ';
        html += '<a href="?view=isotopes">Isotopes</a>';
        html += '<a href="?view=molecules">Molecules</a> ';
        html += '</nav>';

        return html;
    }

    static renderElement(protons) {
        const element = Elements.data[protons];

        let html = '<section class="element">';
        html += Elements.formatElement(protons, false);

        const crustLink = Link.toWikipedia('Abundances_of_the_elements_(data_page)', 'Abundance');

        html += '<aside>';
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${element.name}#History`, 'Name')}: ${element.name}</li>`;
        html += `<li>${Link.toWikipedia('Chemical_symbol', 'Symbol')}: ${element.symbol}</li>`;
        html += `<li>${Link.toWikipedia('Atomic_number', 'Atomic Number')}: ${protons}</li>`;
        html += `<li>${Link.toWikipedia('Standard_atomic_weight', 'Weight')}: ${element.weight}</li>`;
        html += `<li>${Link.toWikipedia('Density', 'Density')}: ${Elements.formatDensity(element.density)}</li>`;
        html += `<li>${Elements.linkBlock()}: ${Elements.linkBlock(element.block)}</li>`;
        html += `<li>${Link.toWikipedia('Group_(periodic_table)', 'Group')}: ${Elements.linkGroup(element.group)}</li>`;
        html += `<li>${Elements.linkPeriod()}: ${Elements.linkPeriod(element.period)}</li>`;
        html += `<li>${Link.toWikipedia('Melting_point', 'Melting Point')}: ${Elements.formatCelsius(element.melts)}</li>`;
        html += `<li>${Link.toWikipedia('Boiling_point', 'Boiling Point')}: ${Elements.formatCelsius(element.boils)}</li>`;
        html += `<li>${crustLink}: ${Elements.formatAbundance(element.crust)}</li>`;
        html += `<li>Type: ${Link.create(Elements.typeURLs[element.type], element.type, true)}</li>`;
        html += '</ul>';

        html += '<ul>';
        html += `<li>${Link.toWikipedia(element.name, 'More info on Wikipedia')}</a></li>`;
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
            const syntheticElement = Link.toWikipedia('Synthetic_element', 'synthetic element');
            html += `<p>${element.name} is a ${syntheticElement}. Its longest
            lived isotope, ${isotopeName}, has a half-life of ${time}.</p>`;
        }

        html += '</section>';
        html += '<section class="molecules">';
        html += '<h2>Molecules</h2>';

        const compoundsPath = (protons < 103) ? `${element.name}_compounds` : `${element.name}#Chemical`;
        html += '<ul>';
        html += `<li>${Link.toWikipedia(`${compoundsPath}`, `Wikipedia: ${element.name} compounds`)}</li>`;
        if (protons < 100) {
            html += `<li>${Link.toWikipedia(`Category:${compoundsPath}`, `Wikipedia: Category: ${element.name} compounds`)}</li>`;
        }
        html += '</ul>';

        if (element.type === 'Noble Gas') {
            const nobleGasCompoundsLink = Link.toWikipedia('Noble_gas_compound', 'Noble gas compounds');
            html += `<p>${nobleGasCompoundsLink} do not form easily. Although
            not impossible, it usually requires very low temperatures, high
            pressures, or both.</p>`;
        }

        html += Molecules.renderList(element.symbol);
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

    static renderElementHighlights(element) {
        let html = `Density: ${Elements.formatDensity(element.density, true)}`;
        html += `<br>Melting Point: ${Elements.formatCelsius(element.melts)}`;
        html += `<br>Boiling Point: ${Elements.formatCelsius(element.boils)}`;
        html += `<br>Abundance: ${Elements.formatAbundance(element.crust)}`;
        return html;
    }

    static renderGroup(group) {
        if (!(group in Elements.groupElements)) {
            return '';
        }

        let html = '<table class="elements group"><tbody>';
        const elements = Elements.groupElements[group];
        for (const protons of elements) {
            const element = Elements.data[protons];
            html += '<tr>';
            html += `<td>${Elements.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">${Elements.renderElementHighlights(element)}</td>`;
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
        for (let protons = min; protons <= max; protons++) {
            const element = Elements.data[protons];
            html += '<tr>';
            html += `<td>${Elements.formatElement(protons, true)}</td>`;
            html += `<td class="element-data">${Elements.renderElementHighlights(element)}</td>`;
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

class Molecules {
    static data = {
        HBO: ['Oxoborane'],
        HBF4: ['Fluoroboric acid'],
        HCN: ['Hydrogen cyanide'],
        HNCO: ['Isocyanic acid'],
        HN: ['Imidogen'],
        HNO: ['Nitroxyl'],
        HNO2: ['Nitrous acid'],
        HNO3: ['Nitric acid'],
        HN3: ['Hydrazoic acid'],
        HOF: ['Hypofluorous acid'],
        HClO: ['Hypochlorous acid'],
        HOBr: ['Hypobromous acid'],
        HIO: ['Hypoiodous acid'],
        HClO2: ['Chlorous acid'],
        HBrO2: ['Bromous acid'],
        HIO2: ['Iodous acid'],
        HSbF6SO3: ['Magic acid'],
        HClO3: ['Chloric acid'],
        HIO3: ['Iodic acid'],
        HClO4: ['Perchloric acid'],
        HMnO4: ['Permanganic acid'],
        HTcO4: ['Pertechnetic acid'],
        HIO4: ['Metaperiodic acid'],
        HReO4: ['Perrhenic acid'],
        HF: ['Hydrogen fluoride'],
        HArF: ['Argon fluorohydride'],
        HPF6: ['Hexafluorophosphoric acid'],
        HAsF6: ['Hexafluoroarsenic acid'],
        HCl: ['Hydrogen chloride'],
        HAuCl4: ['Chloroauric acid'],
        HBr: ['Hydrogen bromide'],
        HI: ['Hydrogen iodide'],
        HAt: ['Hydrogen astatide'],
        H2: ['Dihydrogen'],
        H2CO3: ['Carbonic acid'],
        H2N2: ['Diimide'],
        H2N2O2: ['Hyponitrous acid'],
        H2O: ['Water'],
        H2O2: ['Hydrogen peroxide'],
        H2O2Si: ['Oxosilanol'],
        H2O2S2: ['Thiosulfurous acid'],
        H2O3: ['Trioxidane'],
        H2SiO3: ['Metasilicic acid'],
        H2SO3: ['Sulfurous acid'],
        H2S2O3: ['Thiosulfuric acid'],
        H2TiO3: ['Metatitanic acid'],
        H2SeO3: ['Selenous acid'],
        H2TeO3: ['Tellurous acid'],
        H2SO4: ['Sulfuric acid'],
        H2S2O4: ['Dithionous acid'],
        H2TiO4: ['Pertitanic acid'],
        H2CrO4: ['Chromic acid'],
        H2SeO4: ['Selenic acid'],
        H2XeO4: ['Xenic acid'],
        H2WO4: ['Tungstic acid'],
        H2Si2O5: ['Disilicic acid'],
        H2S2O6: ['Dithionic acid'],
        H2O7S2: ['Disulfuric acid'],
        H2Cr2O7: ['Chromic acid'],
        H2O8S2: ['Peroxydisulfuric acid'],
        H2SbF7: ['Fluoroantimonic acid'],
        H2S: ['Hydrogen sulfide'],
        H2Se: ['Hydrogen selenide'],
        H2Te: ['Hydrogen telluride'],
        H3N3: ['Triazene'],
        H3PO2: ['Hypophosphorous acid'],
        H3PO3: ['Phosphorous acid'],
        H3AsO3: ['Arsenous acid', 'Arsonic acid'],
        H3PO4: ['Phosphoric acid'],
        H3AsO4: ['Arsenic acid'],
        H3PW12O40: ['Phosphotungstic acid'],
        H4N2O4: ['Nitroxylic acid'],
        H4N4: ['Ammonium azide', 'Tetrazene'],
        H4SiO4: ['Orthosilicic acid'],
        H4TiO4: ['Orthotitanic acid'],
        H4TiO5: ['Peroxotitanic acid'],
        H4XeO6: ['Perxenic acid'],
        H4Re2O9: ['Perrhenic acid'],
        H5N3: ['Triazane'],
        H5N5: ['Hydrazinium azide'],
        H5IO6: ['Orthoperiodic acid'],
        H6Cl6O2Pt: ['Chloroplatinic acid'],
        H6Si2O7: ['Pyrosilicic acid'],
        H12N8NiO6: ['Nickel hydrazine nitrate'],
        H18N6Cl3Co: ['Hexamminecobalt(III) chloride'],
        H20N4S4O18Ce: ['Ammonium cerium(IV) sulfate'],

        HeLi: ['Lithium helium'],

        LiH: ['Lithium hydride'],
        LiOH: ['Lithium hydroxide'],
        LiNH2: ['Lithium amide'],
        LiBH4: ['Lithium borohydride'],
        LiAlH4: ['Lithium aluminum hydride'],
        LiGaH4: ['Lithium tetrahydridogallate'],
        LiC9H18N: ['Lithium tetramethylpiperidide'],
        LiBO2: ['Lithium metaborate'],
        LiB3O5: ['Lithium triborate'],
        LiCN: ['Lithium cyanide'],
        LiSCN: ['Lithium thiocyanate'],
        LiNO2: ['Lithium nitrite'],
        LiNaNO2: ['Lithium sodium nitroxylate'],
        LiNO3: ['Lithium nitrate'],
        LiClO: ['Lithium hypochlorite'],
        LiCoO: ['Lithium cobalt oxide'],
        LiClO3: ['Lithium chlorate'],
        LiNbO3: ['Lithium niobate'],
        LiIO3: ['Lithium iodate'],
        LiTaO3: ['Lithium tantalate'],
        LiFePO4: ['Lithium iron phosphate'],
        LiClO4: ['Lithium perchlorate'],
        LiTi2P3O12: ['Lithium titanium phosphate'],
        LiGe2P3O12: ['Lithium germanium phosphate'],
        LiZr2P3O12: ['Lithium zirconium phosphate'],
        LiF: ['Lithium fluoride'],
        LiYF4: ['Yttrium lithium fluoride'],
        LiPF6: ['Lithium hexafluorophosphate'],
        LiCl: ['Lithium chloride'],
        LiBr: ['Lithium bromide'],
        LiTe3: ['Lithium tritelluride'],
        LiI: ['Lithium iodide'],
        Li2NH: ['Lithium imide'],
        Li2BeF4: ['FLiBe'],
        Li2B4O7: ['Lithium borate'],
        Li2CO3: ['Lithium carbonate'],
        Li2C2: ['Lithium carbide'],
        Li2O: ['Lithium oxide'],
        Li2O2: ['Lithium peroxide'],
        Li2SiO3: ['Lithium metasilicate'],
        Li2SO3: ['Lithium sulfite'],
        Li2TiO3: ['Lithium titanate'],
        Li2RuO3: ['Lithium ruthenate'],
        Li2TeO3: ['Lithium tellurite'],
        Li2IrO3: ['Lithium iridate'],
        Li2PtO3: ['Lithium platinate'],
        Li2SO4: ['Lithium sulfate'],
        Li2MoO4: ['Lithium molybdate'],
        Li2WO4: ['Lithium tungstate'],
        Li2O5Si2: ['Lithium disilicate'],
        Li2S: ['Lithium sulfide'],
        Li2Se: ['Lithium selenide'],
        Li2Te: ['Lithium telluride'],
        Li2Po: ['Lithium polonide'],
        Li3C6H5O7: ['Lithium citrate'],
        Li3N: ['Lithium nitride'],
        Li3P: ['Lithium phosphide'],
        Li4O4Si: ['Lithium orthosilicate'],
        Li7La3Zr2O12: ['Lithium lanthanum zirconium oxide'],

        BeH: ['Beryllium monohydride'],
        BeH2: ['Beryllium hydride'],
        BeH2O2: ['Beryllium hydroxide'],
        BeB2H8: ['Beryllium borohydride'],
        BeCO3: ['Beryllium carbonate'],
        BeN2O6: ['Beryllium nitrate'],
        BeN6: ['Beryllium azide'],
        BeO: ['Beryllium oxide'],
        BeSO4: ['Beryllium sulfate'],
        BeCrO4: ['Beryllium chromate'],
        BeF2: ['Beryllium fluoride'],
        BeS: ['Beryllium sulfide'],
        BeCl2: ['Beryllium chloride'],
        BeBr2: ['Beryllium bromide'],
        BeTe: ['Beryllium telluride'],
        BeI2: ['Beryllium iodide'],
        Be2C: ['Beryllium carbide'],
        Be3N2: ['Beryllium nitride'],

        BH: ['Boron monohydride'],
        BH2N: ['Iminoborane'],
        BH3: ['Borane'],
        BH3O: ['Borinic acid'],
        BH3O3: ['Boric acid'],
        BNH6: ['Ammonia borane'],
        BN: ['Boron nitride'],
        BN9: ['Boron triazide'],
        BN17: ['Pentazenium tetraazidoborate'],
        BFO: ['Boron monofluoride monoxide'],
        BPO4: ['Boron phosphate'],
        BF: ['Boron monofluoride'],
        BF3: ['Boron trifluoride'],
        BP: ['Boron phosphide'],
        BCl3: ['Boron trichloride'],
        BAs: ['Boron arsenide'],
        BBr3: ['Boron tribromide'],
        BI3: ['Boron triiodide'],
        B2: ['Diboron'],
        B2H2: ['Diborane(2)'],
        B2H4: ['Diborane(4)'],
        B2H4O4: ['Tetrahydroxydiboron'],
        B2H6: ['Diborane'],
        B2H8P2: ['Diphosphadiboretanes'],
        B2O: ['Boron monoxide'],
        B2O3: ['Boron trioxide'],
        B2F4: ['Diboron tetrafluoride'],
        B2S3: ['Boron sulfide'],
        B2Cl4: ['Diboron tetrachloride'],
        B3H3O3: ['Boroxine'],
        B3H3O6: ['Metaboric acid'],
        B3H6N3: ['Borazine'],
        B4H2O7: ['Tetraboric acid'],
        B4H8N4: ['Borazocine'],
        B4H10: ['Tetraborane'],
        B4C: ['Boron carbide'],
        B5H9: ['Pentaborane(9)'],
        B5H11: ['Pentaborane(11)'],
        B6H10: ['Hexaborane(10)'],
        B6H12: ['Hexaborane(12)'],
        B6O: ['Boron suboxide'],
        B6O18Zn9: ['Zinc borate'],
        B9H22Na2O20: ['Disodium enneaborate'],
        B10H14: ['Decaborane'],
        B12: ['Dodecaboron'],
        B12H12Cs2: ['Cesium dodecaborate'],
        B18H22: ['Octadecaborane'],

        C: ['Carbon black', 'Diamond', 'Graphene', 'Graphite'],
        CHLiO3: ['Lithium bicarbonate'],
        CHN5: ['Pentazine'],
        CHN9: ['Triazidomethane'],
        CHO2Na: ['Sodium formate'],
        CHClO2: ['Chloroformic acid'],
        CF3SO3H: ['Triflic acid'],
        CHCl2F: ['Dichlorofluoromethane'],
        CHClF2: ['Chlorodifluoromethane'],
        CHBrF2: ['Bromodifluoromethane'],
        CHF3: ['Fluoroform'],
        CHCl3: ['Chloroform'],
        CHBr3: ['Bromoform'],
        CHI3: ['Iodoform'],
        CH2N2: ['Cyanamide', 'Diazirine', 'Diazomethane'],
        CH2N4: ['Tetrazole'],
        CH2O: ['Formaldehyde'],
        CH2OS: ['Sulfine'],
        CH2O2: ['Dioxirane', 'Formic acid'],
        CH2ClF: ['Chlorofluoromethane'],
        CH2F2: ['Difluoromethane'],
        CH2BrCl: ['Bromochloromethane'],
        CH2Cl2: ['Dichloromethane'],
        CH2Br2: ['Dibromomethane'],
        CH2I2: ['Diiodomethane'],
        CH3Li: ['Methyllithium'],
        CH3BO: ['Borane carbonyl'],
        CH3NO: ['Formamide', 'Oxaziridine'],
        CH3N3: ['Methyl azide'],
        CH3N3O2: ['Nitrosourea'],
        CH3NaO: ['Sodium methoxide'],
        CH3FO3S: ['Methyl fluorosulfonate'],
        CH3NaO3S: ['Rongalite'],
        CH3AsO3Na2: ['Disodium methyl arsonate'],
        CH3ReO3: ['Methylrhenium trioxide'],
        CH3O5P: ['Foscarnet'],
        CH3NaS: ['Sodium methanethiolate'],
        CH3MgCl: ['Methylmagnesium chloride'],
        CH3Cl: ['Chloromethane'],
        CH3Br: ['Bromomethane'],
        CH3I: ['Iodomethane'],
        CH3Hg: ['Methylmercury'],
        CH4: ['Methane'],
        CH4N2: ['Diaziridine'],
        CH4N2O: ['Urea', 'Ammonium carbamate'],
        CH4N2O2: ['Hydroxycarbamide'],
        CH4N2S: ['Ammonium thiocyanate', 'Thiourea'],
        CH4O: ['Methanol'],
        CH4AsNaO3: ['Monosodium methyl arsonate'],
        CH4S: ['Methanethiol'],
        CH5N: ['Methylamine'],
        CH5NO: ['Aminomethanol'],
        CH5NO2: ['Ammonium formate'],
        CH5NO3: ['Ammonium bicarbonate'],
        CH5N3: ['Guanidine'],
        CH5N3S: ['Thiosemicarbazide'],
        CH8N2O3: ['Ammonium carbonate'],
        CFN: ['Cyanogen fluoride'],
        CNCl: ['Cyanogen chloride'],
        CN4: ['Cyanogen azide'],
        CN12: ['Tetraazidomethane'],
        CO: ['Carbon monoxide'],
        COCl2: ['Phosgene'],
        CO2: ['Carbon dioxide'],
        CF3NaO2S: ['Sodium trifluoromethanesulfinate'],
        CBr3F: ['Tribromofluoromethane'],
        CF2: ['Difluorocarbene'],
        CBrClF2: ['Bromochlorodifluoromethane'],
        CCl2F2: ['Dichlorodifluoromethane'],
        CBr2F2: ['Dibromodifluoromethane'],
        CBrF3: ['Bromotrifluoromethane'],
        CF4: ['Carbon tetrafluoride'],
        CSi: ['Silicon carbide'],
        CS2: ['Carbon disulfide'],
        CCl4: ['Carbon tetrachloride'],
        CSe2: ['Carbon diselenide'],
        CBr4: ['Carbon tetrabromide'],
        CI4: ['Carbon tetraiodide'],

        C2H: ['Ethynyl radical'],
        C2HF6NO4S2: ['Bistriflimidic acid'],
        C2HNaO4: ['Sodium hydrogenoxalate'],
        C2HO6Na3: ['Sodium sesquicarbonate'],
        C2HBrClF3: ['Halothane'],
        C2HF5: ['Pentafluoroethane'],
        C2H2: ['Acetylene'],
        C2H2B2N2: ['Carborazine'],
        C2H2N2O: ['Furazan', 'Oxadiazole'],
        C2H2N2O2: ['Sydnone'],
        C2H2N2S: ['Thiadiazole'],
        C2H2N4: ['Tetrazine'],
        C2H2O: ['Oxirene'],
        C2H2O2: ['Glyoxal'],
        C2H2O2FNa: ['Sodium fluoroacetate'],
        C2H2ClNaO2: ['Sodium chloroacetate'],
        C2H2O3: ['Glyoxylic acid'],
        C2H2O4: ['Oxalic acid'],
        C2H2O4Mg: ['Magnesium formate'],
        C2H2NiO4: ['Nickel formate'],
        C2H2O6Mg: ['Magnesium bicarbonate'],
        C2H2F2: ['Difluoroethene'],
        C2H2F4: ['Norflurane'],
        C2H2S: ['Thiirene'],
        C2H2S2: ['Dithiete'],
        C2H2Cl2: ['Dichloroethene'],
        C2H2Br2: ['1,2-Dibromoethylene'],
        C2H3LiO2: ['Lithium acetate'],
        C2H3B: ['Borirene'],
        C2H3N: ['Acetonitrile', 'Azirine', 'Methyl isocyanide'],
        C2H3NO: ['Methyl isocyanate'],
        C2H3NO2: ['Dehydroglycine'],
        C2H3NS2: ['Dithiazole'],
        C2H3N3: ['Triazole'],
        C2H3FO: ['Acetyl fluoride'],
        C2H3OCl: ['Acetyl chloride'],
        C2H3BrO: ['Acetyl bromide'],
        C2H3IO: ['Acetyl iodide'],
        C2H3FO2: ['Fluoroacetic acid'],
        C2H3NaO2: ['Sodium acetate'],
        C2H3ClO2: ['Chloroacetic acid'],
        C2H3Cl3O2: ['Chloral hydrate'],
        C2H3KO2: ['Potassium acetate'],
        C2H3BrO2: ['Bromoacetic acid'],
        C2H3IO2: ['Iodoacetic acid'],
        C2H3CsO2: ['Cesium acetate'],
        C2H3F3O3S: ['Methyl trifluoromethanesulfonate'],
        C2H3F: ['Vinyl fluoride'],
        C2H3F3: ['1,1,1-Trifluoroethane'],
        C2H3P: ['Phosphirene'],
        C2H3Cl: ['Vinyl chloride'],
        C2H3Cl3: ['Trichloroethane'],
        C2H4: ['Ethylene'],
        C2H4INO: ['Iodoacetamide'],
        C2H4NNaS2: ['Metam sodium'],
        C2H4N4O2: ['Azodicarbonamide'],
        C2H4O: ['Acetaldehyde', 'Ethylene oxide', 'Polyvinyl alcohol'],
        C2H4O2: ['Acetic acid', 'Dioxetane'],
        C2H4F2: ['Difluoroethane'],
        C2H4S: ['Thiirane'],
        C2H4S2: ['Dithietane'],
        C2H4Cl2: ['Dichloroethane'],
        C2H4Br2: ['Dibromoethane'],
        C2H5B: ['Borirane'],
        C2H5N: ['Aziridine'],
        C2H5NO2: ['Glycine'],
        C2H5NS: ['Thioacetamide'],
        C2H5ONa: ['Sodium ethoxide'],
        C2H5NaOS: ['Sodium methylsulfinylmethylide'],
        C2H5ClO: ['2-Chloroethanol'],
        C2H5NaO3S2: ['Mesna'],
        C2H5NaO4S: ['Sodium 2-hydroxyethyl sulfonate'],
        C2H5P: ['Phosphirane'],
        C2H6O: ['Ethanol', 'Dimethyl ether'],
        C2H6OS: ['Dimethyl sulfoxide'],
        C2H6Cl3KOPt: ['Zeise\'s salt'],
        C2H6O2S: ['Ethylene glycol', 'Methylsulfonylmethane'],
        C2H6O4S: ['Dimethyl sulfate'],
        C2H6S: ['Dimethyl sulfide'],
        C2H6AuClS: ['Chloro(dimethyl sulfide)gold(I)'],
        C2H6S2: ['Dimethyl disulfide'],
        C2H6Zn: ['Dimethylzinc'],
        C2H6Cd: ['Dimethylcadmium'],
        C2H6Te: ['Dimethyl telluride'],
        C2H6Hg: ['Dimethylmercury'],
        C2H7N: ['Ethylamine'],
        C2H7NO2: ['Ammonium acetate'],
        C2H7NO3S: ['Taurine'],
        C2H7NS: ['Cysteamine'],
        C2H7AsO2: ['Cacodylic acid'],
        C2H8N2: ['Ethylenediamine'],
        C2H8N2O3Pt: ['Nedaplatin'],
        C2H10I2N2: ['Ethylenediamine dihydroiodide'],
        C2H12B10: ['Ortho-carborane'],
        C2BeO4: ['Beryllium oxalate'],
        C2Cl3N: ['Trichloroacetonitrile'],
        C2N2O2Hg: ['Mercury(II) fulminate'],
        C2N2Mg: ['Magnesium cyanide'],
        C2N14: ['1-Diazidocarbamoyl-5-azidotetrazole'],
        C2F3NaO2: ['Sodium trifluoroacetate'],
        C2Cl3NaO2: ['Sodium trichloroacetate'],
        C2Cs2O4: ['Cesium oxalate'],
        C2ClF3: ['Chlorotrifluoroethylene'],
        C2F4: ['Tetrafluoroethylene'],
        C2Cl2F4: ['1,2-Dichlorotetrafluoroethane'],
        C2Br2F4: ['Dibromotetrafluoroethane'],
        C2ClF5: ['Chloropentafluoroethane'],
        C2F6: ['Hexafluoroethane'],
        C2Cl4: ['Tetrachloroethylene'],
        C2Cl6: ['Hexachloroethane'],
        C2Ag2: ['Silver acetylide'],

        C3HF5O2: ['Perfluoropropionic acid'],
        C3H2ClF5O: ['Enflurane', 'Isoflurane'],
        C3H2F6O: ['Desflurane'],
        C3H2O2: ['Cyclopropenone', 'Propiolic acid'],
        C3H2O4Na2: ['Disodium malonate'],
        C3H3N: ['Acrylonitrile', 'Azete'],
        C3H3NO: ['Isoxazole', 'Oxazole'],
        C3H3NO2: ['Münchnone'],
        C3H3NS: ['Isothiazole', 'Thiazole'],
        C3H3N3: ['Triazine'],
        C3H3N3O3: ['Cyanuric acid'],
        C3H3NaO2: ['Sodium polyacrylate'],
        C3H3NaO3: ['Sodium pyruvate'],
        C3H3Cl: ['Propargyl chloride'],
        C3H3Br: ['Propargyl bromide'],
        C3H4: ['Cyclopropene', 'Propadiene', 'Propyne'],
        C3H4N2: ['Imidazole', 'Pyrazole'],
        C3H4O: ['Oxetene', 'Propargyl alcohol'],
        C3H4Cl2F2O: ['Methoxyflurane'],
        C3H4Cl2O: ['Dichloroacetone'],
        C3H4O2: ['Acrylic acid'],
        C3H4O3: ['Pyruvic acid'],
        C3H4O4: ['Malonic acid'],
        C3H4S: ['Thiete'],
        C3H5LiO3: ['Lithium lactate'],
        C3H5N: ['Propionitrile'],
        C3H5NO: ['Oxazoline'],
        C3H5NO2: ['Dehydroalanine', '2-Oxazolidone'],
        C3H5NS: ['Thiazoline'],
        C3H5N3O9: ['Nitroglycerin'],
        C3H5FO: ['Fluoroacetone'],
        C3H5NaOS2: ['Sodium ethyl xanthate'],
        C3H5ClO: ['Chloroacetone'],
        C3H5BrO: ['Bromoacetone'],
        C3H5NaO2: ['Sodium propionate'],
        C3H5ClO2: ['Ethyl chloroformate'],
        C3H5KO2: ['Potassium propanoate'],
        C3H5NaO3: ['Sodium lactate'],
        C3H5KO3: ['Potassium lactate'],
        C3H5O6P: ['Phosphoenolpyruvic acid'],
        C3H5Cl: ['Allyl chloride'],
        C3H6: ['Cyclopropane', 'Propylene'],
        C3H6N2: ['2-Imidazoline', 'Pyrazoline'],
        C3H6N2O2: ['Cycloserine'],
        C3H6N6: ['Melamine'],
        C3H6O: ['Acetone', 'Oxetane', 'Propionaldehyde'],
        C3H6O2: ['Dioxolane', 'Propionic acid'],
        C3H6O3: ['Dihydroxyacetone', 'Glyceraldehyde', 'Lactic acid', 'Trioxane'],
        C3H6O6S3Ce: ['Cerium(III) methanesulfonate'],
        C3H6S: ['Thietane', 'Thioacetone'],
        C3H6S2: ['Dithiolane'],
        C3H6S3: ['Trithiane'],
        C3H7N: ['Azetidine'],
        C3H7NO: ['Dimethylformamide', 'Isoxazolidine', 'Oxazolidine'],
        C3H7NO2: ['Alanine', 'Β-Alanine', 'Ethyl carbamate', 'Sarcosine'],
        C3H7NO2S: ['Cysteine'],
        C3H7NO2Se: ['Selenocysteine'],
        C3H7NO2Te: ['Tellurocysteine'],
        C3H7NO3: ['Serine', 'Isoserine'],
        C3H7N3O2: ['Glycocyamine'],
        C3H7O4P: ['Fosfomycin'],
        C3H7O6P: ['Glyceraldehyde 3-phosphate'],
        C3H7CaO6P: ['Calcium glycerylphosphate'],
        C3H7O7P: ['Phosphoglyceric acid'],
        C3H7ClMg: ['Isopropylmagnesium chloride'],
        C3H7P: ['Phosphetane'],
        C3H7Cl: ['Isopropyl chloride'],
        C3H7Br: ['2-Bromopropane'],
        C3H8: ['Propane'],
        C3H8N2: ['Imidazolidine', 'Pyrazolidine'],
        C3H8N2O3: ['Bis(hydroxymethyl)urea'],
        C3H8O: ['Isopropyl alcohol', '1-Propanol'],
        C3H8OS2: ['Dimercaprol'],
        C3H8O2: ['Propylene glycol', 'Trimethylene glycol'],
        C3H8O3: ['Glycerol'],
        C3H9BO3: ['Trimethyl borate'],
        C3H9N: ['Trimethylamine'],
        C3H9O3N: ['Ammonium lactate'],
        C3H9N3: ['Triazinane'],
        C3H9NaOSi: ['Sodium trimethylsiloxide'],
        C3H9IOS: ['Trimethylsulfoxonium iodide'],
        C3H9SiCl: ['Trimethylsilyl chloride'],
        C3H9SnCl: ['Trimethyltin chloride'],
        C3H9In: ['Trimethylindium'],
        C3CoNO4: ['Cobalt tricarbonyl nitrosyl'],
        C3Cl2N3NaO3: ['Sodium dichloroisocyanurate'],
        C3Br3N3: ['Cyanuric bromide'],
        C3F9O9S3Sc: ['Scandium(III) trifluoromethanesulfonate'],
        C3F9O9S3Ce: ['Cerium(III) trifluoromethanesulfonate'],
        C3F6: ['Hexafluoropropylene'],
        C3Na2S5: ['Sodium 1,3-dithiole-2-thione-4,5-dithiolate'],

        C4HF7O2: ['Perfluorobutanoic acid'],
        C4HNaO3: ['Moniliformin'],
        C4HCoO4: ['Cobalt tetracarbonyl hydride'],
        C4F9S3O6H: ['Triflidic acid'],
        C4H2O3: ['Maleic anhydride'],
        C4H2Na2O4: ['Sodium fumarate'],
        C4H2K2O4: ['Potassium fumarate'],
        C4H2O4Ca: ['Calcium fumarate'],
        C4H3FN2O2: ['Fluorouracil'],
        C4H3F7O: ['Sevoflurane'],
        C4H4KNO4S: ['Acesulfame potassium'],
        C4H4N2: ['Diazine', 'Pyrazine', 'Pyridazine', 'Pyrimidine'],
        C4H4N2O2: ['Uracil'],
        C4H4N2O3: ['Barbituric acid'],
        C4H4N2O5: ['Alloxan'],
        C4H4FN3O: ['Flucytosine'],
        C4H4O: ['Furan'],
        C4H4O2: ['1,4-Dioxin', '2-Furanone'],
        C4H4O4: ['Fumaric acid', 'Maleic acid'],
        C4H4AuNaO4S: ['Sodium aurothiomalate'],
        C4H4O5: ['Metatartaric acid', 'Oxaloacetic acid'],
        C4H4Na2O5: ['Sodium malate'],
        C4H4MgO5: ['Magnesium malate'],
        C4H4K2O5: ['Potassium malate'],
        C4H4CaO5: ['Calcium malate'],
        C4H4KNaO6: ['Potassium sodium tartrate'],
        C4H4Na2O6: ['Sodium tartrate'],
        C4H4K2O6: ['Potassium tartrate'],
        C4H4CaO6: ['Calcium tartrate'],
        C4H4S: ['Thiophene'],
        C4H4S2: ['Dithiin'],
        C4H4Se: ['Selenophene'],
        C4H4Te: ['Tellurophene'],
        C4H5B: ['Borole'],
        C4H5N: ['Pyrrole'],
        C4H5NO: ['Oxazine'],
        C4H5NS: ['Allyl isothiocyanate', 'Thiazine'],
        C4H5N3O: ['Cytosine'],
        C4H5NaO6: ['Monosodium tartrate'],
        C4H5P: ['Phosphole'],
        C4H5As: ['Arsole'],
        C4H5Sb: ['Stibole'],
        C4H5Bi: ['Bismole'],
        C4H6: ['Bicyclobutane', 'Butadiene', 'Butyne', 'Cyclobutene', 'Methylcyclopropene', 'Methylenecyclopropane', 'Trimethylenemethane'],
        C4H6LiNO4: ['Lithium aspartate'],
        C4H6BN: ['1,2-Dihydro-1,2-azaborine'],
        C4H6N2: ['Fomepizole'],
        C4H6N2O2: ['Muscimol'],
        C4H6N2S: ['Thiamazole'],
        C4H6N4O3: ['Allantoin'],
        C4H6N4O3S2: ['Acetazolamide'],
        C4H6O2: ['Butyrolactone', 'Methacrylic acid', 'Vinyl acetate'],
        C4H6O3: ['Acetoacetic acid', 'Ketobutyric acid', 'Propylene carbonate'],
        C4H6O4: ['Succinic acid'],
        C4H6MgO4: ['Magnesium acetate'],
        C4H6O4S2: ['Succimer'],
        C4H6CaO4: ['Calcium acetate'],
        C4H6O4Mn: ['Manganese(II) acetate'],
        C4H6NiO4: ['Nickel(II) acetate'],
        C4H6O4Pd: ['Palladium(II) acetate'],
        C4H6O4Ba: ['Barium acetate'],
        C4H6O4Pt: ['Platinum(II) acetate'],
        C4H6O5: ['Dimethyl dicarbonate', 'Malic acid'],
        C4H6O6: ['Tartaric acid'],
        C4H6O6Pb: ['Lead(II) acetate'],
        C4H6Sn: ['Stannole'],
        C4H7N: ['Butyronitrile'],
        C4H7NO2: ['Azetidine-2-carboxylic acid'],
        C4H7NO4: ['Aspartic acid'],
        C4H7N3O: ['Creatinine'],
        C4H7NaO2: ['Sodium butyrate'],
        C4H7BrO2: ['Ethyl bromoacetate'],
        C4H7NaO3: ['Sodium oxybate'],
        C4H7NaO4: ['Sodium diacetate'],
        C4H8: ['Butene', 'Cyclobutane', 'Isobutylene'],
        C4H8N2O3: ['Asparagine'],
        C4H8MgN2O4: ['Magnesium glycinate'],
        C4H8O: ['Butyraldehyde', 'Tetrahydrofuran'],
        C4H8OS: ['Oxathiane'],
        C4H8O2: ['Butyric acid', '1,4-Dioxane', 'Ethyl acetate', 'Methyl propionate'],
        C4H8O2S: ['Sulfolane'],
        C4H8Cl2GeO2: ['Germanium dichloride dioxane'],
        C4H8O3: ['Hydroxybutyric acid', 'Hydroxyisobutyric acid'],
        C4H8S: ['Tetrahydrothiophene'],
        C4H8S2: ['Dithiane'],
        C4H9Li: ['Butyllithium'],
        C4H9LiO: ['Lithium tert-butoxide'],
        C4H9N: ['Pyrrolidine'],
        C4H9NO: ['Dimethylacetamide', 'Morpholine'],
        C4H9NO2: ['Aminobutyric acid', 'Aminoisobutyric acid', 'GABA'],
        C4H9NO2S: ['Cysteine methyl ester', 'Homocysteine'],
        C4H9NO3: ['Threonine', 'Homoserine'],
        C4H9NO5: ['Ammonium malate'],
        C4H9NS: ['Thiomorpholine'],
        C4H9N3O2: ['Creatine'],
        C4H9NaO: ['Sodium tert-butoxide'],
        C4H9ClO: ['tert-Butyl hypochlorite'],
        C4H9KO: ['Potassium tert-butoxide'],
        C4H9Na: ['n-Butylsodium'],
        C4H9P: ['Phospholane'],
        C4H9SnCl3: ['Butyltin trichloride'],
        C4H10: ['Butane', 'Isobutane'],
        C4H10BF3O: ['Boron trifluoride etherate'],
        C4H10NO5P: ['Fosmidomycin'],
        C4H10N2: ['Diazinane', 'Piperazine'],
        C4H10N2O3: ['Canaline'],
        C4H10N2O4: ['Ammonium fumarate'],
        C4H10N2Si: ['Trimethylsilyldiazomethane'],
        C4H10N3O5P: ['Phosphocreatine'],
        C4H10O: ['Butanol', 'Diethyl ether'],
        C4H10O2: ['Butanediol'],
        C4H10O4: ['Erythritol'],
        C4H10O8Pb3: ['Basic lead acetate'],
        C4H10S: ['1-Butanethiol'],
        C4H10Zn: ['Diethylzinc'],
        C4H11LiSi: ['(Trimethylsilyl)methyllithium'],
        C4H11BO: ['Borane–tetrahydrofuran'],
        C4H11N: ['Butylamine', 'Diethylamine'],
        C4H11N5: ['Metformin'],
        C4H12LiN: ['Lithium diisopropylamide'],
        C4H12FN: ['Tetramethylammonium fluoride'],
        C4H12NCl: ['Tetramethylammonium chloride'],
        C4H12N2: ['Putrescine'],
        C4H12MgN2O6S2: ['Magnesium taurate'],
        C4H12Ge: ['Isobutylgermane'],
        C4H12Pb: ['Tetramethyllead'],
        C4H13NO: ['Tetramethylammonium hydroxide'],
        C4H13NO7P2: ['Alendronic acid'],
        C4H14BN: ['Borane tert-butylamine'],
        C4H22B18CoNa: ['Sodium dicarbollylcobaltate(III)'],
        C4N2Na2S2: ['Sodium maleonitriledithiolate'],
        C4FeNa2O4: ['Disodium tetracarbonylferrate'],
        C4O4Cl2Rh2: ['Rhodium carbonyl chloride'],
        C4F8: ['Octafluorocyclobutane'],
        C4F10: ['Perfluorobutane'],

        C5HO5Mn: ['Pentacarbonylhydridomanganese'],
        C5H3LiN2O4: ['Lithium orotate'],
        C5H4N2O4: ['Orotic acid'],
        C5H4FN3O2: ['Favipiravir'],
        C5H4N4: ['5-Aza-7-deazapurine', 'Purine'],
        C5H4N4O: ['Allopurinol', 'Hypoxanthine'],
        C5H4N4O2: ['Xanthine'],
        C5H4N4O3: ['Uric acid'],
        C5H4N4S: ['Mercaptopurine'],
        C5H4N6O3S: ['Riamilovir'],
        C5H4O2: ['Furfural', 'Pyrone'],
        C5H4S3: ['Trithiapentalene'],
        C5H5Li: ['Lithium cyclopentadienide'],
        C5H5B: ['Borabenzene'],
        C5H5N: ['Pyridine'],
        C5H5NiNO: ['Cyclopentadienyl nickel nitrosyl'],
        C5H5NS: ['Thiazepine'],
        C5H5N3O: ['Pyrazinamide'],
        C5H5N5: ['Adenine'],
        C5H5N5O: ['Guanine'],
        C5H5N5S: ['Tioguanine'],
        C5H5Na: ['Sodium cyclopentadienide'],
        C5H5BrMg: ['Cyclopentadienyl magnesium bromide'],
        C5H5P: ['Phosphorine'],
        C5H5As: ['Arsabenzene'],
        C5H5In: ['Cyclopentadienylindium(I)'],
        C5H5Sb: ['Stibinin'],
        C5H5Bi: ['Bismabenzene'],
        C5H6N2: ['Diazepine'],
        C5H6N2O2: ['Thymine'],
        C5H6O: ['Pyran'],
        C5H6O5: ['α-Ketoglutaric acid'],
        C5H6Si: ['Silabenzene'],
        C5H6S: ['Thiopyran'],
        C5H6Ge: ['Germabenzene'],
        C5H6Sn: ['Stannabenzene'],
        C5H7NOS: ['Goitrin'],
        C5H7NO3: ['Pyroglutamic acid'],
        C5H7NNa2O4: ['Disodium glutamate'],
        C5H7N3O: ['5-Methylcytosine'],
        C5H7N3O2: ['5-Hydroxymethylcytosine'],
        C5H7N3O5: ['Quisqualic acid'],
        C5H8: ['Bicyclopentane', 'Cyclopentene', 'Isoprene', 'Pentadiene', 'Pentyne', 'Spiropentane'],
        C5H8NO4Na: ['Monosodium glutamate'],
        C5H8KNO4: ['Monopotassium glutamate'],
        C5H8O: ['3,4-Dihydropyran'],
        C5H8O2: ['Acetylacetone', 'Angelic acid', 'Glutaraldehyde', 'Methyl methacrylate', 'Tiglic acid'],
        C5H9N: ['tert-Butyl isocyanide'],
        C5H9NO: ['N-Methyl-2-pyrrolidone'],
        C5H9NO2: ['Proline'],
        C5H9NO3: ['Hydroxyproline', 'Aminolevulinic acid'],
        C5H9NO3S: ['Acetylcysteine'],
        C5H9NO4: ['Glutamic acid', 'NMDA'],
        C5H9NO4S: ['Carbocisteine'],
        C5H9N3: ['Histamine'],
        C5H9Cl2N3O2: ['Carmustine'],
        C5H10: ['Cyclopentane', '2-Methyl-2-butene', 'Pentene'],
        C5H10NS2Na: ['Sodium diethyldithiocarbamate'],
        C5H10N2O3: ['Glutamine'],
        C5H10N2O7P2: ['Zoledronic acid'],
        C5H10O: ['Isoprenol', 'Isovaleraldehyde', 'Prenol', 'Tetrahydropyran'],
        C5H10O2: ['3-Methylbutanoic acid', 'Valeric acid'],
        C5H10O3: ['β-Hydroxy β-methylbutyric acid'],
        C5H10O4: ['Deoxyribose'],
        C5H10O5: ['Arabinose', 'Lyxose', 'Ribose', 'Ribulose', 'Xylose'],
        C5H10S: ['Prenylthiol', 'Thiane'],
        C5H11N: ['Piperidine'],
        C5H11NO: ['Isovaleramide'],
        C5H11NO2: ['Valine', 'Norvaline', 'Isovaline', 'Trimethylglycine'],
        C5H11NO2S: ['Methionine', 'Penicillamine'],
        C5H11NO2Se: ['Selenomethionine'],
        C5H11NO4S: ['Acamprosate'],
        C5H11O7P: ['1-Deoxy-D-xylulose 5-phosphate'],
        C5H11O8P: ['Ribose 5-phosphate', 'Ribulose 5-phosphate'],
        C5H11P: ['Phosphinane'],
        C5H12: ['Pentane', 'Neopentane'],
        C5H12NO5P: ['AP5'],
        C5H12NO7P: ['Phosphoribosylamine'],
        C5H12N2O2: ['Ornithine'],
        C5H12N2O2S: ['Thialysine'],
        C5H12N2O4: ['Monoammonium glutamate'],
        C5H12N4O3: ['Canavanine'],
        C5H12N8: ['Mitoguazone'],
        C5H12O5: ['Methyl tert-butyl ether', 'Ribitol', 'Xylitol'],
        C5H12O7P2: ['Dimethylallyl pyrophosphate', 'Isopentenyl pyrophosphate'],
        C5H12O8P2: ['(E)-4-Hydroxy-3-methyl-but-2-enyl pyrophosphate'],
        C5H12O9P2: ['2-C-Methyl-D-erythritol-2,4-cyclopyrophosphate'],
        C5H12O11P2: ['Ribulose 1,5-bisphosphate'],
        C5H13OCl: ['Choline chloride'],
        C5H13O7P: ['2-C-Methylerythritol 4-phosphate'],
        C5H13O14P3: ['Phosphoribosyl pyrophosphate'],
        C5H14N2: ['Cadaverine'],
        C5H15Ta: ['Pentamethyltantalum'],
        C5FeN6Na2O: ['Sodium nitroprusside'],
        C5O5ArW: ['Argon tungsten pentacarbonyl'],
        C5BrMnO5: ['Manganese pentacarbonyl bromide'],
        C5O5Os: ['Osmium pentacarbonyl'],

        C6HCl5O: ['Pentachlorophenol'],
        C6HF11O2: ['Perfluorohexanoic acid'],
        C6H3N3O7: ['Picric acid'],
        C6H3Cl3O: ['Trichlorophenol'],
        C6H3Br3O: ['Tribromophenol'],
        C6H3Cl3: ['Trichlorobenzene'],
        C6H4ClNO2: ['4-Nitrochlorobenzene'],
        C6H4Cl2O: ['Dichlorophenol'],
        C6H4Br2O: ['Dibromophenol'],
        C6H4O2: ['Benzoquinone'],
        C6H4O6: ['Tetrahydroxy-1,4-benzoquinone'],
        C6H4Na2O8S2: ['Tiron'],
        C6H4S2: ['Thienothiophene'],
        C6H4Cl2: ['Dichlorobenzene'],
        C6H4Br2: ['Dibromobenzene'],
        C6H5BO2: ['Catecholborane'],
        C6H5NO2: ['Niacin', 'Nitrobenzene'],
        C6H5HgNO3: ['Phenylmercuric nitrate'],
        C6H5Cl2N: ['Dichloroaniline'],
        C6H5NaO: ['Sodium phenoxide'],
        C6H5ClO: ['Chlorophenol'],
        C6H5BrO: ['Monobromophenol'],
        C6H5IO: ['Iodophenol'],
        C6H5Na3O7: ['Trisodium citrate'],
        C6H5F: ['Fluorobenzene'],
        C6H5F5S: ['Pentafluorosulfanylbenzene'],
        C6H5Na: ['Phenylsodium'],
        C6H5MgBr: ['Phenylmagnesium bromide'],
        C6H5Cl: ['Chlorobenzene'],
        C6H5Cl2I: ['Iodobenzene dichloride'],
        C6H5Br: ['Bromobenzene'],
        C6H5I: ['Iodobenzene'],
        C6H6: ['Benzene'],
        C6H6NCl: ['Chloroaniline'],
        C6H6N2: ['Diazapentalene'],
        C6H6N2O: ['Nicotinamide'],
        C6H6N2O2: ['Nitroaniline'],
        C6H6N4O2: ['7-Methylxanthine'],
        C6H6N6O2: ['Temozolomide'],
        C6N12H6O12: ['Hexanitrohexaazaisowurtzitane'],
        C6H6O: ['Oxepin', 'Phenol'],
        C6H6O2: ['Catechol', 'Hydroquinone', 'Resorcinol'],
        C6H6O2Ce: ['Cerium(III) acetate'],
        C6H6O3: ['Hydroxyquinol', 'Maltol', 'Phloroglucinol', 'Pyrogallol'],
        C6H6O4: ['Kojic acid', 'Tetrahydroxybenzene'],
        C6H6O5: ['Pentahydroxybenzene'],
        C6H6O6: ['Benzenehexol'],
        C6H6Na2O7: ['Disodium citrate'],
        C6H6MgO7: ['Magnesium citrate'],
        C6H6Ca2O7: ['Dicalcium citrate'],
        C6H6S: ['Thiepine', 'Thiophenol'],
        C6H6Se: ['Benzeneselenol'],
        C6H7B: ['Borepin'],
        C6H7BO2: ['Phenylboronic acid'],
        C6H7BHgO3: ['Phenylmercuric borate'],
        C6H7N: ['Aniline', 'Azepine'],
        C6H7N3O: ['Isoniazid'],
        C6H7NaO2: ['Sodium sorbate'],
        C6H7KO2: ['Potassium sorbate'],
        C6H7NaO6: ['Sodium alginate', 'Sodium ascorbate', 'Sodium erythorbate'],
        C6H7KO6: ['Potassium alginate', 'Potassium ascorbate'],
        C6H7NaO7: ['Monosodium citrate'],
        C6H8N2: ['p-Phenylenediamine'],
        C6H8N2O8: ['Isosorbide dinitrate'],
        C6H8ClN7O: ['Amiloride'],
        C6H8O2: ['Sorbic acid'],
        C6H8Na2O4: ['Sodium adipate'],
        C6H8K2O4: ['Potassium adipate'],
        C6H8O6: ['Alginic acid', 'Erythorbic acid', 'Vitamin C'],
        C6H8O7: ['Citric acid'],
        C6H8CaO7: ['Monocalcium citrate'],
        C6H9NO: ['Carbapenam', 'N-Vinylpyrrolidone'],
        C6H9NOS2: ['Raphanin'],
        C6H9NO6: ['Carboxyglutamic acid'],
        C6H9N3O2: ['Histidine'],
        C6H9N3O3: ['Metronidazole'],
        C6H9MnO6: ['Manganese(III) acetate'],
        C6H9O6Eu: ['Europium(III) acetate'],
        C6H9O6Gd: ['Gadolinium acetate'],
        C6H9O6Tb: ['Terbium acetate'],
        C6H9O6Dy: ['Dysprosium(III) acetate'],
        C6H9O6Ho: ['Holmium acetate'],
        C6H9O6Er: ['Erbium(III) acetate'],
        C6H9O6Tm: ['Thulium(III) acetate'],
        C6H9O6Yb: ['Ytterbium(III) acetate'],
        C6H9O6Lu: ['Lutetium(III) acetate'],
        C6H10: ['Cyclohexene', 'Hexadiene', 'Hexyne'],
        C6H10O6NaB: ['Sodium triacetoxyborohydride'],
        C6H10N6O: ['Dacarbazine'],
        C6H10O: ['Mesityl oxide'],
        C6H10O4: ['Adipic acid', 'Isosorbide'],
        C6H10CaO4: ['Calcium propanoate'],
        C6H10O5: ['Curdlan', 'Dextrin', 'Glucose oxidase', 'Pullulan', 'Starch'],
        C6H10O6: ['Glucono delta-lactone'],
        C6H10MgO6: ['Magnesium lactate'],
        C6H10CaO6: ['Calcium lactate'],
        C6H10MnO6: ['Manganese lactate'],
        C6H10FeO6: ['Iron(II) lactate'],
        C6H10O6Cu: ['Copper(II) lactate'],
        C6H10O7: ['Glucuronic acid'],
        C6H10O7Ge2: ['Propagermanium'],
        C6H11LiO7: ['Lithium gluconate'],
        C6H11NO: ['Caprolactam'],
        C6H11NOS2: ['Sulforaphane'],
        C6H11NO2: ['Pipecolic acid'],
        C6H11NO3: ['Methyl aminolevulinate'],
        C6H11NO3S: ['N-Formylmethionine'],
        C6H11AuO5S: ['Aurothioglucose'],
        C6H11NaO7: ['Sodium gluconate'],
        C6H11KO7: ['Potassium gluconate'],
        C6H12: ['Cyclohexane', 'Hexene'],
        C6H12NNaO3S: ['Cyclamate'],
        C6H12F2N2O2: ['Eflornithine'],
        C6H12N2O4S: ['Lanthionine'],
        C6H12N2O4S2: ['Cystine'],
        C6H12N2O4Pt: ['Carboplatin'],
        C6H12N3PS: ['Thiotepa'],
        C6H12N4: ['Hexamethylenetetramine'],
        C6H12O: ['Methyl isobutyl ketone', 'Oxepane'],
        C6H12O2: ['Caproic acid'],
        C6H12O4: ['Acetone peroxide', 'Mevalonic acid', 'Pantoic acid'],
        C6H12Br2O4: ['Mitobronitol'],
        C6H12O5: ['Fucose', 'Rhamnose'],
        C6H12O6: ['Fructose', 'Galactose', 'Glucose', 'Inositol', 'Mannose'],
        C6H12O7: ['Gluconic acid'],
        C6H12S: ['Thiepane'],
        C6H13BO2: ['Pinacolborane'],
        C6H13N: ['Azepane'],
        C6H13NO2: ['Leucine', 'Isoleucine', 'Norleucine', 'Β-Leucine'],
        C6H13NO2S: ['Ethionine'],
        C6H13NO4: ['Perosamine'],
        C6H13NO5: ['Glucosamine'],
        C6H13N3O3: ['Citrulline'],
        C6H13N5O: ['Moroxydine'],
        C6H13O9P: ['Fructose 1-phosphate', 'Fructose 6-phosphate', 'Glucose 1-phosphate', 'Glucose 6-phosphate'],
        C6H13O10P: ['6-Phosphogluconic acid'],
        C6H14: ['Hexane', '2-Methylpentane', '3-Methylpentane'],
        C6H14N2O2: ['Lysine'],
        C6H14N2O3: ['Hydroxylysine'],
        C6H14N4O2: ['Arginine'],
        C6H14O: ['Ethyl tert-butyl ether'],
        C6H14O2: ['Hexylene glycol'],
        C6H14O6: ['Mannitol', 'Sorbitol'],
        C6H14O6S2: ['Busulfan'],
        C6H14O8S2: ['Treosulfan'],
        C6H15B: ['Triethylborane'],
        C6H15N: ['Triethylamine'],
        C6H15NaO3SSi: ['Sodium trimethylsilylpropanesulfonate'],
        C6H15In: ['Triethylindium'],
        C6H16LiB: ['Lithium triethylborohydride'],
        C6H16BNa: ['Sodium triethylborohydride'],
        C6H16N2O4: ['Ammonium adipate'],
        C6H16AlNaO4: ['Sodium bis(2-methoxyethoxy)aluminum hydride'],
        C6H17N3O7: ['Triammonium citrate'],
        C6H18LiNSi2: ['Lithium bis(trimethylsilyl)amide'],
        C6H18N3OP: ['Hexamethylphosphoramide'],
        C6H18O24P6: ['Phytic acid'],
        C6H18Al2: ['Trimethylaluminum'],
        C6H18W: ['Hexamethyltungsten'],
        C6N6Na4Fe: ['Sodium ferrocyanide'],
        C6Ca2FeN6: ['Calcium ferrocyanide'],
        C6O6V: ['Vanadium hexacarbonyl'],
        C6O6W: ['Tungsten hexacarbonyl'],
        C6FeNa3O12: ['Sodium ferrioxalate'],
        C6O12Pr2: ['Praseodymium(III) oxalate'],
        C6O12Sm2: ['Samarium(III) oxalate'],
        C6BrF5: ['Bromopentafluorobenzene'],
        C6F6: ['Hexafluorobenzene'],

        C7H3ClF6N2O4S2: ['Comins\' reagent'],
        C7H5NO: ['Anthranil', 'Benzisoxazole', 'Benzoxazole'],
        C7H5Cl2NO4S: ['Halazone'],
        C7H5NS: ['Benzothiazole'],
        C7H5NaO2: ['Sodium benzoate'],
        C7H5KO2: ['Potassium benzoate'],
        C7H5NaO3: ['Sodium salicylate'],
        C7H5IO4: ['2-Iodoxybenzoic acid'],
        C7H5BiO4: ['Bismuth subsalicylate'],
        C7H5F3: ['Trifluorotoluene'],
        C7H6BFO2: ['Tavaborole'],
        C7H6N2: ['Benzimidazole', 'Indazole'],
        C7H6N4O2: ['Tirapazamine'],
        C7H6O: ['Tropone'],
        C7H6O2: ['Benzoic acid', 'Salicylaldehyde', 'Tropolone'],
        C7H6O3: ['Hydroxybenzoic acid', 'Sesamol'],
        C7H6O4: ['Patulin'],
        C7H6O5: ['Gallic acid'],
        C7H7BO3: ['4-Formylphenylboronic acid'],
        C7H7N: ['Azocine'],
        C7H7NO: ['Benzamide'],
        C7H7NO2: ['4-Aminobenzoic acid', 'Salicylamide'],
        C7H7NO2NaSCl: ['Chloramine-T'],
        C7H7NO3: ['4-Aminosalicylic acid', 'Mesalazine'],
        C7H7N3O2S: ['Tosyl azide'],
        C7H7ClN4O2: ['8-Chlorotheophylline'],
        C7H7ClN6O2: ['Mitozolomide'],
        C7H7O4Rh: ['Dicarbonyl(acetylacetonato)rhodium(I)'],
        C7H7K: ['Benzyl potassium'],
        C7H8: ['Cycloheptatriene', 'Toluene'],
        C7H8NNa3O6: ['Trisodium dicarboxymethyl alaninate'],
        C7H8ClN3O4S2: ['Hydrochlorothiazide'],
        C7H8N4O2: ['Paraxanthine', 'Theobromine', 'Theophylline'],
        C7H8O: ['Benzyl alcohol', 'Cresol'],
        C7H8O2: ['Methylcatechol', 'Methoxyphenol', 'Orcinol'],
        C7H8O3: ['Ethyl maltol'],
        C7H9N: ['Lutidine'],
        C7H9NO6S: ['Pomaglumetad'],
        C7H10N2OS: ['Propylthiouracil'],
        C7H10N2O4: ['AMPA'],
        C7H11NO2: ['Ethosuximide'],
        C7H11NO5: ['N-Acetylglutamic acid'],
        C7H11N3O2: ['3-Methylhistidine'],
        C7H11N3O6S: ['Avibactam'],
        C7H12O4: ['Diethyl malonate'],
        C7H12O5: ['Glyceryl diacetate'],
        C7H12O6: ['Quinic acid'],
        C7H13N3: ['Triazabicyclodecene'],
        C7H14: ['Cycloheptane', 'Heptene', 'Methylcyclohexane'],
        C7H14N2O3: ['Theanine'],
        C7H14N2O4: ['Diaminopimelic acid'],
        C7H14N2O4S: ['Cystathionine'],
        C7H14N2O4S2: ['Djenkolic acid'],
        C7H14O2: ['Enanthic acid'],
        C7H15N: ['Azocane'],
        C7H15NO3: ['Carnitine'],
        C7H15Cl2N2O2P: ['Cyclophosphamide', 'Ifosfamide'],
        C7H15Cl2N2O4P: ['Perfosfamide'],
        C7H15N2O8P: ['Glycineamide ribonucleotide'],
        C7H16: ['Heptane'],
        C7H16NO2: ['Acetylcholine'],
        C7H16NO5P: ['AP-7'],
        C7H17NO5: ['Meglumine'],
        C7H17N4O4P: ['Guanitoxin'],
        C7H19N3: ['Spermidine'],

        C8HF15O2: ['Perfluorooctanoic acid'],
        C8HF17O3S: ['Perfluorooctanesulfonic acid'],
        C8H2F17NO2S: ['Perfluorooctanesulfonamide'],
        C8H4Cl2O2: ['Terephthaloyl chloride'],
        C8H4O3: ['Phthalic anhydride'],
        C8H5NO2: ['Phthalimide'],
        C8H6: ['Pentalene'],
        C8H6N2: ['Cinnoline', 'Phthalazine', 'Quinazoline', 'Quinoxaline'],
        C8H6N4O5: ['Nitrofurantoin'],
        C8H6O: ['Benzofuran', 'Isobenzofuran'],
        C8H6O2: ['Benzodioxine'],
        C8H6Cl2O3: ['2,4-Dichlorophenoxyacetic acid'],
        C8H6O4: ['Benzenedicarboxylic acid'],
        C8H6O5: ['Stipitatic acid'],
        C8H6S: ['Benzothiophene'],
        C8H7N: ['Indole', 'Isoindole'],
        C8H7NNa4O8: ['Tetrasodium iminodisuccinate'],
        C8H7NS: ['Benzyl isothiocyanate'],
        C8H7ClN2O2S: ['Diazoxide'],
        C8H7N3O2: ['Luminol'],
        C8H7NaO3: ['Sodium methylparaben'],
        C8H7NaO4: ['Sodium dehydroacetate'],
        C8H7P: ['Benzophosphole'],
        C8H8: ['Styrene'],
        C8H8N2O3S: ['Zonisamide'],
        C8H8N4: ['Hydralazine'],
        C8H8O: ['Oxonine'],
        C8H8O2: ['Methyl benzoate', 'Phenylacetic acid'],
        C8H8O3: ['Mandelic acid', 'Methylparaben', 'Methyl salicylate', 'Vanillin'],
        C8H8O4: ['Dehydroacetic acid', 'Vanillic acid'],
        C8H8S: ['(2Z,4Z,6Z,8Z)-Thionine'],
        C8H9N: ['Azonine'],
        C8H9NO2: ['Metacetamol', 'Phenylglycine', 'Paracetamol'],
        C8H9NO3: ['4-Hydroxyphenylglycine'],
        C8H9NO4: ['Dihydroxyphenylglycine'],
        C8H9NO5: ['Clavulanic acid'],
        C8H9FN2O3: ['Tegafur'],
        C8H9ClO: ['Chloroxylenol'],
        C8H10: ['Xylene'],
        C8H10NO6P: ['Pyridoxal phosphate'],
        C8H10N2O4: ['Mimosine'],
        C8H10N2O7Ca: ['Calcium carbimide'],
        C8H10N2S: ['Ethionamide'],
        C8H10FN3O3S: ['Emtricitabine'],
        C8H10N4O2: ['Caffeine'],
        C8H10O: ['Xylenol'],
        C8H10O2: ['Creosol', 'Phenoxyethanol'],
        C8H10O3: ['Syringol'],
        C8H10O4: ['Penicillic acid'],
        C8H11N: ['Dimethylaniline', 'Phenethylamine'],
        C8H11NO: ['Tyramine'],
        C8H11NO2: ['Dopamine', 'Octopamine'],
        C8H11NO3: ['Norepinephrine', 'Oxidopamine', 'Pyridoxine'],
        C8H11NO4S2: ['Erdosteine'],
        C8H11NO5S: ['Sulbactam'],
        C8H11Cl2N3O2: ['Uramustine'],
        C8H11N3O3S: ['Lamivudine'],
        C8H11N5O3: ['Aciclovir'],
        C8H11Cl3O6: ['Chloralose'],
        C8H12N2O2: ['Pyridoxamine'],
        C8H12N2O3: ['Barbital'],
        C8H12N2O3S: ['6-APA'],
        C8H12MgN2O8: ['Magnesium aspartate'],
        C8H12N4O4: ['Decitabine'],
        C8H12N4O5: ['Azacitidine', 'Ribavirin'],
        C8H12N5O4P: ['Adefovir'],
        C8H12O2: ['Dimedone'],
        C8H12ClO8Ru2: ['Diruthenium tetraacetate chloride'],
        C8H12Mo2O8: ['Molybdenum(II) acetate'],
        C8H12O8Pb: ['Lead(IV) acetate'],
        C8H12Cl2Pt: ['Dichloro(cycloocta-1,5-diene)platinum(II)'],
        C8H13NO: ['Tropinone'],
        C8H13NO2: ['Scopine'],
        C8H13O5N: ['Chitin'],
        C8H13N5O4: ['Taribavirin'],
        C8H14N2O2: ['Levetiracetam'],
        C8H14N2O4: ['Coprine'],
        C8H14N2O4Pt: ['Oxaliplatin'],
        C8H14N2O5S: ['γ-Glutamylcysteine'],
        C8H14N3O6P: ['Cidofovir'],
        C8H14N3O7P: ['5-Aminoimidazole ribotide'],
        C8H14N4NiO4: ['Nickel bis(dimethylglyoximate)'],
        C8H14O2S2: ['Lipoic acid'],
        C8H14MgO10: ['Magnesium L-threonate'],
        C8H15N: ['Tropane'],
        C8H15NO: ['Hygrine', 'Pseudotropine', 'Tropine'],
        C8H15NOS2: ['Lipoamide'],
        C8H15NO2: ['Tranexamic acid'],
        C8H15NO6: ['N-Acetylglucosamine'],
        C8H15N2O9P: ['Phosphoribosyl-N-formylglycineamide'],
        C8H15N3: ['7-Methyl-1,5,7-triazabicyclo(4.4.0)dec-5-ene'],
        C8H15N3O4: ['Alanyl-glutamine'],
        C8H15N3O7: ['Streptozotocin'],
        C8H15N7O2S3: ['Famotidine'],
        C8H16: ['Cyclooctane', 'Octene'],
        C8H16N3O8P: ['5′-Phosphoribosylformylglycinamidine'],
        C8H16O2: ['Caprylic acid', '2,2,4,4-Tetramethyl-1,3-cyclobutanediol', 'Valproate'],
        C8H16NaO8: ['Carmellose sodium'],
        C8H16Cl2Rh2: ['Chlorobis(ethylene)rhodium dimer'],
        C8H17N: ['Coniine'],
        C8H17NO2: ['Pregabalin'],
        C8H18: ['Octane'],
        C8H18N4O2: ['Asymmetric dimethylarginine'],
        C8H18Mg: ['Dibutylmagnesium'],
        C8H20Ge: ['Tetraethylgermanium'],
        C8H20Pb: ['Tetraethyllead'],
        C8H21NO: ['Tetraethylammonium hydroxide'],
        C8H22N2Ni: ['Tetramethylethylenediamine(dimethyl)nickel(II)'],
        C8H24Cl2O4RuS4: ['Dichlorotetrakis(dimethylsulfoxide)ruthenium(II)'],

        C9HF17O2: ['Perfluorononanoic acid'],
        C9H4Cl3IO: ['Haloprogin'],
        C9H4O5: ['Trimellitic anhydride'],
        C9H5Cl2NO: ['Chloroxine'],
        C9H6O2: ['Chromone', 'Coumarin'],
        C9H6O3: ['Umbelliferone'],
        C9H6O4: ['Aesculetin'],
        C9H7BF2N2: ['BODIPY'],
        C9H7N: ['Isoquinoline', 'Quinoline'],
        C9H7Cl2N5: ['Lamotrigine'],
        C9H7N7O2S: ['Azathioprine'],
        C9H7MnO3: ['Methylcyclopentadienyl manganese tricarbonyl'],
        C9H8ClN5S: ['Tizanidine'],
        C9H8O: ['Cinnamaldehyde'],
        C9H8O2: ['Cinnamic acid'],
        C9H8O3: ['Coumaric acid'],
        C9H8O4: ['Aspirin', 'Caffeic acid'],
        C9H9N: ['Skatole'],
        C9H9NS: ['Phenethyl isothiocyanate'],
        C9H9Cl2N3O: ['Guanfacine'],
        C9H9Cl2N3: ['Clonidine'],
        C9H9HgNaO2S: ['Thiomersal'],
        C9H10BKN6: ['Potassium trispyrazolylborate'],
        C9H10Cl2N2O: ['DCMU'],
        C9H10N4O4: ['Acefylline'],
        C9H10O2: ['Paracoumaryl alcohol'],
        C9H10O3: ['Apocynin', 'Ethylparaben', 'Ethylvanillin'],
        C9H10O4: ['Syringaldehyde'],
        C9H10O5: ['Ethyl gallate', 'Syringic acid'],
        C9H11NO2: ['Benzocaine', 'Ethenzamide', 'Metolcarb', 'Norsalsolinol', 'Phenylalanine'],
        C9H11NO3: ['Tyrosine'],
        C9H11NO4: ['D-DOPA', 'L-DOPA'],
        C9H11NO5: ['Droxidopa'],
        C9H11FN2O5: ['Doxifluridine', 'Floxuridine'],
        C9H11IN2O5: ['Idoxuridine'],
        C9H11F2N3O4: ['Gemcitabine'],
        C9H11ClN4O2: ['Tipiracil'],
        C9H12: ['Cumene', 'Mesitylene', 'n-Propylbenzene'],
        C9H12N2O5: ['Deoxyuridine', 'Zebularine'],
        C9H12N2O5S: ['Tiazofurin'],
        C9H12N2O6: ['Pseudouridine', 'Uridine'],
        C9H12N2S: ['Prothionamide'],
        C9H12N6: ['Triethylenemelamine'],
        C9H12O2: ['Cumene hydroperoxide'],
        C9H12O4: ['MB-3'],
        C9H13N: ['Amphetamine', 'Dextroamphetamine', 'N-Methylphenethylamine'],
        C9H13NO: ['Phenylpropanolamine'],
        C9H13NO2: ['Ecgonidine', 'Phenylephrine', 'Synephrine'],
        C9H13NO3: ['Adrenaline'],
        C9H13N2O2: ['Pyridostigmine'],
        C9H13N2O8P: ['Deoxyuridine monophosphate'],
        C9H13N2O9P: ['Uridine monophosphate'],
        C9H13N3O4: ['Deoxycytidine'],
        C9H13N3O5: ['Cytarabine', 'Cytidine'],
        C9H13N5O4: ['Ganciclovir'],
        C9H13ClN6O2: ['Nimustine'],
        C9H14N2O12P2: ['Uridine diphosphate'],
        C9H14N3O7P: ['Deoxycytidine monophosphate'],
        C9H14N3O8P: ['Cytidine monophosphate'],
        C9H14N4O3: ['Carnosine'],
        C9H14O3: ['Boonein'],
        C9H14O6: ['Triacetin'],
        C9H14O7: ['Propylene glycol alginate'],
        C9H15NO3: ['Ecgonine'],
        C9H15N2O15P3: ['Uridine triphosphate'],
        C9H15N3O10P2: ['Deoxycytidine diphosphate'],
        C9H15N3O11P2: ['Cytidine diphosphate'],
        C9H16ClN3O2: ['Lomustine'],
        C9H16N3O13P3: ['Deoxycytidine triphosphate'],
        C9H16N3O14P3: ['Cytidine triphosphate'],
        C9H16Br2N5O4P: ['Evofosfamide'],
        C9H16O: ['2-Nonenal'],
        C9H16O4: ['Azelaic acid'],
        C9H17NO2: ['Gabapentin'],
        C9H17NO5: ['Pantothenic acid'],
        C9H17NO8: ['Neuraminic acid'],
        C9H18: ['Cyclononane', 'Nonene'],
        C9H18BF3O3S: ['Dibutylboron trifluoromethanesulfonate'],
        C9H18Cl3N2O2P: ['Trofosfamide'],
        C9H18N6: ['Altretamine'],
        C9H18O2: ['Pelargonic acid'],
        C9H18O6: ['Acetone peroxide'],
        C9H19NO4: ['Panthenol'],
        C9H19NO7: ['Choline bitartrate'],
        C9H19Cl2N2O5PS2: ['Mafosfamide'],
        C9H19ClN3O5P: ['Fotemustine'],
        C9H20: ['Nonane'],
        C9H21N4P: ['Verkade base'],

        C10HF19O2: ['Perfluorodecanoic acid'],
        C10HO9Co3: ['Methylidynetricobaltnonacarbonyl'],
        C10H2O6: ['Pyromellitic dianhydride'],
        C10H2O10Os3: ['Decacarbonyldihydridotriosmium'],
        C10H4N2Na2O8S: ['Naphthol yellow S'],
        C10H5F6IO4: ['(Bis(trifluoroacetoxy)iodo)benzene'],
        C10H6: ['Acepentalene'],
        C10H6MgN4O8: ['Magnesium orotate'],
        C10H6O2: ['Naphthoquinone'],
        C10H6O3: ['Juglone', 'Lawsone'],
        C10H6O6: ['Spinochrome B'],
        C10H6O7: ['Spinochrome D'],
        C10H6O8: ['Hexahydroxy-1,4-naphthalenedione'],
        C10H7Cl2N3O: ['Anagrelide'],
        C10H7N3S: ['Tiabendazole'],
        C10H7F: ['Fluoronaphthalene'],
        C10H7Cl: ['Chloronaphthalene'],
        C10H7Br: ['Bromonaphthalene'],
        C10H8: ['Azulene', 'Naphthalene'],
        C10H8Li: ['Lithium naphthalene'],
        C10H8N2O2S2Zn: ['Zinc pyrithione'],
        C10H8O: ['Naphthol'],
        C10H8MoO3: ['Cycloheptatrienemolybdenum tricarbonyl'],
        C10H8O4: ['Anemonin', 'Ethylene terephthalate', 'Furoin', 'Scopoletin'],
        C10H8Na: ['Sodium naphthalene'],
        C10H9N: ['Benzazepine'],
        C10H9NO2: ['Indole-3-acetic acid'],
        C10H9AgN4O2S: ['Silver sulfadiazine'],
        C10H9NaO4: ['Sodium ferulate'],
        C10H10: ['Divinylbenzene'],
        C10H10N3NaO5: ['Suosan'],
        C10H10N4OS: ['Metisazone'],
        C10H10N4O2S: ['Sulfadiazine'],
        C10H10O2: ['Safrole'],
        C10H10O3: ['Coniferyl aldehyde'],
        C10H10O4: ['Ferulic acid'],
        C10H10Mg: ['Magnesocene'],
        C10H10Cl2Ti: ['Titanocene dichloride'],
        C10H10Cl2V: ['Vanadocene dichloride'],
        C10H10Cl2Zr: ['Zirconocene dichloride'],
        C10H10Cl2Nb: ['Niobocene dichloride'],
        C10H10Cl2Mo: ['Molybdocene dichloride'],
        C10H10Mn: ['Manganocene'],
        C10H10Ni: ['Nickelocene'],
        C10H10Ru: ['Ruthenocene'],
        C10H10Os: ['Osmocene'],
        C10H11NO: ['Tryptophol'],
        C10H11NO3: ['Betamipron'],
        C10H11F3N2O5: ['Trifluridine'],
        C10H11N3O3S: ['Sulfamethoxazole'],
        C10H11N4Na2O8P: ['Disodium inosinate'],
        C10H11CaN4O8P: ['Calcium inosinate'],
        C10H11ClFN5O3: ['Clofarabine'],
        C10H11N5O6P: ['Cyclic adenosine monophosphate'],
        C10H11BrN5O6P: ['8-Bromoadenosine 3\',5\'-cyclic monophosphate'],
        C10H11BrN5O7P: ['8-Bromoguanosine 3\',5\'-cyclic monophosphate'],
        C10H11NaO2: ['Sodium phenylbut'],
        C10H11O4Na: ['Lactisole'],
        C10H11IO4: ['(Diacetoxyiodo)benzene'],
        C10H12ClNO2: ['Baclofen'],
        C10H12N2: ['Tryptamine'],
        C10H12N2O: ['Serotonin'],
        C10H12N2O5S: ['7-ACA'],
        C10H12MgN2O6: ['Magnesium pidolate'],
        C10H12N2O6S: ['Ritipenem'],
        C10H12FeN2NaO8: ['Ferric sodium EDTA'],
        C10H12CaN2Na2O8: ['Sodium calcium edetate'],
        C10H12N4OS: ['Thioacetazone'],
        C10H12N4O5: ['Inosine'],
        C10H12N4O5S: ['Tazobactam'],
        C10H12N4O6: ['Xanthosine'],
        C10H12ClN5O3: ['Cladribine'],
        C10H12FN5O4: ['Fludarabine'],
        C10H12N5O7P: ['Cyclic guanosine monophosphate'],
        C10H12N5Na2O8P: ['Disodium guanylate'],
        C10H12K2N5O8P: ['Dipotassium guanylate'],
        C10H12CaN5O8P: ['Calcium guanylate'],
        C10H12O: ['Anethole', 'Cuminaldehyde'],
        C10H12O2: ['Eugenol', 'Hinokitiol', 'Raspberry ketone', 'Thujaplicin', 'Thymoquinone'],
        C10H12O3: ['Carvonic acid', 'Coniferyl alcohol', 'Canolol', 'Isopropylparaben', 'Propylparaben'],
        C10H12O4: ['Acetosyringone', 'Cantharidin'],
        C10H12O5: ['Propyl gallate'],
        C10H12Mo: ['Molybdocene dihydride'],
        C10H13NO: ['Kairine'],
        C10H13NO2: ['3,4-Methylenedioxyamphetamine', 'Phenacetin'],
        C10H13NO4: ['Methyldopa'],
        C10H13ClN2O3S: ['Chlorpropamide'],
        C10H13FN2O5: ['Clevudine'],
        C10H13N2O11P: ['Orotidine 5\'-monophosphate'],
        C10H13N3O5S: ['Nifurtimox'],
        C10H13N4O7P: ['Deoxyinosine monophosphate'],
        C10H13N4O8P: ['Inosinic acid'],
        C10H13N4O9P: ['Xanthosine monophosphate'],
        C10H13N5O3: ['Cordycepin', 'Deoxyadenosine'],
        C10H13N5O4: ['Adenosine', 'Deoxyguanosine', 'Vidarabine', 'Zidovudine'],
        C10H13N5O5: ['Guanosine'],
        C10H14: ['Cymene'],
        C10H14NO5PS: ['Parathion'],
        C10H14N2: ['Nicotine'],
        C10H14N2O4: ['Carbidopa', 'Porphobilinogen'],
        C10H14N2O5: ['Telbivudine', 'Thymidine'],
        C10H14N2O8P1: ['Thymidine monophosphate'],
        C10H14FN3O4: ['PSI-6130'],
        C10H14N5O4P: ['Besifovir'],
        C10H14N5O6P: ['Deoxyadenosine monophosphate'],
        C10H14N5O7P: ['Adenosine monophosphate', 'Deoxyguanosine monophosphate'],
        C10H14N5O8P: ['Guanosine monophosphate'],
        C10H14O: ['Carvacrol', 'Carvone', 'Chrysanthenone', 'Levoverbenone', 'Menthofuran', 'Myrtenal', 'Perillaldehyde', 'Perillene', 'Safranal', 'Thymol', 'Umbellulone', 'Verbenone'],
        C10H14O2: ['Camphorquinone', 'Dolichodial', 'Nepetalactone', '8-Oxogeranial', 'Perilla ketone', 'tert-Butylhydroquinone', 'Wine lactone'],
        C10H14O4: ['7-Deoxyloganetic acid', 'Guaifenesin'],
        C10H14BaO4: ['Barium acetylacetonate'],
        C10H14O5V: ['Vanadyl acetylacetonate'],
        C10H14MgO6: ['Magnesium levulinate'],
        C10H15N: ['Levomethamphetamine', 'Methamphetamine', 'Phentermine'],
        C10H15NO: ['Anatoxin-a', 'Ephedrine', 'Hordenine', 'Perillartine', 'Pseudoephedrine'],
        C10H15NO2: ['Methylecgonidine'],
        C10H15NO4: ['Kainic acid'],
        C10H15N4O14P3: ['Inosine triphosphate'],
        C10H15N5O3: ['Penciclovir'],
        C10H15N5O9P2: ['Deoxyadenosine diphosphate'],
        C10H15N5O10P2: ['Adenosine diphosphate', 'Deoxyguanosine diphosphate'],
        C10H15N5O11P2: ['Guanosine diphosphate'],
        C10H15Br2Cl3: ['Halomon'],
        C10H16: ['Camphene', '3-Carene', 'Limonene', 'Myrcene', 'Ocimene', 'Phellandrene', 'Pinene', 'Sabinene', 'Terpinene', 'Thujene', 'Turpentine'],
        C10H16Br2N2O2: ['Pipobroman'],
        C10H16N2O3S: ['Biotin'],
        C10H16N2O4S3: ['Dorzolamide'],
        C10H16N2O8: ['Ethylenediaminetetraacetic acid'],
        C10H16MgN2O8: ['Magnesium diglutamate'],
        C10H16CaN2O8: ['Calcium diglutamate'],
        C10H16N2O11P2: ['Thymidine diphosphate'],
        C10H16N4O3: ['Anserine'],
        C10H16N5O12P3: ['Deoxyadenosine triphosphate'],
        C10H16N5O13P3: ['Adenosine triphosphate', 'Deoxyguanosine triphosphate'],
        C10H16N5O14P3: ['Guanosine triphosphate'],
        C10H16O: ['Camphor', 'Carveol', 'Citral', 'Fenchone', '(S)-Ipsdienol', 'Myrtenol', 'Perillyl alcohol', 'Pinocarveol', 'Piperitone', 'Pulegone', 'Thujone', 'Verbenol'],
        C10H16O2: ['Ascaridole', 'Chrysanthemic acid', 'Geranic acid', 'Iridodial', 'Iridomyrmecin', 'Lineatin', 'Nepetalactol', 'Nerolic acid'],
        C10H16O4S: ['Camphorsulfonic acid'],
        C10H17N: ['Amantadine'],
        C10H17NO9S2: ['Sinigrin'],
        C10H17N2O14P3: ['Thymidine triphosphate'],
        C10H17N2O15P3: ['5-Methyluridine triphosphate'],
        C10H17N3O6S: ['Glutathione'],
        C10H17N3S: ['Pramipexole'],
        C10H17O7P2: ['Geranyl pyrophosphate'],
        C10H18: ['Bornane', 'Pinane'],
        C10H18ClN3O2: ['Semustine'],
        C10H18ClN3O7: ['Ranimustine'],
        C10H18N4O6: ['Argininosuccinic acid'],
        C10H18O: ['Borneol', 'Citronellal', 'Eucalyptol', 'Fenchol', 'Geraniol', 'Grandisol', 'Isoborneol', 'Lavandulol', 'Linalool', 'Menthone', 'Menthoxypropanediol', 'Myrcenol', 'Nerol', '2-Pinanol', 'Rose oxide', 'Terpinen-4-ol', 'Terpineol'],
        C10H18O2: ['8-Hydroxygeraniol', 'Sobrerol'],
        C10H18O3: ['Epomediol'],
        C10H18O21S4: ['Pentosan polysulfate'],
        C10H18S: ['Grapefruit mercaptan'],
        C10H19O6PS2: ['Malathion'],
        C10H20: ['Cyclodecane', 'Decene'],
        C10H20N2S4: ['Disulfiram'],
        C10H20O: ['Citronellol', 'Menthol', 'Rhodinol'],
        C10H20O2: ['Capric acid', 'Hydroxycitronellal', 'p-Menthane-3,8-diol', 'Paramenthane hydroperoxide'],
        C10H21N: ['Propylhexedrine'],
        C10H21N3O: ['Diethylcarbamazine'],
        C10H22: ['Decane'],
        C10H22Cl2N2O4Pt: ['Satraplatin'],
        C10H22O14S4: ['Mannosulfan'],
        C10H23N3O3: ['Hypusine'],
        C10H24N2O2: ['Ethambutol'],
        C10H25O5Nb: ['Niobium(V) ethoxide'],
        C10H25O5Ta: ['Tantalum(V) ethoxide'],
        C10H30N5Ta: ['Pentakis(dimethylamido)tantalum'],

        C11H6O3: ['Angelicin', 'Psoralen'],
        C11H8O2: ['Menadione'],
        C11H8O3: ['Plumbagin'],
        C11H8O5: ['Purpurogallin'],
        C11H8Na4O8P2: ['Kappadione'],
        C11H9N: ['2-Phenylpyridine'],
        C11H9I3N2O4: ['Diatrizoate'],
        C11H10BrN5: ['Brimonidine'],
        C11H10O4: ['Scoparone'],
        C11H10O6: ['Dipyrocetyl'],
        C11H12N2O: ['Phenazone'],
        C11H12N2O2: ['Idazoxan', 'Tryptophan'],
        C11H12Cl2N2O5: ['Chloramphenicol'],
        C11H12N2S: ['Levamisole'],
        C11H12O4: ['Sinapaldehyde'],
        C11H12O5: ['Sinapinic acid'],
        C11H13NO4: ['Bendiocarb'],
        C11H13NO6: ['Caramboxin'],
        C11H13NNa2O7S2: ['Disufenton sodium'],
        C11H13BrN2O5: ['Brivudine'],
        C11H13BrN2O6: ['Sorivudine'],
        C11H13N3O1: ['Ampyrone'],
        C11H13N3O3S: ['Sulfafurazole'],
        C11H13N5O3: ['Filociclovir'],
        C11H13BrFN7O4S: ['Epacadostat'],
        C11H14N2: ['N-Methyltryptamine'],
        C11H14N2S: ['Pyrantel'],
        C11H14O2: ['Actinidiolide'],
        C11H14O3: ['Butylparaben'],
        C11H14O4: ['Sinapyl alcohol'],
        C11H14O5: ['Genipin', 'Sarracenin'],
        C11H15NO2: ['MDMA'],
        C11H15NO5: ['Methocarbamol'],
        C11H15N5O3: ['Galidesivir', 'Lobucavir'],
        C11H15N5O5: ['Nelarabine'],
        C11H16INO2: ['2,5-Dimethoxy-4-iodoamphetamine'],
        C11H16N2O2: ['Pilocarpine'],
        C11H16N2O3: ['Butalbital'],
        C11H16N2O4S: ['Thienamycin'],
        C11H16N2O8: ['N-Acetylaspartylglutamic acid'],
        C11H16FN3O3: ['Carmofur'],
        C11H16N4O4: ['Acetylcarnosine', 'Pentostatin'],
        C11H16ClN5: ['Proguanil'],
        C11H16O2: ['Butylated hydroxyanisole', 'Dihydroactinidiolide', 'Jasmolone'],
        C11H17NO3: ['Mescaline'],
        C11H17N2NaO2S: ['Sodium thiopental'],
        C11H17N3O: ['Triacsin C'],
        C11H17N3O8: ['Tetrodotoxin'],
        C11H18N2O3: ['Amobarbital', 'Pentobarbital'],
        C11H19NO8: ['N-Acetylmuramic acid'],
        C11H19NO9: ['N-Acetylneuraminic acid'],
        C11H19NO10: ['N-Glycolylneuraminic acid'],
        C11H19NO10S2: ['Progoitrin'],
        C11H19N3O6: ['Ophthalmic acid'],
        C11H20O: ['2-Methylisoborneol'],
        C11H20O2: ['Undecylenic acid'],
        C11H21NO3: ['Ethyl butylacetylaminopropionate'],
        C11H22: ['Cycloundecane', 'Undecene'],
        C11H22N2O4S: ['Pantetheine'],
        C11H22O2: ['Undecylic acid'],
        C11H24: ['Undecane'],

        C12H5Cl5: ['Pentachlorobiphenyl'],
        C12H6Cl4O2S: ['Bithionol'],
        C12H7Cl3O2: ['Triclosan'],
        C12H8: ['Acenaphthylene'],
        C12H8N2: ['1,10-Phenanthroline'],
        C12H8N2O2: ['Questiomycin A'],
        C12H8O2: ['Dibenzo-1,4-dioxin'],
        C12H8Cl2: ['Dichlorobiphenyl'],
        C12H9N: ['Carbazole'],
        C12H9N2NaO5S: ['Chrysoine resorcinol'],
        C12H9NaO: ['Sodium orthophenyl phenol'],
        C12H9P: ['Phosphaphenalene'],
        C12H10: ['Acenaphthene', 'Biphenyl'],
        C12H10N3O3P: ['Diphenylphosphoryl azide'],
        C12H10N5NaO6S: ['Mordant brown 33'],
        C12H10O: ['Diphenyl ether', '2-Phenylphenol'],
        C12H10O7: ['Echinochrome A'],
        C12H10Mg3O14: ['Trimagnesium citrate'],
        C12H10Ca3O14: ['Calcium citrate'],
        C12H10S2: ['Diphenyl disulfide'],
        C12H10Se2: ['Diphenyl diselenide'],
        C12H11N: ['Diphenylamine'],
        C12H11ClN2O5S: ['Furosemide'],
        C12H11N3O6S2: ['Fast Yellow AB'],
        C12H11N7: ['Triamterene'],
        C12H12N2: ['4-Aminodiphenylamine'],
        C12H12N2O: ['4,4\'-Oxydianiline'],
        C12H12I3N2NaO2: ['Ipodate sodium'],
        C12H12N2O2S: ['Dapsone'],
        C12H12N2O3: ['Phenobarbital'],
        C12H12N4O3: ['Benznidazole'],
        C12H12Cl2O3: ['Protamine sulfate'],
        C12H12MoO3: ['(Mesitylene)molybdenum tricarbonyl'],
        C12H13N3O2: ['Triaziquone'],
        C12H13N3O3S: ['Fexinidazole'],
        C12H13ClN4: ['Pyrimethamine'],
        C12H14N2O2: ['Primidone'],
        C12H14N4O4S: ['Sulfadoxine'],
        C12H14Cl3O4P: ['Chlorfenvinphos'],
        C12H14CaO4: ['Calcium erythorbate', 'Calcium sorbate'],
        C12H14CaO12: ['Calcium alginate', 'Calcium ascorbate'],
        C12H15N: ['MPTP'],
        C12H15NO5S: ['Faropenem'],
        C12H15NO5S3: ['Sulopenem'],
        C12H15N3O2S: ['Albendazole'],
        C12H15N5O3: ['Entecavir'],
        C12H15AsN6OS2: ['Melarsoprol'],
        C12H16BNO5S: ['Vaborbactam'],
        C12H16F3N: ['Fenfluramine'],
        C12H16N2: ['Dimethyltryptamine'],
        C12H16N2O: ['Psilocin'],
        C12H16N4O3: ['Iprazochrome'],
        C12H16N4O4: ['MK-608'],
        C12H16O3: ['Vibralactone'],
        C12H16O4: ['Olivetolic acid', 'Vibralactone B'],
        C12H17NO: ['DEET'],
        C12H17NO2: ['Ciclopirox'],
        C12H17NO3: ['Bucetin', 'Cerulenin'],
        C12H17N2O4P: ['Psilocybin'],
        C12H17N3O4S: ['Imipenem'],
        C12H18Be4O13: ['Basic beryllium acetate'],
        C12H18NNaSi2: ['Sodium bis(trimethylsilyl)amide'],
        C12H18N2O2S: ['Thiamylal'],
        C12H18N2O3: ['Secobarbital'],
        C12H18N2O3S: ['Tolbutamide'],
        C12H18N2O4: ['Midodrine'],
        C12H18N4OSCl2: ['Thiamine hydrochloride'],
        C12H18O: ['Propofol'],
        C12H18O2: ['2,5-Dimethoxy-p-cymene', '4-Hexylresorcinol'],
        C12H18O3: ['Vibralactone D', 'Vibralactone K'],
        C12H18O12CaMg2: ['Calcium magnesium acetate'],
        C12H18Ni: ['trans,trans,trans-(1,5,9-Cyclododecatriene)nickel(0)'],
        C12H19NO20S3: ['Heparin'],
        C12H19N2O2: ['Neostigmine'],
        C12H19N3O: ['Procarbazine'],
        C12H19N4O10P3S: ['Thiamine triphosphate'],
        C12H19Cl3O8: ['Sucralose'],
        C12H20N2O3S: ['Sotalol'],
        C12H20N2O8: ['Mugineic acid'],
        C12H20N2O8Pt: ['Dicycloplatin'],
        C12H20N4O6S: ['Relebactam'],
        C12H20O2: ['Bornyl acetate', 'Geranyl acetate', 'Isobornyl acetate', 'Lavandulyl acetate', 'Linalyl acetate'],
        C12H20O7: ['Triethyl citrate'],
        C12H20O10: ['Cellulose'],
        C12H21N: ['Memantine', 'Rimantadine'],
        C12H21NO8S: ['Topiramate'],
        C12H21N3O3: ['Pyrrolysine'],
        C12H21N3O6: ['Nicotianamine'],
        C12H21N5O3: ['Choline theophyllinate'],
        C12H22O: ['Geosmin'],
        C12H22O2: ['Menthyl acetate'],
        C12H22O6: ['Etoglucid'],
        C12H22O10: ['Neohesperidose', 'Robinin', 'Robinose', 'Rutinose'],
        C12H22O11: ['Lactose', 'Lactulose', 'Maltose', 'Sucrose'],
        C12H22O12: ['Lactobionic acid'],
        C12H22MgO14: ['Magnesium gluconate'],
        C12H22CaO14: ['Calcium gluconate'],
        C12H22O14Fe: ['Iron(II) gluconate'],
        C12H22O14Zn: ['Zinc gluconate'],
        C12H23LiO2: ['Lithium laurate'],
        C12H23NO3: ['Icaridin'],
        C12H23NO10S3: ['Glucoraphanin'],
        C12H23NaO2: ['Sodium laurate'],
        C12H24: ['Cyclododecane', 'Dodecene'],
        C12H24B2O4: ['Bis(pinacolato)diboron'],
        C12H24O2: ['Lauric acid'],
        C12H24O8: ['Acetone peroxide'],
        C12H24O11: ['Isomalt', 'Lactitol', 'Maltitol'],
        C12H25O: ['Dodecanol'],
        C12H25NaSO4: ['Sodium dodecyl sulfate'],
        C12H26: ['Dodecane'],
        C12H27N3Sn: ['Tributyltin azide'],
        C12H27NaOSi: ['Sodium silox'],
        C12H28BLi: ['L-selectride'],
        C12H28N5O14Fe: ['Ammonium ferric citrate'],
        C12H28O4Ti: ['Titanium isopropoxide'],
        C12H28Sn: ['Tributyltin hydride'],
        C12H30B2: ['Thexylborane'],
        C12H30Al2: ['Triethylaluminum'],
        C12H36I4Pt4: ['Trimethylplatinum iodide'],
        C12H38Na3O26Sb2: ['Sodium stibogluconate'],
        C12H54Al16O75S8: ['Sucralfate'],
        C12O12Ru3: ['Triruthenium dodecacarbonyl'],
        C12O12Os3: ['Triosmium dodecacarbonyl'],

        C13H6Cl6O2: ['Hexachlorophene'],
        C13H8Cl2N2O4: ['Niclosamide'],
        C13H8N3NaO5: ['Alizarine Yellow R'],
        C13H8O: ['Fluorenone'],
        C13H8O2: ['Fluorone', 'Xanthone'],
        C13H8O4: ['Urolithin A'],
        C13H9N: ['Acridine'],
        C13H9BrClNO2: ['Bromochlorosalicylanilide'],
        C13H9Cl3N2O: ['Triclocarban'],
        C13H10: ['Fluorene', 'Phenalene'],
        C13H10Li2N4O9S2: ['Lucifer yellow'],
        C13H10N2O4: ['Thalidomide'],
        C13H10O: ['Xanthene'],
        C13H10O3: ['4,4\'-Dihydroxybenzophenone', 'Diphenyl carbonate'],
        C13H11NO2: ['Salicylanilide'],
        C13H12N2O: ['Harmine'],
        C13H12N2O5S: ['Nimesulide'],
        C13H12F2N6O: ['Fluconazole'],
        C13H12O8: ['Coutaric acid'],
        C13H12O9: ['Caftaric acid'],
        C13H13N3: ['Varenicline'],
        C13H13N3O3: ['Lenalidomide'],
        C13H13N5O5S2: ['Ceftizoxime'],
        C13H13F2N6O4P: ['Fosfluconazole'],
        C13H13IO8: ['Dess–Martin periodinane'],
        C13H14N2O: ['Harmaline'],
        C13H14N4O4: ['NITD008'],
        C13H14O5: ['Citrinin'],
        C13H16: ['1,1,6-Trimethyl-1,2-dihydronaphthalene'],
        C13H16ClNO: ['Ketamine'],
        C13H16N2: ['Tetryzoline'],
        C13H16N2O: ['Tetrahydroharmine'],
        C13H16N2O2: ['Melatonin'],
        C13H16N2O4S2: ['Almecillin'],
        C13H16N4O: ['Veliparib'],
        C13H16N6O4: ['Triciribine'],
        C13H17NO: ['Crotamiton'],
        C13H17ClN2O2: ['Moclobemide'],
        C13H17N3: ['Tramazoline'],
        C13H17N3O: ['Aminophenazone'],
        C13H17N3O4S: ['Metamizole'],
        C13H17N5O8S2: ['Aztreonam'],
        C13H18ClNO: ['Bupropion'],
        C13H18N2: ['α,N,N-Trimethyltryptamine'],
        C13H18N2O: ['5-MeO-DMT'],
        C13H18Br2N2O: ['Ambroxol'],
        C13H18Cl2N2O2: ['Melphalan'],
        C13H18O: ['Damascenone'],
        C13H18O2: ['Ibuprofen'],
        C13H18O7: ['Salicin'],
        C13H19NO: ['Dimethylaminopivalophenone'],
        C13H20N2O2: ['Dropropizine', 'Levodropropizine', 'Procaine'],
        C13H20N6O4: ['Valaciclovir'],
        C13H20O: ['Damascone', 'Ionone'],
        C13H21NO3: ['Salbutamol'],
        C13H21NO4: ['Meteloidine'],
        C13H21N3S2: ['Vedaclidine'],
        C13H21N5O2: ['Tezampanel'],
        C13H22N4O3S: ['Ranitidine'],
        C13H22O: ['Geranylacetone'],
        C13H23N: ['Adapromine'],
        C13H24N2O: ['Cuscohygrine'],
        C13H24N4O3: ['Melanocyte-inhibiting factor'],
        C13H24N4O3S: ['Timolol'],
        C13H26: ['Cyclotridecane', 'Tridecene'],
        C13H26N2O: ['Dihydrocuscohygrine'],
        C13H26O2: ['Tridecylic acid'],
        C13H28: ['Tridecane'],

        C14H6O8: ['Ellagic acid'],
        C14H7NaO5S: ['Sodium 2-anthraquinonesulfonate'],
        C14H8N2Na2O10S2: ['Disodium 4,4\'-dinitrostilbene-2,2\'-disulfonate'],
        C14H8O2: ['Anthraquinone'],
        C14H8O8: ['Rufigallol'],
        C14H9ClF3NO2: ['Efavirenz'],
        C14H9Cl2F3N2O: ['Halocarban'],
        C14H9Cl3N2OS: ['Triclabendazole'],
        C14H9Cl5: ['DDT'],
        C14H10: ['Anthracene', 'Phenanthrene'],
        C14H10BNO3: ['Crisaborole'],
        C14H10O4: ['Benzoyl peroxide'],
        C14H10MgO4: ['Magnesium benzoate'],
        C14H10CaO4: ['Calcium benzoate'],
        C14H10MgO6: ['Magnesium salicylate'],
        C14H10Cl4: ['Mitotane'],
        C14H11Cl2NO2: ['Diclofenac'],
        C14H11Cl2NO4: ['Diloxanide'],
        C14H11ClN2O4S: ['Chlortalidone'],
        C14H12ClNO2: ['Tolfenamic acid'],
        C14H12O2: ['Benzyl benzoate'],
        C14H13BN2O3S: ['Diazaborine B'],
        C14H13N3O4S2: ['Meloxicam'],
        C14H13N5O5S2: ['Cefdinir'],
        C14H14INO: ['o-Phenyl-3-iodotyramine'],
        C14H14INO2: ['3-Iodothyronamine'],
        C14H14N2: ['Naphazoline'],
        C14H14N2O: ['Metyrapone'],
        C14H14N3NaO3S: ['Methyl orange'],
        C14H14N4O4: ['Terizidone'],
        C14H14N8O4S3:['Cefazolin'],
        C14H14O3: ['Naproxen'],
        C14H14O4: ['Marmesin'],
        C14H14O9: ['Fertaric acid'],
        C14H15Cl2N: ['Chlornaphazine'],
        C14H15N5O6S2: ['Cefdaloxime'],
        C14H16: ['Chamazulene'],
        C14H16BNO: ['2-Aminoethoxydiphenyl borate'],
        C14H16N2: ['Ergoline'],
        C14H16N2Na2O6S3: ['Sulfoxone'],
        C14H16N4: ['Imiquimod'],
        C14H17N3O: ['Frovatriptan'],
        C14H18N2: ['Ciclindole'],
        C14H18N2O: ['Propyphenazone', 'Tabernanthalog'],
        C14H18N2O5: ['Aspartame'],
        C14H18N4O3: ['Trimethoprim'],
        C14H18N4O9: ['Caffeine citrate'],
        C14H18N6O: ['Abacavir'],
        C14H18O3: ['Gyrinal'],
        C14H19BCl2N2O4: ['Ixazomib'],
        C14H19NO: ['Ethoxyquin'],
        C14H19NO2: ['Dexmethylphenidate', 'Methylphenidate'],
        C14H19Cl2NO2: ['Chlorambucil'],
        C14H19NO4: ['Anisomycin'],
        C14H19NO9S2: ['Glucotropaeolin'],
        C14H19N5O4: ['Famciclovir'],
        C14H20N2O: ['AAZ-A-154'],
        C14H20N2O3: ['Vorinostat'],
        C14H20Br2N2: ['Bromhexine'],
        C14H20O3: ['Heptylparaben'],
        C14H20O4: ['Vibralactone L'],
        C14H21NO2: ['Amylocaine'],
        C14H21NO11: ['Hyaluronic acid'],
        C14H21NO15S: ['Dermatan sulfate'],
        C14H21N3O2S: ['Sumatriptan'],
        C14H21N3O3: ['Oxamniquine'],
        C14H21N5O2S: ['Abrocitinib'],
        C14H22NNaO11: ['Sodium hyaluronate'],
        C14H22N2O: ['Lidocaine'],
        C14H22N2O3: ['Atenolol'],
        C14H22ClN3O2: ['Metoclopramide'],
        C14H22CuN6O4: ['Copper peptide GHK-Cu'],
        C14H22N6O5: ['Valganciclovir'],
        C14H22O: ['Norpatchoulenol'],
        C14H22O2: ['Rishitin'],
        C14H23NO: ['Tapentadol'],
        C14H24N2O7: ['Spectinomycin'],
        C14H24N4O6: ['Rhodotorulic acid'],
        C14H24N6O4: ['Glycyl-L-histidyl-L-lysine'],
        C14H25N3O4S: ['Alitame'],
        C14H25N3O14P2: ['4-Diphosphocytidyl-2-C-methylerythritol'],
        C14H26N3O17P3: ['4-Diphosphocytidyl-2-C-methyl-D-erythritol 2-phosphate'],
        C14H26O9S: ['Bacopaside A'],
        C14H28: ['Cyclotetradecane', 'Tetradecene'],
        C14H28O2: ['Myristic acid'],
        C14H29NaO4S: ['Sodium tetradecyl sulfate'],
        C14H30: ['Tetradecane'],
        C14H30Cl2N2O4: ['Suxamethonium chloride'],

        C15H8O6: ['Rhein'],
        C15H10N2O2: ['Methylene diphenyl diisocyanate'],
        C15H10Cl2N2O2: ['Lonidamine', 'Lorazepam'],
        C15H10ClN3O3: ['Clonazepam'],
        C15H10O2: ['Flavone'],
        C15H10O4: ['Chrysin', 'Chrysophanol', 'Daidzein'],
        C15H10O5: ['Apigenin', 'Emodin', 'Aloe emodin'],
        C15H10O6: ['Kaempferol', 'Luteolin', 'Orobol'],
        C15H10O7: ['Quercetin'],
        C15H10O8: ['Myricetin'],
        C15H11I3NNaO4: ['Liothyronine'],
        C15H11I4NO4: ['Thyroxine', 'Levothyroxine'],
        C15H12ClNO2: ['Carprofen'],
        C15H12I3NO4: ['Reverse triiodothyronine', 'Triiodothyronine'],
        C15H12N2O: ['Carbamazepine'],
        C15H12N2O2: ['Oxcarbazepine', 'Phenytoin'],
        C15H12O: ['Chalcone'],
        C15H12Cl2F4O2: ['Transfluthrin'],
        C15H12Br4O2: ['Tetrabromobisphenol A'],
        C15H12O5: ['Naringenin'],
        C15H12O6: ['Aromadendrin', 'Eriodictyol'],
        C15H13NO3: ['Ketorolac'],
        C15H13N3O2S: ['Fenbendazole'],
        C15H13FO2: ['Flurbiprofen', 'Tarenflurbil'],
        C15H14N2O4S: ['Belinostat'],
        C15H14ClN3O4S: ['Cefaclor'],
        C15H14N4O: ['Nevirapine'],
        C15H14N4O6S2: ['Ceftibuten'],
        C15H14O: ['Dihydrochalcone'],
        C15H14O3: ['Equol', 'Lapachol'],
        C15H14O5: ['Phloretin'],
        C15H14O6: ['Catechin'],
        C15H14O7: ['Gallocatechol'],
        C15H15N: ['Centanafadine'],
        C15H15NO2: ['Diphenylalanine'],
        C15H16N2O4: ['Apaziquone'],
        C15H16N2O6S2: ['Ticarcillin'],
        C15H16O2: ['Bisphenol A'],
        C15H17FN4O2: ['Flupirtine'],
        C15H17N5O6S2: ['Cefpodoxime'],
        C15H17N7O5S3: ['Cefmetazole'],
        C15H18: ['Cadalene', 'Guaiazulene', 'Vetivazulene'],
        C15H18FNO2: ['3β-(p-Fluorobenzoyloxy)tropane'],
        C15H18N2: ['N-Isopropyl-N\'-phenyl-1,4-phenylenediamine'],
        C15H18N4O4S: ['Biapenem'],
        C15H18N4O5: ['Mitomycin C'],
        C15H18F2N6O7S2: ['Flomoxef'],
        C15H18O2: ['Curzerenone'],
        C15H18O3: ['Irofulven', 'Xanthatin'],
        C15H18O8: ['Bilobalide'],
        C15H19NO2: ['Tropacocaine'],
        C15H19NO3: ['Hydroxytropacocaine'],
        C15H19Cl2N3O4: ['Maribavir'],
        C15H19N3O5: ['Carboquone'],
        C15H19N5: ['Rizatriptan'],
        C15H20O: ['Curzerene', 'Mutisianthol', 'Turmerone'],
        C15H20O2: ['Dictyophorine', 'Velleral'],
        C15H20O3: ['Illudin M', 'Parthenolide', 'Periplanone B'],
        C15H20O4: ['Abscisic acid', 'Illudin S', 'Santonic acid'],
        C15H20O5: ['Koningic acid', 'Phaseic acid'],
        C15H20O6: ['Vomitoxin'],
        C15H21NO2: ['Desmethylprodine', 'Ketobemidone', 'Pethidine'],
        C15H21NO9S2: ['Gluconasturtiin'],
        C15H21N3O: ['Primaquine'],
        C15H21N3O3S: ['Gliclazide'],
        C15H21N3O4S: ['Panipenem'],
        C15H21NaO5S: ['Sodium nonanoyloxybenzenesulfonate'],
        C15H21O6Ce: ['Cerium(III) acetylacetonate'],
        C15H21O6Dy: ['Dysprosium acetylacetonate'],
        C15H21O6Ho: ['Holmium acetylacetonate'],
        C15H21O6Ir: ['Iridium acetylacetonate'],
        C15H22BKN6: ['Potassium tris(3,5-dimethyl-1-pyrazolyl)borate'],
        C15H22N2O18P2: ['Uridine diphosphate glucuronic acid'],
        C15H22FN3O6: ['Capecitabine'],
        C15H22O: ['Cyperotundone', 'Germacrone', 'Mustakone', 'Nootkatone', 'Rotundone', 'α-Vetivone'],
        C15H22O2: ['Polygodial'],
        C15H22O3: ['Gemfibrozil', 'Nardosinone', 'Sterpuric acid'],
        C15H22O5: ['Artemisinin', 'Octyl gallate'],
        C15H22O9: ['Aucubin'],
        C15H22O10: ['Catalpol'],
        C15H23N3O3S: ['Mecillinam'],
        C15H23N5O2S: ['Oclacitinib'],
        C15H23N5O4: ['Kyotorphin'],
        C15H24: ['Amorpha-4,11-diene', 'Aristolochene', 'Bergamotene', 'Bisabolene', 'Cadinenes', 'Caryophyllene', 'Cedrene', 'Chamigrene', 'Copaene', 'Cubebene', 'Elemene', 'Farnesene', 'Germacrene', 'Guaiene', 'Humulene', 'Isocomene', 'Longifolene', 'Selinene', 'Thujopsene', 'Valencene', 'Zingiberene'],
        C15H24N2O2: ['Tetracaine'],
        C15H24N2O17P2: ['Uridine diphosphate galactose', 'Uridine diphosphate glucose'],
        C15H24N4O6: ['Valopicitabine'],
        C15H24N4O6S2: ['Doripenem'],
        C15H24O: ['Butylated hydroxytoluene', 'Khusimol', 'Nonylphenol', 'Santalol', 'Spathulenol'],
        C15H24O2: ['Capsidiol', 'Curdione', 'Hernandulcin'],
        C15H24O3: ['Bisacurone'],
        C15H24O5: ['Dihydroartemisinin'],
        C15H25BO2: ['4-Nonylphenylboronic acid'],
        C15H25NO3: ['Metoprolol'],
        C15H25N3O: ['Lisdexamfetamine'],
        C15H25N3O5: ['Zelquistinel'],
        C15H25N3O16P2: ['Cytidine diphosphate glucose'],
        C15H26O: ['Bisabolol', 'α-Cadinol', 'δ-Cadinol', 'Capnellene', 'Carotol', 'Cedrol', 'Cubebol', 'Farnesol', 'Guaiol', 'Ledol', 'Nerolidol', 'Patchoulol'],
        C15H28: ['Drimane'],
        C15H28NNaO3: ['Sodium lauroyl sarcosinate'],
        C15H28O7P2: ['Farnesyl pyrophosphate'],
        C15H30O2: ['Pentadecylic acid'],
        C15H32: ['Pentadecane'],

        C16H6O6: ['BPDA'],
        C16H7Na3O10S3: ['Pyranine'],
        C16H8Br2N2O2: ['6,6′-Dibromoindigo'],
        C16H8N2Na2O8S2: ['Indigo carmine'],
        C16H9N4Na3O9S2: ['Tartrazine'],
        C16H10: ['Fluoranthene', 'Pyrene'],
        C16H10N2O2: ['Indigo dye'],
        C16H10N2Na2O7S2: ['Orange G', 'Orange GGN', 'Sunset yellow FCF'],
        C16H10N4Na2O7S2: ['Yellow 2G'],
        C16H10MgO10: ['Magnesium monoperoxyphthalate'],
        C16H11N2NaO4S: ['Acid Orange 7'],
        C16H11AsN2O10S2: ['Thorin'],
        C16H11N3Na2O7S2: ['D&C Red 33'],
        C16H12O5: ['Parietin'],
        C16H13ClN2O: ['Diazepam'],
        C16H13ClN2O2: ['Temazepam'],
        C16H13N3O3: ['Mebendazole'],
        C16H14F3N3O2S: ['Lansoprazole', 'Dexlansoprazole'],
        C16H14F3N5O: ['Voriconazole'],
        C16H14O3: ['Ketoprofen'],
        C16H14O5: ['Sakuranetin'],
        C16H14O6: ['Haematoxylin', 'Hesperetin', 'Homoeriodictyol', 'Sterubin'],
        C16H15Cl2N: ['Dasotraline', 'Desmethylsertraline', 'Indatraline'],
        C16H15F2N3O4S: ['Pantoprazole'],
        C16H15N5: ['DAPI'],
        C16H15F6N5O: ['Sitagliptin'],
        C16H15N5O7S2: ['Cefixime'],
        C16H15Cl3O2: ['Methoxychlor'],
        C16H16ClNO2S: ['Clopidogrel'],
        C16H16N2O2: ['Lysergic acid'],
        C16H16N2O6S2: ['Cefalotin'],
        C16H16ClN3O4: ['Loracarbef'],
        C16H16N4O8S: ['Cefuroxime'],
        C16H16O5: ['Alkannin'],
        C16H16O6: ['Nigrosporin B'],
        C16H17N2NaO4S: ['Penicillin G sodium'],
        C16H17KN2O4S: ['Penicillin G potassium'],
        C16H17N3O: ['Ergine'],
        C16H17N3O4S: ['Cefalexin'],
        C16H17N3O5S: ['Cefadroxil'],
        C16H17N3O7S2: ['Cefoxitin'],
        C16H17N5O7S2: ['Cefotaxime'],
        C16H17N7O2S: ['Baricitinib'],
        C16H17N9O5S3: ['Cefmenoxime'],
        C16H18N2O4S: ['Benzylpenicillin'],
        C16H18N2O5S: ['Phenoxymethylpenicillin'],
        C16H18N2O7S2: ['Temocillin'],
        C16H18ClN3S: ['Methylene blue'],
        C16H18N6O: ['Delgocitinib'],
        C16H18O9: ['Chlorogenic acid'],
        C16H19NO4: ['Benzoylecgonine'],
        C16H19ClN2: ['Chlorphenamine'],
        C16H19N3O4S: ['Ampicillin', 'Cefradine'],
        C16H19N3O5S: ['Amoxicillin'],
        C16H20N2: ['Benzathine'],
        C16H20FN3O4: ['Linezolid'],
        C16H20N4O3S: ['Torasemide'],
        C16H20N6O: ['Tofacitinib'],
        C16H21NO2: ['Propranolol', 'Troparil'],
        C16H21N3: ['Tripelennamine'],
        C16H21N3O2: ['Zolmitriptan'],
        C16H21Cl2N3O2: ['Bendamustine'],
        C16H21N3O8S: ['Cephalosporin C'],
        C16H22O10: ['Geniposidic acid'],
        C16H22O11: ['Deacetylasperulosidic acid'],
        C16H23NO2: ['Prodine'],
        C16H24NO5: ['Sinapine'],
        C16H24N2: ['Xylometazoline'],
        C16H24N2O: ['Oxymetazoline', 'Ropinirole'],
        C16H24O4: ['Brefeldin A'],
        C16H24O9: ['7-Deoxyloganic acid'],
        C16H24O10: ['Loganic acid'],
        C16H24Cl2Rh2: ['Cyclooctadiene rhodium chloride dimer'],
        C16H24Cl2Ir2: ['Cyclooctadiene iridium chloride dimer'],
        C16H24Ni: ['Bis(cyclooctadiene)nickel(0)'],
        C16H25NO2: ['Dendrobine', 'Desvenlafaxine', 'Tramadol'],
        C16H26N2O5S: ['Cilastatin'],
        C16H26N2O16P2: ['Thymidine diphosphate glucose'],
        C16H26O: ['Callicarpenal'],
        C16H26O3: ['Juvabione'],
        C16H26O5: ['Artemether'],
        C16H26O7: ['Picrocrocin'],
        C16H28N2O2: ['Tromantadine'],
        C16H28N2O4: ['Oseltamivir'],
        C16H28O: ['Ambroxide'],
        C16H28O7: ['Rosiridin'],
        C16H30B2: ['9-Borabicyclo(3.3.1)nonane'],
        C16H30O2: ['Palmitoleic acid'],
        C16H32: ['Hexadecene'],
        C16H32O2: ['Palmitic acid'],
        C16H34: ['Hexadecane'],
        C16H34O: ['Cetyl alcohol'],
        C16H36NF: ['Tetra-n-butylammonium fluoride'],
        C16H40Cl4N2Ni: ['Tetraethylammonium tetrachloronickelate'],

        C17H9Cl3N4O2: ['Diclazuril'],
        C17H11N5: ['Letrozole'],
        C17H11F6N7O: ['Selinexor'],
        C17H12: ['Benzofluorene'],
        C17H12F3NO4S: ['Belzutifan'],
        C17H13ClN4: ['Alprazolam'],
        C17H14BF4NO3: ['Acoziborole'],
        C17H14F3N3O2S: ['Celecoxib'],
        C17H14O: ['Dibenzylideneacetone'],
        C17H15NO5: ['Benorilate'],
        C17H15FN6O3: ['Tedizolid'],
        C17H16F6N2O: ['Mefloquine'],
        C17H17NO2: ['Apomorphine'],
        C17H17Cl2N: ['Sertraline'],
        C17H17N3O6S2: ['Cefapirin'],
        C17H17ClN6O3: ['Eszopiclone'],
        C17H17N7O8S4: ['Cefotetan'],
        C17H17ClO6: ['Griseofulvin'],
        C17H18F3NO: ['Fluoxetine'],
        C17H18N2O: ['Conolidine', 'Ervaticine'],
        C17H18N2O6: ['Nifedipine'],
        C17H18N2O6S: ['Carbenicillin'],
        C17H18FN3O3: ['Ciprofloxacin'],
        C17H18N6: ['Ruxolitinib'],
        C17H19N: ['Tametraline'],
        C17H19NO: ['Diphenylprolinol'],
        C17H19NO3: ['Aposcopolamine', 'Chavicine', 'Hydromorphone', 'Morphine', 'Piperine'],
        C17H19ClN2S: ['Chlorpromazine'],
        C17H19N3: ['Mirtazapine'],
        C17H19N3O3S: ['Esomeprazole', 'Omeprazole'],
        C17H19N5: ['Anastrozole'],
        C17H19N5O2: ['Pixantrone'],
        C17H19N5O6S2: ['Cefcapene', 'Cefovecin'],
        C17H19F3N6O: ['Upadacitinib'],
        C17H19BrN6O2: ['Barettin'],
        C17H20FNO4: ['4′-Fluorococaine'],
        C17H20N2O2: ['Tropicamide'],
        C17H20F6N2O3: ['Flecainide'],
        C17H20N2O5S: ['Bumetanide'],
        C17H20N2O6S: ['Methicillin'],
        C17H20N2S: ['Promethazine'],
        C17H20N4O6: ['Riboflavin'],
        C17H20N4S: ['Olanzapine'],
        C17H20O6: ['Mycophenolic acid'],
        C17H21NO: ['Atomoxetine', 'Diphenhydramine', 'Phenyltoloxamine'],
        C17H21NO4: ['Cocaine', 'Scopolamine'],
        C17H21NO5: ['Anisodine', 'Salicylmethylecgonine'],
        C17H21N4O9P: ['Flavin mononucleotide'],
        C17H22N2O: ['Doxylamine'],
        C17H22N2O3: ['Trichostatin A'],
        C17H22N4O2: ['Resiquimod'],
        C17H22O5: ['Matricin'],
        C17H23NO3: ['Atropine', 'Hyoscyamine'],
        C17H23NO4: ['Anisodamine'],
        C17H23N3O: ['Piperylone'],
        C17H23N5O: ['Gardiquimod'],
        C17H24O3: ['Onchidal'],
        C17H24O4: ['Trichodermin'],
        C17H24O9: ['Syringin'],
        C17H24O10: ['Geniposide', 'Secologanin', 'Verbenalin'],
        C17H25N: ['Phencyclidine'],
        C17H25NO2: ['N-Octyl bicycloheptene dicarboximide'],
        C17H25N3O2S: ['Almotriptan', 'Naratriptan'],
        C17H25N3O5S: ['Meropenem'],
        C17H26N2O: ['5-Methoxy-N,N-diisopropyltryptamine'],
        C17H26N4O: ['Alniditan'],
        C17H26O4: ['Gingerol'],
        C17H26O5: ['Botrydial'],
        C17H26O10: ['Loganin'],
        C17H27NO2: ['Venlafaxine'],
        C17H28: ['Gonane'],
        C17H28N2O3: ['Oxybuprocaine'],
        C17H28O: ['Sterol'],
        C17H28O5: ['Artemotil'],
        C17H34O2: ['Margaric acid'],
        C17H35N: ['Solenopsin'],
        C17H36: ['Heptadecane'],

        C18H9NNa2O8S2: ['Quinoline yellow WS'],
        C18H11NO2: ['Quinoline Yellow'],
        C18H12: ['Chrysene', 'Tetracene', 'Tetraphene', 'Triphenylene'],
        C18H12N2O2: ['Xantocillin'],
        C18H12CaN2O6S: ['Lithol Rubine BK'],
        C18H12O6: ['Sterigmatocystin'],
        C18H13NNa2O8S2: ['Sodium picosulfate'],
        C18H13ClFN3: ['Midazolam'],
        C18H14Cl4N2O: ['Miconazole'],
        C18H14F4N2O4S: ['Bicalutamide'],
        C18H14N2Na2O7S2: ['Scarlet GN'],
        C18H14N2Na2O8S2: ['Allura Red AC'],
        C18H14N3NaO3S: ['Acid orange 5'],
        C18H14N4O5S: ['Sulfasalazine'],
        C18H15B: ['Triphenylborane'],
        C18H15N3NaO3S: ['Metanil Yellow'],
        C18H15O3P: ['Triphenyl phosphite'],
        C18H15O4P: ['Triphenyl phosphate'],
        C18H15Sb: ['Triphenylstibine'],
        C18H16N2O3: ['Citrus Red 2'],
        C18H16N6S2: ['U0126'],
        C18H17ClO6: ['Radicicol'],
        C18H18: ['Cyclooctadecanonaene', 'Retene'],
        C18H18N4O3S2: ['Pritelivir'],
        C18H18N6O5S2: ['Cefamandole'],
        C18H18N8O7S3: ['Ceftriaxone'],
        C18H19NOS: ['Duloxetine'],
        C18H19Cl2NO4: ['Felodipine'],
        C18H19F2NO5: ['Riodipine'],
        C18H19N3O: ['Ondansetron'],
        C18H19N3O5S: ['Cefprozil'],
        C18H19ClN4: ['Clozapine'],
        C18H19N5O4S: ['Vosaroxin'],
        C18H20BNO: ['(R)-2-Methyl-CBS-oxazaborolidine'],
        C18H20N2: ['Apparicine'],
        C18H20FN3O4: ['Levofloxacin', 'Ofloxacin'],
        C18H20O2: ['Diethylstilbestrol', 'Equilin'],
        C18H21NO3: ['Codeine', 'Hydrocodone'],
        C18H21NO4: ['Oxycodone'],
        C18H21ClN2: ['Chlorcyclizine'],
        C18H21N3O4S2: ['Razupenem'],
        C18H21N5O2: ['Alogliptin'],
        C18H21O8P: ['Fosbretabulin'],
        C18H22INO3: ['25I-NBOMe'],
        C18H22N2: ['Cyclizine'],
        C18H22N2S: ['Vortioxetine'],
        C18H22N4O2: ['Peficitinib'],
        C18H22O: ['Enzacamene', 'Estratetraenol'],
        C18H22O2: ['Estrone'],
        C18H22O3: ['Hydroxyestrone'],
        C18H22O4: ['Masoprocol'],
        C18H22O5: ['Zearalenone'],
        C18H22O5S: ['Estrone sulfate'],
        C18H23NO: ['Orphenadrine'],
        C18H23NO3: ['Ractopamine'],
        C18H23NO3S: ['Ciglitazone'],
        C18H23NO4: ['Cocaethylene'],
        C18H23O9N3S: ['Aspartame-acesulfame salt'],
        C18H23N9O4S3: ['Cefotiam'],
        C18H24: ['Estrin'],
        C18H24N2: ['6PPD'],
        C18H24I3N3O9: ['Ioversol'],
        C18H24O2: ['Estradiol'],
        C18H24O3: ['Epiestriol', 'Estriol', 'Hydroxyestradiol'],
        C18H24O3S: ['Dibunate'],
        C18H24O4: ['Estetrol'],
        C18H24O5S: ['Estradiol sulfate'],
        C18H24O6S: ['Estriol sulfate'],
        C18H25NO: ['Dextromethorphan'],
        C18H25O5P: ['Estradiol phosphate'],
        C18H26ClN3O: ['Hydroxychloroquine'],
        C18H26FN3O6: ['Mericitabine'],
        C18H26ClN3: ['Chloroquine'],
        C18H26N10O3: ['Netropsin'],
        C18H26O2: ['Nandrolone'],
        C18H26O3: ['Oxabolone'],
        C18H26O5: ['Zeranol'],
        C18H27NO3: ['Capsaicin'],
        C18H28N2O: ['Bupivacaine'],
        C18H28O2: ['Stearidonic acid'],
        C18H29NO3: ['Butamirate'],
        C18H29N3O5S: ['Lenapenem'],
        C18H30: ['Estrane'],
        C18H30O2: ['Eleostearic acid', 'Linolenic acid', 'Pinolenic acid'],
        C18H30O2Ir2: ['Calendic acid', 'Cyclooctadiene iridium methoxide dimer'],
        C18H30NaO3S: ['Sodium dodecylbenzenesulfonate'],
        C18H31B: ['Alpine borane'],
        C18H31NO4: ['Bisoprolol'],
        C18H31N5O6: ['Rapastinel'],
        C18H32O2: ['Linoleic acid', 'Linolelaidic acid', 'Rumenic acid'],
        C18H32O16: ['Raffinose'],
        C18H33ClN2O5S: ['Clindamycin'],
        C18H33NaO3: ['Sodium ricinoleate'],
        C18H34N2NaO3: ['Sodium lauroamphoacetate'],
        C18H34SnO: ['Cyhexatin'],
        C18H34O2: ['Elaidic acid', 'Oleic acid', 'Vaccenic acid'],
        C18H34O3: ['Ricinoleic acid'],
        C18H34O6: ['Sorbitan monolaurate'],
        C18H35NaO2: ['Sodium stearate'],
        C18H36: ['Octadecene'],
        C18H36N4O11: ['Kanamycin A'],
        C18H36O2: ['Stearic acid'],
        C18H37NO2: ['Sphingosine'],
        C18H37N5O8: ['Dibekacin'],
        C18H37N5O9: ['Tobramycin'],
        C18H38: ['Octadecane'],
        C18H38NO5P: ['Sphingosine-1-phosphate'],
        C18F15B: ['Tris(pentafluorophenyl)borane'],
        C18Fe7N18: ['Prussian blue'],

        C19H10Br4O5S: ['Bromophenol blue'],
        C19H12Cl2O5S: ['Chlorophenol red'],
        C19H12O8: ['Diacerein'],
        C19H14N2O4: ['C286'],
        C19H14O3: ['Polyether ether ketone'],
        C19H14O5S: ['Phenol red'],
        C19H15F3N2O3: ['Tecovirimat'],
        C19H16: ['Triphenylmethane'],
        C19H16N2Na2O7S2: ['Ponceau 3R'],
        C19H16O: ['Triphenylmethanol'],
        C19H16O4: ['Warfarin'],
        C19H17NOS: ['Tolnaftate'],
        C19H17NO7: ['Nedocromil'],
        C19H17N3: ['Pararosaniline'],
        C19H17N3O4S2: ['Cephaloridine'],
        C19H17ClFN3O5S: ['Flucloxacillin'],
        C19H17Cl2N3O5S: ['Dicloxacillin'],
        C19H17N5O7S3: ['Ceftiofur'],
        C19H17F6N7O: ['Enasidenib'],
        C19H18FN3O: ['Rucaparib'],
        C19H18F3N3O2: ['Lasmiditan'],
        C19H18ClN3O5S: ['Cloxacillin', 'Rivaroxaban'],
        C19H18N6O5S3: ['Cefditoren'],
        C19H18O6: ['Decarboxylated 8,5\'-diferulic acid'],
        C19H19NOS: ['Ketotifen'],
        C19H19N3O5S: ['Oxacillin'],
        C19H19N3O6: ['Nilvadipine'],
        C19H19N7O6: ['Folate'],
        C19H20ClNO: ['Ecopipam'],
        C19H20FNO3: ['Paroxetine'],
        C19H20N2O3S: ['Pioglitazone'],
        C19H20N4: ['Bilane'],
        C19H20N4O: ['Niraparib'],
        C19H20N4O2S2: ['Elesclomol'],
        C19H20N8O5: ['Aminopterin'],
        C19H21N: ['Nortriptyline'],
        C19H21NO: ['Doxepin'],
        C19H21NO4: ['Naloxone'],
        C19H21NS: ['Pizotifen'],
        C19H21N3O: ['Zolpidem'],
        C19H21N5O4: ['Prazosin'],
        C19H22BrNO4S2: ['Tiotropium bromide'],
        C19H22N2: ['Pericine'],
        C19H22N2O: ['Vinburnine'],
        C19H22N2O3: ['Ervatinine'],
        C19H22ClN5O: ['Trazodone'],
        C19H22F3N5O2S: ['Alpelisib'],
        C19H22O6: ['Dihydrokanakugiol', 'Gibberellic acid'],
        C19H23NO4: ['Methylecgonine cinnamate'],
        C19H23ClN2: ['Clomipramine'],
        C19H23N3O: ['Benzydamine'],
        C19H23N3O2: ['Ergometrine'],
        C19H23N3O4S: ['Hetacillin'],
        C19H24: ['Simonellite'],
        C19H24N2: ['Ibogamine', 'Imipramine'],
        C19H24N2O: ['Noribogaine'],
        C19H24N2O2: ['Praziquantel'],
        C19H24N2O3: ['Labetalol'],
        C19H24N2O4: ['Formoterol'],
        C19H24N4O2: ['Pentamidine'],
        C19H24N6O5S2: ['Cefepime'],
        C19H24O3: ['Testolactone'],
        C19H25BN4O4: ['Bortezomib'],
        C19H25N3O2S2: ['Dimetotiazine'],
        C19H25N5O4: ['Terazosin'],
        C19H26I3N3O9: ['Iohexol'],
        C19H26N6O: ['Seliciclib'],
        C19H26O: ['Androstadienone'],
        C19H26O2: ['Androstenedione', 'Cannabidivarin', 'Tetrahydrocannabivarin'],
        C19H26O3: ['7-Keto-DHEA'],
        C19H26O6: ['Diacetylverrucarol'],
        C19H26O7: ['Diacetoxyscirpenol'],
        C19H27N3O4: ['Semagacestat'],
        C19H28O: ['Androstadienol', 'Androstenone', 'Fasedienol'],
        C19H28O2: ['Androstanedione', 'Dehydroepiandrosterone', 'Prasterone', 'Testosterone'],
        C19H28O3: ['Hydroxy-DHEA', 'Hydroxytestosterone', '11-Ketoandrosterone', '11-Ketodihydrotestosterone', 'Methylhydroxynandrolone'],
        C19H28O5S: ['Dehydroepiandrosterone sulfate', 'Prasterone sulfate', 'Testosterone sulfate'],
        C19H28O8: ['Artesunate'],
        C19H30N5O10P: ['Tenofovir disoproxil'],
        C19H30O: ['Androstenol'],
        C19H30O2: ['Androstenediol', 'Androsterone', 'Dihydrotestosterone', 'Epiandrosterone', 'Epietiocholanolone', 'Etiocholanolone'],
        C19H30O3: ['Hydroxyepiandrosterone', 'Oxandrolone'],
        C19H30O5: ['Dodecyl gallate'],
        C19H30O5S: ['Androstenediol sulfate', 'Androsterone sulfate'],
        C19H32: ['Androstane'],
        C19H32O2: ['Androstanediol', 'Etiocholanediol'],
        C19H34: ['Fichtelite', '18-Norabietane'],
        C19H35NO2: ['Dicycloverine'],
        C19H37N5O7: ['Sisomicin'],
        C19H38O2: ['Pristanic acid'],
        C19H40: ['Nonadecane', 'Pristane'],
        C19H42BrN: ['Cetrimonium bromide'],

        C20: ['C20 fullerene'],
        C20H4Cl4I4O5: ['Rose bengal'],
        C20H6Br4Na2O5: ['Eosin Y'],
        C20H6I4Na2O5: ['Erythrosine'],
        C20H8Br2N2O9: ['Eosin B'],
        C20H8Br2HgNa2O6: ['Merbromin'],
        C20H8Br4Na2O10S2: ['Bromsulfthalein'],
        C20H10: ['Corannulene'],
        C20H11N2Na3O10S3: ['Amaranth', 'Ponceau 4R'],
        C20H11N2Na3O11S3: ['Hydroxynaphthol blue'],
        C20H12: ['Benzofluoranthene', 'Benzopyrene', 'Perylene'],
        C20H12N2Na2O7S2: ['Acid Red 13', 'Azorubine', 'Ponceau 6R'],
        C20H12N3O7SNa: ['Eriochrome Black T'],
        C20H12N4Na2O12S4: ['Bisdisulizole disodium'],
        C20H12O3: ['Fluoran'],
        C20H12O5: ['Fluorescein'],
        C20H14O4: ['Phenolphthalein'],
        C20H15N3O6: ['Rubitecan'],
        C20H16N2O4: ['Camptothecin'],
        C20H16N4: ['Chlorin'],
        C20H16Cl2N4Ru: ['cis-Dichlorobis(bipyridine)ruthenium(II)'],
        C20H16O6: ['Viridin'],
        C20H17NO6: ['Bicuculline'],
        C20H17N3Na2O9S3: ['Acid fuchsin'],
        C20H18ClNO6: ['Ochratoxin A'],
        C20H18N2O2: ['Nile red'],
        C20H18O6: ['Sesamin'],
        C20H18O7: ['Sesamolin'],
        C20H18O8: ['8,5\'-Diferulic acid'],
        C20H19F2N3O5: ['Dolutegravir'],
        C20H20N2O3: ['Cyclopiazonic acid'],
        C20H20ClN3O: ['Nile blue'],
        C20H20N3Cl: ['Fuchsine'],
        C20H20N4: ['Hexahydroporphine'],
        C20H20Cl3N4Rh: ['Dichlorotetrakis(pyridine)rhodium(III) chloride'],
        C20H20N6O9S: ['Latamoxef'],
        C20H20U: ['Tetrakis(cyclopentadienyl)uranium(IV)'],
        C20H21N: ['Cyclobenzaprine'],
        C20H21FN2O: ['Escitalopram'],
        C20H21N5O6: ['Pemetrexed'],
        C20H21FN6O5: ['Raltegravir'],
        C20H21N7O6S2: ['Ceforanide'],
        C20H21ClO4: ['Fenofibrate'],
        C20H22N2O2: ['Akuammicine'],
        C20H22ClN3O: ['Amodiaquine'],
        C20H22N4O10S: ['Cefuroxime axetil'],
        C20H22N8O3: ['Deucravacitinib'],
        C20H22N8O5: ['Methotrexate'],
        C20H22N8O6S2: ['Ceftobiprole'],
        C20H22O7: ['Saudin', 'Tinosporide'],
        C20H23N: ['Amitriptyline'],
        C20H23NO4: ['Efaproxiral', 'Naltrexone'],
        C20H23N5O6S: ['Azlocillin'],
        C20H23N7O7: ['Folinic acid', '10-Formyltetrahydrofolate'],
        C20H24ClNO: ['Cloperastine'],
        C20H24N2O: ['Affinisine'],
        C20H24N2OS: ['Lucanthone'],
        C20H24N2O2: ['Affinine', 'Quinidine', 'Quinine'],
        C20H24N2O6: ['Nisoldipine'],
        C20H24ClN3S: ['Prochlorperazine'],
        C20H24O2: ['Ethinylestradiol'],
        C20H24O4: ['Bipinnatin J', 'Crocetin', 'Dithymoquinone'],
        C20H24O6: ['Triptolide'],
        C20H24O7: ['Ailanthone', 'Tripdiolide', 'Triptolidenol'],
        C20H24O9: ['Eurycomanone'],
        C20H25NO2S2: ['Tiagabine'],
        C20H25NO3: ['Panicudine'],
        C20H25ClN2O5: ['Amlodipine'],
        C20H25N3O: ['Lysergic acid diethylamide'],
        C20H25N3O2: ['Methylergometrine'],
        C20H25N5O10: ['Nikkomycin Z'],
        C20H25ClO6: ['Tripchlorolide'],
        C20H26N2O: ['Ibogaine', 'Tabernanthine'],
        C20H26N4O: ['Lisuride'],
        C20H26O2: ['Norethisterone'],
        C20H26O3: ['Crotogoudin', 'Kahweol'],
        C20H26O4: ['Carnosol', 'Momilactone B'],
        C20H28N2O5: ['Enalapril'],
        C20H28N2O5S: ['Tamsulosin'],
        C20H28O: ['Retinal'],
        C20H28O2: ['Alitretinoin', 'Isotretinoin', 'Nordinone', '19-Norprogesterone', 'Retinoic acid', 'Sugiol', 'Tetrahydrocannabutol', 'Tretinoin'],
        C20H28O3: ['Cafestol', 'Cinerin I', 'Euniolide', 'Petasin', 'Taxodone'],
        C20H28O4: ['Carnosic acid'],
        C20H28O5: ['Tricholomalide'],
        C20H28O6: ['Phorbol'],
        C20H28O8Hf: ['Hafnium acetylacetonate'],
        C20H30BrNO3: ['Ipratropium bromide'],
        C20H30N2O5: ['Neotame'],
        C20H30O: ['Ferruginol', 'Retinol', 'Taxadienone', 'Totarol', 'Vitamin A'],
        C20H30O2: ['Abietic acid', 'Bosseopentaenoic acid', 'Eicosapentaenoic acid', 'Isopimaric acid', 'Kaurenoic acid', 'Levopimaric acid', 'Pimaric acid'],
        C20H30O3: ['Galanolactone', 'Leukotriene A4', 'Neotripterifordin', 'Oxymesterone', 'Steviol'],
        C20H30O5: ['Andrographolide'],
        C20H30O8: ['Ptaquiloside'],
        C20H30Cl2Zr: ['Decamethylzirconocene dichloride'],
        C20H30Cl4Rh2: ['Pentamethylcyclopentadienyl rhodium dichloride dimer'],
        C20H30Cl4Ir2: ['Pentamethylcyclopentadienyl iridium dichloride dimer'],
        C20H30Zn2: ['Decamethyldizincocene'],
        C20H31N: ['Leelamine'],
        C20H31NO3: ['Pentoxyverine'],
        C20H31ClO7: ['Ligerin'],
        C20H32: ['β-Araneosene', 'Cembrene A', 'Elisabethatriene', 'Laurenene', 'Sclarene', 'Stemarene', 'Stemodene', 'Taxadiene'],
        C20H32O: ['Ethylestrenol'],
        C20H32O2: ['Arachidonic acid'],
        C20H32O3: ['Epoxyeicosatrienoic acid', 'Isocupressic acid'],
        C20H32O4: ['Leukotriene B4'],
        C20H32O5: ['Prostacyclin'],
        C20H33NO3: ['Oxeladin'],
        C20H34: ['19-Norpregnane', 'Phyllocladane', 'Tigliane'],
        C20H34O: ['Cembratrienol', 'Geranylgeraniol', 'Isotuberculosinol'],
        C20H34O2: ['Eicosatrienoic acid', 'Incensole'],
        C20H34O4: ['Aphidicolin'],
        C20H34O5: ['Prostaglandin E1'],
        C20H34AuO9PS0: ['Auranofin'],
        C20H35B: ['Diisopinocampheylborane'],
        C20H35NO: ['Euglenophycin'],
        C20H36: ['Abietane', 'Taxane'],
        C20H36O2: ['Eicosadienoic acid', 'Sclareol'],
        C20H36O5: ['Lagochilin'],
        C20H36O7P2: ['Geranylgeranyl pyrophosphate'],
        C20H37O7S: ['Docusate'],
        C20H38: ['Labdane'],
        C20H38N6O4: ['Leupeptin'],
        C20H38O2: ['Eicosenoic acid'],
        C20H40O: ['Isophytol', 'Phytol'],
        C20H40O2: ['Arachidic acid', 'Phytanic acid'],
        C20H42: ['Crocetane', 'Icosane', 'Phytane'],
        C20H42O: ['Arachidyl alcohol'],

        C21H14Br4O5S: ['Bromocresol green'],
        C21H16Br2O5S: ['Bromocresol purple'],
        C21H17ClN2O3: ['Rhodamine 123'],
        C21H17NaO5S: ['Cresol Red'],
        C21H18NO4: ['Chelerythrine'],
        C21H18O13: ['Miquelianin'],
        C21H19N3O3S: ['Amsacrine'],
        C21H20ClNO5: ['Alvocidib'],
        C21H20N4O3: ['Entinostat'],
        C21H20Cl2O3: ['Permethrin'],
        C21H20O6: ['Curcumin'],
        C21H20O11: ['Quercitrin'],
        C21H20O12: ['Hyperoside', 'Isoquercetin'],
        C21H21N: ['Cyproheptadine'],
        C21H21NO2: ['Oxetorone'],
        C21H21NO2S: ['Tazarotene'],
        C21H21NO6: ['Hydrastine'],
        C21H21ClN2O: ['PK-11195'],
        C21H21N2O3: ['Serpentine'],
        C21H21ClN2O8: ['Demeclocycline'],
        C21H21F2N3O7: ['Posizolid'],
        C21H21ClN4OS: ['Ziprasidone'],
        C21H21O4P: ['Tricresyl phosphate'],
        C21H21ClO11: ['Chrysanthemin'],
        C21H21ClO12: ['Myrtillin'],
        C21H22N2O2: ['Strychnine'],
        C21H22N2O5S: ['Nafcillin'],
        C21H22N4OS: ['Abafungin'],
        C21H22N4O6S: ['Raltitrexed'],
        C21H22N6O: ['Glasdegib'],
        C21H22O4: ['Taxamairin A'],
        C21H22O11: ['Astilbin'],
        C21H23ClFNO2: ['Haloperidol'],
        C21H23NO3: ['Olopatadine'],
        C21H23NO5: ['Heroin'],
        C21H23N3O2: ['Panobinostat'],
        C21H23N5O3S: ['Filgotinib'],
        C21H24N2O2: ['Tabersonine'],
        C21H24N2O3: ['Lochnericine', 'Vobasine'],
        C21H24FN3O4: ['Moxifloxacin'],
        C21H24N4O2S: ['Mirabegron'],
        C21H24O10: ['Nothofagin'],
        C21H24O11: ['Aspalathin'],
        C21H25N: ['Terbinafine'],
        C21H25NO: ['Benzatropine'],
        C21H25NO5: ['Demecolcine'],
        C21H25ClN2O3: ['Cetirizine', 'Levocetirizine'],
        C21H25ClN2O4S: ['Tianeptine'],
        C21H25N3O2S: ['Quetiapine'],
        C21H25N5O8S2: ['Mezlocillin'],
        C21H25ClO6: ['Dapagliflozin'],
        C21H26ClNO: ['Clemastine'],
        C21H26N2: ['SIMes'],
        C21H26N2O2: ['Coronaridine'],
        C21H26N2O3: ['Dregamine', 'Heyneanine', 'Stemmadenine', 'Tabernaemontanine', 'Vincamine'],
        C21H26N2S2: ['Thioridazine'],
        C21H26O2: ['Cannabinodiol', 'Cannabinol'],
        C21H26O3: ['Acitretin'],
        C21H26O5: ['Prednisone'],
        C21H26O10: ['Bruceolide'],
        C21H27NO: ['Methadone'],
        C21H27ClN2O2: ['Hydroxyzine'],
        C21H27N3O4S3: ['Yersiniabactin'],
        C21H27N5O4S: ['Glipizide'],
        C21H27FO6: ['Triamcinolone'],
        C21H28N2O2: ['Ibogaline'],
        C21H28N6O9: ['Wybutosine'],
        C21H28N7O14P2: ['Nicotinamide adenine dinucleotide'],
        C21H28O2: ['Guggulsterone', 'Levonorgestrel', 'Norgestrel'],
        C21H28O3: ['Pyrethrin I'],
        C21H28O4: ['11-Dehydrocorticosterone', '21-Deoxycortisone'],
        C21H28O5: ['Aldosterone', 'Cinerin II', 'Cortisone', 'Prednisolone'],
        C21H29NO: ['Biperiden'],
        C21H29NO2: ['Norelgestromin'],
        C21H29N6O5P: ['Tenofovir alafenamide'],
        C21H29N7O17P3: ['Nicotinamide adenine dinucleotide phosphate'],
        C21H29FO2: ['4\'-Fluorocannabidiol'],
        C21H29FO5: ['Fludrocortisone'],
        C21H30O2: ['Avarol', 'Cannabichromene', 'Cannabicitran', 'Cannabicyclol', 'Cannabidiol', 'Progesterone', 'Tetrahydrocannabinol'],
        C21H30O3: ['Cannabielsoin', 'Deoxycorticosterone', '7-Hydroxycannabidiol', '17α-Hydroxyprogesterone', '11-Hydroxy-THC', 'Jasmolin I'],
        C21H30O4: ['Cannabimovone', 'Cannabitriol', 'Corticosterone', 'Deoxycortisol', '8,11-Dihydroxytetrahydrocannabinol'],
        C21H30O4S: ['Tixocortol'],
        C21H30O5: ['Cortisol', 'Hydrocortisone', '18-Hydroxycorticosterone'],
        C21H30O6: ['18-Hydroxycortisol', '6β-Hydroxycortisol'],
        C21H31NO2: ['EIDD-036'],
        C21H31N3O5: ['Lisinopril'],
        C21H31N5O2: ['Buspirone'],
        C21H32O2: ['Cannabigerol', 'Dihydroprogesterone', 'Pregnanedione', 'Pregnenolone'],
        C21H32O3: ['Hydroxypregnenolone'],
        C21H32O5S: ['Pregnenolone sulfate'],
        C21H33N3O5S: ['Pivmecillinam'],
        C21H34O2: ['Allopregnanolone', 'Epipregnanolone', 'Isopregnanolone', 'Pregnanolone'],
        C21H35N2O3: ['Lapyrium'],
        C21H36: ['Pregnane'],
        C21H36N7O16P3S: ['Coenzyme A'],
        C21H36O2: ['Allopregnanediol', 'Pregnanediol'],
        C21H36O3: ['Pregnanetriol'],
        C21H39N7O12: ['Streptomycin'],
        C21H40N8O6: ['Tuftsin'],
        C21H41N5O7: ['Netilmicin'],
        C21H41O7P: ['Lysophosphatidic acid'],
        C21H43N5O7: ['Gentamicin'],
        C21H44: ['Heneicosane'],
        C21H46NO4P: ['Miltefosine'],

        C22H12: ['Benzoperylene'],
        C22H14: ['Pentacene'],
        C22H14N6Na2O9S2: ['Amido black 10B'],
        C22H16N4Na2O9S2: ['Orange B'],
        C22H17ClN2: ['Clotrimazole'],
        C22H17ClN6O: ['Duvelisib'],
        C22H18Cl2FNO3: ['Cyfluthrin'],
        C22H18I6N2O9: ['Iotroxic acid'],
        C22H18FN7O: ['Idelalisib'],
        C22H18O4: ['o-Cresolphthalein'],
        C22H18O10: ['Epicatechin gallate'],
        C22H18O11: ['Epigallocatechin gallate'],
        C22H18O12: ['Chicoric acid'],
        C22H19Cl2NO3: ['Cypermethrin'],
        C22H19Br2NO3: ['Deltamethrin'],
        C22H19N3O4: ['Tadalafil'],
        C22H20O13: ['Carminic acid'],
        C22H21ClN2O8: ['Meclocycline'],
        C22H21N8O8PS4: ['Ceftaroline fosamil'],
        C22H22N2O4: ['Ambrisentan'],
        C22H22N2O8: ['Metacycline'],
        C22H22N6O5S2: ['Cefpirome'],
        C22H22N6O7S2: ['Ceftazidime'],
        C22H22N8: ['Bisantrene'],
        C22H22O8: ['Podophyllotoxin'],
        C22H23NO7: ['Noscapine'],
        C22H23ClN2O2: ['Loratadine'],
        C22H23ClN2O8: ['Chlortetracycline'],
        C22H23N3O4: ['Erlotinib'],
        C22H23N5O: ['Motesanib'],
        C22H23ClN6O: ['Losartan'],
        C22H23FN6O3: ['Radezolid'],
        C22H24N2O8: ['Doxycycline', 'Tetracycline'],
        C22H24N2O9: ['Oxytetracycline'],
        C22H24ClN3O: ['Azelastine'],
        C22H24ClN3: ['New fuchsine'],
        C22H24ClFN4O3: ['Gefitinib'],
        C22H24O10: ['Sakuranin'],
        C22H25NO3: ['Tamibarotene'],
        C22H25F2NO4: ['Nebivolol'],
        C22H25NO6: ['Colchicine'],
        C22H25BrN2O3S: ['Umifenovir'],
        C22H25N3O3: ['Spiroxatrine'],
        C22H25N3O7S: ['Ertapenem'],
        C22H26N2O2S: ['Eletriptan'],
        C22H26N2O4S: ['Diltiazem'],
        C22H26N2O5: ['FV-100'],
        C22H26F3N3OS: ['Fluphenazine'],
        C22H26ClN7O2S: ['Dasatinib'],
        C22H26O3: ['Resmethrin'],
        C22H26O11: ['Agnuside'],
        C22H27FN3O2: ['Spiramide'],
        C22H27N5O4: ['Losoxantrone'],
        C22H27N9O4: ['Distamycin'],
        C22H27F3O4S: ['Fluticasone'],
        C22H28N2O: ['Fentanyl'],
        C22H28N2O3: ['Isovoacangine', '18-Methoxycoronaridine', 'Voacangine'],
        C22H28N2O4: ['19-Epivoacristine', 'Isovoacristine', 'Voacristine'],
        C22H28FN3O6S: ['Rosuvastatin'],
        C22H28N4O6: ['Mitoxantrone'],
        C22H28O2: ['Etonogestrel'],
        C22H28O3: ['Norethisterone acetate'],
        C22H28O4: ['Endecaphyllacin B'],
        C22H28ClFO4: ['Clobetasol'],
        C22H28Cl2O4: ['Mometasone'],
        C22H28O5: ['Pyrethrin II'],
        C22H28O6: ['Quassin'],
        C22H29N3O6S: ['Pivampicillin'],
        C22H29FN3O9P: ['Sofosbuvir'],
        C22H29FO4: ['Fluorometholone'],
        C22H29FO5: ['Betamethasone', 'Dexamethasone'],
        C22H30N4O4: ['Tentoxin'],
        C22H30N6O3S: ['Avitriptan'],
        C22H30N6O4S: ['Sildenafil'],
        C22H30Cl2N10: ['Chlorhexidine'],
        C22H30O: ['Desogestrel'],
        C22H30O4: ['Cannabichromenic acid', 'Cannabidiolic acid', 'Endecaphyllacin A', 'Tetrahydrocannabinolic acid'],
        C22H30O5: ['Guanacastepene A', 'Jasmolin II', 'Methylprednisolone'],
        C22H30O6: ['Prostratin'],
        C22H31NO: ['Tolterodine'],
        C22H31NO2: ['Pregnenolone 16α-carbonitrile'],
        C22H31NO3: ['Oxybutynin'],
        C22H31N3O6S2: ['Tebipenem'],
        C22H31N9O13P3S: ['Adenosine thiamine triphosphate'],
        C22H32NNa2O6P: ['EIDD-1723'],
        C22H32O2: ['Docosahexaenoic acid', 'Retinyl acetate'],
        C22H32O3: ['Medroxyprogesterone'],
        C22H32O4: ['Cannabigerolic acid'],
        C22H34O2: ['Docosapentaenoic acid', 'Ethyl eicosapentaenoic acid'],
        C22H34O5: ['Pleuromutilin'],
        C22H34O7: ['Forskolin'],
        C22H36O2: ['Docosatetraenoic acid'],
        C22H37NO2: ['Anandamide', 'Virodhamine'],
        C22H38O5: ['Misoprostol'],
        C22H38O7: ['Ascorbyl palmitate'],
        C22H40O2: ['Docosadienoic acid'],
        C22H42O2: ['Erucic acid'],
        C22H42O6: ['Sorbitan monopalmitate'],
        C22H43N5O13: ['Amikacin'],
        C22H44O2: ['Behenic acid'],
        C22H46: ['Docosane'],
        C22H46O: ['Docosanol'],
        C22H63N13P4: ['P4-t-Bu'],

        C23H16O11: ['Cromoglicic acid'],
        C23H21F10N3O: ['Vestipitant'],
        C23H21F7N4O3: ['Aprepitant'],
        C23H22ClF3O2: ['Bifenthrin'],
        C23H22O6: ['Rotenone'],
        C23H23NO2: ['Crisnatol'],
        C23H23ClFNO5: ['Elvitegravir'],
        C23H23N3O5: ['Topotecan'],
        C23H23N7O5: ['Pralatrexate'],
        C23H24N4O6: ['Merimepodib'],
        C23H24N6O5S2: ['Cefquinome'],
        C23H24O8: ['Wortmannin'],
        C23H25ClN2: ['Malachite green'],
        C23H25N5O5: ['Doxazosin'],
        C23H25ClFN7O: ['Gandotinib'],
        C23H26N2O2: ['Solifenacin'],
        C23H26N2O4: ['Brucine'],
        C23H26O3: ['Phenothrin'],
        C23H27Cl2N3O2: ['Aripiprazole'],
        C23H27N3O7: ['Minocycline'],
        C23H27FN4O2: ['Risperidone'],
        C23H27FN4O3: ['Paliperidone'],
        C23H27N5O7S: ['Piperacillin'],
        C23H27ClO7: ['Empagliflozin'],
        C23H28ClN3O5S: ['Glibenclamide'],
        C23H28F2N6O4S: ['Ticagrelor'],
        C23H28N8O4: ['Copanlisib'],
        C23H28O2: ['Pelretin'],
        C23H28O8: ['Salvinorin A'],
        C23H29N3O2S2: ['Tiotixene'],
        C23H30N2O4: ['Pholcodine'],
        C23H30ClN3O: ['Mepacrine'],
        C23H30N8O: ['Ribociclib'],
        C23H30N12O8S2: ['Ceftolozane'],
        C23H30O3: ['Etretinate'],
        C23H30O4: ['Nomegestrol acetate'],
        C23H31NO2: ['Proadifen'],
        C23H31NO3: ['Norgestimate'],
        C23H32Cl2NO6P: ['Estramustine phosphate'],
        C23H32N2O5: ['Ramipril'],
        C23H32F3N5O4: ['Nirmatrelvir'],
        C23H32O3: ['16-Dehydropregnenolone acetate'],
        C23H34N2O4: ['Conopharyngine'],
        C23H34O2: ['Cannabidiol dimethyl ether', 'Cannabidiphorol', 'Cardenolide', 'Tetrahydrocannabiphorol'],
        C23H34O4: ['Rostafuroxin'],
        C23H34O5: ['Mevastatin'],
        C23H35N7O6S: ['Tomopenem'],
        C23H36N2O2: ['Finasteride'],
        C23H36O2: ['Cardanolide', 'Luteone'],
        C23H36O7: ['Pravastatin'],
        C23H38N7O17P3S: ['Acetyl-CoA'],
        C23H38O: ['Teprenone'],
        C23H38O4: ['2-Arachidonoylglycerol'],
        C23H40O3: ['2-Arachidonyl glyceryl ether'],
        C23H46ClNO4: ['Pahutoxin'],
        C23H46N6O13: ['Neomycin'],
        C23H47N5O18S: ['Paromomycin'],
        C23H48: ['Tricosane'],

        C24H12: ['Coronene'],
        C24H14: ['Dibenzopyrene'],
        C24H20B: ['Tetraphenylborate'],
        C24H20BNa: ['Sodium tetraphenylborate'],
        C24H20BK: ['Potassium tetraphenylborate'],
        C24H20O10: ['Gyrophoric acid'],
        C24H21F2NO3: ['Ezetimibe'],
        C24H22FN3O4: ['Exatecan'],
        C24H23NO: ['JWH-018'],
        C24H23FN4O3: ['Olaparib'],
        C24H25NO3: ['Cyphenothrin'],
        C24H25ClFN5O3: ['Afatinib'],
        C24H25FO5S: ['Canagliflozin'],
        C24H26N2O4: ['Carvedilol'],
        C24H26N2O13: ['Betanin'],
        C24H26N4O5S: ['Amenamevir'],
        C24H27NO5S: ['Troglitazone'],
        C24H27N5O6: ['Gluten exorphin B4'],
        C24H28N2O5: ['Benazepril'],
        C24H28N3Cl: ['Methyl violet'],
        C24H28ClN5O3: ['Dimenhydrinate'],
        C24H28O2: ['Bexarotene'],
        C24H29NO3: ['Donepezil'],
        C24H29NO5: ['Sacubitril'],
        C24H29N3O8: ['Sarecycline'],
        C24H29N5O3: ['Valsartan'],
        C24H29N7O2: ['Palbociclib'],
        C24H29ClO4: ['Cyproterone acetate'],
        C24H30N2O7: ['Advantame'],
        C24H30Cl2FN3O3: ['Melphalan flufenamide'],
        C24H30O3: ['Drospirenone'],
        C24H30O7: ['Anziaic acid'],
        C24H30O8: ['Estrone glucuronide'],
        C24H30O11: ['Harpagoside'],
        C24H31N3O: ['Famprofazone'],
        C24H31F3O4: ['Flumedroxone acetate'],
        C24H31FO6: ['Flunisolide', 'Triamcinolone acetonide'],
        C24H32O4S: ['Spironolactone'],
        C24H32O8: ['Estradiol glucuronide'],
        C24H32O9: ['Estriol glucuronide'],
        C24H32O10: ['Acevaltrate'],
        C24H33Cl2NO5: ['Vilanterol'],
        C24H33N3O4: ['Ranolazine'],
        C24H33FN7O7P: ['Bemnifosbuvir'],
        C24H34N4O5S: ['Glimepiride'],
        C24H34O3: ['Rimexolone'],
        C24H34O4: ['Medroxyprogesterone acetate'],
        C24H34O9: ['T-2 mycotoxin'],
        C24H36N4O6S2: ['Romidepsin'],
        C24H36O2: ['Nisinic acid'],
        C24H36O5: ['Lovastatin'],
        C24H37N5O9: ['Gluten exorphin A5'],
        C24H38N4O4S: ['Azamulin'],
        C24H38N7O19P3S: ['Malonyl-CoA'],
        C24H38O4: ['Diethylhexyl phthalate'],
        C24H39NO7: ['Gigactonine', 'Vinervine'],
        C24H40N7O17P3S: ['Propionyl-CoA'],
        C24H40O3: ['Lithocholic acid'],
        C24H40O4: ['Chenodeoxycholic acid', 'Deoxycholic acid'],
        C24H40O5: ['Cholic acid'],
        C24H40O32Zr6: ['Zirconyl acetate'],
        C24H42: ['Cholane'],
        C24H42O7: ['Ascorbyl stearate'],
        C24H42O21: ['Stachyose'],
        C24H43NaO6: ['Sodium stearoyl lactylate'],
        C24H44O6: ['Sorbitan monooleate'],
        C24H46O2: ['Nervonic acid'],
        C24H46MgO4: ['Magnesium laurate'],
        C24H46NiO4: ['Nickel(II) laurate'],
        C24H46O4Cu: ['Copper(II) laurate'],
        C24H46O6: ['Sorbitan monostearate'],
        C24H48O2: ['Lignoceric acid'],
        C24H48MnO4: ['Manganese laurate'],
        C24H50: ['Tetracosane'],
        C24H50O: ['1-Tetracosanol'],
        C24H54OSn2: ['Tributyltin oxide'],
        C24H54Mo2O6: ['Hexa(tert-butoxy)dimolybdenum(III)'],
        C24BF20Li: ['Lithium tetrakis(pentafluorophenyl)borate'],

        C25H22O10: ['Umbilicaric acid'],
        C25H24N6O2: ['Ibrutinib'],
        C25H24N8O7S2: ['Cefpiramide'],
        C25H25NO9: ['Amrubicin'],
        C25H25F3N4O6: ['Delamanid'],
        C25H25N5O4: ['Apixaban'],
        C25H26O3: ['Adarotene'],
        C25H27N2NaO6S2: ['Xylene cyanol'],
        C25H27ClN2: ['Meclizine'],
        C25H27N3O4: ['Belotecan'],
        C25H27N9O8S2: ['Cefoperazone'],
        C25H28N6O: ['Irbesartan'],
        C25H28N8O2: ['Linagliptin'],
        C25H29I2NO3: ['Amiodarone'],
        C25H30N2O5: ['Quinapril'],
        C25H30ClN3: ['Crystal violet'],
        C25H30N4O9S2: ['Sultamicillin'],
        C25H30O4: ['Bixin', 'Norbixin'],
        C25H31F3O5S: ['Fluticasone propionate'],
        C25H32N4O7S: ['Oprozomib'],
        C25H32ClN5O2: ['Nefazodone'],
        C25H32O2: ['Quinestrol'],
        C25H32O9: ['Gutolactone'],
        C25H34O6: ['Budesonide', 'Ingenol mebutate'],
        C25H35NO9: ['Ryanodine'],
        C25H35N6O9PS: ['IDX-184'],
        C25H36O5: ['Shortolide A'],
        C25H36O6: ['Erinacine', 'Pseudopterosin A'],
        C25H36O8: ['Testosterone glucuronide'],
        C25H36O10: ['Glaucarubin'],
        C25H37NO4: ['Bimatoprost', 'Salmeterol'],
        C25H37N5O6: ['Apimostinel'],
        C25H38O3: ['Testosterone isocaproate'],
        C25H38O5: ['Simvastatin'],
        C25H38O8: ['Androsterone glucuronide', 'Etiocholanolone glucuronide'],
        C25H40N2O6S: ['Leukotriene D4'],
        C25H40N7O18P3S: ['Acetoacetyl-CoA'],
        C25H40N7O19P3S: ['Succinyl-CoA'],
        C25H40O8: ['Androstanediol glucuronide'],
        C25H41NO7: ['Delsoline', 'Lycoctonine'],
        C25H43N13O10: ['Viomycin', 'Enviomycin'],
        C25H44N14O8: ['Capreomycin'],
        C25H44O7P2: ['Geranylfarnesyl pyrophosphate'],
        C25H46: ['Highly branched isoprenoid III'],
        C25H48: ['Highly branched isoprenoid II'],
        C25H48N6O8: ['Deferoxamine'],
        C25H48N6O10: ['Plazomicin'],
        C25H50: ['Highly branched isoprenoid I'],
        C25H52: ['Pentacosane'],

        C26: ['C26 fullerene'],
        C26H26F2N2: ['Flunarizine'],
        C26H27NO9: ['Idarubicin'],
        C26H27N3O5S: ['Dasabuvir'],
        C26H28ClNO: ['Clomifene'],
        C26H28Cl2N4O4: ['Ketoconazole'],
        C26H29NO: ['Tamoxifen'],
        C26H29N3O6: ['Nicardipine'],
        C26H30O8: ['Limonin'],
        C26H31Cl2N5O3: ['Terconazole'],
        C26H31N5O5: ['Etanautine'],
        C26H32F2O7: ['Fluocinonide'],
        C26H33NO2: ['Abiraterone acetate', 'Fenretinide'],
        C26H34O10: ['Aviculin'],
        C26H36O3: ['Estradiol cypionate'],
        C26H38O2: ['Quingestrone'],
        C26H39NO6S: ['Epothilone A'],
        C26H40N2O36S5: ['Enoxaparin sodium'],
        C26H40O5: ['Latanoprost'],
        C26H43NO5: ['Glycochenodeoxycholic acid'],
        C26H43NO6: ['Glycocholic acid'],
        C26H44N7O18P3S: ['HMB-CoA'],
        C26H44O9: ['Mupirocin'],
        C26H45NO6S: ['Taurochenodeoxycholic acid', 'Taurodeoxycholic acid'],
        C26H45NO7S: ['Taurocholic acid'],
        C26H46: ['Norcholestane'],
        C26H48O5: ['Momordol'],
        C26H52O2: ['Cerotic acid'],
        C26H54: ['Hexacosane'],
        C26H54O: ['1-Hexacosanol'],

        C27H18N4Na2O9S2: ['Brown HT'],
        C27H22Cl2N4O: ['Tipifarnib'],
        C27H22Cl2N4: ['Clofazimine'],
        C27H23F2N3O7S: ['Baloxavir marboxil'],
        C27H24N4O6: ['OSI-7904'],
        C27H25N2NaO7S2: ['Green S'],
        C27H28N6O: ['Bisbenzimide'],
        C27H28Br2O5S: ['Bromothymol blue'],
        C27H29NO10: ['Daunorubicin'],
        C27H29NO11: ['Doxorubicin', 'Epirubicin'],
        C27H29N5O6S: ['Bosentan'],
        C27H29F3O6S: ['Fluticasone furoate'],
        C27H30N2O2: ['Palovarotene'],
        C27H30F6N2O2: ['Dutasteride'],
        C27H30F2N2O3: ['Lomerizine'],
        C27H30N4O: ['Oxatomide'],
        C27H30O5S: ['Thymol blue'],
        C27H30O6Cl2: ['Mometasone furoate'],
        C27H30O14: ['Rhoifolin'],
        C27H30O16: ['Rutin'],
        C27H31FN4O8: ['Eravacycline'],
        C27H31ClO16: ['Tulipanin'],
        C27H32F2N8: ['Abemaciclib'],
        C27H32O14: ['Naringin'],
        C27H32O15: ['Eriocitrin', 'Neoeriocitrin'],
        C27H33NO4: ['Paxilline'],
        C27H33N3O7: ['Verruculogen'],
        C27H33N3O8: ['Rolitetracycline'],
        C27H33N9O15P2: ['Flavin adenine dinucleotide'],
        C27H34N2O4S: ['Brilliant green'],
        C27H34N2O9: ['Strictosidine'],
        C27H34O9: ['Verrucarin A'],
        C27H34O14: ['Naringin dihydrochalcone'],
        C27H35N5O7S: ['Met-enkephalin'],
        C27H35N6O8P: ['Remdesivir'],
        C27H36N6O3S: ['Fedratinib'],
        C27H36O11: ['Bruceanol B'],
        C27H37N3O7S: ['Darunavir'],
        C27H38N2O4: ['Verapamil'],
        C27H38O3: ['Norethisterone enanthate'],
        C27H40O3: ['Calcipotriol'],
        C27H41NO2: ['Cyclopamine'],
        C27H41NO6S: ['Epothilone B'],
        C27H42N2O5S: ['Ixabepilone'],
        C27H42FeN9O12: ['Ferrichrome'],
        C27H42O3: ['Diosgenin', 'Yamogenin'],
        C27H44N7O20P3S: ['HMG-CoA'],
        C27H44N10O6: ['Antipain'],
        C27H44O: ['Cholecalciferol', '7-Dehydrocholesterol'],
        C27H44O2: ['Alfacalcidol', 'Calcifediol'],
        C27H44O3: ['Calcitriol', 'Sarsasapogenin'],
        C27H44O6: ['Ecdysone'],
        C27H44O7: ['Ecdysterone'],
        C27H44O8: ['Turkesterone'],
        C27H45N5O5: ['Boceprevir'],
        C27H46O: ['Cholesterol', 'Lathosterol'],
        C27H46O2: ['27-Hydroxycholesterol', 'δ-Tocopherol'],
        C27H46O4S: ['Cholesterol sulfate'],
        C27H48: ['Cholestane'],
        C27H48O6: ['5Beta-Scymnol'],
        C27H52N3O7P: ['Brincidofovir'],
        C27H56: ['Heptacosane'],

        C28H14N2O4: ['Indanthrone blue'],
        C28H16ClF6N5O: ['Tradipitant'],
        C28H17N5Na4O14S4: ['Brilliant Black BN'],
        C28H18O4: ['Naphtholphthalein'],
        C28H19N5Na2O6S4: ['Titan yellow'],
        C28H22ClF3N6O3: ['Ivosidenib'],
        C28H22F3N7O: ['Nilotinib'],
        C28H24N2O7: ['Orcein'],
        C28H26N4O3: ['Staurosporine'],
        C28H27NO4S: ['Raloxifene'],
        C28H28F2N6O3: ['Rimegepant'],
        C28H28O3: ['Adapalene'],
        C28H30N4O6: ['Lurtotecan'],
        C28H30O4: ['Thymolphthalein'],
        C28H30O9: ['Physalin B', 'Physalin C'],
        C28H30O10: ['Physalin A', 'Physalin F'],
        C28H30O11: ['Bruceanol A'],
        C28H31NO10: ['Menogaril'],
        C28H31ClN2O3: ['Rhodamine B'],
        C28H32N4O3: ['Pacritinib'],
        C28H33NO7: ['Cytochalasin E'],
        C28H33N7O2: ['Osimertinib'],
        C28H34O6: ['Deoxygedunin'],
        C28H34O15: ['Hesperidin', 'Neohesperidin'],
        C28H35N3O7: ['Pristinamycin IIA'],
        C28H35N5O5: ['Morphiceptin'],
        C28H36N4O2S: ['Lurasidone'],
        C28H36O10: ['Lucibufagin C'],
        C28H36O11: ['Bruceanol D', 'Bruceanol F', 'Bruceantin'],
        C28H36O15: ['Neohesperidin dihydrochalcone'],
        C28H37N5O7: ['Leu-enkephalin'],
        C28H37ClO7: ['Beclometasone'],
        C28H38N2O4: ['Cephaeline'],
        C28H38O6: ['Withaferin A'],
        C28H38O11: ['Bruceanol E', 'Bruceanol H'],
        C28H40N2O9: ['Antimycin A'],
        C28H40O2: ['δ-Tocotrienol'],
        C28H40O8: ['Phorbol 12,13-dibutyrate', 'Taxusin'],
        C28H41NO3: ['N-Arachidonoyl dopamine'],
        C28H42O2: ['β-Tocotrienol', 'γ-Tocotrienol'],
        C28H43O7: ['Gedunin'],
        C28H44O: ['Ergocalciferol', 'Ergosterol'],
        C28H44Co: ['Tetrakis(1-norbornyl)cobalt(IV)'],
        C28H45NO5S: ['Lefamulin'],
        C28H46O: ['Dihydrotachysterol', '22-Dihydroergocalciferol'],
        C28H46O5: ['Hippuristanol'],
        C28H47NO4S: ['Tiamulin'],
        C28H47NO8: ['Pikromycin'],
        C28H48: ['Bisnorhopane'],
        C28H48O: ['Campesterol'],
        C28H48O2: ['β-Tocopherol', 'γ-Tocopherol'],
        C28H48O6: ['Brassinolide'],
        C28H50: ['Campestane', 'Ergostane'],
        C28H50N4O7: ['Epoxomicin'],
        C28H50O: ['Campestanol'],
        C28H56O2: ['Montanic acid'],
        C28H58: ['Octacosane'],

        C29H23F6N5O3: ['Atogepant'],
        C29H24O12: ['Theaflavin'],
        C29H26ClFN4O4S: ['Lapatinib'],
        C29H26F3N5O3: ['Ubrogepant'],
        C29H28F4N4O4: ['Letermovir'],
        C29H30N6O6: ['Olmesartan'],
        C29H30O13: ['Amarogentin'],
        C29H31N7O: ['Imatinib'],
        C29H32ClN3: ['Victoria blue R'],
        C29H32ClN5O2: ['Pyronaridine'],
        C29H32Cl2N6: ['Piperaquine'],
        C29H32O13: ['Etoposide'],
        C29H33NO4: ['Trifarotene'],
        C29H33ClN2O2: ['Loperamide'],
        C29H34BrNO2: ['Umeclidinium bromide'],
        C29H34N2O2: ['Dotarizine'],
        C29H34O11: ['Myrotoxin B'],
        C29H35NO2: ['Mifepristone'],
        C29H35F3N2O3: ['Siponimod'],
        C29H35N5O7S: ['CCK-4'],
        C29H35Cl2N6O4P: ['Piperaquine phosphate'],
        C29H36O9: ['Satratoxin-H'],
        C29H36O15: ['Verbascoside'],
        C29H37NO5: ['Cytochalasin B'],
        C29H37N3O6: ['A23187'],
        C29H37N6O9P: ['GS-6620'],
        C29H38N2O6: ['Atrasentan'],
        C29H38N4O6S: ['Penicillin G procaine'],
        C29H38N4O10: ['Lymecycline'],
        C29H38O4: ['Celastrol'],
        C29H39NO9: ['Omacetaxine mepesuccinate'],
        C29H39N5O8: ['Tigecycline'],
        C29H40N2O4: ['Emetine'],
        C29H40N4O7: ['Omadacycline'],
        C29H40N6O6S: ['Metkefamide'],
        C29H40O5: ['Antcin B'],
        C29H41NO4: ['Buprenorphine'],
        C29H42O10: ['Convallatoxin'],
        C29H42O11: ['Antiarin'],
        C29H43NO4S: ['Avasimibe'],
        C29H44ClN5O18P4: ['Pyronaridine tetraphosphate'],
        C29H44O2: ['α-Tocotrienol'],
        C29H44O3: ['Estradiol undecylate'],
        C29H45N5O8: ['Gluten exorphin C'],
        C29H46O2: ['Momordenol'],
        C29H48O: ['Stigmasterol', 'Vitamin D5'],
        C29H50O: ['β-Sitosterol'],
        C29H50O2: ['α-Tocopherol'],
        C29H52: ['Fusidane', 'Poriferastane', 'Stigmastane'],
        C29H52O: ['24-Ethyl coprostanol', 'Stigmastanol'],
        C29H53NO5: ['Orlistat'],
        C29H60: ['Nonacosane'],

        C30H15FeN3Na3O15S3: ['Naphthol Green B'],
        C30H16O8: ['Hypericin'],
        C30H18O10: ['Amentoflavone'],
        C30H24N6Cl2Ru: ['Tris(bipyridine)ruthenium(II) chloride'],
        C30H25Sb: ['Pentaphenylantimony'],
        C30H26O13: ['Prodelphinidin B3', 'Prodelphinidin B9'],
        C30H27N3O15: ['Enterobactin'],
        C30H30F2N6O3: ['Sotorasib'],
        C30H32Cl3NO: ['Lumefantrine'],
        C30H32N2O2: ['Diphenoxylate'],
        C30H34FN5O5: ['Frakefamide'],
        C30H34ClN7O10S2: ['Cefiderocol'],
        C30H36O9: ['Nimbin'],
        C30H37NO4: ['Ulipristal acetate'],
        C30H38N6O7: ['Gluten exorphin B5'],
        C30H40O: ['Apocarotenal'],
        C30H40O3: ['Chamaecydin'],
        C30H40O6: ['Absinthin', 'Lepidolide'],
        C30H40O13: ['Bruceanol G'],
        C30H42N7O18P3S: ['Coumaroyl-CoA'],
        C30H42O8: ['Proscillaridin'],
        C30H42O10: ['Tigilanol tiglate'],
        C30H42O11: ['Decinnamoyltaxinine J'],
        C30H42Ni3O12: ['Nickel(II) bis(acetylacetonate)'],
        C30H44O7: ['Cucurbitacin D', 'Ganoderic acid'],
        C30H46O2: ['Ganoderol A', 'Momordicinin'],
        C30H46O3: ['Moronic acid'],
        C30H46O4: ['Enoxolone'],
        C30H46O6: ['Retigeric acid B'],
        C30H46O16S2: ['Atractyloside'],
        C30H47NO4S: ['Retapamulin'],
        C30H47N3O9S: ['Leukotriene C4'],
        C30H48O2: ['Daturaolone', 'Ganoderol B'],
        C30H48O3: ['Betulinic acid', 'Boswellic acid', 'Karavilagenin E', 'Oleanolic acid', 'Ursolic acid'],
        C30H48O4: ['Corosolic acid', 'Ganodermanontriol', 'Hederagenin', 'Maslinic acid', 'Momordicin I'],
        C30H50: ['Squalene'],
        C30H50O: ['Amyrin', 'Cycloartenol', 'Friedelin', 'Isoarborinol', 'Lanosterol', 'Lupeol', '2,3-Oxidosqualene', 'Parkeol', 'Taraxasterol', 'Taraxerol'],
        C30H50O2: ['Arnidiol', 'Betulin', 'Daturadiol'],
        C30H50O4: ['Balsaminol A', 'Cucurbalsaminol A'],
        C30H50O5: ['Balsaminapentaol', 'Cycloastragenol'],
        C30H50O6: ['Gymnemagenin'],
        C30H52: ['Arborane', 'Cycloartane', 'Gammacerane', 'Gorgostane', 'Hopane', 'Oleanane'],
        C30H52O: ['Ambrein', 'Tetrahymanol'],
        C30H52O2: ['Dammarenediol', 'Zeorin'],
        C30H52O3: ['Dammarenetriol', 'Protopanaxadiol'],
        C30H52O4: ['Panaxatriol', 'Protopanaxatriol'],
        C30H53NO11: ['Benzonatate'],
        C30H54: ['Cucurbitane', 'Dammarane', 'Euphane', 'Lanostane', 'Protostane', 'Tirucallane'],
        C30H56: ['Malabaricane'],
        C30H60O2: ['Melissic acid'],
        C30H62: ['Squalane', 'Triacontane'],
        C30H62O: ['1-Triacontanol'],

        C31H24F3N5O3: ['Umbralisib'],
        C31H33N3O6S: ['Zafirlukast'],
        C31H38O13: ['Bruceanol C'],
        C31H40O2: ['Menatetrenone'],
        C31H42N2O6: ['Batrachotoxin'],
        C31H43N3O2: ['Drimentine G'],
        C31H46O2: ['Phytomenadione'],
        C31H46O9: ['Yunnanxane'],
        C31H46O18S2: ['Carboxyatractyloside'],
        C31H48O6: ['Fusidic acid'],
        C31H50F6IrNP2: ['Crabtree\'s catalyst'],
        C31H50O3: ['Momordicin-28'],
        C31H52N2O5S: ['Valnemulin'],
        C31H52O3: ['α-Tocopheryl acetate'],
        C31H52O4: ['Balsaminol B', 'Cucurbalsaminol B'],
        C31H64: ['Hentriacontane'],

        C32H14: ['Ovalene'],
        C32H22N6Na2O6S2: ['Congo red'],
        C32H25N3O9S3Na2: ['Water blue'],
        C32H31BrN2O2: ['Bedaquiline'],
        C32H32O13S: ['Teniposide'],
        C32H35ClFN7O2: ['Adagrasib'],
        C32H37NO12: ['Pirarubicin'],
        C32H38N2O5: ['Cortivazol'],
        C32H39NO4: ['Fexofenadine'],
        C32H40BrN5O5: ['Bromocriptine'],
        C32H43N5O5: ['Dihydroergocryptine'],
        C32H44O2: ['Food orange 7'],
        C32H44O7: ['Ciclesonide'],
        C32H44O8: ['Cucurbitacin E'],
        C32H45N3O4S: ['Nelfinavir'],
        C32H48BF5O4S: ['ZB716'],
        C32H48O5: ['Acetoxolone'],
        C32H48O9: ['Oleandrin'],
        C32H49N9O5: ['Elamipretide'],
        C32H55BrN4O: ['Thonzonium bromide'],
        C32H56Cl2Ir2: ['Chlorobis(cyclooctene)iridium dimer'],
        C32H58N2O7S: ['CHAPS detergent'],
        C32H58O13: ['Rhamnolipid'],
        C32H64O2: ['Cetyl palmitate', 'Lacceroic acid'],
        C32H66: ['Dotriacontane'],

        C33H24IrN3: ['Tris(2-phenylpyridine)iridium'],
        C33H30N4O2: ['Telmisartan'],
        C33H31N5O10: ['ONX-0801'],
        C33H35NO13: ['Elsamitrucin'],
        C33H35FN2O5: ['Atorvastatin'],
        C33H35N5O5: ['Ergotamine'],
        C33H36N4O6: ['Bilirubin'],
        C33H37N5O5: ['Dihydroergotamine'],
        C33H38N4O6: ['Irinotecan'],
        C33H38O11: ['Triptofordin C-2'],
        C33H40N2O9: ['Reserpine'],
        C33H40N3Cl: ['Victoria blue BO'],
        C33H40N6O7: ['Casokefamide'],
        C33H41N3O: ['Victoria Blue BO base'],
        C33H44F2N2O3: ['Omaveloxolone'],
        C33H44O: ['Citranaxanthin'],
        C33H45N5O3: ['Lanepitant'],
        C33H47NO13: ['Natamycin'],
        C33H48O6: ['Leptomycin'],
        C33H60O10: ['Nonoxynol-9'],
        C33H68: ['Tritriacontane'],

        C34H22Cl2N4O2: ['Pigment violet 23'],
        C34H24N6Na4O16S4: ['Direct Blue 1'],
        C34H31CuN4Na3O6: ['Chlorophyllin'],
        C34H32O4N4Fe: ['Heme B'],
        C34H33BrN6O3: ['Deleobuvir'],
        C34H34N4O4: ['Protoporphyrin IX'],
        C34H35N3O10: ['Zorubicin'],
        C34H36F3NO13: ['Valrubicin'],
        C34H36O4N4S2Fe: ['Heme C'],
        C34H38N4O4: ['Protoporphyrinogen IX'],
        C34H38N6O5: ['Endomorphin'],
        C34H40ClNO4: ['Indometacin farnesil'],
        C34H41N7O5: ['Dabigatran'],
        C34H44N4O4: ['Tazemetostat'],
        C34H46O18: ['Eleutheroside D'],
        C34H47NO11: ['Aconitine'],
        C34H50N5NaO7: ['BQ-788'],
        C34H50O7: ['Carbenoxolone'],
        C34H50O12: ['Thapsigargin'],
        C34H50O16: ['Neoconvalloside'],
        C34H54O3: ['Estradiol palmitate'],
        C34H54O8: ['Lasalocid'],
        C34H57BrN2O4: ['Vecuronium bromide'],
        C34H59NO15: ['Fumonisin B1'],
        C34H63N5O9: ['Pepstatin'],
        C34H68O2: ['Geddic acid'],
        C34H70: ['Tetratriacontane'],

        C35H33NO12: ['Neocarzinostatin'],
        C35H35F2N8O5S: ['Isavuconazonium'],
        C35H36ClNO3S: ['Montelukast'],
        C35H38Cl2N8O4: ['Itraconazole'],
        C35H39N5O11: ['Vibriobactin'],
        C35H42O14: ['Taxinine M'],
        C35H44O16: ['Azadirachtin'],
        C35H45Cl2NO6: ['Prednimustine'],
        C35H46ClN5O9S: ['Asunaprevir'],
        C35H46O20: ['Echinacoside'],
        C35H47NO10: ['Taxine alkaloids'],
        C35H48N2O10: ['Eleutherobin'],
        C35H48N8O11S: ['Phalloidin'],
        C35H49O29: ['Xanthan gum'],
        C35H52O4: ['Hyperforin'],
        C35H54GdN7O15: ['Gadopiclenol'],
        C35H55N9O16: ['Peptide T'],
        C35H58O11: ['Filipin'],
        C35H60O6: ['Daucosterol'],
        C35H61NO12: ['Oleandomycin'],
        C35H66NO7P: ['Lecithin'],
        C35H72: ['Pentatriacontane'],

        C36H28O16: ['Theaflavin-3-gallate'],
        C36H30OP2Cl3Re: ['Oxotrichlorobis(triphenylphosphine)rhenium(V)'],
        C36H30Cl2P2Pd: ['Bis(triphenylphosphine)palladium chloride'],
        C36H38O8: ['Tinyatoxin'],
        C36H44N4O8: ['Coproporphyrinogen III'],
        C36H45N5O5S: ['Beclabuvir'],
        C36H46N4: ['Octaethylporphyrin'],
        C36H46N8O3: ['Zavegepant'],
        C36H47N5O4: ['Indinavir'],
        C36H51NO12: ['Pseudaconitine'],
        C36H53N7O6: ['Telaprevir'],
        C36H54O4: ['Adhyperforin'],
        C36H54O12: ['Bryoamaride'],
        C36H56O6: ['Bevirimat'],
        C36H56O8: ['Kuguaglycoside C', '12-O-Tetradecanoylphorbol-13-acetate'],
        C36H56O12: ['Fusicoccin'],
        C36H58O3: ['Estradiol stearate'],
        C36H58O8: ['Clavaric acid'],
        C36H60O2: ['Retinyl palmitate'],
        C36H60O3: ['Momordicilin'],
        C36H60O9: ['Kuguaglycoside D'],
        C36H60O30: ['α-Cyclodextrin'],
        C36H61N5O7S: ['Narlaprevir'],
        C36H62O11: ['Monensin'],
        C36H66O6Zn: ['Zinc ricinoleate'],
        C36H70O4Mg: ['Magnesium stearate'],
        C36H70CaO4: ['Calcium stearate'],
        C36H70MnO4: ['Manganese stearate'],
        C36H70NiO4: ['Nickel(II) stearate'],
        C36H70O4Cu: ['Copper(II) stearate'],
        C36H70O4Zn: ['Zinc stearate'],
        C36H74: ['Hexatriacontane'],

        C37H24O6N2: ['Etherimide'],
        C37H30OPClIr: ['Vaska\'s complex'],
        C37H34N2Na2O9S3: ['Brilliant blue FCF'],
        C37H34N2Na2O10S3: ['Fast Green FCF'],
        C37H40O9: ['Resiniferatoxin'],
        C37H42N4O13: ['Aldoxorubicin'],
        C37H42F2N8O4: ['Posaconazole'],
        C37H43N5O9PdS: ['Padeliporfin'],
        C37H44ClNO6: ['Penitrem A'],
        C37H44O13: ['Taxagifine'],
        C37H48N4O5: ['Lopinavir'],
        C37H48N6O5S2: ['Ritonavir'],
        C37H50N2O10: ['Methyllycaconitine'],
        C37H62O8: ['Kuguaglycoside A', 'Kuguaglycoside B'],
        C37H66N7O17P3S: ['Palmitoyl-CoA'],
        C37H67NO13: ['Erythromycin'],
        C37H76: ['Heptatriacontane'],

        C38H38O10: ['Mezerein'],
        C38H41N5O9: ['Talaporfin'],
        C38H46F4N6O9S: ['Glecaprevir'],
        C38H47N5O7S2: ['Simeprevir'],
        C38H50N6O9S: ['Grazoprevir'],
        C38H52N6O7: ['Atazanavir'],
        C38H56O4: ['Campesteryl ferulate'],
        C38H60O18: ['Stevioside'],
        C38H69NO13: ['Clarithromycin'],
        C38H72N2O12: ['Azithromycin'],
        C38H78: ['Octatriacontane'],

        C39H42N6O18: ['Bacillibactin'],
        C39H43N3O11S: ['Trabectedin'],
        C39H49NO16: ['Nogalamycin'],
        C39H50O7: ['Peridinin'],
        C39H52N2O8: ['Granadaene'],
        C39H53N9O13S: ['Amanullinic acid'],
        C39H53N9O14S: ['Amanin', 'ε-Amanitin'],
        C39H53N9O15S: ['β-Amanitin'],
        C39H54N10O11S: ['Proamanullin'],
        C39H54N10O12S: ['Amanullin'],
        C39H54N10O13S: ['Amaninamide', 'γ-Amanitin'],
        C39H54N10O14S: ['α-Amanitin'],
        C39H64N4O16: ['Tunicamycin'],
        C39H80: ['Nonatriacontane'],

        C40H33BF24O2: ['Brookhart\'s acid'],
        C40H34N2O8: ['Fagopyrin'],
        C40H43N7O7S: ['Paritaprevir'],
        C40H44N4O16: ['Uroporphyrinogen'],
        C40H46N4O17: ['Hydroxymethylbilane'],
        C40H49BrN6O9S: ['Faldaprevir'],
        C40H50N8O6: ['Daclatasvir'],
        C40H50O2: ['Rhodoxanthin'],
        C40H52O2: ['Canthaxanthin'],
        C40H52O4: ['Astaxanthin'],
        C40H53N7O5S2: ['Cobicistat'],
        C40H54: ['Torulene'],
        C40H54O: ['Echinenone'],
        C40H54O2: ['Diatoxanthin', '3\'-Hydroxyechinenone'],
        C40H54O3: ['Diadinoxanthin'],
        C40H56: ['α-Carotene', 'β-Carotene', 'γ-Carotene', 'δ-Carotene', 'ε-Carotene', 'Lycopene'],
        C40H56O: ['β-Cryptoxanthin', 'Mutatochrome', 'Rubixanthin'],
        C40H56O2: ['Lutein', 'meso-Zeaxanthin', 'Xanthophyll', 'Zeaxanthin'],
        C40H56O3: ['Antheraxanthin', 'Capsanthin', 'Flavoxanthin'],
        C40H56O4: ['Capsorubin', 'Neoxanthin', 'Violaxanthin'],
        C40H57N5O7: ['Carfilzomib'],
        C40H58: ['Neurosporene'],
        C40H58O: ['Rhodopin'],
        C40H58O4: ['Oryzanol A'],
        C40H59NO11: ['Eribulin'],
        C40H60: ['ζ-Carotene'],
        C40H62: ['Phytofluene'],
        C40H62O19: ['Sucrose acetate isobutyrate'],
        C40H64: ['Phytoene'],
        C40H66: ['Lycopersene'],
        C40H74O6: ['Stearyl palmityl tartrate'],
        C40H80NO8P: ['Dipalmitoylphosphatidylcholine'],
        C40H82: ['Tetracontane'],

        C41H42N4O8: ['Verteporfin'],
        C41H44N4O10S: ['Lurbinectedin'],
        C41H60O4: ['Oryzanol C'],
        C41H64O13: ['Digitoxin', 'Gymnemic acid IV'],
        C41H64O14: ['Digoxin'],
        C41H65NO10: ['Spinosad A'],
        C41H66O12: ['α-Hederin'],
        C41H66O13: ['Bacopaside V', 'Gymnemic acid III'],
        C41H67NO15: ['Troleandomycin'],
        C41H68O14: ['Astragaloside A', 'Astragaloside IV'],
        C41H72O9: ['Ionomycin'],
        C41H84: ['Hentetracontane'],

        C42H38O20: ['Senna glycoside'],
        C42H50Cl4N2O4: ['Estradiol mustard'],
        C42H53NO15: ['Aclarubicin'],
        C42H58N2O8: ['Incarvillateine'],
        C42H58O5: ['Dinoxanthin'],
        C42H58O6: ['Fucoxanthin'],
        C42H62O16: ['Glycyrrhizin'],
        C42H66O14: ['Neokuguaglucoside'],
        C42H67NO10: ['Spinosad D'],
        C42H70O11: ['Salinomycin'],
        C42H70O13: ['Kuguaglycoside G'],
        C42H70O14: ['Kuguaglycoside E'],
        C42H70O35: ['β-Cyclodextrin'],
        C42H72O14: ['Pseudoginsenoside F11'],
        C42H86: ['Dotetracontane'],

        C43H32O20: ['Theaflavin digallate'],
        C43H47N2NaO6S2: ['Indocyanine green'],
        C43H49N7O10: ['Virginiamycin S1'],
        C43H50N4O6: ['Vobtusine'],
        C43H51N3O11: ['Rifaximin'],
        C43H52N4O5: ['Conodurine', 'Voacamine'],
        C43H52N4O7: ['Conofoline'],
        C43H53NO14: ['Docetaxel'],
        C43H55N5O7: ['Vindesine'],
        C43H58N4O12: ['Rifampicin'],
        C43H66N12O12S2: ['Oxytocin'],
        C43H66O14: ['Gymnemic acid I'],
        C43H68ClNO11: ['Pimecrolimus'],
        C43H68O14: ['Gymnemic acid II'],
        C43H69NO12: ['Ascomycin'],
        C43H72O13: ['Kuguaglycoside F'],
        C43H74N2O14: ['Spiramycin'],
        C43H88: ['Triatetracontane'],

        C44H30N4: ['Tetraphenylporphyrin'],
        C44H32N4O4: ['Temoporfin'],
        C44H43AlCa2O30: ['Carmine'],
        C44H55NO16: ['Milataxel'],
        C44H57NO17: ['Ortataxel'],
        C44H58N2O10: ['Budesonide/formoterol'],
        C44H64O24: ['Crocin', 'Saffron'],
        C44H67N5O4: ['Ibrexafungerp'],
        C44H68O13: ['Okadaic acid'],
        C44H69NO12: ['Tacrolimus'],
        C44H70O23: ['Rebaudioside A'],
        C44H90: ['Tetratetracontane'],

        C45H38O20: ['Prodelphinidin C2'],
        C45H50ClN7O7S: ['Venetoclax'],
        C45H53NO14: ['Larotaxel'],
        C45H54N4O8: ['Vinorelbine'],
        C45H54F2N4O8: ['Vinflunine'],
        C45H57NO14: ['Cabazitaxel'],
        C45H57N3O9: ['Beauvericin'],
        C45H69N11O12S: ['Carbetocin'],
        C45H74BNO15: ['Boromycin'],
        C45H74O: ['Solanesol'],
        C45H74O11: ['Oligomycin'],
        C45H92: ['Pentatetracontane'],

        C46H56N4O10: ['Vincristine'],
        C46H58N4O9: ['Vinblastine'],
        C46H60FN3O13: ['Tesetaxel'],
        C46H62N4O11: ['Rifabutin'],
        C46H65N15O12S2: ['Vasopressin'],
        C46H74O: ['Bacopaside X'],
        C46H74O20S: ['Bacopaside I'],
        C46H77NO17: ['Tylosin'],
        C46H92O2: ['Beeswax'],
        C46H94: ['Hexatetracontane'],

        C47H51NO14: ['Paclitaxel'],
        C47H64N4O12: ['Rifapentine'],
        C47H70O14: ['Abamectin B1b'],
        C47H72O14: ['22,23-dihydroavermectin B1b'],
        C47H73NO17: ['Amphotericin B'],
        C47H74O18: ['Araloside A'],
        C47H75NO17: ['Nystatin'],
        C47H76O18: ['Bacopaside II'],
        C47H83O13P: ['Phosphatidylinositol'],
        C47H96: ['Heptatetracontane'],

        C48H56N6O8S2: ['Penicillin G benzathine'],
        C48H72O14: ['Abamectin B1a'],
        C48H74O14: ['22,23-dihydroavermectin B1a'],
        C48H80O18: ['Kuguaglycoside H'],
        C48H80O40: ['γ-Cyclodextrin'],
        C48H86CaO12: ['Calcium stearoyl-2-lactylate'],
        C48H98: ['Octatetracontane'],

        C49H54F2N8O6: ['Ledipasvir'],
        C49H54N8O8: ['Velpatasvir'],
        C49H55N9O7: ['Elbasvir'],
        C49H56O6N4Fe: ['Heme A'],
        C49H58O5N4Fe: ['Heme O'],
        C49H100: ['Nonatetracontane'],

        C50H67N7O8: ['Ombitasvir'],
        C50H68N14O10: ['Bremelanotide'],
        C50H69N15O9: ['Melanotan II'],
        C50H73N15O11: ['Bradykinin'],
        C50H80N14O14S: ['Neurokinin A'],
        C50H102: ['Pentacontane'],
        C51H40N6O23S6: ['Suramin'],
        C51H42O3Pd2: ['Tris(dibenzylideneacetone)dipalladium(0)'],
        C51H79NO13: ['Sirolimus'],
        C51H80O18: ['Ziziphin'],
        C51H98O6: ['Tripalmitin'],
        C51H104: ['Henpentacontane'],
        C52H74Cl2O18: ['Fidaxomicin'],
        C52H76O24: ['Plicamycin'],
        C52H98N16O13: ['Colistin'],
        C52H106: ['Dopentacontane'],
        C53H76N14O12: ['Teprotide'],
        C53H80O2: ['Plastoquinone'],
        C53H83NO14: ['Everolimus'],
        C53H84NO14P: ['Ridaforolimus'],
        C53H93N7O13: ['Surfactin'],
        C53H108: ['Tripentacontane'],
        C54H45ClP3Rh: ['Wilkinson\'s catalyst'],
        C54H45Cl2P3Ru: ['Dichlorotris(triphenylphosphine)ruthenium(II)'],
        C54H62CaN4O14S4: ['Patent Blue V'],
        C54H77N13O12: ['β-Neoendorphin'],
        C54H85N13O15S: ['Eledoisin'],
        C54H90N6O18: ['Valinomycin'],
        C54H92O24: ['Siamenoside I'],
        C54H105CeO6: ['Cerium stearate'],
        C54H110: ['Tetrapentacontane'],
        C55H46OP3Rh: ['Tris(triphenylphosphine)rhodium carbonyl hydride'],
        C55H70MgN4O6: ['Chlorophyll b'],
        C55H72MgN4O5: ['Chlorophyll a'],
        C55H79N13O14S2: ['Neurokinin B'],
        C55H82O21S2: ['Yessotoxin'],
        C55H84N17O21S3: ['C55H84N17O21S3'],
        C55H86O24: ['Aescin'],
        C55H92O: ['Bactoprenol'],
        C55H92O7P2: ['C55-isoprenyl pyrophosphate'],
        C55H112: ['Pentapentacontane'],
        C56H45O2P3Ru: ['Dicarbonyltris(triphenylphosphine)ruthenium(0)'],
        C56H71N9O23S: ['Micafungin'],
        C56H88N18O22: ['Pyoverdine'],
        C56H100N16O17S: ['Polymyxin B'],
        C56H114: ['Hexapentacontane'],
        C57H65F5N10O8: ['Pibrentasvir'],
        C57H82O26: ['Chromomycin A3'],
        C57H87N7O15: ['Plitidepsin'],
        C57H110O6: ['Stearin'],
        C57H116: ['Heptapentacontane'],
        C58H73N13O21S2: ['Ceruletide'],
        C58H86N2O19: ['Hamycin A'],
        C58H95N15O15: ['Teixobactin'],
        C58H114O26: ['Polysorbate 20'],
        C58H118: ['Octapentacontane'],
        C59H79N15O21S6: ['Linaclotide'],
        C59H84N2O18: ['Candicidin'],
        C59H84N16O12: ['Leuprorelin'],
        C59H88N2O17: ['Perimycin'],
        C59H90O4: ['Coenzyme Q'],
        C59H95N15O18S: ['Kassinin'],
        C59H120: ['Nonapentacontane'],

        C60: ['Buckminsterfullerene'],
        C60H89N15O13: ['α-Neoendorphin'],
        C60H90O5: ['Shellac'],
        C60H92N12O10: ['Gramicidin S'],
        C60H114O8: ['Sorbitan tristearate'],
        C60H122: ['Hexacontane'],
        C61H88Cl2O32: ['Avilamycin'],
        C62H86N12O16: ['Dactinomycin'],
        C62H89CoN13O15P: ['Hydroxocobalamin'],
        C62H95N4O30P: ['Moenomycin C'],
        C62H96N5O28P: ['Moenomycin C1'],
        C62H111N11O12: ['Ciclosporin'],
        C63H88CoN14O14P: ['Cobalamin', 'Cyanocobalamin'],
        C63H91CoN13O14P: ['Methylcobalamin'],
        C63H98N18O13S: ['Substance P'],
        C64H32N16Lu: ['Lutetium phthalocyanine'],
        C64H124O26: ['Polysorbate 80'],
        C65H82N2O18S2: ['Atracurium besilate'],
        C66H75Cl2N9O24: ['Vancomycin'],
        C66H87N13O13: ['Tyrocidine'],
        C66H103N17O16S: ['Bacitracin'],
        C66H112O34: ['Neomogroside'],
        C66H121Fe2NaO65: ['Sodium ferric gluconate complex'],
        C68H74N8O11: ['Porfimer sodium'],
        C69H81NO15: ['DHA-paclitaxel'],
        C69H108N5O34P: ['Moenomycin A'],

        C70: ['C70 fullerene'],
        C70H91N15O26: ['Minigastrin'],
        C71H110N24O18S: ['Bombesin'],
        C72H42N6Na4O18RuS6: ['Tetrasodium tris(bathophenanthroline disulfonate)ruthenium(II)'],
        C72H60P4Pd: ['Tetrakis(triphenylphosphine)palladium(0)'],
        C72H60P4Pt: ['Tetrakis(triphenylphosphine)platinum(0)'],
        C72H100CoN18O17P: ['Adenosylcobalamin'],
        C72H101N17O26: ['Daptomycin'],
        C73H88Cl2N10O26: ['Chloroeremomycin'],
        C74H99N21O16S: ['γ-Melanocyte-stimulating hormone'],
        C76H52O46: ['Tannic acid'],
        C77H109N21O19S: ['α-Melanocyte-stimulating hormone'],
        C77H120N18O26S: ['α-Endorphin'],
        C78H111N21O19: ['Afamelanotide'],
        C79H129N27O22: ['Nociceptin'],

        C80H106Cl2N11O27P: ['Telavancin'],
        C83H131N19O27S: ['γ-Endorphin'],
        C86H97Cl3N10O26: ['Oritavancin'],
        C88H100Cl2N10O28: ['Dalbavancin'],
        C89H101Cl2N9O36: ['β Avoparcin'],
        C89H102ClN9O36: ['α Avoparcin'],

        C91H117N19O26: ['Zoptarelin doxorubicin'],
        C91H132ClNO34: ['Prymnesin-B1'],
        C92H150N22O25: ['Alamethicin'],
        C94H178N2O25P2: ['Lipid A'],
        C96H136Cl3NO35: ['Prymnesin-2'],
        C97H124N20O31S: ['Little gastrin I'],
        C99H140N20O17: ['Gramicidin'],

        C107H154Cl3NO44: ['Prymnesin-1'],
        C118H174N34O35S: ['β-Melanocyte-stimulating hormone'],
        C129H198N42O35S2: ['Urumin'],
        C132H194N40O49S: ['Big gastrin'],
        C143H230N42O37S7: ['Nisin'],
        C146H213N43O40: ['Galanin'],
        C153H225N43O49S: ['Glucagon'],
        C156H216Al12Cu43: ['Heterometallic copper-aluminum superatom'],
        C158H249N53O47S11: ['Chlorotoxin'],
        C158H251N39O46S: ['β-Endorphin'],
        C164H256O68S2Na2: ['Maitotoxin'],
        C172H221N62O91P17S17: ['Oblimersen'],
        C172H265N43O51: ['Liraglutide'],
        C187H291N45O59: ['Semaglutide'],
        C190H287N55O57: ['Neuropeptide Y'],

        C204H263N63O114P20S20: ['Fomivirsen'],
        C225H348N48O68: ['Tirzepatide'],
        C256H381N65O79S6: ['Insulin aspart'],
        C257H308N32O79: ['Paclitaxel trevatide'],
        C257H383N65O77S6: ['Insulin'],
        C257H389N65O77S6: ['Insulin lispro'],
        C267H402N64O76S6: ['Insulin detemir'],
        C267H404N72O78S6: ['Insulin glargine'],
        C274H411N65O81S6: ['Insulin degludec'],

        C540: ['C540 fullerene'],
        C759H1186N208O232S10: ['Anakinra'],
        C845H1343N223O243S9: ['Filgrastim'],
        C860H1353N227O255S9: ['Peginterferon alfa-2a'],
        C860H1353N229O255S9: ['Peginterferon alfa-2b'],

        C1321H1999N339O396S9: ['Dornase alfa'],
        C1377H2208N382O442S17: ['Asparaginase', 'Pegaspargase'],
        C1521H2381N417O461S7: ['Rasburicase'],
        C2100H3278N566O669S4: ['Streptokinase'],
        C2101H3229N551O673S15: ['Abciximab'],
        C2158H3282N562O681S12: ['Ranibizumab'],
        C2553H4026N692O798S16: ['Tagraxofusp'],
        C2560H4042N678O799S17: ['Denileukin diftitox'],
        C2569H3928N746O781S40: ['Alteplase'],
        C2646H4044N704O836S18: ['Dulaglutide'],
        C4318H6788N1164O1304S32: ['Aflibercept'],
        H582O111C290: ['P123'],
        C6332H9808N1678O1989S42: ['Daclizumab'],
        C6352H9838N1694O1992S46: ['Eptinezumab'],
        C6362H9862N1712O1995S42: ['Nivolumab'],
        C6378H9844N1698O1997S48: ['Basiliximab'],
        C6388H9918N1718O1998S44: ['Sarilumab'],
        C6392H9854N1686O2018S46: ['Galcanezumab'],
        C6396H9922N1712O1996S42: ['Solanezumab'],
        C6398H9878N1694O2016S48: ['Panitumumab'],
        C6416H9874N1688O1987S44: ['Rituximab'],
        C6420H9832N1690O2014S44: ['Dostarlimab'],
        C6428H9912N1694O1987S46: ['Adalimumab', 'Infliximab'],
        C6428H9976N1720O2018S42: ['Tocilizumab'],
        C6446H9902N1706O1998S42: ['Atezolizumab'],
        C6446H9946N1702O2042S42: ['Bavituximab'],
        C6450H9916N1714O2023S38: ['Omalizumab'],
        C6452H9958N1722O2010S42: ['Canakinumab'],
        C6452H10038N1708O2013S42: ['Donanemab'],
        C6456H9932N1700O2026S44: ['Isatuximab'],
        C6466H9996N1724O2010S42: ['Daratumumab'],
        C6468H10066N1732O2005S40: ['Alemtuzumab'],
        C6470H9952N1716O2016S46: ['Fremanezumab'],
        C6470H10012N1726O2013S42: ['Trastuzumab'],
        C6470H10056N1700O2008S50: ['Palivizumab'],
        C6472H9964N1728O2018S50: ['Erenumab'],
        C6472H10028N1740O2014S46: ['Aducanumab'],
        C6480H10022N1742O2020S44: ['Ofatumumab'],
        C6482H10004N1712O2016S46: ['Ustekinumab'],
        C6484H10042N1732O2023S36: ['Cetuximab'],
        C6488H10034N1746O2038S50: ['Tixagevimab'],
        C6534H10004N1716O2036S46: ['Pembrolizumab'],
        C6544H10088N1744O2032S46: ['Lecanemab'],
        C6566H10082N1746O2056S40: ['Nimotuzumab'],
        C6626H10218N1750O2078S44: ['Cilgavimab'],
        C6638H10160N1720O2108S44: ['Bevacizumab'],
        C6742H9972N1732O2004S40: ['Ipilimumab'],
        C6760H10447N1743O2010S32: ['Botulinum toxin'],
        C9030H13932N2400O2670S74: ['Rilonacept'],

        NHCl2: ['Dichloramine'],
        NH2Cl: ['Monochloramine'],
        NH3: ['Ammonia'],
        NH3CO2: ['Carbamic acid'],
        NH4ClO3: ['Ammonium chlorate'],
        NH4VO3: ['Ammonium metavanadate'],
        NH4ClO4: ['Ammonium perchlorate'],
        NH4AlS2O8: ['Ammonium alum'],
        NH6O4P: ['Ammonium dihydrogen phosphate'],
        NO: ['Nitric oxide'],
        NOCl: ['Nitrosyl chloride'],
        NO3: ['Nitrate radical'],
        NO6Cl: ['Nitronium perchlorate'],
        NF3: ['Nitrogen trifluoride'],
        NCl3: ['Nitrogen trichloride'],
        NBr3: ['Nitrogen tribromide'],
        NI3: ['Nitrogen triiodide'],
        N2: ['Dinitrogen'],
        N2H4: ['Hydrazine'],
        N2H8SO4: ['Ammonium sulfate'],
        N2H8S2O8: ['Ammonium persulfate'],
        N2H8SiF6: ['Ammonium fluorosilicate'],
        N2H8PtCl6: ['Ammonium hexachloroplatinate'],
        N2H9PO4: ['Diammonium phosphate'],
        N2O: ['Nitrous oxide'],
        N2O4: ['Dinitrogen tetroxide'],
        N2O5: ['Dinitrogen pentoxide'],
        N2F2: ['Dinitrogen difluoride'],
        N2F4: ['Tetrafluorohydrazine'],
        N3H12PO4: ['Ammonium phosphate'],
        N3P3Cl6: ['Hexachlorophosphazene'],
        N4: ['Tetranitrogen'],
        N4O: ['Nitrosyl azide', 'Oxatetrazole'],
        N4O2: ['Nitryl azide'],
        N4O6: ['Trinitramide'],
        N5H: ['Pentazole'],
        N6: ['Hexazine'],

        O2: ['Dioxygen'],
        O2F2: ['Dioxygen difluoride'],
        O2PtF6: ['Dioxygenyl hexafluoroplatinate'],
        O3: ['Ozone'],
        O4: ['Tetraoxygen'],
        O8: ['Octaoxygen'],

        FHO3S: ['Fluorosulfuric acid'],
        FN3: ['Fluorine azide'],
        FClO4: ['Fluorine perchlorate'],
        F2: ['Difluorine'],
        F2Kr: ['Krypton difluoride'],
        F4K2Ni: ['Potassium tetrafluoronickelate'],
        F6H2Si: ['Hexafluorosilicic acid'],

        NaH: ['Sodium hydride'],
        NaHCO3: ['Sodium bicarbonate'],
        NaOH: ['Sodium hydroxide'],
        NaHSO3: ['Sodium bisulfite'],
        NaHSO4: ['Sodium bisulfate'],
        NaHXeO4: ['Monosodium xenate'],
        NaHF2: ['Sodium bifluoride'],
        NaSH: ['Sodium hydrosulfide'],
        NaSeH: ['Sodium hydroselenide'],
        NaNH2: ['Sodium amide'],
        NaH2PO2: ['Sodium hypophosphite'],
        NaH2PO4: ['Monosodium phosphate'],
        NaH2AsO4: ['Sodium dihydrogen arsenate'],
        NaBH3CN: ['Sodium cyanoborohydride'],
        NaBH4: ['Sodium borohydride'],
        NaH4BO4: ['Sodium tetrahydroxyborate'],
        NaAlH4: ['Sodium aluminum hydride'],
        NaH5PO4: ['Microcosmic salt'],
        NaH14Al3P8O32: ['Sodium aluminum phosphate'],
        NaBO2: ['Sodium metaborate'],
        NaBO3: ['Sodium perborate'],
        NaBF4: ['Sodium tetrafluoroborate'],
        NaCN: ['Sodium cyanide'],
        NaOCN: ['Sodium cyanate'],
        NaSCN: ['Sodium thiocyanate'],
        NaNO2: ['Sodium nitrite'],
        NaNO3: ['Sodium nitrate'],
        NaN3: ['Sodium azide'],
        NaOCl: ['Sodium hypochlorite'],
        NaOBr: ['Sodium hypobromite'],
        NaAlO2: ['Sodium aluminate'],
        NaClO2: ['Sodium chlorite'],
        NaCoO2: ['Sodium cobalt oxide'],
        NaAsO2: ['Sodium arsenite'],
        NaClO3: ['Sodium chlorate'],
        NaVO3: ['Sodium metavanadate'],
        NaBrO3: ['Sodium bromate'],
        NaTcO3: ['Sodium technetate(V)'],
        NaBiO3: ['Sodium bismuthate'],
        NaClO4: ['Sodium perchlorate'],
        NaMnO4: ['Sodium permanganate'],
        NaBrO4: ['Sodium perbromate'],
        NaTcO4: ['Sodium pertechnetate'],
        NaIO4: ['Sodium periodate'],
        NaReO4: ['Sodium perrhenate'],
        NaAlSi2O6: ['Jadeite'],
        NaAlSi3O8: ['Albite'],
        NaAlS2O8: ['Sodium alum'],
        NaF: ['Sodium fluoride'],
        NaPF6: ['Sodium hexafluorophosphate'],
        NaAlCl4: ['Sodium tetrachloroaluminate'],
        NaSi: ['Sodium silicide'],
        NaCl: ['Sodium chloride'],
        NaBr: ['Sodium bromide'],
        NaI: ['Sodium iodide'],
        Na2HPO3: ['Disodium hydrogen phosphite'],
        Na2HPO4: ['Disodium phosphate'],
        Na2HAsO4: ['Disodium hydrogen arsenate'],
        Na2H2P2O7: ['Disodium pyrophosphate'],
        Na2H6O6Sn: ['Sodium stannate'],
        Na2H20B4O17: ['Borax'],
        Na2He: ['Disodium helide'],
        Na2B4O7: ['Sodium tetraborate'],
        Na2B8O13: ['Disodium octaborate'],
        Na2CO3: ['Sodium carbonate'],
        Na2C2O4: ['Sodium oxalate'],
        Na2NO7S: ['Disodium nitrosodisulfonate'],
        Na2N2O2: ['Sodium hyponitrite'],
        Na2N2O3: ['Angeli\'s salt'],
        Na2ZnO2: ['Sodium zincate'],
        Na2PFO3: ['Sodium monofluorophosphate'],
        Na2SiO3: ['Sodium metasilicate'],
        Na2SO3: ['Sodium sulfite'],
        Na2O3S2: ['Sodium thiosulfate'],
        Na2TiO3: ['Sodium metatitanate'],
        Na2GeO3: ['Sodium germanate'],
        Na2O3Se: ['Sodium selenite'],
        Na2TeO3: ['Sodium tellurite'],
        Na2SO4: ['Sodium sulfate'],
        Na2S2O4: ['Sodium dithionite'],
        Na2CrO4: ['Sodium chromate'],
        Na2O4Se: ['Sodium selenate'],
        Na2MoO4: ['Sodium molybdate'],
        Na2WO4: ['Sodium tungstate'],
        Na2S2O5: ['Sodium metabisulfite'],
        Na2S2O6: ['Sodium dithionate'],
        Na2S2O7: ['Sodium pyrosulfate'],
        Na2U2O7: ['Sodium diuranate'],
        Na2MgS2O8: ['Sodium magnesium sulfate'],
        Na2S2O8: ['Sodium persulfate'],
        Na2S: ['Sodium sulfide'],
        Na2S4: ['Sodium tetrasulfide'],
        Na2PdCl4: ['Sodium tetrachloropalladate'],
        Na2OsCl6: ['Sodium hexachloroosmate'],
        Na2PtCl6: ['Sodium hexachloroplatinate'],
        Na2Se: ['Sodium selenide'],
        Na2Te: ['Sodium telluride'],
        Na2Po: ['Sodium polonide'],
        Na3H15Al2P8O32: ['Sodium aluminum phosphate'],
        Na3B5O8: ['Trisodium pentaborate'],
        Na3N: ['Sodium nitride'],
        Na3N6O12Co: ['Sodium hexanitritocobaltate(III)'],
        Na3PS2O2: ['Sodium dithiophosphate'],
        Na3PO3S: ['Sodium monothiophosphate'],
        Na3PO4: ['Trisodium phosphate'],
        Na3VO4: ['Sodium orthovanadate'],
        Na3P3O9: ['Sodium trimetaphosphate'],
        Na3AlF6: ['Sodium aluminum hexafluoride'],
        Na3P: ['Sodium phosphide'],
        Na3SbS4: ['Sodium thioantimoniate'],
        Na3As: ['Sodium arsenide'],
        Na4O4Si: ['Sodium orthosilicate'],
        Na4O7P2: ['Tetrasodium pyrophosphate'],
        Na5P3O10: ['Sodium triphosphate'],
        Na6O7Si2: ['Sodium pyrosilicate'],
        Na6P6O18: ['Sodium hexametaphosphate'],
        Na6V10O28: ['Sodium decavanadate'],

        MgH: ['Magnesium monohydride'],
        MgHPO4: ['Dimagnesium phosphate'],
        MgH2: ['Magnesium hydride'],
        MgH2O2: ['Magnesium hydroxide'],
        MgH4P2O8: ['Monomagnesium phosphate'],
        MgB2: ['Magnesium diboride'],
        MgCO3: ['Magnesium carbonate'],
        MgC2O4: ['Magnesium oxalate'],
        MgN2O6: ['Magnesium nitrate'],
        MgO: ['Magnesium oxide'],
        MgO2: ['Magnesium peroxide'],
        MgSO3: ['Magnesium sulfite'],
        MgSO4: ['Magnesium sulfate'],
        MgCrO4: ['Magnesium chromate'],
        MgCl2O6: ['Magnesium chlorate'],
        MgU2O7: ['Magnesium diuranate'],
        MgCl2O8: ['Magnesium perchlorate'],
        MgNb2O9Pb3: ['Lead magnesium niobate'],
        MgF2: ['Magnesium fluoride'],
        MgS: ['Magnesium sulfide'],
        MgCl2: ['Magnesium chloride'],
        MgCu2: ['Magnesium copper'],
        MgBr2: ['Magnesium bromide'],
        MgI2: ['Magnesium iodide'],
        MgPo: ['Magnesium polonide'],
        Mg2NiH4: ['Magnesium nickel hydride'],
        Mg2SiO4: ['Magnesium orthosilicate'],
        Mg2O8Si3: ['Magnesium trisilicate'],
        Mg2Si: ['Magnesium silicide'],
        Mg3Si4H2O12: ['Talc'],
        Mg3N2: ['Magnesium nitride'],
        Mg3ZnO4: ['Magnesium zinc oxide'],
        Mg3O8P2: ['Trimagnesium phosphate'],
        Mg4Si6H2O17: ['Sepiolite'],
        Mg5Ga2: ['Pentamagnesium digallide'],

        AlHO2: ['Aluminum hydroxide oxide'],
        AlMg2H7O7: ['Magaldrate'],
        AlB3H12: ['Aluminum borohydride'],
        AlLiO2: ['Lithium aluminate'],
        AlB2: ['Aluminum diboride'],
        AlB12: ['Aluminum dodecaboride'],
        AlF: ['Aluminum monofluoride'],
        AlF3: ['Aluminum fluoride'],
        AlP: ['Aluminum phosphide'],
        AlCl: ['Aluminum monochloride'],
        AlCl3: ['Aluminum chloride'],
        AlBr: ['Aluminum monobromide'],
        AlBr3: ['Aluminum bromide'],
        AlI: ['Aluminum monoiodide'],
        AlI3: ['Aluminum iodide'],
        Al2O3: ['Aluminum oxide'],
        Al2MgO8Si2: ['Almasilate'],
        Al2S3O12: ['Aluminum sulfate'],
        Al2Br6: ['Aluminum bromide'],
        Al2I6: ['Aluminum iodide'],

        Si: ['Crystalline silicon', 'Silicene', 'Silicyne'],
        SiH4: ['Silane'],
        SiB3: ['Silicon triboride'],
        SiB4: ['Silicon tetraboride'],
        SiB6: ['Silicon hexaboride'],
        SiN12: ['Silicon tetraazide'],
        SiO2: ['Silicon dioxide'],
        SiF4: ['Silicon tetrafluoride'],
        SiS2: ['Silicon disulfide'],
        SiCl4: ['Silicon tetrachloride'],
        Si2H6: ['Disilane'],
        Si3H8: ['Trisilane'],
        Si3N4: ['Silicon nitride'],
        Si4H10: ['Tetrasilane'],
        Si5H10: ['Cyclopentasilane'],
        Si5H12: ['Pentasilane'],
        Si6H14: ['Haxasilane'],
        Si24: ['Si24'],

        PH3: ['Phosphine'],
        POCl3: ['Phosphoryl chloride'],
        PF5: ['Phosphorus pentafluoride'],
        PCl3: ['Phosphorus trichloride'],
        PCl5: ['Phosphorus pentachloride'],
        PBr3: ['Phosphorus tribromide'],
        PI3: ['Phosphorus triiodide'],
        P2: ['Diphosphorus'],
        P2H4: ['Diphosphane'],
        P2S5: ['Phosphorus pentasulfide'],
        P2I4: ['Diphosphorus tetraiodide'],
        P3N5: ['Triphosphorus pentanitride'],
        P4: ['Tetraphosphorus'],
        P4O6: ['Phosphorus trioxide'],
        P4O10: ['Phosphorus pentoxide'],
        P4S3: ['Phosphorus sesquisulfide'],
        P4S10: ['Phosphorus pentasulfide'],

        SOCl2: ['Thionyl chloride'],
        SO2: ['Sulfur dioxide'],
        SO2F2: ['Sulfuryl fluoride'],
        SO3: ['Sulfur trioxide'],
        SF4: ['Sulfur tetrafluoride'],
        SF5Cl: ['Sulfur chloride pentafluoride'],
        SF6: ['Sulfur hexafluoride'],
        SCl2: ['Sulfur dichloride'],
        S2: ['Disulfur'],
        S2F10: ['Disulfur decafluoride'],
        S2Cl2: ['Disulfur dichloride'],
        S2Se: ['Selenium disulfide'],
        S3: ['Trisulfur'],
        S4: ['Tetrasulfur'],
        S4N4: ['Tetrasulfur tetranitride'],
        S6: ['Hexasulfur'],
        S7: ['Heptasulfur'],
        S8: ['Octasulfur'],
        S12: ['Dodecasulfur'],

        ClH4N: ['Ammonium chloride'],
        ClN3: ['Chlorine azide'],
        ClO2: ['Chlorine dioxide'],
        ClFO2S: ['Sulfuryl chloride fluoride'],
        ClO3F: ['Perchloryl fluoride'],
        ClF3: ['Chlorine trifluoride'],
        ClF5: ['Chlorine pentafluoride'],
        Cl2: ['Dichlorine'],
        Cl2H18N6Ni: ['Hexaamminenickel chloride'],
        Cl2O: ['Dichlorine monoxide'],
        Cl2O4: ['Chlorine perchlorate'],
        Cl2O6: ['Dichlorine hexoxide'],
        Cl2O7: ['Dichlorine heptoxide'],
        Cl6H8IrN2: ['Ammonium hexachloroiridate(IV)'],
        Cl6IrNa3: ['Sodium hexachloroiridate(III)'],

        ArH: ['Argon monohydride'],
        ArH4: ['Argon hydride'],
        Ar1C60: ['Argon buckminsterfullerene'],

        KH: ['Potassium hydride'],
        KHCO3: ['Potassium bicarbonate'],
        KOH: ['Potassium hydroxide'],
        KHSO3: ['Potassium bisulfite'],
        KHSO4: ['Potassium bisulfate'],
        KHF2: ['Potassium bifluoride'],
        KNH2: ['Potassium amide'],
        KH2PO4: ['Monopotassium phosphate'],
        KC4H5O6: ['Potassium bitartrate'],
        KCN: ['Potassium cyanide'],
        KCNO: ['Potassium cyanate'],
        KC8: ['Potassium graphite'],
        KNO2: ['Potassium nitrite'],
        KNO3: ['Potassium nitrate'],
        KN3: ['Potassium azide'],
        KO2: ['Potassium superoxide'],
        KO3: ['Potassium ozonide'],
        KClO3: ['Potassium chlorate'],
        KBrO3: ['Potassium bromate'],
        KIO3: ['Potassium iodate'],
        KClO4: ['Potassium perchlorate'],
        KMnO4: ['Potassium permanganate'],
        KAlSi3O8: ['Potassium aluminum silicate'],
        KAlS2O8: ['Potassium alum'],
        KF: ['Potassium fluoride'],
        KCl: ['Potassium chloride'],
        KBr: ['Potassium bromide'],
        KI: ['Potassium iodide'],
        K2HPO4: ['Dipotassium phosphate'],
        K2ReH9: ['Potassium nonahydridorhenate'],
        K2Al2B2O7: ['Potassium aluminum borate'],
        K2CO3: ['Potassium carbonate'],
        K2O: ['Potassium oxide'],
        K2O2: ['Potassium peroxide'],
        K2O3Si: ['Potassium silicate'],
        K2SO3: ['Potassium sulfite'],
        K2TeO3: ['Potassium tellurite'],
        K2SO4: ['Potassium sulfate'],
        K2FeO4: ['Potassium ferrate'],
        K2SeO4: ['Potassium selenate'],
        K2O5S2: ['Potassium metabisulfite'],
        K2Mg2S2O8: ['Potassium magnesium sulfate'],
        K2S2O8: ['Potassium persulfate'],
        K2Mg2S3O12: ['Langbeinite'],
        K2NiF6: ['Potassium hexafluoronickelate(IV)'],
        K2TaF7: ['Potassium heptafluorotantalate'],
        K2PtCl4: ['Potassium tetrachloroplatinate'],
        K2PtCl6: ['Potassium hexachloroplatinate'],
        K2Re2Cl8: ['Potassium octachlorodirhenate'],
        K2Te: ['Potassium telluride'],
        K2HgI4: ['Potassium tetraiodomercurate(II)'],
        K2Po: ['Potassium polonide'],
        K3C6H5O7: ['Potassium citrate'],
        K3FeC6O12: ['Potassium ferrioxalate'],
        K3PO4: ['Tripotassium phosphate'],
        K3CrO8: ['Potassium tetraperoxochromate(V)'],
        K3CuF6: ['Potassium hexafluorocuprate(III)'],
        K4FeC6N6: ['Potassium ferrocyanide'],

        CaClHO: ['Calcium hydroxychloride'],
        CaHPO4: ['Dicalcium phosphate'],
        CaH2: ['Calcium hydride'],
        CaH2C2O4: ['Calcium formate'],
        CaH2O2: ['Calcium hydroxide'],
        CaH2S2O6: ['Calcium bisulfite'],
        CaH4P2O8: ['Monocalcium phosphate'],
        CaB6: ['Calcium hexaboride'],
        CaCN2: ['Calcium cyanamide'],
        CaCO3: ['Calcium carbonate'],
        CaC2: ['Calcium carbide'],
        CaC2O4: ['Calcium oxalate'],
        CaO: ['Calcium oxide'],
        CaO2: ['Calcium peroxide'],
        CaO2Cl2: ['Calcium hypochlorite'],
        CaSO3: ['Calcium sulfite'],
        CaAl2O4: ['Monocalcium aluminate'],
        CaSO4: ['Calcium sulfate'],
        CaCrO4: ['Calcium chromate'],
        CaWO4: ['Scheelite'],
        CaCl2O6: ['Calcium chlorate'],
        CaBr2O6: ['Calcium bromate'],
        CaI2O6: ['Calcium iodate'],
        CaAl2Si2O8: ['Calcium aluminosilicate'],
        CaCl2O8: ['Calcium perchlorate'],
        CaMn2O8: ['Calcium permanganate'],
        CaF2: ['Calcium fluoride'],
        CaSi: ['Calcium monosilicide'],
        CaS: ['Calcium sulfide'],
        CaCl: ['Calcium(I) chloride'],
        CaCl2: ['Calcium chloride'],
        CaBr2: ['Calcium bromide'],
        CaI2: ['Calcium iodide'],
        CaPo: ['Calcium polonide'],
        Ca2O4Si: ['Calcium silicate'],
        Ca2O7P2: ['Calcium pyrophosphate'],
        Ca3B2O6: ['Calcium borate'],
        Ca3N2: ['Calcium nitride'],
        Ca3SiO5: ['Alite'],
        Ca3Al2O6: ['Tricalcium aluminate'],
        Ca3P2O8: ['Tricalcium phosphate'],
        Ca3As2O8: ['Calcium arsenate'],
        Ca3P2: ['Calcium phosphide'],
        Ca5P3HO13: ['Hydroxyapatite'],
        Ca12Al14O33: ['Dodecacalcium hepta-aluminate'],

        ScH3: ['Scandium(III) hydride'],
        ScB12: ['Scandium dodecaboride'],
        ScF3: ['Scandium fluoride'],
        ScCl3: ['Scandium chloride'],
        ScBr3: ['Scandium bromide'],
        ScI3: ['Scandium triiodide'],
        Sc2O3: ['Scandium oxide'],

        TiB2: ['Titanium diboride'],
        TiC: ['Titanium carbide'],
        TiN: ['Titanium nitride'],
        TiO2: ['Titanium dioxide'],
        TiCl3: ['Titanium(III) chloride'],
        TiCl4: ['Titanium tetrachloride'],
        TiI3: ['Titanium(III) iodide'],
        Ti2O3: ['Titanium(III) oxide'],

        VOF3: ['Vanadium(V) oxytrifluoride'],
        VOCl3: ['Vanadium oxytrichloride'],
        VCl4: ['Vanadium tetrachloride'],
        VBr3: ['Vanadium(III) bromide'],
        V2O5: ['Vanadium(V) oxide'],

        CrB: ['Chromium(III) boride'],
        CrO: ['Chromium(II) oxide'],
        CrO2: ['Chromium(IV) oxide'],
        CrO3: ['Chromium trioxide'],
        CrF3: ['Chromium(III) fluoride'],
        CrCl3: ['Chromium(III) chloride'],
        Cr2Te3: ['Chromium(III) telluride'],

        MnHO2: ['Manganite'],
        MnH2O2: ['Manganese(II) hydroxide'],
        MnCO3: ['Manganese(II) carbonate'],
        MnC2O4: ['Manganese oxalate'],
        MnN2O6: ['Manganese(II) nitrate'],
        MnO: ['Manganese(II) oxide'],
        MnO2: ['Manganese dioxide'],
        MnNa2O4: ['Sodium manganate'],
        MnSO4: ['Manganese(II) sulfate'],
        MnF2: ['Manganese(II) fluoride'],
        MnSi: ['Manganese monosilicide'],
        MnSi2: ['Manganese disilicide'],
        MnS: ['Manganese(II) sulfide'],
        MnCl2: ['Manganese(II) chloride'],
        MnGe: ['Manganese germanide'],
        MnAs: ['Manganese arsenide'],
        MnBr2: ['Manganese(II) bromide'],
        MnTe: ['Manganese(II) telluride'],
        MnI2: ['Manganese(II) iodide'],
        Mn2O3: ['Manganese(III) oxide'],
        Mn2O7: ['Manganese heptoxide'],
        Mn3O4: ['Manganese(II,III) oxide'],

        FeH6Mg2: ['Magnesium iron hexahydride'],
        FeB: ['Iron monoboride'],
        FeB4: ['Iron tetraboride'],
        FeCO3: ['Iron(II) carbonate'],
        FeC5O5: ['Iron pentacarbonyl'],
        FeN3O9: ['Iron(III) nitrate'],
        FeSO4: ['Iron(II) sulfate'],
        FeCl2O8: ['Iron(II) perchlorate'],
        FeS2: ['Pyrite'],
        FeKS2: ['Potassium dithioferrate'],
        FeCl2: ['Iron(II) chloride'],
        FeCl3: ['Iron(III) chloride'],
        Fe2B: ['Iron boride'],
        Fe2C9O9: ['Diiron nonacarbonyl'],
        Fe2O3: ['Ferric oxide'],
        Fe2S3O12: ['Iron(III) sulfate'],
        Fe7MoS9C: ['FeMoco'],
        Fe16N2: ['Iron nitride'],

        CoH2O2: ['Cobalt(II) hydroxide'],
        CoC10H10: ['Cobaltocene'],
        CoB: ['Cobalt boride'],
        CoCO3: ['Cobalt(II) carbonate'],
        CoN2O6: ['Cobalt(II) nitrate'],
        CoO: ['Cobalt(II) oxide'],
        CoSO4: ['Cobalt(II) sulfate'],
        CoF2: ['Cobalt(II) fluoride'],
        CoF3: ['Cobalt(III) fluoride'],
        CoS: ['Cobalt sulfide'],
        CoS2: ['Cobalt sulfide'],
        CoCl2: ['Cobalt(II) chloride'],
        CoCl3: ['Cobalt(III) chloride'],
        CoBr2: ['Cobalt(II) bromide'],
        CoI2: ['Cobalt(II) iodide'],
        Co2C8O8: ['Dicobalt octacarbonyl'],
        Co2O3: ['Cobalt(III) oxide'],
        Co3O4: ['Cobalt(II,III) oxide'],
        Co3S4: ['Cobalt sulfide'],
        Co4C12O12: ['Tetracobalt dodecacarbonyl'],
        Co9S8: ['Cobalt sulfide'],

        NiHO2: ['Nickel oxide hydroxide'],
        NiC4H2O4: ['Nickel succinate'],
        NiH2O2: ['Nickel(II) hydroxide'],
        NiCO3: ['Nickel(II) carbonate'],
        NiC2N2: ['Nickel dicyanide'],
        NiS2C2N2: ['Nickel(II) thiocyanate'],
        NiC4O4: ['Nickel tetracarbonyl'],
        NiN2O4: ['Nickel(II) nitrite'],
        NiN2O6: ['Nickel(II) nitrate'],
        NiO: ['Nickel(II) oxide'],
        NiTiO3: ['Nickel(II) titanate'],
        NiSO4: ['Nickel(II) sulfate'],
        NiCrO4: ['Nickel(II) chromate'],
        NiMn2O4: ['Nickel manganese oxide'],
        NiWO4: ['Nickel tungstate'],
        NiCl2O8: ['Nickel(II) perchlorate'],
        NiF2: ['Nickel(II) fluoride'],
        NiF3: ['Nickel(III) fluoride'],
        NiAl: ['Nickel aluminide'],
        NiSi: ['Nickel monosilicide'],
        NiS: ['Nickel sulfide'],
        NiCl2: ['Nickel(II) chloride'],
        NiAs: ['Nickel arsenide'],
        NiSe: ['Nickel selenide'],
        NiBr2: ['Nickel(II) bromide'],
        NiSb: ['Nickel antimonide'],
        NiI2: ['Nickel(II) iodide'],
        Ni2B: ['Dinickel boride'],
        Ni2O3: ['Nickel(III) oxide'],
        Ni2MnO4: ['Nickel manganese oxide'],
        Ni2Si: ['Nickel silicide'],
        Ni3B: ['Trinickel boride'],
        Ni3P2O8: ['Nickel(II) phosphate'],
        Ni3Al: ['Nickel aluminide'],

        Cu: ['Native copper'],
        CuH2O2: ['Copper(II) hydroxide'],
        CuCN: ['Copper(I) cyanide'],
        CuCO3: ['Copper(II) carbonate'],
        CuC2O4: ['Copper oxalate'],
        CuO: ['Copper(II) oxide'],
        CuO2: ['Copper peroxide'],
        CuSO4: ['Copper(II) sulfate'],
        CuCl2O8: ['Copper(II) perchlorate'],
        CuS: ['Copper monosulfide'],
        CuCl: ['Copper(I) chloride'],
        CuCl2: ['Copper(II) chloride'],
        CuBr2: ['Copper(II) bromide'],
        CuTe: ['Copper(II) telluride'],
        CuTe2: ['Copper ditelluride'],
        Cu2CH2O5: ['Basic copper carbonate'],
        Cu2H3O3Cl: ['Dicopper chloride trihydroxide'],
        Cu2O: ['Copper(I) oxide'],
        Cu2O3: ['Copper(III) oxide'],
        Cu2SO4: ['Copper(I) sulfate'],
        Cu2Se: ['Copper selenide'],
        Cu2Te: ['Copper(I) telluride'],
        Cu3C2H2O8: ['Basic copper carbonate'],
        Cu3H4O8S2: ['Chevreul\'s salt'],
        Cu3B2O6: ['Copper(II) borate'],
        Cu4O3: ['Paramelaconite'],
        Cu5Si: ['Copper silicide'],

        ZnH2O2: ['Zinc hydroxide'],
        ZnC4H6O4: ['Zinc acetate'],
        ZnCO3: ['Zinc carbonate'],
        ZnC2N2: ['Zinc cyanide'],
        ZnN2O6: ['Zinc nitrate'],
        ZnO: ['Zinc oxide'],
        ZnO2: ['Zinc peroxide'],
        ZnSO4: ['Zinc sulfate'],
        ZnCrO4: ['Zinc chromate'],
        ZnMoO4: ['Zinc molybdate'],
        ZnCl2O6: ['Zinc chlorate'],
        ZnF2: ['Zinc fluoride'],
        ZnP2: ['Zinc diphosphide'],
        ZnS: ['Zinc sulfide'],
        ZnCl2: ['Zinc chloride'],
        ZnSe: ['Zinc selenide'],
        ZnBr2: ['Zinc bromide'],
        ZnSb: ['Zinc antimonide'],
        ZnTe: ['Zinc telluride'],
        ZnI2: ['Zinc iodide'],
        Zn2SiO4: ['Zinc silicate'],
        Zn3N2: ['Zinc nitride'],
        Zn3P2O8: ['Zinc phosphate'],
        Zn3P2: ['Zinc phosphide'],
        Zn3As2: ['Zinc arsenide'],
        Zn3Sb2: ['Zinc antimonide'],
        Zn4Sb3: ['Zinc antimonide'],

        GaH3: ['Gallane'],
        GaH3O3: ['Gallium(III) hydroxide'],
        GaC3H9: ['Trimethylgallium'],
        GaN: ['Gallium nitride'],
        GaN3O9: ['Gallium nitrate'],
        GaF3: ['Gallium(III) fluoride'],
        GaP: ['Gallium phosphide'],
        GaAsP: ['Gallium arsenide phosphide'],
        GaS: ['Gallium(II) sulfide'],
        GaCl3: ['Gallium trichloride'],
        GaAs: ['Gallium arsenide'],
        GaSe: ['Gallium(II) selenide'],
        GaBr3: ['Gallium(III) bromide'],
        GaPd: ['Gallium palladide'],
        GaSb: ['Gallium antimonide'],
        GaTe: ['Gallium(II) telluride'],
        GaI: ['Gallium monoiodide'],
        GaI3: ['Gallium(III) iodide'],
        Ga2H6: ['Digallane'],
        Ga2O: ['Gallium(I) oxide'],
        Ga2O3: ['Gallium(III) oxide'],
        Ga2S3: ['Gallium(III) sulfide'],
        Ga2Te3: ['Gallium(III) telluride'],
        Ga4I4: ['Gallium monoiodide'],

        Ge: ['α-Germanium', 'β-Germanium', 'Germanene'],
        GeH4: ['Germane'],
        GeO: ['Germanium monoxide'],
        GeO2: ['Germanium dioxide'],
        GeS: ['Germanium monosulfide'],
        GeS2: ['Germanium disulfide'],
        GeCl2: ['Germanium dichloride'],
        GeCl4: ['Germanium tetrachloride'],
        GeSe2: ['Germanium diselenide'],
        GeTe: ['Germanium telluride'],
        Ge2H2: ['Digermyne'],

        AsCuHO3: ['Scheele\'s Green'],
        AsH3: ['Arsine'],
        AsLi: ['Lithium arsenide'],
        AsO2: ['Arsenic dioxide'],
        AsKO2: ['Potassium arsenite'],
        AsF3: ['Arsenic trifluoride'],
        AsF5: ['Arsenic pentafluoride'],
        AsS: ['Realgar'],
        AsCl3: ['Arsenic trichloride'],
        AsBr3: ['Arsenic tribromide'],
        AsI3: ['Arsenic triiodide'],
        As2O3: ['Arsenic trioxide'],
        As2O4: ['Arsenic dioxide'],
        As2O5: ['Arsenic pentoxide'],
        As2S3: ['Arsenic trisulfide'],
        As2Te3: ['Arsenic(III) telluride'],
        As4S4: ['Realgar'],

        SeOCl2: ['Selenium oxydichloride'],
        SeOBr2: ['Selenium oxybromide'],
        SeO2: ['Selenium dioxide'],
        SeO2F2: ['Selenoyl fluoride'],
        SeO3: ['Selenium trioxide'],
        SeF4: ['Selenium tetrafluoride'],
        SeF6: ['Selenium hexafluoride'],
        SeCl4: ['Selenium tetrachloride'],
        SeBr4: ['Selenium tetrabromide'],
        Se2S6: ['Selenium hexasulfide'],
        Se2Cl2: ['Selenium monochloride'],
        Se4N4: ['Tetraselenium tetranitride'],
        Se8: ['Cyclooctaselenium'],

        BrHO3: ['Bromic acid'],
        BrHO4: ['Perbromic acid'],
        BrCN: ['Cyanogen bromide'],
        BrN3: ['Bromine azide'],
        BrO2: ['Bromine dioxide'],
        BrO2F: ['Bromyl fluoride'],
        BrNaO2: ['Sodium bromite'],
        BrF: ['Bromine monofluoride'],
        BrF3: ['Bromine trifluoride'],
        BrF5: ['Bromine pentafluoride'],
        BrCl: ['Bromine monochloride'],
        Br2: ['Dibromine'],
        Br2O: ['Dibromine monoxide'],
        Br2O3: ['Dibromine trioxide'],
        Br2O5: ['Dibromine pentoxide'],

        KrF: ['Krypton fluoride'],

        RbH: ['Rubidium hydride'],
        RbOH: ['Rubidium hydroxide'],
        RbO2: ['Rubidium superoxide'],
        RbO3: ['Rubidium ozonide'],
        RbF: ['Rubidium fluoride'],
        RbCl: ['Rubidium chloride'],
        RbBr: ['Rubidium bromide'],
        RbAg4I5: ['Rubidium silver iodide'],
        RbI: ['Rubidium iodide'],
        Rb2CO3: ['Rubidium carbonate'],
        Rb2O2: ['Rubidium peroxide'],
        Rb2Te: ['Rubidium telluride'],

        SrH2O2: ['Strontium hydroxide'],
        SrB6: ['Strontium hexaboride'],
        SrCO3: ['Strontium carbonate'],
        SrN2O6: ['Strontium nitrate'],
        SrO: ['Strontium oxide'],
        SrO2: ['Strontium peroxide'],
        SrAl2O4: ['Strontium aluminate'],
        SrSO4: ['Strontium sulfate'],
        SrCrO4: ['Strontium chromate'],
        SrF2: ['Strontium fluoride'],
        SrS: ['Strontium sulfide'],
        SrCl2: ['Strontium chloride'],
        Sr3N2: ['Strontium nitride'],

        YH2: ['Yttrium hydride'],
        YH3: ['Yttrium hydride'],
        YH3O3: ['Yttrium hydroxide'],
        YB6: ['Yttrium boride'],
        YN: ['Yttrium nitride'],
        YN3O9: ['Yttrium(III) nitrate'],
        YO: ['Yttrium(II) oxide'],
        YBa2Cu3O7: ['Yttrium barium copper oxide'],
        YP: ['Yttrium phosphide'],
        YCl3: ['Yttrium(III) chloride'],
        Y2C6O12: ['Yttrium oxalate'],
        Y2O3: ['Yttrium(III) oxide'],
        Y3Al5O12: ['Yttrium aluminum garnet'],

        ZrH2: ['Zirconium hydride'],
        ZrB2: ['Zirconium diboride'],
        ZrC: ['Zirconium carbide'],
        ZrN: ['Zirconium nitride'],
        ZrOCl2: ['Zirconyl chloride'],
        ZrO2: ['Zirconium dioxide'],
        ZrSiO4: ['Zirconium(IV) silicate'],
        ZrW2O8: ['Zirconium tungstate'],
        ZrF4: ['Zirconium tetrafluoride'],
        ZrCl3: ['Zirconium(III) chloride'],
        ZrCl4: ['Zirconium(IV) chloride'],
        ZrBr4: ['Zirconium(IV) bromide'],
        ZrI4: ['Zirconium(IV) iodide'],

        NbB2: ['Niobium diboride'],
        NbC: ['Niobium carbide'],
        NbN: ['Niobium nitride'],
        NbO: ['Niobium monoxide'],
        NbO2: ['Niobium dioxide'],
        NbCl5: ['Niobium(V) chloride'],
        NbBr5: ['Niobium(V) bromide'],
        Nb2O5: ['Niobium pentoxide'],
        Nb2NiO6: ['Nickel niobate'],
        Nb2I10: ['Niobium pentaiodide'],

        MoC6O6: ['Molybdenum hexacarbonyl'],
        MoO2: ['Molybdenum dioxide'],
        MoO3: ['Molybdenum trioxide'],
        MoF6: ['Molybdenum hexafluoride'],
        MoS2: ['Molybdenum disulfide'],
        MoCl2: ['Molybdenum(II) chloride'],
        MoCl3: ['Molybdenum(III) chloride'],
        MoCl4: ['Molybdenum tetrachloride'],
        MoCl5: ['Molybdenum(V) chloride'],
        MoCl6: ['Molybdenum(VI) chloride'],
        MoBr3: ['Molybdenum(III) bromide'],
        MoBr4: ['Molybdenum(IV) bromide'],
        MoTe: ['Molybdenum ditelluride'],

        TcF6: ['Technetium hexafluoride'],
        TcCl3: ['Technetium trichloride'],
        TcCl4: ['Technetium(IV) chloride'],
        Tc2O7: ['Technetium(VII) oxide'],

        RuB2: ['Ruthenium boride'],
        RuC5O5: ['Ruthenium pentacarbonyl'],
        RuO2: ['Ruthenium(IV) oxide'],
        RuO4: ['Ruthenium tetroxide'],
        RuF3: ['Ruthenium(III) fluoride'],
        RuF5: ['Ruthenium pentafluoride'],
        RuF6: ['Ruthenium hexafluoride'],
        RuS2: ['Laurite'],
        RuCl3: ['Ruthenium(III) chloride'],
        Ru2B3: ['Ruthenium boride'],

        RhO2: ['Rhodium(IV) oxide'],
        RhF3: ['Rhodium trifluoride'],
        RhF5: ['Rhodium pentafluoride'],
        RhF6: ['Rhodium hexafluoride'],
        RhCl3: ['Rhodium(III) chloride'],
        Rh2O3: ['Rhodium(III) oxide'],

        PdCl2: ['Palladium(II) chloride'],

        AgFH6N2: ['Silver diammine fluoride'],
        AgBF4: ['Silver tetrafluoroborate'],
        AgCNO: ['Silver fulminate'],
        AgNO3: ['Silver nitrate'],
        AgN3: ['Silver azide'],
        AgBrO3: ['Silver bromate'],
        AgF: ['Silver(I) fluoride'],
        AgF2: ['Silver(II) fluoride'],
        AgF3: ['Silver(III) fluoride'],
        AgPF6: ['Silver hexafluorophosphate'],
        AgCl: ['Silver chloride'],
        AgBr: ['Silver bromide'],
        AgI: ['Silver iodide'],
        Ag2CO3: ['Silver carbonate'],
        Ag2O: ['Silver oxide'],
        Ag2SeO3: ['Silver selenite'],
        Ag2F: ['Silver subfluoride'],
        Ag2S: ['Silver sulfide'],
        Ag2Te: ['Silver telluride'],
        Ag3N: ['Silver nitride'],
        Ag3SbS3: ['Silver sulfantimonite'],
        Ag3Sb: ['Silver antimonide'],
        Ag4O4: ['Silver(I,III) oxide'],

        CdH2O2: ['Cadmium hydroxide'],
        CdC2N2: ['Cadmium cyanide'],
        CdN2O6: ['Cadmium nitrate'],
        CdO: ['Cadmium oxide'],
        CdSO4: ['Cadmium sulfate'],
        CdS: ['Cadmium sulfide'],
        CdCl2: ['Cadmium chloride'],
        CdZnTe: ['Cadmium zinc telluride'],
        CdSe: ['Cadmium selenide'],
        CdBr2: ['Cadmium bromide'],
        CdTe: ['Cadmium telluride'],
        CdI2: ['Cadmium iodide'],
        Cd3As2: ['Cadmium arsenide'],

        InH3O3: ['Indium(III) hydroxide'],
        InN: ['Indium nitride'],
        InGaN: ['Indium gallium nitride'],
        InN3O9: ['Indium(III) nitrate'],
        InF3: ['Indium(III) fluoride'],
        InP: ['Indium phosphide'],
        InCl3: ['Indium(III) chloride'],
        InBr3: ['Indium(III) bromide'],
        InSb: ['Indium antimonide'],
        InI3: ['Indium(III) iodide'],
        In2O3: ['Indium(III) oxide'],
        In2Se3: ['Indium(III) selenide'],
        In2Te3: ['Indium(III) telluride'],

        SnH2O2: ['Tin(II) hydroxide'],
        SnH4: ['Stannane'],
        SnO2: ['Tin(IV) oxide'],
        SnF2: ['Tin(II) fluoride'],
        SnF4: ['Tin(IV) fluoride'],
        SnS: ['Tin(II) sulfide'],
        SnS2: ['Tin(IV) sulfide'],
        SnCl2: ['Tin(II) chloride'],
        SnCl4: ['Tin(IV) chloride'],
        SnBr2: ['Tin(II) bromide'],
        SnBr4: ['Tin(IV) bromide'],
        SnTe: ['Tin telluride'],
        SnI2: ['Tin(II) iodide'],
        SnI4: ['Tin(IV) iodide'],

        SbOCl: ['Antimony oxychloride'],
        SbF3: ['Antimony trifluoride'],
        SbF5: ['Antimony pentafluoride'],
        SbCl3: ['Antimony trichloride'],
        SbCl5: ['Antimony pentachloride'],
        SbBr3: ['Antimony tribromide'],
        SbI3: ['Antimony triiodide'],
        Sb2O3: ['Antimony trioxide'],
        Sb2O4: ['Antimony tetroxide'],
        Sb2O5: ['Antimony pentoxide'],
        Sb2S3: ['Antimony trisulfide'],
        Sb2S5: ['Antimony pentasulfide'],
        Sb2Te3: ['Antimony telluride'],

        TeF5OH: ['Teflic acid'],
        TeH6O6: ['Telluric acid'],
        TeO2: ['Tellurium dioxide'],
        TeO3: ['Tellurium trioxide'],
        TeF4: ['Tellurium tetrafluoride'],
        TeF6: ['Tellurium hexafluoride'],
        TeCl4: ['Tellurium tetrachloride'],
        TeBr4: ['Tellurium tetrabromide'],
        TeI4: ['Tellurium tetraiodide'],

        ICN: ['Cyanogen iodide'],
        IN3: ['Iodine azide'],
        INaO3: ['Sodium iodate'],
        IF: ['Iodine monofluoride'],
        IF3: ['Iodine trifluoride'],
        IF5: ['Iodine pentafluoride'],
        IF7: ['Iodine heptafluoride'],
        ICl: ['Iodine monochloride'],
        IBr: ['Iodine monobromide'],
        I2: ['Diiodine'],
        I2O: ['Diiodine oxide'],
        I2O5: ['Iodine pentoxide'],
        I2Cl6: ['Iodine trichloride'],
        I3K: ['Lugol\'s iodine'],
        I4O9: ['Tetraiodine nonoxide'],

        XeOF4: ['Xenon oxytetrafluoride'],
        XeO2: ['Xenon dioxide'],
        XeO2F2: ['Xenon dioxydifluoride'],
        XeO3: ['Xenon trioxide'],
        XeO4: ['Xenon tetroxide'],
        XeF2: ['Xenon difluoride'],
        XeF4: ['Xenon tetrafluoride'],
        XeF6: ['Xenon hexafluoride'],
        XeCl2: ['Xenon dichloride'],
        XeCl4: ['Xenon tetrachloride'],
        XeBr2: ['Xenon dibromide'],

        CsH: ['Cesium hydride'],
        CsHCO2: ['Cesium formate'],
        CsOH: ['Cesium hydroxide'],
        CsHO4S: ['Cesium bisulfate'],
        CsLiB6O10: ['Cesium lithium borate'],
        CsNO3: ['Cesium nitrate'],
        CsO2: ['Cesium superoxide'],
        CsO3: ['Cesium ozonide'],
        CsClO4: ['Cesium perchlorate'],
        CsF: ['Cesium fluoride'],
        CsCl: ['Cesium chloride'],
        CsCdCl3: ['Cesium cadmium chloride'],
        CsBr: ['Cesium bromide'],
        CsCdBr3: ['Cesium cadmium bromide'],
        CsI: ['Cesium iodide'],
        Cs2CO3: ['Cesium carbonate'],
        Cs2O: ['Cesium monoxide'],
        Cs2O2: ['Cesium peroxide'],
        Cs2SO4: ['Cesium sulfate'],
        Cs2Al2Si4O12: ['Pollucite'],
        Cs2CuF6: ['Cesium hexafluorocuprate(IV)'],
        Cs2S: ['Cesium sulfide'],
        Cs2Te: ['Cesium telluride'],
        Cs4O6: ['Cesium sesquioxide'],

        BaH2: ['Barium hydride'],
        BaH2O2: ['Barium hydroxide'],
        BaB2O4: ['Barium borate'],
        BaB6: ['Barium boride'],
        BaCO3: ['Barium carbonate'],
        BaC2: ['Barium carbide'],
        BaC2N2: ['Barium cyanide'],
        BaC2N2S2: ['Barium thiocyanate'],
        BaC2O4: ['Barium oxalate'],
        BaN2O6: ['Barium nitrate'],
        BaN6: ['Barium azide'],
        BaO: ['Barium oxide'],
        BaO2: ['Barium peroxide'],
        BaCl2O2: ['Barium hypochlorite'],
        BaSO3: ['Barium sulfite'],
        BaTiO3: ['Barium titanate'],
        BaSnO3: ['Barium stannate'],
        BaSO4: ['Barium sulfate'],
        BaCrO4: ['Barium chromate'],
        BaMnO4: ['Barium manganate'],
        BaFeO4: ['Barium ferrate'],
        BaWO4: ['Barium tungstate'],
        BaCuSi2O6: ['Han purple'],
        BaP2O6: ['Barium metaphosphate'],
        BaCl2O6: ['Barium chlorate'],
        BaBr2O6: ['Barium bromate'],
        BaI2O6: ['Barium iodate'],
        BaCl2O8: ['Barium perchlorate'],
        BaMn2O8: ['Barium permanganate'],
        BaCuSi4O10: ['Han blue'],
        BaFe12O19: ['Barium ferrite'],
        BaF2: ['Barium fluoride'],
        BaS: ['Barium sulfide'],
        BaCl2: ['Barium chloride'],
        BaZnGa: ['Barium zinc gallide'],
        BaBr2: ['Barium bromide'],
        BaI2: ['Barium iodide'],
        Ba2TiO4: ['Barium orthotitanate'],

        LaH3O3: ['Lanthanum hydroxide'],
        LaB6: ['Lanthanum hexaboride'],
        LaN3O9: ['Lanthanum(III) nitrate'],
        LaYbO3: ['Lanthanum ytterbium oxide'],
        LaF3: ['Lanthanum trifluoride'],
        LaCl3: ['Lanthanum(III) chloride'],
        LaNi5: ['Lanthanum pentanickel'],
        La2C6O12: ['Lanthanum oxalate'],
        La2O3: ['Lanthanum oxide'],
        La2Hf2O7: ['Lanthanum hafnate'],

        CeH3O3: ['Cerium(III) hydroxide'],
        CeH4O4: ['Cerium(IV) hydroxide'],
        CeC16H16: ['Cerocene'],
        CeB6: ['Cerium hexaboride'],
        CeN3O9: ['Cerium(III) nitrate'],
        CeO2: ['Cerium(IV) oxide'],
        CeS2O8: ['Cerium(IV) sulfate'],
        CeCl4O16: ['Cerium(IV) perchlorate'],
        CeF3: ['Cerium(III) fluoride'],
        CeF4: ['Cerium(IV) fluoride'],
        CeCl3: ['Cerium(III) chloride'],
        CeCoIn5: ['Cerium-Cobalt-Indium 5'],
        CeBr3: ['Cerium(III) bromide'],
        CeI2: ['Cerium diiodide'],
        CeI3: ['Cerium(III) iodide'],
        Ce2C3O9: ['Cerium(III) carbonate'],
        Ce2C6O12: ['Cerium oxalate'],
        Ce2N6O19: ['Dicerium nitrate'],
        Ce2O3: ['Cerium(III) oxide'],
        Ce2S3O12: ['Cerium(III) sulfate'],
        Ce2S3: ['Cerium(III) sulfide'],
        Ce3O4: ['Cerium(III, IV) oxide'],

        PrN: ['Praseodymium(III) nitride'],
        PrN3O9: ['Praseodymium(III) nitrate'],
        PrO2: ['Praseodymium(IV) oxide'],
        PrF3: ['Praseodymium(III) fluoride'],
        PrF4: ['Praseodymium(IV) fluoride'],
        PrCl3: ['Praseodymium(III) chloride'],
        PrBr3: ['Praseodymium(III) bromide'],
        PrI3: ['Praseodymium(III) iodide'],
        Pr2O3: ['Praseodymium(III) oxide'],
        Pr6O11: ['Praseodymium(III,IV) oxide'],

        NdH3O3: ['Neodymium(III) hydroxide'],
        NdC6H9O6: ['Neodymium acetate'],
        NdAl3B4O12: ['Neodymium aluminum borate'],
        NdN: ['Neodymium nitride'],
        NdN3O9: ['Neodymium nitrate'],
        NdNiO3: ['Neodymium nickelate'],
        NdAsO4: ['Neodymium arsenate'],
        NdTaO4: ['Neodymium tantalate'],
        NdCl2: ['Neodymium(II) chloride'],
        NdCl3: ['Neodymium(III) chloride'],
        NdBr2: ['Neodymium(II) bromide'],
        NdI2: ['Neodymium(II) iodide'],
        NdI3: ['Neodymium(III) iodide'],
        Nd2C3O9: ['Neodymium(III) carbonate'],
        Nd2C6O12: ['Neodymium(III) oxalate'],
        Nd2O3: ['Neodymium(III) oxide'],
        Nd2S3O12: ['Neodymium(III) sulfate'],

        PmH3O3: ['Promethium(III) hydroxide'],
        PmN3O9: ['Promethium(III) nitrate'],
        PmPO4: ['Promethium(III) phosphate'],
        PmF3: ['Promethium(III) fluoride'],
        PmCl3: ['Promethium(III) chloride'],
        PmBr3: ['Promethium(III) bromide'],
        PmI3: ['Promethium(III) iodide'],
        Pm2O3: ['Promethium(III) oxide'],

        SmH3O3: ['Samarium(III) hydroxide'],
        SmB6: ['Samarium hexaboride'],
        SmN3O9: ['Samarium(III) nitrate'],
        SmF3: ['Samarium(III) fluoride'],
        SmCl3: ['Samarium(III) chloride'],
        SmAs: ['Samarium arsenide'],
        SmSe: ['Selenium(II) selenide'],
        SmBr2: ['Samarium(II) bromide'],
        SmBr3: ['Samarium(III) bromide'],
        SmTe: ['Samarium(II) telluride'],
        SmI2: ['Samarium(II) iodide'],
        Sm2O3: ['Samarium(III) oxide'],
        Sm2S3: ['Samarium(III) sulfide'],

        EuH2: ['Europium hydride'],
        EuH3O3: ['Europium(III) hydroxide'],
        EuN3O9: ['Europium(III) nitrate'],
        EuO: ['Europium(II) oxide'],
        EuSO4: ['Europium(II) sulfate'],
        EuAsO4: ['Europium(III) arsenate'],
        EuF2: ['Europium(II) fluoride'],
        EuF3: ['Europium(III) fluoride'],
        EuP: ['Europium(III) phosphide'],
        EuS: ['Europium(II) sulfide'],
        EuCl2: ['Europium dichloride'],
        EuCl3: ['Europium(III) chloride'],
        EuBr2: ['Europium(II) bromide'],
        EuBr3: ['Europium(III) bromide'],
        EuI: ['Europium(III) iodide'],
        EuI2: ['Europium(II) iodide'],
        Eu2C6O12: ['Europium(III) oxalate'],
        Eu2O3: ['Europium(III) oxide'],

        GdH3O3: ['Gadolinium(III) hydroxide'],
        GdN3O9: ['Gadolinium(III) nitrate'],
        GdF3: ['Gadolinium(III) fluoride'],
        GdP: ['Gadolinium phosphide'],
        GdCl3: ['Gadolinium(III) chloride'],
        GdBr3: ['Gadolinium(III) bromide'],
        GdI2: ['Gadolinium diiodide'],
        GdI3: ['Gadolinium(III) iodide'],
        Gd2O2S: ['Gadolinium oxysulfide'],
        Gd2O3: ['Gadolinium(III) oxide'],
        Gd2O5Si: ['Gadolinium oxyorthosilicate'],
        Gd3Ga5O12: ['Gadolinium gallium garnet'],

        TbH3O3: ['Terbium(III) hydroxide'],
        TbN3O9: ['Terbium(III) nitrate'],
        TbO2: ['Terbium(IV) oxide'],
        TbF3: ['Terbium(III) fluoride'],
        TbF4: ['Terbium(IV) fluoride'],
        TbP: ['Terbium phosphide'],
        TbCl3: ['Terbium(III) chloride'],
        TbBr3: ['Terbium(III) bromide'],
        TbI3: ['Terbium(III) iodide'],
        Tb2O3: ['Terbium(III) oxide'],
        Tb4O7: ['Terbium(III,IV) oxide'],

        DyH3O3: ['Dysprosium(III) hydroxide'],
        DyN3O9: ['Dysprosium(III) nitrate'],
        DyF3: ['Dysprosium(III) fluoride'],
        DyP: ['Dysprosium phosphide'],
        DyCl2: ['Dysprosium(II) chloride'],
        DyCl3: ['Dysprosium(III) chloride'],
        DyBr3: ['Dysprosium(III) bromide'],
        Dy2O3: ['Dysprosium(III) oxide'],
        Dy2O5Ti: ['Dysprosium titanate'],
        Dy2O7Ti2: ['Dysprosium titanate'],
        Dy2O7Sn2: ['Dysprosium stannate'],

        HoN3O9: ['Holmium(III) nitrate'],
        HoF3: ['Holmium(III) fluoride'],
        HoP: ['Holmium phosphide'],
        HoCl3: ['Holmium(III) chloride'],
        HoBr3: ['Holmium(III) bromide'],
        HoI3: ['Holmium(III) iodide'],
        Ho2O3: ['Holmium(III) oxide'],
        Ho2O7Ti2: ['Holmium titanate'],
        Ho2S3: ['Holmium(III) sulfide'],

        ErH3O3: ['Erbium(III) hydroxide'],
        ErB4: ['Erbium tetraboride'],
        ErB6: ['Erbium hexaboride'],
        ErN3O9: ['Erbium(III) nitrate'],
        ErF3: ['Erbium(III) fluoride'],
        ErP: ['Erbium phosphide'],
        ErCl3: ['Erbium(III) chloride'],
        ErBr3: ['Erbium(III) bromide'],
        ErI3: ['Erbium(III) iodide'],
        Er2O3: ['Erbium(III) oxide'],

        TmH3O3: ['Thulium(III) hydroxide'],
        TmN3O9: ['Thulium(III) nitrate'],
        TmF2: ['Thulium(II) fluoride'],
        TmF3: ['Thulium(III) fluoride'],
        TmP: ['Thulium phosphide'],
        TmCl2: ['Thulium(II) chloride'],
        TmCl3: ['Thulium(III) chloride'],
        TmBr2: ['Thulium dibromide'],
        TmBr3: ['Thulium(III) bromide'],
        TmI3: ['Thulium(III) iodide'],
        Tm2O3: ['Thulium(III) oxide'],

        YbH2: ['Ytterbium hydride'],
        YbN3O9: ['Ytterbium(III) nitrate'],
        YbF3: ['Ytterbium(III) fluoride'],
        YbRh2Si2: ['Ytterbium dirhodium disilicide'],
        YbP: ['Ytterbium phosphide'],
        YbCl2: ['Ytterbium(II) chloride'],
        YbCl3: ['Ytterbium(III) chloride'],
        YbBr3: ['Ytterbium(III) bromide'],
        YbI2: ['Ytterbium(II) iodide'],
        YbI3: ['Ytterbium(III) iodide'],
        Yb2O3: ['Ytterbium(III) oxide'],
        Yb2S3O12: ['Ytterbium(III) sulfate'],

        LuH3: ['Lutetium hydride'],
        LuH3O3: ['Lutetium(III) hydroxide'],
        LuN3O9: ['Lutetium(III) nitrate'],
        LuTaO4: ['Lutetium tantalate'],
        LuF3: ['Lutetium(III) fluoride'],
        LuP: ['Lutetium phosphide'],
        LuCl3: ['Lutetium(III) chloride'],
        LuBr3: ['Lutetium(III) bromide'],
        LuI3: ['Lutetium(III) iodide'],
        Lu2O3: ['Lutetium(III) oxide'],
        Lu2V2O7: ['Lutetium vanadate'],
        Lu3Al5O12: ['Lutetium aluminum garnet'],

        HfB2: ['Hafnium diboride'],
        HfC: ['Hafnium carbide'],
        HfN4O12: ['Hafnium nitrate'],
        HfO2: ['Hafnium(IV) oxide'],
        HfSiO4: ['Hafnium(IV) silicate'],
        HfF4: ['Hafnium tetrafluoride'],
        HfS2: ['Hafnium disulfide'],
        HfCl4: ['Hafnium tetrachloride'],
        HfBr4: ['Hafnium tetrabromide'],
        HfI3: ['Hafnium(III) iodide'],
        HfI4: ['Hafnium(IV) iodide'],
        Hf2CN: ['Hafnium carbonitride'],

        TaB: ['Tantalum boride'],
        TaB2: ['Tantalum diboride'],
        TaC: ['Tantalum carbide'],
        TaN: ['Tantalum nitride'],
        TaF5: ['Tantalum pentafluoride'],
        TaAl3: ['Tantalum trialuminide'],
        TaS2: ['Tantalum(IV) sulfide'],
        TaCl5: ['Tantalum(V) chloride'],
        TaAs: ['Tantalum arsenide'],
        TaSe2: ['Tantalum diselenide'],
        TaTe2: ['Tantalum telluride'],
        Ta2O5: ['Tantalum pentoxide'],
        Ta2Br10: ['Tantalum(V) bromide'],
        Ta2I10: ['Tantalum(V) iodide'],
        Ta4HfC5: ['Tantalum hafnium carbide'],

        WB: ['Tungsten boride'],
        WB2: ['Tungsten boride'],
        WB4: ['Tungsten boride'],
        WC: ['Tungsten carbide'],
        WN: ['Tungsten nitride'],
        WN2: ['Tungsten nitride'],
        WOF4: ['Tungsten(VI) oxytetrafluoride'],
        WOCl4: ['Tungsten(VI) oxytetrachloride'],
        WOBr4: ['Tungsten(VI) oxytetrabromide'],
        WO2: ['Tungsten(IV) oxide'],
        WO2Cl2: ['Tungsten dichloride dioxide'],
        WO3: ['Tungsten trioxide'],
        WF6: ['Tungsten hexafluoride'],
        WSi2: ['Tungsten disilicide'],
        WS2: ['Tungsten disulfide'],
        WS3: ['Tungsten trisulfide'],
        WCl4: ['Tungsten(IV) chloride'],
        WCl6: ['Tungsten hexachloride'],
        WSe2: ['Tungsten diselenide'],
        WTe2: ['Tungsten ditelluride'],
        W2: ['Ditungsten'],
        W2B: ['Tungsten boride'],
        W2N: ['Tungsten nitride'],
        W2O3: ['Tungsten(III) oxide'],
        W2Cl10: ['Tungsten(V) chloride'],
        W6Cl12: ['Tungsten(II) chloride'],
        W6Cl18: ['Tungsten(III) chloride'],

        ReC5HO5: ['Pentacarbonylhydridorhenium'],
        ReB2: ['Rhenium diboride'],
        ReBrC5O5: ['Bromopentacarbonylrhenium(I)'],
        ReO2: ['Rhenium(IV) oxide'],
        ReO3: ['Rhenium trioxide'],
        ReF6: ['Rhenium hexafluoride'],
        ReF7: ['Rhenium heptafluoride'],
        ReS2: ['Rhenium disulfide'],
        ReCl4: ['Rhenium(IV) chloride'],
        ReCl5: ['Rhenium pentachloride'],
        ReCl6: ['Rhenium(VI) chloride'],
        ReSe2: ['Rhenium diselenide'],
        ReTe2: ['Rhenium ditelluride'],
        ReI4: ['Rhenium tetraiodide'],
        Re2C10O10: ['Dirhenium decacarbonyl'],
        Re2O7: ['Rhenium(VII) oxide'],
        Re2S7: ['Rhenium(VII) sulfide'],
        Re3Cl9: ['Trirhenium nonachloride'],
        Re3Br9: ['Rhenium(III) bromide'],

        OsB2: ['Osmium diboride'],
        OsO2: ['Osmium dioxide'],
        OsO4: ['Osmium tetroxide'],
        OsF5: ['Osmium pentafluoride'],
        OsF6: ['Osmium hexafluoride'],
        OsCl4: ['Osmium(IV) chloride'],
        OsBr4: ['Osmium tetrabromide'],
        OsI: ['Osmium(I) iodide'],
        OsI2: ['Osmium(II) iodide'],
        OsI3: ['Osmium(III) iodide'],

        IrH3: ['Iridium trihydride'],
        IrO2: ['Iridium(IV) oxide'],
        IrO4: ['Iridium tetroxide'],
        IrF4: ['Iridium tetrafluoride'],
        IrF5: ['Iridium(V) fluoride'],
        IrF6: ['Iridium hexafluoride'],
        IrS2: ['Iridium disulfide'],
        IrCl3: ['Iridium(III) chloride'],
        IrCl4: ['Iridium tetrachloride'],
        Ir2S3: ['Iridium(III) sulfide'],
        Ir4C12O12: ['Tetrairidium dodecacarbonyl'],

        PtN2H6Cl2: ['Cisplatin'],
        PtO2: ['Adams\' catalyst'],
        PtF4: ['Platinum tetrafluoride'],
        PtF5: ['Platinum pentafluoride'],
        PtF6: ['Platinum hexafluoride'],
        PtCl2: ['Platinum(II) chloride'],
        PtCl4: ['Platinum(IV) chloride'],
        PtBr2: ['Platinum(II) bromide'],
        PtBr4: ['Platinum(IV) bromide'],

        AuNa3O6S4: ['Sodium aurothiosulfate'],
        AuF5: ['Gold(V) fluoride'],
        AuF7: ['Gold heptafluoride'],
        AuCl: ['Gold(I) chloride'],
        AuBr3: ['Gold(III) bromide'],
        AuI: ['Gold monoiodide'],
        AuCs: ['Cesium auride'],
        Au2O3: ['Gold(III) oxide'],
        Au2S2O8: ['Gold(II) sulfate'],
        Au2S: ['Gold(I) sulfide'],
        Au2S3: ['Gold(III) sulfide'],
        Au2Cl6: ['Gold(III) chloride'],
        Au2Te3: ['Gold telluride'],
        Au3Te5: ['Gold telluride'],
        Au4Cl8: ['Gold(I,III) chloride'],

        HgH: ['Mercury(I) hydride'],
        HgN6: ['Mercuric azide'],
        HgO: ['Mercury(II) oxide'],
        HgSO4: ['Mercury(II) sulfate'],
        HgF4: ['Mercury(IV) fluoride'],
        HgS: ['Mercury sulfide'],
        HgCl2: ['Mercury(II) chloride'],
        HgZnTe: ['Mercury zinc telluride'],
        HgSe: ['Mercury selenide'],
        HgTe: ['Mercury telluride'],
        Hg2Cl2: ['Mercury(I) chloride'],

        TlOH: ['Thallium(I) hydroxide'],
        TlH3: ['Thallane'],
        TlH3O3: ['Thallium(III) hydroxide'],
        TlNO3: ['Thallium(I) nitrate'],
        TlF: ['Thallium(I) fluoride'],
        TlF3: ['Thallium trifluoride'],
        TlCl: ['Thallium(I) chloride'],
        TlBr: ['Thallium(I) bromide'],
        TlI: ['Thallium(I) iodide'],
        TlI3: ['Thallium triiodide'],
        Tl2CO3: ['Thallium(I) carbonate'],
        Tl2O: ['Thallium(I) oxide'],
        Tl2O3: ['Thallium(III) oxide'],
        Tl2SO4: ['Thallium(I) sulfate'],
        Tl2Ba2Ca2Cu3O10: ['Thallium barium calcium copper oxide'],
        Tl2Te: ['Thallium(I) telluride'],

        PbHAsO4: ['Lead hydrogen arsenate'],
        PbH2O2: ['Lead(II) hydroxide'],
        PbCO3: ['Lead carbonate'],
        PbN2O6: ['Lead(II) nitrate'],
        PbN6: ['Lead(II) azide'],
        PbO: ['Lead(II) oxide'],
        PbO2: ['Lead dioxide'],
        PbSO4: ['Lead(II) sulfate'],
        PbCrO4: ['Lead(II) chromate'],
        PbS: ['Lead(II) sulfide'],
        PbS2: ['Lead(IV) sulfide'],
        PbSe: ['Lead selenide'],
        PbTe: ['Lead telluride'],
        Pb3O4: ['Lead(II,IV) oxide'],
        Pb4FeSb6S14: ['Jamesonite'],
        Pb5Sb4S11: ['Boulangerite'],
        Pb9Sb22S42: ['Lead anitmony sulfide'],

        BiH3: ['Bismuthine'],
        BiOCl: ['Bismuth oxychloride'],
        BiO4V: ['Bismuth vanadate'],
        BiF3: ['Bismuth trifluoride'],
        BiF5: ['Bismuth pentafluoride'],
        BiCl3: ['Bismuth chloride'],
        BiMn: ['Bismanol'],
        BiBr3: ['Bismuth tribromide'],
        BiI3: ['Bismuth(III) iodide'],
        Bi2CO5: ['Bismuth subcarbonate'],
        Bi2O3: ['Bismuth(III) oxide'],
        Bi2Ge3O9: ['Bismuth germanate'],
        Bi2S3: ['Bismuth(III) sulfide'],
        Bi2Br9Cs3: ['Cesium enneabromodibismuthate'],
        Bi2Te3: ['Bismuth telluride'],
        Bi4Ge3O12: ['Bismuth germanate'],
        Bi5H9N4O22: ['Bismuth oxynitrate'],
        Bi12GeO20: ['Bismuth germanate'],

        PoH2: ['Polonium hydride'],
        PoO: ['Polonium monoxide'],
        PoO2: ['Polonium dioxide'],
        PoO3: ['Polonium trioxide'],
        PoF6: ['Polonium hexafluoride'],
        PoCl2: ['Polonium dichloride'],
        PoCl4: ['Polonium tetrachloride'],
        PoBr2: ['Polonium dibromide'],
        PoI4: ['Polonium tetraiodide'],

        AtBr: ['Astatine bromide'],
        AtI: ['Astatine iodide'],

        RnO3: ['Radon trioxide'],
        RnF2: ['Radon difluoride'],

        FrOH: ['Francium hydroxide'],
        FrCl: ['Francium chloride'],

        RaCO3: ['Radium carbonate'],
        RaN2O6: ['Radium nitrate'],
        RaSO4: ['Radium sulfate'],
        RaF2: ['Radium fluoride'],
        RaCl2: ['Radium chloride'],
        RaBr2: ['Radium bromide'],

        AcN3O9: ['Actinium(III) nitrate'],
        AcPO4: ['Actinium(III) phosphate'],
        AcF3: ['Actinium(III) fluoride'],
        AcCl3: ['Actinium(III) chloride'],
        AcBr3: ['Actinium(III) bromide'],
        AcI3: ['Actinium(III) iodide'],
        Ac2O3: ['Actinium(III) oxide'],
        Ac2S3: ['Actinium(III) sulfide'],

        ThH4O4: ['Thorium(IV) hydroxide'],
        ThC16H16: ['Thorocene'],
        ThC: ['Thorium(IV) carbide'],
        ThC4O8: ['Thorium oxalate'],
        ThN4O12: ['Thorium(IV) nitrate'],
        ThO: ['Thorium monoxide'],
        ThOF2: ['Thorium oxyfluoride'],
        ThO2: ['Thorium dioxide'],
        ThSiO4: ['Thorium(IV) orthosilicate'],
        ThF4: ['Thorium tetrafluoride'],
        ThS2: ['Thorium(IV) sulfide'],
        ThCl4: ['Thorium(IV) chloride'],
        ThI4: ['Thorium(IV) iodide'],

        PaC16H16: ['Protactinocene'],
        PaO2: ['Protactinium(IV) oxide'],
        PaF5: ['Protactinium(V) fluoride'],
        PaCl4: ['Protactinium(IV) chloride'],
        PaCl5: ['Protactinium(V) chloride'],
        PaBr4: ['Protactinium(IV) bromide'],
        PaBr5: ['Protactinium(V) bromide'],
        PaI5: ['Protactinium(V) iodide'],
        Pa2O5: ['Protactinium(V) oxide'],

        UB4H16: ['Uranium borohydride'],
        UC16H16: ['Uranocene'],
        UB2: ['Uranium diboride'],
        UC: ['Uranium carbide'],
        UO2: ['Uranium dioxide'],
        UO2F2: ['Uranyl fluoride'],
        UO3: ['Uranium trioxide'],
        UO4: ['Uranyl peroxide'],
        UO6: ['Uranium hexoxide'],
        UF3: ['Uranium trifluoride'],
        UF4: ['Uranium tetrafluoride'],
        UF5: ['Uranium pentafluoride'],
        UF6: ['Uranium hexafluoride'],
        UPd2Al3: ['Uranium palladium aluminide'],
        USi2: ['Uranium disilicide'],
        URu2Si2: ['Uranium ruthenium silicide'],
        US: ['Uranium monosulfide'],
        UCl3: ['Uranium(III) chloride'],
        UCl4: ['Uranium tetrachloride'],
        UCl5: ['Uranium pentachloride'],
        UCl6: ['Uranium hexachloride'],
        URhGe: ['Uranium rhodium germanium'],
        UBr4: ['Uranium tetrabromide'],
        UBr5: ['Uranium pentabromide'],
        UI3: ['Uranium(III) iodide'],
        UI4: ['Uranium(IV) iodide'],
        UPt3: ['Uranium platinide'],
        U2N3: ['Uranium nitrides'],
        U2O5: ['Diuranium pentoxide'],
        U3O8: ['Triuranium octoxide'],

        NpH3O5: ['Neptunium(VII) oxide-hydroxide'],
        NpC16H16: ['Neptunocene'],
        NpC4O8: ['Neptunium(IV) oxalate'],
        NpN4O12: ['Neptunium(IV) nitrate'],
        NpO2: ['Neptunium(IV) oxide'],
        NpF3: ['Neptunium(III) fluoride'],
        NpF4: ['Neptunium(IV) fluoride'],
        NpF5: ['Neptunium(V) fluoride'],
        NpF6: ['Neptunium(VI) fluoride'],
        NpSi2: ['Neptunium silicide'],
        NpCl3: ['Neptunium(III) chloride'],
        NpAs: ['Neptunium arsenide'],
        NpAs2: ['Neptunium diarsenide'],

        PuH2: ['Plutonium hydride'],
        PuC16H16: ['Plutonocene'],
        PuB2: ['Plutonium diboride'],
        PuB4: ['Plutonium tetraboride'],
        PuB6: ['Plutonium hexaboride'],
        PuC: ['Plutonium carbide'],
        PuN4O12: ['Plutonium(IV) nitrate'],
        PuO2: ['Plutonium(IV) oxide'],
        PuF3: ['Plutonium(III) fluoride'],
        PuF4: ['Plutonium tetrafluoride'],
        PuF6: ['Plutonium hexafluoride'],
        PuSi: ['Plutonium silicide'],
        PuP: ['Plutonium(III) phosphide'],
        PuCl3: ['Plutonium(III) chloride'],
        PuAs: ['Plutonium(III) arsenide'],
        PuSe: ['Plutonium selenide'],
        PuBr3: ['Plutonium(III) bromide'],
        Pu2C3: ['Plutonium carbide'],

        AmH3O3: ['Americium(III) hydroxide'],
        AmN3O9: ['Americium(III) nitrate'],
        AmO2: ['Americium dioxide'],
        AmF3: ['Americium(III) fluoride'],
        AmF4: ['Americium(IV) fluoride'],
        AmCl2: ['Americium(II) chloride'],
        AmCl3: ['Americium(III) chloride'],
        AmBr2: ['Americium(II) bromide'],
        AmBr3: ['Americium(III) bromide'],
        AmI2: ['Americium(II) iodide'],
        AmI3: ['Americium(III) iodide'],
        Am2O3: ['Americium(III) oxide'],

        CmH3O3: ['Curium hydroxide'],
        CmN3O9: ['Curium(III) nitrate'],
        CmF3: ['Curium(III) fluoride'],
        CmCl3: ['Curium(III) chloride'],
        CmBr3: ['Curium(III) bromide'],
        Cm2O3: ['Curium(III) oxide'],

        BkN3O9: ['Berkelium(III) nitrate'],
        BkO2: ['Berkelium(IV) oxide'],
        BkCl3: ['Berkelium(III) chloride'],

        CfB6H5O13: ['Californium(III) polyborate'],
        CfFO: ['Californium(III) oxyfluoride'],
        CfClO: ['Californium(III) oxychloride'],
        CfCl3: ['Californium(III) chloride'],
        CfBr3: ['Californium(III) bromide'],

        EsCl3: ['Einsteinium(III) chloride'],
        EsBr3: ['Einsteinium(III) bromide'],
        EsI3: ['Einsteinium(III) iodide'],
        Es2O3: ['Einsteinium(III) oxide'],
    };

    static combine(elements, multiplier = 1) {
        let newFormula = '';
        for (const element in elements) {
            const count = elements[element] * multiplier ;
            newFormula += element;
            newFormula += (count > 1) ? count: '';
        }
        return newFormula;
    }

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

        const result = Molecules.#compareElements(a, b, priority, true);
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
            const symbol = Elements.data[protons].symbol;
            const result = Molecules.#compareElements(a, b, protons);
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

    static #compareElements(a, b, protons, priority = false) {
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

        let failed = 0;
        let passed = 0;
        for (const test of tests) {
            const args = test[0];
            const expected = test[1];
            const actual = Molecules.compare(...args, true);
            console.assert(actual === expected, args[0], args[1], 'not sorted correctly.');
            if (actual === expected) {
                passed += 1;
            }
            else {
                failed += 1;
            }
        }
        console.log(`${failed} tests failed, ${passed} passed.`);

        return failed;
    }

    static convertFormula(formula, sort = false, ...priorities) {
        // Convert a semistructural chemical formula to a molecular formula.
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
            formula = formula.toSpliced(index, length, substr);
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

    static convertFormulaTest() {
        const tests = [
            [['H2O'], 'H2O'],
            [['CH3(CH2)17COOH'], 'C19H38O2'],
            [['HO(CH2CH2O)20(CH2CH(CH3)O)70(CH2CH2O)20H'], 'H582O111C290'],
            [['Be(BH4)2'], 'BeB2H8'],
            [['Be(NO3)2'], 'BeN2O6'],
            [['Mn(CH3CO2)2', true, 'C'], 'C4H6O4Mn'],
            /*
            [['Os3H2(CO)10', true, 'C'], 'C10H2O10Os3'],
            //[['ReOCl3(PPh3)2', 'C'], 'C36H30OP2Cl3Re'],
            [['Fe(NO3)3', true, 'Fe'], 'FeN3O9'],
            [['Fe(CO)5', true, 'Fe'], 'FeC5O5'],
            */
            [['Fe(ClO4)2', false, 'Fe'], 'FeCl2O8'],
            /*
            [['Fe2(SO4)3', false, 'Fe'], 'Fe2S3O12'],
            [['Co(OH)2', true, 'Co'], 'CoH2O2'],
            */
            [['Co(C5H5)2', true, 'Co', 'C'], 'CoC10H10'],
            /*
            [['Co(NO3)2', true, 'Co'], 'CoN2O6'],
            [['Co2(CO)8', true, 'Co'], 'Co2C8O8'],
            [['Co4(CO)12', true, 'Co'], 'Co4C12O12'],
            [['NiO(OH)', true, 'Ni'], 'NiHO2'],
            [['Ni(OH)2', true, 'Ni'], 'NiH2O2'],
            [['Ni(NO3)2', true, 'Ni'], 'NiN2O6'],
            [['Ni(CO)4', true, 'Ni'], 'NiC4O4'],
            */
            [['Ni3(PO4)2', false, 'Ni'], 'Ni3P2O8'],
            /*
            [['Cu(OH)2', true, 'Cu'], 'CuH2O2'],
            [['Cu2CO3(OH)2', true, 'Cu', 'C'], 'Cu2CH2O5'],
            [['Cu2(OH)3Cl', true, 'Cu'], 'Cu2H3O3Cl'],
            [['Cu3(CO3)2(OH)2', true, 'Cu', 'C'], 'Cu3C2H2O8'],
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
            */
            [['Yb(NO3)3', false, 'Yb'], 'YbN3O9'],
            [['Yb2(SO4)3', false, 'Yb'], 'Yb2S3O12'],
            /*
            [['Lu(OH)3', true, 'Lu'], 'LuH3O3'],
            [['Lu(NO3)3', true, 'Lu'], 'LuN3O9'],
            [['Hf(NO3)4', true, 'Hf'], 'HfN4O12'],
            [['ReH(CO)5', true, 'Re', 'C'], 'ReC5HO5'],
            [['ReBr(CO)5', false, 'Re'], 'ReBrC5O5'],
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

        let failed = 0;
        let passed = 0;
        for (const test of tests) {
            const args = test[0];
            const expected = test[1];
            const actual = Molecules.convertFormula(...args);
            console.assert(actual === expected, args, `${actual} !== ${expected}`, 'not converted correctly.');
            if (actual === expected) {
                passed += 1;
            }
            else {
                failed += 1;
            }
        }
        console.log(`${failed} tests failed, ${passed} passed.`);

        return failed;
    }

    static #convertSymbols(components) {
        // Convert an object keyed by element symbols to a map keyed by atomic numbers.
        const atomic = new Map();
        for (const symbol in components) {
            const protons = Elements.findProtons(symbol);
            if (protons in atomic) {
                atomic.set(protons, atomic.get(protons) + components[symbol]);
            }
            else {
                atomic.set(protons, components[symbol]);
            }
        }
        return atomic;
    }

    static #foundElements = {};
    static findElement(symbol) {
        if (symbol in Molecules.#foundElements) {
            return Molecules.#foundElements[symbol];
        }
        const formulas = [];
        for (const formula in Molecules.data) {
            const elements = Molecules.parse(formula);
            if (symbol in elements) {
                formulas.push(formula);
            }
        }
        Molecules.#foundElements[symbol] = formulas;
        return formulas;
    }

    static #foundMolecules = {};
    static findMolecule(molecule) {
        if (molecule in Molecules.#foundMolecules) {
            return Molecules.#foundMolecules[molecule];
        }
        const formulas = [];
        for (const formula in Molecules.data) {
            const molecules = Molecules.data[formula];
            if (molecules.includes(molecule)) {
                formulas.push(formula);
            }
        }
        Molecules.#foundMolecules[molecule] = formulas;
        return formulas;
    }

    static findMoleculeDuplicates() {
        console.time('findMoleculeDuplicates');
        const names = {};
        for (const formula in Molecules.data) {
            const molecules = Molecules.data[formula];
            for (const molecule of molecules) {
                const formulas = Molecules.findMolecule(molecule);
                if (formulas.length < 2) {
                    continue;
                }
                if (!(molecule in names)) {
                    names[molecule] = [];
                }
                for (const f of formulas) {
                    if (!names[molecule].includes(f)) {
                        names[molecule].push(f);
                    }
                }
            }
        }
        console.timeEnd('findMoleculeDuplicates');
        return names;
    }

    static findEquivalentFormulas(formula) {
        const formulas = [];
        for (const f in Molecules.data) {
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

    static list(symbol = null) {
        return symbol ? Molecules.findElement(symbol) : Object.keys(Molecules.data);
    }

    static #parsed = {};
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
            if (Object.hasOwn(elements, element)) {
                //console.log(formula, 'repeats', element);
                elements[element] += count;
            }
            else {
                elements[element] = count;
            }
        }
        Molecules.#parsed[formula] = elements;
        return elements;
    }

    static prioritizeElements(elements, ...priorities) {
        // Accepts an object of element counts, keyed by element symbols.
        // Returns a copy of the object with elements prioritized in argument order.
        // Copy the input object, so we don't mutate it.
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

    static sort(formulas = [], priority = 'H') {
        if (formulas.length < 1) {
            formulas = Object.keys(Molecules.data);
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

    static sortByFirstElement() {
        console.time('Molecules.sortByFirstElement()');
        const byElement = {};
        for (const formula in Molecules.data) {
            const components = Molecules.parse(formula);
            const element = Object.keys(components)[0];
            if (element in byElement) {
                byElement[element].push(formula);
            }
            else {
                byElement[element] = [formula];
            }
        }
        for (const element in byElement) {
            const formulas = byElement[element];
            Molecules.sort(formulas, element);
        }
        console.timeEnd('Molecules.sortByFirstElement()');
    }

    static weigh(formula) {
        const elements = Molecules.parse(formula);
        let weight = 0;
        for (const symbol in elements) {
            const protons = Elements.findProtons(symbol);
            const element = Elements.data[protons];
            weight += Math.round(element.weight) * elements[symbol];
        }
        return weight;
    }

    static render() {
        document.title = 'Molecules';
        let html = `<h1>${document.title}</h1>`;
        html += Molecules.renderChart();
        html += Molecules.renderList();
        Molecules.sortByFirstElement();
        /*
        console.log(Molecules.findMoleculeDuplicates());
        console.time('findEquivalentFormulas');
        for (const formula in Molecules.data) {
            const equivalentFormulas = Molecules.findEquivalentFormulas(formula);
            if (equivalentFormulas.length > 0) {
                console.log(formula, equivalentFormulas);
            }
        }
        console.timeEnd('findEquivalentFormulas');
        */
        return html;
    }

    static renderChart() {
        console.time('molecules-chart');
        const counts = {};
        let max = 0;
        for (const protons in Elements.data) {
            const element = Elements.data[protons];
            const formulas = Molecules.list(element.symbol);
            let count = 0;
            for (const formula of formulas) {
                const molecules = Molecules.data[formula];
                count += molecules.length;
            }
            if (count > max) {
                max = count;
            }
            counts[protons] = count;
        }

        let html = '<section class="molecules-chart">';
        for (const [protons, count] of Object.entries(counts)) {
            const element = Elements.data[protons];
            const percent = ((count / max) * 100).toFixed(1);
            const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
            html += `<div class="${typeClass}" style="width: calc(${percent}% + 3.1rem)">`;
            html += `<a href="?protons=${protons}" title="${element.name}">`;
            html += `${element.symbol}: ${count}`;
            html += '<span class="link"></span></a></div>';
        }
        html += '</section>';
        console.timeEnd('molecules-chart');

        return html;
    }

    static renderMolecule(molecule) {
        const formulas = Molecules.findMolecule(molecule);

        if (formulas.length === 1) {
            return Molecules.renderFormula(formulas[0]);
        }

        let html = `<h1>${molecule}</h1>`;

        if (formulas.length === 0) {
            html += '<p>No formulas found.</p>';
            return html;
        }

        html += '<ul>';
        for (const formula of formulas) {
            const linkText = Molecules.format(formula);
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

        return html;
    }

    static renderFormula(formula) {
        const pretty = Molecules.format(formula);

        document.title = formula;

        let html = `<h1>${pretty}</h1>`;
        html += `<p>Molecular weight: ${Molecules.weigh(formula)}</p>`;
        html += '<h2>Links</h2>';

        if (formula in Molecules.data) {
            html += '<ul>';
            for (const chemical of Molecules.data[formula]) {
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

    static renderList(symbol = null) {
        const formulas = Molecules.list(symbol);
        if (formulas.length < 1) {
            return '';
        }

        let moleculesCount = 0;
        for (const formula of formulas) {
            const names = Molecules.data[formula];
            moleculesCount += names.length;
        }

        const formulasTally = `${formulas.length} Formula${(formulas.length === 1) ? '' : 's'}`;
        const moleculesTally = `${moleculesCount} Molecule${(moleculesCount === 1) ? '' : 's'}`;
        let html = `<h3>${formulasTally}, ${moleculesTally}</h3>`;
        html += '<ul>';
        for (const formula of formulas) {
            const names = Molecules.data[formula];
            const linkText = `${Molecules.format(formula)}: ${names.join(', ')}`;
            html += `<li><a href="?formula=${formula}">${linkText}</a></li>`;
        }
        html += '</ul>';

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

        document.title = 'Isotopes';

        let html = '<h1>Most Stable Isotopes of Each Element</h1>';
        html += '<table class="isotopes">';

        for (let neutrons = 177; neutrons >= -1; neutrons--) {
            neutrons = parseInt(neutrons);
            html += '<tr>';

            if (neutrons === 177) {
                html += '<th class="y-axis max" rowspan="19">177</th>';
            }
            else if (neutrons === 158) {
                html += '<th class="y-axis label" rowspan="140">Neutrons</th>';
            }
            else if (neutrons === 18) {
                html += '<th class="y-axis min" rowspan="19">0</th>';
            }
            else if (neutrons === -1) {
                // Work around a colspan border rendering bug in Safari.
                // See: https://bugs.webkit.org/show_bug.cgi?id=20840
                html += '<th class="empty"></th>';
                html += '<th class="empty"></th>';
                html += '<th class="x-axis min" colspan="18">1</th>';
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

class Test {
    static render() {
        const failures = Test.run();
        const color = failures ? 'red' : 'green';
        document.title = 'Automated Tests';
        let html = '<main>';
        html += `<h1>${document.title}</h1>`;
        html += `<p>Failures: <span style="color: ${color}">${failures}</span></p>`;
        return html;
    }

    static run() {
        let failures = 0;
        failures += Molecules.compareTest();
        failures += Molecules.convertFormulaTest();
        return failures;
    }
}

Site.render();
