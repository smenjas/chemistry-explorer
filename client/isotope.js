import * as common from './common.js';
import isotopeData from './isotope-data.js';

/**
 * Provide information about atomic isotopes: elements whose neutron numbers vary.
 */
export default class Isotope {
    /**
     * Get all isotopes in our database: the most stable for each element.
     *
     * @returns {Object} Atomic numbers keyed by neutron counts
     */
    static getAll() {
        const all = {};

        for (const [protons, isotopes] of isotopeData.primordial) {
            for (const isotope of isotopes) {
                const neutrons = isotope - protons;
                common.pushTo(all, neutrons, protons);
            }
        }

        for (const [protons, isotopes] of isotopeData.synthetic) {
            for (const isotope in isotopes) {
                const neutrons = isotope - protons;
                common.pushTo(all, neutrons, protons);
            }
        }

        return all;
    }
}
