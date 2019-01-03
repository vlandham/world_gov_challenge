import React, { Component } from "react";
import PropTypes from "prop-types";
import addComputedProps from "react-computed-props";
import AutoWidth from "../AutoWidth/AutoWidth";
import ConnectedScatterPlotGroups from "../ConnectedScatterPlotGroups/ConnectedScatterPlotGroups";

import { tableContent } from "../tooltip/tooltip";
import { formatNumber } from "../../utils/format";
import { METRICS, EXTENT } from "../../constants";

function chartProps(props) {
  const { xMetric, yMetric } = props;
  const scale = "global";

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
      title: `${d.country} - ${d.year}`,
      valueFormat: formatNumber
    });
  };

  return {
    scale,
    xLabel,
    yLabel,
    zLabel,
    xFunc,
    yFunc,
    zFunc,
    tooltipTextFunc
  };
}

class BigGraph extends Component {
  static propTypes = {
    dataGrouped: PropTypes.array,
    scale: PropTypes.string,
    colorScale: PropTypes.func
  };

  static defaultProps = {
    dataGrouped: [],
    xMetric: "hdi",
    yMetric: "gni",
    scale: "global",
    colorScale: d => "#333"
  };

  /**
   *
   */
  renderBigGraph() {
    const {
      dataGrouped,
      colorScale,
      scale,
      xLabel,
      yLabel,
      zLabel,
      xFunc,
      yFunc,
      zFunc,
      xMetric,
      yMetric,
      tooltipTextFunc
    } = this.props;

    return (
      <AutoWidth>
        <ConnectedScatterPlotGroups
          dataBackground={dataGrouped}
          xMetric={xMetric}
          yMetric={yMetric}
          xFunc={xFunc}
          yFunc={yFunc}
          zFunc={zFunc}
          xLabel={xLabel}
          yLabel={yLabel}
          zLabel={zLabel}
          xExtent={EXTENT}
          yExtent={EXTENT}
          scale={scale}
          colorScale={colorScale}
          height={600}
          tooltipTextFunc={tooltipTextFunc}
        />
      </AutoWidth>
    );
  }

  render() {
    return this.renderBigGraph();
  }
}

export default addComputedProps(chartProps)(BigGraph);
