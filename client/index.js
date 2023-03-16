'use strict';

class Elements {
    static data = {
        1:   { symbol: 'H',  name: 'Hydrogen',      mass:   1.00794, period: 1, group:  1,   density:  0.071, melts: -259.3,  boils: -252.9,  type: 'Other Nonmetal' },
        2:   { symbol: 'He', name: 'Helium',        mass:   4.0026,  period: 1, group: 18,   density:  0.126, melts: null,    boils: -268.9,  type: 'Noble Gas' },
        3:   { symbol: 'Li', name: 'Lithium',       mass:   6.939,   period: 2, group:  1,   density:  0.53,  melts:  180.6,  boils: 1342,    type: 'Alkali Metal' },
        4:   { symbol: 'Be', name: 'Beryllium',     mass:   9.0122,  period: 2, group:  2,   density:  1.85,  melts: 1289,    boils: 2472,    type: 'Alkaline Earth Metal' },
        5:   { symbol: 'B',  name: 'Boron',         mass:  10.811,   period: 2, group: 13,   density:  2.34,  melts: 2092,    boils: 4002,    type: 'Metalloid' },
        6:   { symbol: 'C',  name: 'Carbon',        mass:  12.0111,  period: 2, group: 14,   density:  2.26,  melts: null,    boils: 3827,    type: 'Other Nonmetal' },
        7:   { symbol: 'N',  name: 'Nitrogen',      mass:  14.0067,  period: 2, group: 15,   density:  0.81,  melts: -210,    boils: -195.8,  type: 'Other Nonmetal' },
        8:   { symbol: 'O',  name: 'Oxygen',        mass:  15.9994,  period: 2, group: 16,   density:  1.14,  melts: -218.79, boils: -182.97, type: 'Other Nonmetal' },
        9:   { symbol: 'F',  name: 'Flourine',      mass:  18.9984,  period: 2, group: 17,   density:  1.11,  melts: -219.6,  boils: -188.1,  type: 'Halogen Nonmetal' },
        10:  { symbol: 'Ne', name: 'Neon',          mass:  20.180,   period: 2, group: 18,   density:  1.20,  melts: -248.6,  boils: -246,    type: 'Noble Gas' },
        11:  { symbol: 'Na', name: 'Sodium',        mass:  22.9898,  period: 3, group:  1,   density:  0.97,  melts:   97.8,  boils:  883,    type: 'Alkali Metal' },
        12:  { symbol: 'Mg', name: 'Magnesium',     mass:  24.305,   period: 3, group:  2,   density:  1.74,  melts:  650,    boils: 1090,    type: 'Alkaline Earth Metal' },
        13:  { symbol: 'Al', name: 'Aluminum',      mass:  26.9815,  period: 3, group: 13,   density:  2.70,  melts:  660,    boils: 2520,    type: 'Post Transition Metal' },
        14:  { symbol: 'Si', name: 'Silicon',       mass:  28.086,   period: 3, group: 14,   density:  2.33,  melts: 1414,    boils: 3267,    type: 'Metalloid' },
        15:  { symbol: 'P',  name: 'Phosphorus',    mass:  30.9738,  period: 3, group: 15,   density:  1.82,  melts:   44.1,  boils:  280,    type: 'Other Nonmetal' },
        16:  { symbol: 'S',  name: 'Sulfur',        mass:  32.064,   period: 3, group: 16,   density:  2.07,  melts:  115.2,  boils:  444.7,  type: 'Other Nonmetal' },
        17:  { symbol: 'Cl', name: 'Chlorine',      mass:  35.453,   period: 3, group: 17,   density:  1.56,  melts: -101,    boils:  -33.9,  type: 'Halogen Nonmetal' },
        18:  { symbol: 'Ar', name: 'Argon',         mass:  39.948,   period: 3, group: 18,   density:  1.40,  melts: -189.4,  boils: -185.9,  type: 'Noble Gas' },
        19:  { symbol: 'K',  name: 'Potassium',     mass:  39.098,   period: 4, group:  1,   density:  0.86,  melts:   63.7,  boils:  759,    type: 'Alkali Metal' },
        20:  { symbol: 'Ca', name: 'Calcium',       mass:  40.08,    period: 4, group:  2,   density:  1.55,  melts:  842,    boils: 1494,    type: 'Alkaline Earth Metal' },
        21:  { symbol: 'Sc', name: 'Scandium',      mass:  44.956,   period: 4, group:  3,   density:  3.0,   melts: 1541,    boils: 2836,    type: 'Transition Metal' },
        22:  { symbol: 'Ti', name: 'Titanium',      mass:  47.90,    period: 4, group:  4,   density:  4.51,  melts: 1670,    boils: 3289,    type: 'Transition Metal' },
        23:  { symbol: 'V',  name: 'Vanadium',      mass:  50.942,   period: 4, group:  5,   density:  6.1,   melts: 1910,    boils: 3409,    type: 'Transition Metal' },
        24:  { symbol: 'Cr', name: 'Chromium',      mass:  51.996,   period: 4, group:  6,   density:  7.19,  melts: 1863,    boils: 2672,    type: 'Transition Metal' },
        25:  { symbol: 'Mn', name: 'Manganese',     mass:  54.938,   period: 4, group:  7,   density:  7.43,  melts: 1246,    boils: 2062,    type: 'Transition Metal' },
        26:  { symbol: 'Fe', name: 'Iron',          mass:  55.847,   period: 4, group:  8,   density:  7.86,  melts: 1538,    boils: 2862,    type: 'Transition Metal' },
        27:  { symbol: 'Co', name: 'Cobalt',        mass:  58.933,   period: 4, group:  9,   density:  8.9,   melts: 1495,    boils: 2928,    type: 'Transition Metal' },
        28:  { symbol: 'Ni', name: 'Nickel',        mass:  58.69,    period: 4, group: 10,   density:  8.9,   melts: 1455,    boils: 2914,    type: 'Transition Metal' },
        29:  { symbol: 'Cu', name: 'Copper',        mass:  63.54,    period: 4, group: 11,   density:  8.96,  melts: 1085,    boils: 2563,    type: 'Transition Metal' },
        30:  { symbol: 'Zn', name: 'Zinc',          mass:  65.37,    period: 4, group: 12,   density:  7.14,  melts:  419.6,  boils:  907,    type: 'Transition Metal' },
        31:  { symbol: 'Ga', name: 'Gallium',       mass:  69.72,    period: 4, group: 13,   density:  5.91,  melts:   29.8,  boils: 2205,    type: 'Post Transition Metal' },
        32:  { symbol: 'Ge', name: 'Germanium',     mass:  72.59,    period: 4, group: 14,   density:  5.32,  melts:  938.4,  boils: 2834,    type: 'Metalloid' },
        33:  { symbol: 'As', name: 'Arsenic',       mass:  74.922,   period: 4, group: 15,   density:  5.72,  melts: null,    boils:  615,    type: 'Metalloid' },
        34:  { symbol: 'Se', name: 'Selenium',      mass:  78.96,    period: 4, group: 16,   density:  4.79,  melts:  221,    boils:  685,    type: 'Other Nonmetal' },
        35:  { symbol: 'Br', name: 'Bromine',       mass:  79.904,   period: 4, group: 17,   density:  3.12,  melts:   -7.2,  boils:   58.7,  type: 'Halogen Nonmetal' },
        36:  { symbol: 'Kr', name: 'Krypton',       mass:  83.80,    period: 4, group: 18,   density:  2.6,   melts: -157.3,  boils: -153.2,  type: 'Noble Gas' },
        37:  { symbol: 'Rb', name: 'Rubidium',      mass:  85.47,    period: 5, group:  1,   density:  1.53,  melts:   39.48, boils:  688,    type: 'Alkali Metal' },
        38:  { symbol: 'Sr', name: 'Strontium',     mass:  87.62,    period: 5, group:  2,   density:  2.6,   melts:  769,    boils: 1382,    type: 'Alkaline Earth Metal' },
        39:  { symbol: 'Y',  name: 'Yttrium',       mass:  88.905,   period: 5, group:  3,   density:  4.47,  melts: 1522,    boils: 3338,    type: 'Transition Metal' },
        40:  { symbol: 'Zr', name: 'Zirconium',     mass:  91.22,    period: 5, group:  4,   density:  6.49,  melts: 1855,    boils: 4409,    type: 'Transition Metal' },
        41:  { symbol: 'Nb', name: 'Niobium',       mass:  92.906,   period: 5, group:  5,   density:  8.4,   melts: 2469,    boils: 4744,    type: 'Transition Metal' },
        42:  { symbol: 'Mo', name: 'Molybdenum',    mass:  95.94,    period: 5, group:  6,   density: 10.2,   melts: 2623,    boils: 4639,    type: 'Transition Metal' },
        43:  { symbol: 'Tc', name: 'Technetium',    mass:  99,       period: 5, group:  7,   density: 11.5,   melts: 2204,    boils: 4265,    type: 'Transition Metal' },
        44:  { symbol: 'Ru', name: 'Ruthenium',     mass: 101.07,    period: 5, group:  8,   density: 12.2,   melts: 2334,    boils: 4150,    type: 'Transition Metal' },
        45:  { symbol: 'Rh', name: 'Rhodium',       mass: 102.905,   period: 5, group:  9,   density: 12.4,   melts: 1963,    boils: 3697,    type: 'Transition Metal' },
        46:  { symbol: 'Pd', name: 'Palladium',     mass: 106.4,     period: 5, group: 10,   density: 12.0,   melts: 1555,    boils: 2964,    type: 'Transition Metal' },
        47:  { symbol: 'Ag', name: 'Silver',        mass: 107.870,   period: 5, group: 11,   density: 10.5,   melts:  962,    boils: 2163,    type: 'Transition Metal' },
        48:  { symbol: 'Cd', name: 'Cadmium',       mass: 112.41,    period: 5, group: 12,   density:  2.65,  melts:  321.11, boils:  767,    type: 'Transition Metal' },
        49:  { symbol: 'In', name: 'Indium',        mass: 114.82,    period: 5, group: 13,   density:  7.31,  melts:  157,    boils: 2073,    type: 'Post Transition Metal' },
        50:  { symbol: 'Sn', name: 'Tin',           mass: 118.69,    period: 5, group: 14,   density:  7.30,  melts:  232,    boils: 2603,    type: 'Post Transition Metal' },
        51:  { symbol: 'Sb', name: 'Antimony',      mass: 121.76,    period: 5, group: 15,   density:  6.62,  melts:  630.8,  boils: 1587,    type: 'Metalloid' },
        52:  { symbol: 'Te', name: 'Tellurium',     mass: 127.60,    period: 5, group: 16,   density:  6.24,  melts:  450,    boils:  988,    type: 'Metalloid' },
        53:  { symbol: 'I',  name: 'Iodine',        mass: 126.904,   period: 5, group: 17,   density:  4.94,  melts:  113.5,  boils:  184.3,  type: 'Halogen Nonmetal' },
        54:  { symbol: 'Xe', name: 'Xenon',         mass: 131.30,    period: 5, group: 18,   density:  3.06,  melts: -111.8,  boils: -108,    type: 'Noble Gas' },
        55:  { symbol: 'Cs', name: 'Cesium',        mass: 132.905,   period: 6, group:  1,   density:  1.90,  melts:   28.4,  boils:  671,    type: 'Alkali Metal' },
        56:  { symbol: 'Ba', name: 'Barium',        mass: 137.33,    period: 6, group:  2,   density:  3.5,   melts:  729,    boils: 1805,    type: 'Alkaline Earth Metal' },
        57:  { symbol: 'La', name: 'Lanthanum',     mass: 138.91,    period: 6, group:  1,   density:  6.17,  melts:  918,    boils: 3464,    type: 'Lanthanide' },
        58:  { symbol: 'Ce', name: 'Cerium',        mass: 140.12,    period: 6, group: null, density:  6.67,  melts:  798,    boils: 3443,    type: 'Lanthanide' },
        59:  { symbol: 'Pr', name: 'Praseodymium',  mass: 140.907,   period: 6, group: null, density:  6.77,  melts:  931,    boils: 3520,    type: 'Lanthanide' },
        60:  { symbol: 'Nd', name: 'Neodymium',     mass: 144.24,    period: 6, group: null, density:  7.00,  melts: 1021,    boils: 3074,    type: 'Lanthanide' },
        61:  { symbol: 'Pm', name: 'Prometheum',    mass: 145,       period: 6, group: null, density: null,   melts: 1042,    boils: 3000,    type: 'Lanthanide' },
        62:  { symbol: 'Sm', name: 'Samarium',      mass: 150.36,    period: 6, group: null, density:  7.54,  melts: 1074,    boils: 1794,    type: 'Lanthanide' },
        63:  { symbol: 'Eu', name: 'Europium',      mass: 151.964,   period: 6, group: null, density:  5.26,  melts:  822,    boils: 1527,    type: 'Lanthanide' },
        64:  { symbol: 'Gd', name: 'Gadolinium',    mass: 157.25,    period: 6, group: null, density:  7.89,  melts: 1313,    boils: 3273,    type: 'Lanthanide' },
        65:  { symbol: 'Tb', name: 'Terbium',       mass: 158.925,   period: 6, group: null, density:  8.27,  melts: 1356,    boils: 3230,    type: 'Lanthanide' },
        66:  { symbol: 'Dy', name: 'Dysprosium',    mass: 162.50,    period: 6, group: null, density:  8.54,  melts: 1412,    boils: 2567,    type: 'Lanthanide' },
        67:  { symbol: 'Ho', name: 'Holmium',       mass: 164.930,   period: 6, group: null, density:  8.80,  melts: 1474,    boils: 2700,    type: 'Lanthanide' },
        68:  { symbol: 'Er', name: 'Erbium',        mass: 167.259,   period: 6, group: null, density:  9.05,  melts: 1529,    boils: 2868,    type: 'Lanthanide' },
        69:  { symbol: 'Tm', name: 'Thulium',       mass: 168.934,   period: 6, group: null, density:  9.33,  melts: 1545,    boils: 1950,    type: 'Lanthanide' },
        70:  { symbol: 'Yb', name: 'Ytterbium',     mass: 173.054,   period: 6, group: null, density:  6.98,  melts:  819,    boils: 1196,    type: 'Lanthanide' },
        71:  { symbol: 'Lu', name: 'Lutetium',      mass: 174.97,    period: 6, group: null, density:  9.84,  melts: 1663,    boils: 3402,    type: 'Lanthanide' },
        72:  { symbol: 'Hf', name: 'Hafnium',       mass: 178.49,    period: 6, group:  4,   density: 13.1,   melts: 2231,    boils: 4603,    type: 'Transition Metal' },
        73:  { symbol: 'Ta', name: 'Tantalum',      mass: 180.948,   period: 6, group:  5,   density: 16.6,   melts: 3020,    boils: 5458,    type: 'Transition Metal' },
        74:  { symbol: 'W',  name: 'Tungsten',      mass: 183.85,    period: 6, group:  6,   density: 19.3,   melts: 3422,    boils: 5555,    type: 'Transition Metal' },
        75:  { symbol: 'Re', name: 'Rhenium',       mass: 186.2,     period: 6, group:  7,   density: 21.0,   melts: 3186,    boils: 5596,    type: 'Transition Metal' },
        76:  { symbol: 'Os', name: 'Osmium',        mass: 190.2,     period: 6, group:  8,   density: 22.6,   melts: 3033,    boils: 5012,    type: 'Transition Metal' },
        77:  { symbol: 'Ir', name: 'Iridium',       mass: 192.2,     period: 6, group:  9,   density: 22.5,   melts: 2447,    boils: 4428,    type: 'Transition Metal' },
        78:  { symbol: 'Pt', name: 'Platinum',      mass: 195.09,    period: 6, group: 10,   density: 21.4,   melts: 1769,    boils: 3827,    type: 'Transition Metal' },
        79:  { symbol: 'Au', name: 'Gold',          mass: 196.967,   period: 6, group: 11,   density: 19.3,   melts: 1064.4,  boils: 2857,    type: 'Transition Metal' },
        80:  { symbol: 'Hg', name: 'Mercury',       mass: 200.59,    period: 6, group: 12,   density: 13.6,   melts:  -38.8,  boils:  357,    type: 'Transition Metal' },
        81:  { symbol: 'Tl', name: 'Thallium',      mass: 204.38,    period: 6, group: 13,   density: 11.85,  melts:  304,    boils: 1473,    type: 'Post Transition Metal' },
        82:  { symbol: 'Pb', name: 'Lead',          mass: 207.19,    period: 6, group: 14,   density: 11.4,   melts:  327.5,  boils: 1750,    type: 'Post Transition Metal' },
        83:  { symbol: 'Bi', name: 'Bismuth',       mass: 208.980,   period: 6, group: 15,   density:  9.8,   melts:  271.4,  boils: 1564,    type: 'Post Transition Metal' },
        84:  { symbol: 'Po', name: 'Polonium',      mass: 209,       period: 6, group: 16,   density:  9.2,   melts:  254,    boils: null,    type: 'Post Transition Metal' },
        85:  { symbol: 'At', name: 'Astatine',      mass: 210,       period: 6, group: 17,   density: null,   melts:  302,    boils: null,    type: 'Metalloid' },
        86:  { symbol: 'Rn', name: 'Radon',         mass: 222,       period: 6, group: 18,   density: null,   melts:  -71,    boils:  -61.7,  type: 'Noble Gas' },
        87:  { symbol: 'Fr', name: 'Francium',      mass: 223,       period: 7, group:  1,   density: null,   melts:   27,    boils: null,    type: 'Alkali Metal' },
        88:  { symbol: 'Ra', name: 'Radium',        mass: 226,       period: 7, group:  2,   density:  5.0,   melts:  700,    boils: null,    type: 'Alkaline Earth Metal' },
        89:  { symbol: 'Ac', name: 'Actinium',      mass: 227,       period: 7, group:  3,   density: null,   melts: 1051,    boils: 3200,    type: 'Actinide' },
        90:  { symbol: 'Th', name: 'Thorium',       mass: 232.038,   period: 7, group: null, density: 11.7,   melts: 1755,    boils: 4788,    type: 'Actinide' },
        91:  { symbol: 'Pa', name: 'Protactinium',  mass: 231.035,   period: 7, group: null, density: 15.4,   melts: 1572,    boils: null,    type: 'Actinide' },
        92:  { symbol: 'U',  name: 'Uranium',       mass: 238.028,   period: 7, group: null, density: 19.07,  melts: 1135,    boils: 4134,    type: 'Actinide' },
        93:  { symbol: 'Np', name: 'Neptunium',     mass: 237,       period: 7, group: null, density: 19.5,   melts:  639,    boils: null,    type: 'Actinide' },
        94:  { symbol: 'Pu', name: 'Plutonium',     mass: 244,       period: 7, group: null, density: null,   melts:  640,    boils: 3230,    type: 'Actinide' },
        95:  { symbol: 'Am', name: 'Americium',     mass: 243,       period: 7, group: null, density: null,   melts: 1176,    boils: null,    type: 'Actinide' },
        96:  { symbol: 'Cm', name: 'Curium',        mass: 247,       period: 7, group: null, density: null,   melts: 1345,    boils: null,    type: 'Actinide' },
        97:  { symbol: 'Bk', name: 'Berkelium',     mass: 247,       period: 7, group: null, density: null,   melts: 1050,    boils: null,    type: 'Actinide' },
        98:  { symbol: 'Cf', name: 'Californium',   mass: 251,       period: 7, group: null, density: null,   melts:  900,    boils: null,    type: 'Actinide' },
        99:  { symbol: 'Es', name: 'Einsteinium',   mass: 252,       period: 7, group: null, density: null,   melts:  860,    boils: null,    type: 'Actinide' },
        100: { symbol: 'Fm', name: 'Fermium',       mass: 257,       period: 7, group: null, density: null,   melts: 1527,    boils: null,    type: 'Actinide' },
        101: { symbol: 'Md', name: 'Mendelevium',   mass: 258,       period: 7, group: null, density: null,   melts:  827,    boils: null,    type: 'Actinide' },
        102: { symbol: 'No', name: 'Nobelium',      mass: 259,       period: 7, group: null, density: null,   melts:  827,    boils: null,    type: 'Actinide' },
        103: { symbol: 'Lr', name: 'Lawrencium',    mass: 262,       period: 7, group: null, density: null,   melts: 1627,    boils: null,    type: 'Actinide' },
        104: { symbol: 'Rf', name: 'Rutherfordium', mass: 267,       period: 7, group:  4,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        105: { symbol: 'Db', name: 'Dubnium',       mass: 268,       period: 7, group:  5,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        106: { symbol: 'Sg', name: 'Seaborgium',    mass: 271,       period: 7, group:  6,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        107: { symbol: 'Bh', name: 'Bohrium',       mass: 272,       period: 7, group:  7,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        108: { symbol: 'Hs', name: 'Hassium',       mass: 270,       period: 7, group:  8,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        109: { symbol: 'Mt', name: 'Meitnerium',    mass: 276,       period: 7, group:  9,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        110: { symbol: 'Ds', name: 'Darmstadtium',  mass: 281,       period: 7, group: 10,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        111: { symbol: 'Rg', name: 'Roentgenium',   mass: 280,       period: 7, group: 11,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        112: { symbol: 'Cn', name: 'Copernicium',   mass: 285,       period: 7, group: 12,   density: null,   melts: null,    boils: null,    type: 'Transition Metal' },
        113: { symbol: 'Nh', name: 'Nihonium',      mass: 284,       period: 7, group: 13,   density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        114: { symbol: 'Fl', name: 'Flerovium',     mass: 289,       period: 7, group: 14,   density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        115: { symbol: 'Mc', name: 'Moscovium',     mass: 288,       period: 7, group: 15,   density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        116: { symbol: 'Lv', name: 'Livermorium',   mass: 293,       period: 7, group: 16,   density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        117: { symbol: 'Ts', name: 'Tennessine',    mass: 294,       period: 7, group: 17,   density: null,   melts: null,    boils: null,    type: 'Post Transition Metal' },
        118: { symbol: 'Og', name: 'Oganesson',     mass: 294,       period: 7, group: 18,   density: null,   melts: null,    boils: null,    type: 'Noble Gas' },
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

    static render() {
        const params = new URLSearchParams(window.location.search);
        const protons = params.get('protons');
        const element = Elements.data[protons];
        let html = '';

        if (protons && !element) {
            console.log("Unknown element:", protons);
        }

        if (element) {
            document.title = element.name;
            html += '<main>';
            html += `<h1>${document.title}</h1>`;
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

        document.body.insertAdjacentHTML('beforeend', html);
    }

    static formatElement(protons, link = false) {
        const element = Elements.data[protons];

        let html = `<span class="atomic">${protons}</span><br>`;
        html += `<span class="symbol">${element.symbol}</span><br>`;
        html += `<span class="name">${element.name}</span><br>`;
        const mass = (element.mass.toString().indexOf('.') === -1) ? `(${element.mass})` : element.mass;
        html += `<span class="mass">${mass}</span>`;

        if (link) {
            html = `<a href="?protons=${protons}">${html}<span class="link"></span></a>`;
        }

        const typeClass = element.type.toLowerCase().replaceAll(' ', '-');
        const title = element.type;
        html = `<article class="${typeClass} element" title="${title}">${html}</article>`;

        return html;
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
        let html = '<section>';
        html += `<table class="elements"><thead><tr>`;

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
                    td = Elements.formatElement(protons, true);
                    protons++;
                }

                tr += `<td class="${tdClass}">${td}</td>`;
            }

            html += `<tr>${tr}</tr>`;
        }

        html += '</tbody></table>';
        html += '</section>';

        return html;
    }

    static renderElement(protons) {
        const wikiURL = 'https://en.wikipedia.org/wiki/';
        const element = Elements.data[protons];

        let html = '<section class="element">';
        html += Elements.formatElement(protons, false);

        html += '<aside>';
        html += '<ul>';
        html += `<li><a href="${wikiURL}Atomic_number" target="_blank">Atomic Number</a>: ${protons}</li>`;
        html += `<li><a href="${wikiURL}Chemical_symbol" target="_blank">Symbol</a>: ${element.symbol}</li>`;
        html += `<li><a href="${wikiURL}${element.name}#History" target="_blank">Name</a>: ${element.name}</li>`;
        html += `<li><a href="${wikiURL}Atomic_mass" target="_blank">Mass</a>: ${element.mass}</li>`;
        html += `<li><a href="${wikiURL}Density" target="_blank">Density</a>: ${element.density}</li>`;
        html += `<li><a href="${wikiURL}Group_%28periodic_table%29" target="_blank">Group</a>: ${element.group}</li>`;
        html += `<li><a href="${wikiURL}Period_%28periodic_table%29" target="_blank">Period</a>: ${element.period}</li>`;
        html += `<li><a href="${wikiURL}Melting_point" target="_blank">Melting Point</a>: ${element.melts}</li>`;
        html += `<li><a href="${wikiURL}Boiling_point" target="_blank">Boiling Point</a>: ${element.boils}</li>`;
        html += `<li>Type: <a href="${Elements.typeURLs[element.type]}" target="_blank">${element.type}</a></li>`;
        html += '</ul>';

        html += '<ul>';
        html += `<li><a href="${wikiURL}${element.name}" target="_blank">More info on Wikipedia</a></li>`;
        html += '<li><a href="./index.html">Go back to the periodic table</a></li>';
        html += '</ul>';
        html += '</aside>';
        html += '</section>';

        return html;
    }
}

Elements.render();
