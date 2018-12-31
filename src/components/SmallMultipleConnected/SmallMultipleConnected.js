import React, { Component } from "react";
import PropTypes from "prop-types";
import addComputedProps from "react-computed-props";
import * as d3 from "d3";
import ConnectedScatterPlot from "../ConnectedScatterPlot/ConnectedScatterPlot";

import { tableContent } from "../tooltip/tooltip";
import { formatNumber } from "../../utils/format";

import "./SmallMultipleConnected.scss";
import AutoWidth from "../AutoWidth/AutoWidth";

import { METRICS } from "../../constants";

/**
 *
 * @param {*} props
 */
function chartProps(props) {
  const { xMetric, yMetric, scale, sortOrder } = props;
  const dataGrouped = d3
    .nest()
    .key(d => d.country)
    .entries(props.data);

  const zMetric = "year";
  const xLabel = METRICS[xMetric].label;
  const yLabel = METRICS[yMetric].label;
  const zLabel = METRICS[zMetric].label;

  const xFunc = d => d[METRICS[xMetric][scale]];
  const yFunc = d => d[METRICS[yMetric][scale]];
  const zFunc = d => d[METRICS[zMetric].display];

  const tooltipTextFunc = d => {
    const tooltipData = {
      [xLabel]: d[METRICS[xMetric].display],
      [yLabel]: d[METRICS[yMetric].display]
    };
    return tableContent(tooltipData, {
      title: `${d.year}`,
      valueFormat: formatNumber
    });
  };
  console.log(dataGrouped);
  return {
    dataGrouped,
    xLabel,
    yLabel,
    zLabel,
    xFunc,
    yFunc,
    zFunc,
    tooltipTextFunc
  };
}

const EXTENT = [0, 1];

/**
 *
 */
class SmallMultipleScatter extends Component {
  static propTypes = {
    data: PropTypes.array,
    scale: PropTypes.string,
    sortOrder: PropTypes.string
  };

  static defaultProps = {
    data: [],
    xMetric: "hdi",
    yMetric: "gni",
    scale: "global"
  };

  renderChart(chartData) {
    const {
      xFunc,
      yFunc,
      zFunc,
      xLabel,
      yLabel,
      zLabel,
      tooltipTextFunc,
      xMetric,
      yMetric
    } = this.props;
    return (
      <div key={chartData.key} className="small-multiple">
        <AutoWidth>
          <ConnectedScatterPlot
            key={chartData.key}
            name={chartData.key}
            data={chartData.values}
            xFunc={xFunc}
            yFunc={yFunc}
            zFunc={zFunc}
            xLabel={xLabel}
            yLabel={yLabel}
            zLabel={zLabel}
            xExtent={EXTENT}
            yExtent={EXTENT}
            tooltipTextFunc={tooltipTextFunc}
            xMetric={xMetric}
            yMetric={yMetric}
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
