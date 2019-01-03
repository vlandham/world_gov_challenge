import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import addComputedProps from "react-computed-props";
import * as d3 from "d3";
import isfinite from "lodash.isfinite";
import { floatingTooltip } from "../tooltip/tooltip";

import "./ConnectedScatterPlot.scss";

/**
 *
 * @param {*} props
 */
function chartProps(props) {
  const { data, xFunc, yFunc, zFunc, colorScale, height, width, scale } = props;

  let { xExtent, yExtent } = props;

  const padding = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40
  };

  // scaling for retina displays
  let sizeScale = 1.0;
  if (window.devicePixelRatio) {
    sizeScale = window.devicePixelRatio;
  }

  const radius = scale === "local" ? 5 : 2;
  const lineWidth = scale === "local" ? 3 : 1;

  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const dataFiltered = data.filter(
    datum => isfinite(xFunc(datum)) && isfinite(yFunc(datum))
  );

  xExtent = xExtent || d3.extent(data, xFunc);
  const xScale = d3
    .scaleLinear()
    .domain(xExtent)
    .range([0, plotWidth]);

  yExtent = yExtent || d3.extent(data, yFunc);
  const yScale = d3
    .scaleLinear()
    .domain(yExtent)
    .range([plotHeight, 0]);

  const xValue = d => xScale(xFunc(d));
  const yValue = d => yScale(yFunc(d));

  const line = d3
    .line()
    .x(xValue)
    .y(yValue)
    .curve(d3.curveCardinal.tension(0.3));

  const lineCanvas = d3
    .line()
    .x(xValue)
    .y(yValue)
    .curve(d3.curveCardinal.tension(0.3));

  let colorValue = d => "#ddd";
  if (colorScale) {
    colorValue = d => colorScale(zFunc(d));
  }

  let voronoiDiagram = null;

  if (data && data.length > 0) {
    const pixelJitter = () => Math.random() - 0.5;
    voronoiDiagram = d3
      .voronoi()
      .x(d => xValue(d) + pixelJitter())
      .y(d => yValue(d) + pixelJitter())
      .size([plotWidth, plotHeight])(dataFiltered);
  }

  const mouseRadius = plotWidth / 3;

  const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);

  return {
    dataFiltered,
    line,
    lineCanvas,
    padding,
    plotHeight,
    plotWidth,
    xScale,
    yScale,
    xValue,
    yValue,
    colorValue,
    radius,
    lineWidth,
    voronoiDiagram,
    mouseRadius,
    xAxis,
    yAxis,
    sizeScale
  };
}

/**
 *
 */
class ConnectedScatterPlot extends PureComponent {
  static propTypes = {
    data: PropTypes.array,
    name: PropTypes.string,
    radius: PropTypes.number,
    scale: PropTypes.string,
    xFunc: PropTypes.func,
    yFunc: PropTypes.func,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string,
    xExtent: PropTypes.array,
    yExtent: PropTypes.array,
    width: PropTypes.number,
    height: PropTypes.number,
    tooltipTextFunc: PropTypes.func
  };

  static defaultProps = {
    data: [],
    radius: 4,
    height: 300,
    width: 300,
    name: "",
    xFunc: d => d.x,
    yFunc: d => d.x,
    xLabel: "",
    yLabel: "",
    tooltipTextFunc: d => "",
    colorScale: () => "#ddd"
  };

  /**
   *
   */
  constructor(props) {
    super(props);

    this.handleMouseover = this.handleMouseover.bind(this);
    this.handleMouseout = this.handleMouseout.bind(this);
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
  handleMouseover(el) {
    const { voronoiDiagram, mouseRadius } = this.props;

    let mousePos = d3.mouse(el);
    mousePos = this.zoomTransform.invert(mousePos);
    const site = voronoiDiagram.find(mousePos[0], mousePos[1], mouseRadius);
    this.highlightCircle(site && site.data);
  }

  /**
   *
   */
  handleMouseout(el) {
    this.highlightCircle(null);
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
    } else {
      this.highlight
        .style("display", "")
        .style("stroke", colorScale(d[colorBy]))
        .attr("cx", xScale(xFunc(d)))
        .attr("cy", yScale(yFunc(d)));
      if (tooltipTextFunc) {
        this.tooltip.showTooltip(tooltipTextFunc(d), d3.event);
      }
    }

    if (onHover) {
      onHover(d);
    }
  }

