/**
 * Increment a number for a given key. Create the property if the key doesn't
 * exist yet.
 *
 * @param {Object} obj - An object
 * @param {string} key - A property name
 * @param {integer} [count=1] - The number to add
 * @returns {integer} The property's value
 */
export function countKey(obj, key, count = 1) {
    if (key in obj) {
        obj[key] += count;
    }
    else {
        obj[key] = count;
    }
    return obj[key];
}

/**
 * Increment a number for a given key. Create the property if the key doesn't
 * exist yet.
 *
 * @param {Map} map - A map object
 * @param {string} key - A property name
 * @param {integer} [count=1] - The number to add
 * @returns {integer} The property's value
 */
export function countMapKey(map, key, count = 1) {
    if (key in map) {
        map.set(key, map.get(key) + count);
    }
    else {
        map.set(key, count);
    }
    return map.get(key);
}

/**
 * Add an element to an array property of the given object.
 * Create the array if the key doesn't exist yet.
 *
 * @param {Object} obj - An object
 * @param {string} key - A property name
 * @param {...*} values - Values to add to the array
 * @returns {integer} The array's length
 */
export function pushTo(obj, key, ...values) {
    if (!(key in obj)) {
        obj[key] = [];
    }
    obj[key].push(...values);
    return obj[key].length;
}

/**
 * Replace or add characters in a string.
 *
 * @param {string} string - The string to change
 * @param {integer} start - The index to start changing characters
 * @param {integer} deleteCount - The number of characters to remove
 * @param {...string} items - The characters to add
 * @param {string} The modified string
 */
export function spliceString(string, start, deleteCount, ...items) {
    return string.split('').toSpliced(start, deleteCount, ...items).join('');
}
