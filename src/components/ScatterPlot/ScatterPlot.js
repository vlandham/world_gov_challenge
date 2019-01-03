import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import addComputedProps from "react-computed-props";
import isfinite from "lodash.isfinite";
import * as d3 from "d3";

import { includesAny } from "../../utils/collection";
import { floatingTooltip } from "../tooltip/tooltip";

import "./ScatterPlot.scss";

function chartProps(props) {
  const {
    data,
    height,
    width,
    xFunc,
    yFunc,
    colorByFunc,
    colorScale,
    exactMouse
  } = props;

  const padding = {
    top: 20,
    right: 20,
    bottom: 50,
    left: 60
  };

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const xExtent = d3.extent(data, xFunc);
  const xPad = Math.round((xExtent[1] - xExtent[0]) / 20);
  const xScale = d3
    .scaleLinear()
    .domain([xExtent[0] - xPad, xExtent[1] + xPad])
    .range([0, plotWidth]);

  const yExtent = d3.extent(data, yFunc);
  const yPad = (yExtent[1] - yExtent[0]) / 20;
  const yScale = d3
    .scaleLinear()
    .domain([yExtent[0] - yPad, yExtent[1] + yPad])
    .range([plotHeight, 0]);

  const xValue = d => xScale(xFunc(d));
  const yValue = d => yScale(yFunc(d));
  const colorValue = d =>
    colorByFunc(d) ? colorScale(colorByFunc(d)) : "#888";

  const yAxis = d3
    .axisLeft(yScale)
    .tickSizeOuter(0)
    .ticks(4);
  const xAxis = d3
    .axisBottom(xScale)
    .tickSizeOuter(0)
    .ticks(4);

  let voronoiDiagram = d3.voronoi()([]);

  if (!exactMouse) {
    const pixelJitter = () => Math.random() - 0.5;
    voronoiDiagram = d3
      .voronoi()
      .x(d => xValue(d) + pixelJitter())
      .y(d => yValue(d) + pixelJitter())
      .size([plotWidth, plotHeight])(data);
  }

  const mouseRadius = plotWidth / 10;

  return {
    plotWidth,
    plotHeight,
    padding,
    colorValue,
    xScale,
    yScale,
    xValue,
    yValue,
    xAxis,
    yAxis,
    voronoiDiagram,
    mouseRadius
  };
}

/**
 * Scatter Plot component used to visualize two variables in the same chart.
 * Provides brushing capabilities for selecting subsets of data points.
 * Also provides zooming and hovering capabilities.
 */
class ScatterPlot extends PureComponent {
  static propTypes = {
    /**
     * Boolean to enable/disable brushing interaction.
     */
    brushable: PropTypes.bool,

    /**
     * Function to extract attribute used to color dots with.
     * Used in conjunction with `colorScale` a la:
     * `colorScale(colorByFunc(d))`.
     */
    colorByFunc: PropTypes.func,

    /**
     * D3-style color scale function to color dots by.
     */
    colorScale: PropTypes.func,

    /**
     * Array of data objects to plot. x,y, and color values
     * are extracted from each object in this array using
     * xFunc, yFunc, and colorByFunc, respectively.
     */
    data: PropTypes.array,
    labels: PropTypes.object,

    /**
     * A nice UX feature is when mousing over a plot,
     * the nearest point to the mouse cursor can be detected
     * using a voronoi diagram and its tooltip can be displayed
     * without having to explicitly mouse onto that point.
     * Unfortunately, these plots are flexible enough to allow data
     * that is un-voronoi-able... causing crashing behavior. So,
     * this approach (in certain contexts) needs to be abandoned.
     * This boolean controls if 'exact mouse' (no voronoi) should
     * be used for mouse-over or not.
     * @default true
     */
    exactMouse: PropTypes.bool,

    /**
     * Height of component
     */
    height: PropTypes.number,

    /**
     * Values being hovered on.
     */
    hoverData: PropTypes.shape({
      values: PropTypes.array
    }),

    /**
     * Unique name of plot. Used for
     * maximization interaction.
     */
    name: PropTypes.string,

    /**
     * Callback for brushing interaction.
     */
    onFilter: PropTypes.func,

    /**
     *
     */
    onHover: PropTypes.func,

    /**
     * Radius of dots.
     * @default 4
     */
    radius: PropTypes.number,

    /**
     * Values selected.
     */
    selectedData: PropTypes.shape({
      values: PropTypes.array
    }),

    /**
     * Function used to generate tooltip text.
     * function is provided data object.
     */
    tooltipTextFunc: PropTypes.func,

    /**
     * Width of component.
     */
    width: PropTypes.number,

    /**
     * Accessor function for x value of data object to display.
     */
    xFunc: PropTypes.func,

    /**
     * x-axis label.
     */
    xLabel: PropTypes.string,

    /**
     * Accessor function for y value of data object to display.
     */
    yFunc: PropTypes.func,

    /**
     * y-axis label.
     */
    yLabel: PropTypes.string,

    /**
     * Boolean controlling if chart is zoomable or not.
     * @default true
     */
    zoomable: PropTypes.bool
  };