  /**
   *
   */
  setup() {
    const { plotWidth, plotHeight, radius } = this.props;

    this.zoomTransform = d3.zoomIdentity;

    const cRoot = d3.select(this.root);

    this.g = cRoot.append("g");

    const that = this;
    this.underlay = this.g
      .append("rect")
      .classed("underlay", true)
      .attr("width", plotWidth)
      .attr("height", plotHeight)
      .style("fill", "white")
      .style("opacity", 0.001)
      .on("mousemove", function(d) {
        that.handleMouseover(this, d);
      })
      .on("mouseleave", function() {
        that.handleMouseout();
      });
    this.chart = this.g.append("g").classed("chart-group", true);
    this.tooltip = floatingTooltip("_tooltip", { xOffset: 5, yOffset: 20 });

    this.highlight = this.g
      .append("circle")
      .attr("class", "highlight-circle")
      .attr("r", radius + 2)
      .style("fill", "none")
      .style("pointer-events", "none")
      .style("display", "none");

    this.xAxis = this.g
      .append("g")
      .classed("x-axis", true)
      .style("pointer-events", "none");

    this.xAxis.append("line").classed("bar", true);
    this.xAxis.append("text").classed("low", true);
    this.xAxis.append("text").classed("high", true);

    this.yAxis = this.g
      .append("g")
      .classed("y-axis", true)
      .style("pointer-events", "none");

    this.yAxis.append("line").classed("bar", true);
    this.yAxis.append("text").classed("low", true);
    this.yAxis.append("text").classed("high", true);

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
  update() {
    const { padding } = this.props;
    this.g.attr("transform", `translate(${padding.left} ${padding.top})`);

    this.updateChart();
    this.updateAxes();
    this.updateCanvas();
  }

  /**
   *
   */
  updateLine() {
    const { dataFiltered, line, lineWidth } = this.props;
    const lineBinding = this.chart.selectAll(".line").data([dataFiltered]);

    const lineEnter = lineBinding
      .enter()
      .append("path")
      .classed("line", true);

    const lineMerged = lineEnter.merge(lineBinding);
    lineMerged
      .attr("fill", "none")
      .attr("stroke", "#888")
      // .attr("stroke", "url(#svgGradient)")
      .attr("stroke-width", lineWidth)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("pointer-events", "none")
      .attr("d", line);

    lineBinding.exit().remove();
  }

  /**
   *
   */
  updateChart() {
    const { dataFiltered, xValue, yValue, colorValue, radius } = this.props;

    this.updateLine();

    const binding = this.chart
      .selectAll(".dot")
      .data(dataFiltered, datum => datum.key);

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
    merged.style("pointer-events", "none");

    binding.exit().remove();
  }

  updateAxes() {
    const {
      xMetric,
      yMetric,
      xLabel,
      yLabel,
      plotHeight,
      plotWidth,
      padding
    } = this.props;

    this.xAxis.attr("transform", `translate(${0}, ${plotHeight})`);
    this.xAxis.attr("font-size", 10).attr("fill", "none");
    this.yAxis.attr("font-size", 10).attr("fill", "none");

    const xLowText = xMetric === "gini" ? "more equal" : "low";
    const xHighText = xMetric === "gini" ? "less equal" : "high";

    const yLowText = yMetric === "gini" ? "more equal" : "low";
    const yHighText = yMetric === "gini" ? "less equal" : "high";

    this.xAxis
      .select(".bar")
      .attr("x1", 0)
      .attr("x2", plotWidth)
      .attr("y1", 0)
      .attr("y2", 0)
      .style("stroke-width", 1)
      .style("stroke", "black")
      .style("fill", "none");

    this.xAxis
      .select(".low")
      .attr("y", 9)
      .attr("fill", "#333")
      .attr("dy", "0.6em")
      .text(xLowText);

    this.xAxis
      .select(".high")
      .attr("y", 9)
      .attr("x", plotWidth)
      .attr("text-anchor", "end")
      .attr("fill", "#333")
      .attr("dy", "0.6em")
      .text(xHighText);

    this.yAxis
      .select(".bar")
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", plotHeight)
      .style("stroke-width", 1)
      .style("stroke", "black")
      .style("fill", "none");

    this.yAxis
      .select(".low")
      .attr("y", 9)
      .attr("fill", "#333")
      .attr("dy", "0.6em")
      .attr(
        "transform",
        `rotate(270) translate(${-plotHeight} ${-padding.left + 18})`
      )
      .text(yLowText);

    this.yAxis
      .select(".high")
      .attr("y", 9)
      .attr("x", 0)
      .attr("text-anchor", "end")
      .attr("fill", "#333")
      .attr("dy", "0.6em")
      .attr("transform", `rotate(270) translate(${0} ${-padding.left + 18})`)
      .text(yHighText);

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
   * Rerenders the chart on the canvas. Recomputes data sorting and scales.
   */
  updateCanvas() {
    const {
      dataBackground,
      sizeScale,
      width,
      height,
      padding,
      lineWidth,
      scale,
      lineCanvas
    } = this.props;

    const color = d3.color("#ccc");
    color.opacity = scale === "global" ? 0.7 : 0.15;

    // get context
    const ctx = this.canvas.getContext("2d");

    lineCanvas.context(ctx);

    // Reset transform to ensure scale setting is appropriate.
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(sizeScale, sizeScale);
    // draw main bars
    ctx.clearRect(0, 0, width, height);
    // have some padding
    ctx.translate(padding.left, padding.top);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color.toString();
    dataBackground.forEach((country, index) => {
      ctx.beginPath();
      lineCanvas(country.valuesFilter);
      ctx.stroke();
    });
  }

  /**
   *
   */
  updateAxesExact() {
    const {
      xAxis,
      yAxis,
      xLabel,
      yLabel,
      plotHeight,
      plotWidth,
      padding,
      xScale,
      yScale
    } = this.props;

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
    const { name, height, width, sizeScale } = this.props;

    let canvasStyle = {
      width: width,
      height: height
    };

    return (
      <div className="ConnectedScatterPlot">
        <h4 className="title">{name}</h4>
        <div className="chart-container">
          <canvas
            className="chart-canvas"
            ref={node => {
              this.canvas = node;
            }}
            style={canvasStyle}
            width={width * sizeScale}
            height={height * sizeScale}
          />
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

export default addComputedProps(chartProps, {
  changeInclude: [
    "data",
    "dataBackground",
    "scale",
    "sortOrder",
    "width",
    "height",
    "xMetric",
    "yMetric"
  ]
})(ConnectedScatterPlot);
