import React, { Component } from "react";
import PropTypes from "prop-types";
import addComputedProps from "react-computed-props";
import * as d3 from "d3";
import ConnectedScatterPlot from "../ConnectedScatterPlot/ConnectedScatterPlot";

import "./SmallMultipleConnected.scss";
import AutoWidth from "../AutoWidth/AutoWidth";

function chartProps(props) {
  const dataGrouped = d3
    .nest()
    .key(d => d.country)
    .entries(props.data);

  console.log(dataGrouped);
  return { dataGrouped };
}

/**
 *
 */
class SmallMultipleScatter extends Component {
  static propTypes = {
    data: PropTypes.array
  };

  static defaultProps = {
    data: []
  };

  renderChart(chartData) {
    return (
      <div key={chartData.key} className="small-multiple">
        <AutoWidth>
          <ConnectedScatterPlot
            key={chartData.key}
            name={chartData.key}
            data={chartData.values}
          />
        </AutoWidth>
      </div>
    );
  }

  /**
   *
   */
  render() {
    const { dataGrouped } = this.props;
    return (
      <div className="SmallMultipleConnected">
        {dataGrouped.map(d => this.renderChart(d))}
      </div>
    );
  }
}

export default addComputedProps(chartProps)(SmallMultipleScatter);