  static defaultProps = {
    data: [],
    labels: {},
    name: "scatter",
    brushable: true,
    colorByFunc: () => {},
    height: 400,
    hoverData: null,
    selectedData: null,
    width: 300,
    onFilter: () => {},
    colorScale: () => "#ddd",
    xFunc: d => d.x,
    yFunc: d => d.y,
    radius: 4,
    xLabel: "",
    yLabel: "",
    zoomable: false,
    exactMouse: false
  };

  /**
   *
   */
  constructor(props) {
    super(props);

    this.state = {
      zooming: false,
      showTable: false
    };

    this.handleLassoSelect = this.handleLassoSelect.bind(this);
    this.handleZoom = this.handleZoom.bind(this);
    this.handleZoomingToggle = this.handleZoomingToggle.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleMouseOut = this.handleMouseOut.bind(this);
    this.handleMouseOverCircle = this.handleMouseOverCircle.bind(this);
    this.handleMouseOutCircle = this.handleMouseOutCircle.bind(this);
  }

  /**
   * When the react component mounts, setup the d3 vis
   */
  componentDidMount() {
    this.setup();
  }

  /**
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    this.update();
  }

  /**
   *
   */
  handleLassoSelect(d) {
    this.props.onFilter(d);
  }

  /**
   *
   */
  handleZoom() {
    const { xAxis, yAxis, xFunc, yFunc } = this.props;
    let { xScale, yScale } = this.props;

    // record zoom transform to be used in
    // other interaction callbacks.
    this.zoomTransform = d3.event.transform;

    xScale = this.zoomTransform.rescaleX(xScale);
    yScale = this.zoomTransform.rescaleY(yScale);

    this.yAxis.call(yAxis.scale(yScale));

    this.xAxis.call(xAxis.scale(xScale));

    const xValue = d => xScale(xFunc(d));
    const yValue = d => yScale(yFunc(d));

    this.highlightCircle(null);

    this.chart
      .selectAll(".dot")
      .attr("cx", xValue)
      .attr("cy", yValue);
  }

  /**
   *
   */
  handleZoomingToggle() {
    const { zooming } = this.state;
    this.setState({
      zooming: !zooming
    });
  }

  /**
   *
   */
  highlightCircle(d) {
    const {
      xFunc,
      yFunc,
      colorScale,
      colorBy,
      tooltipTextFunc,
      onHover
    } = this.props;
    let { xScale, yScale } = this.props;

    xScale = this.zoomTransform.rescaleX(xScale);
    yScale = this.zoomTransform.rescaleY(yScale);

    if (!d) {
      this.highlight.style("display", "none");
      this.tooltip.hideTooltip();
      this.annotation.attr("opacity", 1.0);
    } else {
      this.highlight
        .style("display", "")
        .style("stroke", colorScale(d[colorBy]))
        .attr("cx", xScale(xFunc(d)))
        .attr("cy", yScale(yFunc(d)));
      if (tooltipTextFunc) {
        this.tooltip.showTooltip(tooltipTextFunc(d), d3.event);
      }
      this.annotation.attr("opacity", 0.3);
    }

    if (onHover) {
      onHover(d);
    }
  }

  /**
   *
   */
  handleMouseOver(el) {
    const { voronoiDiagram, mouseRadius } = this.props;

    let mousePos = d3.mouse(el);
    mousePos = this.zoomTransform.invert(mousePos);
    const site = voronoiDiagram.find(mousePos[0], mousePos[1], mouseRadius);
    this.highlightCircle(site && site.data);
  }

  /**
   *
   */
  handleMouseOut() {
    this.highlightCircle(null);
  }

  /**
   *
   */
  handleMouseOverCircle(d) {
    this.highlightCircle(d);
  }

  /**
   *
   */
  handleMouseOutCircle() {
    this.highlightCircle(null);
  }

  /**
   *
   */
  setup() {
    const { plotHeight, plotWidth, radius, exactMouse } = this.props;
    const cRoot = d3.select(this.root);

    this.g = cRoot.append("g");

    this.underlay = this.g
      .append("rect")
      .classed("underlay", true)
      .attr("width", plotWidth)
      .attr("height", plotHeight)
      .style("fill", "white");

    const that = this;
    if (!exactMouse) {
      this.underlay
        .on("mousemove", function(d) {
          that.handleMouseOver(this, d);
        })
        .on("mouseleave", function() {
          that.handleMouseOut();
        });
    }

    this.setupZoom(this.underlay);

    this.chart = this.g.append("g").classed("chart-group", true);
    this.tooltip = floatingTooltip("_tooltip", { xOffset: 5, yOffset: 20 });

    this.highlight = this.g
      .append("circle")
      .attr("class", "highlight-circle")
      .attr("r", radius * 2)
      .style("fill", "none")
      .style("display", "none");

    this.annotation = this.g
      .append("g")
      .classed("annotation", true)
      .attr("pointer-events", "none");

    this.xAxis = this.g.append("g").classed("x-axis", true);
    this.yAxis = this.g.append("g").classed("y-axis", true);
    this.yAxisLabel = this.g
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle");

    this.xAxisLabel = this.g
      .append("text")
      .attr("class", "axis-label")
      .attr("text-anchor", "middle");

    this.update();
  }

