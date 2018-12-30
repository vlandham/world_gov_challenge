/**
 * Converts snake_case_string to CamelCaseString.
 *
 * @param {String} s snake_case_string
 * @return {String} CamelCaseString
 */
export function snakeToCamel(s) {
  if (!s) return s;
  return s.replace(/(_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
}

/**
 * Capitalize the first letter of the input string
 * @param {String} s input String
 * @return {String} Output String
 */
export function capitalize(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/**
 * Converts snake_string_value to a sentence,
 * by replacing the underscores with spaces.
 *
 * @param {String} s Input snake_case_string
 * @return {String} Sentence.
 */
export function snakeToSentence(s) {
  if (!s) return s;
  return s.replace(/(_)/g, " ");
}

/**
 * Converts snake_string_value to a sentence,
 * by replacing the underscores with spaces.
 * All words in the sentence are capitalized.
 *
 * @param {String} s Input snake_case_string
 * @return {String} Capitalized Sentence.
 */
export function snakeToCapSentence(s) {
  if (!s) return s;
  const newSentence = s.replace(/(_)+/g, " ");
  const words = newSentence.split(" ");
  return words.map(w => capitalize(w)).join(" ");
}

/**
 * Converts value to a display string, appropriate
 * for displaying as a label.
 *
 * @param {Any} value The value to display
 * @return {String} value to display
 */
export function displayLabelFor(value) {
  let displayValue = value;

  if (Array.isArray(value)) {
    displayValue = value.join(" / ");
  }

  if (typeof variable === "boolean") {
    displayValue = value ? "true" : "false";
  }

  return displayValue;
}
