import React, { Component } from "react";
import addComputedProps from "react-computed-props";
import * as d3 from "d3";

import "./ColorLegend.scss";

function chartProps(props) {
  const { domain } = props;
  const years = d3.range(domain[0], domain[1] + 1, 1);
  const radius = 8;
  const spacer = 8;
  const dotWidth = (radius * 2 + spacer) * years.length;
  const xScale = d3
    .scalePoint()
    .domain(years)
    .range([0, dotWidth]);
  return { dotWidth, years, radius, xScale };
}

class ColorLegend extends Component {
  static defaultProps = {
    height: 40
  };

  renderYear(year) {
    const { xScale, radius, colorScale } = this.props;
    return (
      <g key={year} transform={`translate(${xScale(year)},${0})`}>
        <text className="title" textAnchor="middle">
          {year}
        </text>
        <circle cx={0} cy={10} r={radius} fill={colorScale(year)} />
      </g>
    );
  }

  render() {
    const { years, dotWidth, height, radius } = this.props;
    return (
      <div className="ColorLegend">
        <span className="align-middle">Legend:</span>{" "}
        <svg className="dots" width={dotWidth + radius * 4} height={height}>
          <g transform={`translate(${radius * 2},${height / 4})`}>
            {years.map(year => this.renderYear(year))}
          </g>
        </svg>
      </div>
    );
  }
}

export default addComputedProps(chartProps)(ColorLegend);