  /**
   *
   */
  setupZoom(underlay) {
    const { zoomable } = this.props;
    this.zoomTransform = d3.zoomIdentity;

    if (zoomable) {
      this.zoom = d3
        .zoom()
        .scaleExtent([1 / 4, 8])
        .on("zoom", this.handleZoom);

      underlay.call(this.zoom);
    }
  }

  /**
   *
   */
  update() {
    const { padding } = this.props;
    this.g.attr("transform", `translate(${padding.left} ${padding.top})`);

    this.updateChart();
    this.updateAnnotation();
    this.updateAxes();
  }

  updateAnnotation() {
    const { data, labels, xFunc, yFunc } = this.props;
    let { xScale, yScale } = this.props;

    const labelData = data.filter(d => labels[d.country]);

    xScale = this.zoomTransform.rescaleX(xScale);
    yScale = this.zoomTransform.rescaleY(yScale);

    const xValue = d => xScale(xFunc(d));
    const yValue = d => yScale(yFunc(d));

    const binding = this.annotation
      .selectAll(".label")
      .data(labelData, d => d.country);

    const enter = binding
      .enter()
      .append("text")
      .classed("label", true);
    const merged = enter.merge(binding);

    merged
      .attr("x", xValue)
      .attr("y", d => yValue(d))
      .attr("dy", d => (labels[d.country].position === "below" ? 15 : 3))
      .attr("dx", d => (labels[d.country].position === "below" ? null : 8))
      .attr("text-anchor", d =>
        labels[d.country].position === "below" ? "middle" : "start"
      )
      .text(d => d.country);
  }

  /**
   *
   */
  updateChart() {
    const {
      data,
      selectedData,
      hoverData,
      xFunc,
      yFunc,
      colorValue,
      radius,
      exactMouse
    } = this.props;

    let { xScale, yScale } = this.props;

    xScale = this.zoomTransform.rescaleX(xScale);
    yScale = this.zoomTransform.rescaleY(yScale);

    const xValue = d => xScale(xFunc(d));
    const yValue = d => yScale(yFunc(d));

    const binding = this.chart
      .selectAll(".dot")
      .data(
        data.filter(datum => isfinite(xFunc(datum)) && isfinite(yFunc(datum))),
        datum => datum.key
      );

    const enter = binding
      .enter()
      .append("circle")
      .classed("dot", true);

    const merged = enter.merge(binding);

    merged
      .attr("cx", xValue)
      .attr("cy", yValue)
      .attr("r", radius)
      .attr("fill", colorValue);

    if (exactMouse) {
      merged
        .on("mouseover", this.handleMouseOverCircle)
        .on("mouseout", this.handleMouseOutCircle);
    } else {
      merged.style("pointer-events", "none");
    }

    merged
      .classed("highlight", false)
      .classed("dim", false)
      .classed("selected", false);

    if (hoverData && hoverData.values.length > 0) {
      const hoverFilter = d => hoverData.values.includes(d.key);

      merged
        .classed("highlight", false)
        .classed("dim", true)
        .filter(hoverFilter)
        .classed("highlight", true)
        .classed("dim", false)
        .attr("r", radius * 1.5)
        .raise()
        .filter(hoverFilter)
        .classed("selected", true)
        .raise();
    }

    if (selectedData && selectedData.values && selectedData.values.length > 0) {
      merged
        .filter(
          d =>
            d[selectedData.key] &&
            includesAny(d[selectedData.key], selectedData.values)
        )
        .classed("highlight", true)
        .classed("dim", false)
        .raise();
    }

    binding.exit().remove();
  }

  /**
   *
   */
  updateAxes() {
    const {
      xAxis,
      yAxis,
      xLabel,
      yLabel,
      plotHeight,
      plotWidth,
      padding
    } = this.props;

    let { xScale, yScale } = this.props;

    xScale = this.zoomTransform.rescaleX(xScale);
    yScale = this.zoomTransform.rescaleY(yScale);

    this.xAxis
      .attr("transform", `translate(${0}, ${plotHeight})`)
      .call(xAxis.scale(xScale));

    this.yAxis.call(yAxis.scale(yScale));

    this.yAxisLabel
      .attr(
        "transform",
        `rotate(270) translate(${-plotHeight / 2} ${-padding.left + 18})`
      )
      .text(yLabel);

    this.xAxisLabel
      .attr(
        "transform",
        `translate(${plotWidth / 2} ${plotHeight +
          padding.top +
          padding.bottom / 3})`
      )
      .text(xLabel);
  }

  /**
   *
   */
  render() {
    const { height, width } = this.props;

    // keeps plot from overlapping on small screens - as
    // elements are absolutely positioned within.
    const style = { height: height };

    return (
      <div className="ScatterPlot">
        <div className="chart-brush" style={style}>
          <svg
            className="chart"
            ref={node => {
              this.root = node;
            }}
            height={height}
            width={width}
          />
        </div>
      </div>
    );
  }
}

export default addComputedProps(chartProps)(ScatterPlot);
