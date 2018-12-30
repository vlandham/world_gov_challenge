import React, { Component } from "react";
import PropTypes from "prop-types";
import addComputedProps from "react-computed-props";
import * as d3 from "d3";

import "./ConnectedScatterPlot.scss";

function chartProps(props) {
  console.log(props.data);
  return {};
}

/**
 *
 */
class ConnectedScatterPlot extends Component {
  static propTypes = {
    data: PropTypes.array,
    name: PropTypes.string,
    xFunc: PropTypes.func,
    yFunc: PropTypes.func,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string
  };

  static defaultProps = {
    data: [],
    name: "",
    xFunc: d => d.x,
    yFunc: d => d.x,
    xLabel: "",
    yLabel: ""
  };

  /**
   *
   */
  render() {
    const { name } = this.props;
    return (
      <div className="ConnectedScatterPlot">
        <h4 className="title">{name}</h4>
      </div>
    );
  }
}

export default addComputedProps(chartProps)(ConnectedScatterPlot);
