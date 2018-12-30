import * as d3 from "d3";
import "./tooltip.scss";

/**
 * Format an object into a table for tooltip output.
 *
 * @param {Object} entries Object of items to display as a tooltip table.
 * @param {Object} config Configuration object that modifies the table generation.
 *  Possible values are:
 *  title: optional title for table
 *  keys: if provided, only display data from entries associated with these keys.
 *    This also can be used to specify the order of the data in the table.
 *    If not provided, all keys from `entries` are displayed.
 *  keyFormat: formatting function that takes a key and outputs a string to be displayed.
 *  valueFormat: formatting function that takes a value and outputs a string to be displayed.
 */
export function tableContent(entries, config = {}) {
  const defaultConfig = {
    title: null,
    keys: null,
    keyFormat: k => k,
    valueFormat: v => v
  };
  config = { ...defaultConfig, ...config };
  config.keys = config.keys || Object.keys(entries);
  let output = "<div>";
  if (config.title) {
    output += `<h2>${config.title}</h2>`;
  }
  output += "<table><tbody>";
  const rows = config.keys.map(k => {
    if (k in entries) {
      return `<tr><td>${config.keyFormat(k)}</td><td>${config.valueFormat(
        entries[k]
      )}</td></tr>`;
    }
    return "";
  });
  output += rows.join("");
  output += "</tbody></table></div>";
  return output;
}

/**
 * Format an object into a series of spans for tooltip output.
 *
 * @param {Object} entries
 * @param {Function} keyFormat
 */
export function spanContent(entries) {
  const content = Object.keys(entries).map(k => {
    return `<span class='name'>${k}: </span><span class='value'>${
      entries[k]
    }</span>`;
  });

  return content.join("<br/>");
}

/*
 * Creates tooltip with provided id that
 * floats on top of visualization.
 * Most styling is expected to come from CSS
 * so check out bubble_chart.scss for more details.
 */
export function floatingTooltip(tooltipId, width) {
  // Local variable to hold tooltip div for
  // manipulation in other functions.
  var tt = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .attr("id", tooltipId)
    .html("");

  // Set a width if it is provided.
  if (width) {
    tt.style("width", width);
  }

  // Initially it is hidden.
  hideTooltip();

  /*
   * Display tooltip with provided content.
   *
   * content is expected to be HTML string.
   *
   * event is d3.event for positioning.
   */
  function showTooltip(content, event) {
    tt.style("opacity", 1.0)
      .style("pointer-events", "all")
      .html(content);

    updatePosition(event);
  }

  /*
   * Hide the tooltip div.
   */
  function hideTooltip() {
    tt.style("opacity", 0.0).style("pointer-events", "none");
  }

  function toNum(str) {
    return Number(str.replace(/[^\d.-]/g, ""));
  }

  /*
   * Figure out where to place the tooltip
   * based on d3 mouse evenggt.
   */
  function updatePosition(event) {
    var xOffset = 35;
    var yOffset = -60;

    var ttw = toNum(tt.style("width"));
    var tth = toNum(tt.style("height"));

    var wscrY = window.scrollY;
    var wscrX = window.scrollX;

    var curX = document.all ? event.clientX + wscrX : event.pageX;
    var curY = document.all ? event.clientY + wscrY : event.pageY;
    var ttleft =
      curX - wscrX + xOffset * 2 + ttw > window.innerWidth
        ? curX - ttw - xOffset
        : curX + xOffset;

    if (ttleft < wscrX + xOffset) {
      ttleft = wscrX + xOffset;
    }

    var tttop =
      curY - wscrY + yOffset * 2 + tth > window.innerHeight
        ? curY - tth - yOffset * 2
        : curY + yOffset;

    if (tttop < wscrY + yOffset) {
      tttop = curY + yOffset;
    }

    tt.style("top", tttop + "px").style("left", ttleft + "px");
  }

  return {
    showTooltip: showTooltip,
    hideTooltip: hideTooltip,
    updatePosition: updatePosition
  };
}
