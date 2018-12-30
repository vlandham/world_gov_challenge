/**
 * Returns true if collection includes any in list
 * @param  {Array} collection Array of values to search
 * @param  {Array} list values to check for
 * @returns {Bool} true if collection contains any
 *  of the elements in list
 */
export function includesAny(collection, list) {
  if (!collection || !list) {
    return false;
  }

  if (!Array.isArray(collection)) {
    collection = [collection];
  }

  // array.some tests whether at least one element
  // in the array passes the test
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some
  return collection.some(r => list.includes(r));
}
