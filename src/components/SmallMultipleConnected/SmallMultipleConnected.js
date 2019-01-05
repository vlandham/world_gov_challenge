import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addComputedProps from 'react-computed-props';
import { Row, Col } from 'reactstrap';
import * as d3 from 'd3';
import ConnectedScatterPlot from '../ConnectedScatterPlot/ConnectedScatterPlot';
import isfinite from 'lodash.isfinite';

import ColorLegend from '../ColorLegend/ColorLegend';
import { tableContent } from '../tooltip/tooltip';
import { formatNumber } from '../../utils/format';

import './SmallMultipleConnected.scss';
import AutoWidth from '../AutoWidth/AutoWidth';

import { METRICS, EXTENT, ANNOTATIONS } from '../../constants';

/**
 *
 * @param {*} data
 * @param {*} sortOrder
 * @param {*} xFunc
 * @param {*} yFunc
 * @param {*} zFunc
 */
function sortData(data, sortOrder, xFunc, yFunc, zFunc) {
  if (METRICS[sortOrder]) {
    const direction = sortOrder === 'gini' ? 'ascending' : 'descending';
    data = data.sort((x, y) =>
      d3[direction](x[METRICS[sortOrder].sortable], y[METRICS[sortOrder].sortable]),
    );
  } else if (sortOrder === 'region') {
    data = data.sort((x, y) => d3.ascending(x.region, y.region));
  } else {
    data = data.sort((x, y) => d3.ascending(x.key, y.key));
  }

  return data;
}

/**
 *
 * @param {*} data
 * @param {*} threshold
 * @param {*} xFunc
 * @param {*} yFunc
 */
function filterData(data, threshold, xFunc, yFunc) {
  return data.filter(country => {
    country.valuesFilter = country.values.filter(year => {
      return isfinite(xFunc(year)) && isfinite(yFunc(year));
    });

    return country.valuesFilter.length > threshold;
  });
}

/**
 *
 * @param {*} props
 */
function chartProps(props) {
  const { xMetric, yMetric, scale, sortOrder } = props;
  let { dataGrouped } = props;

  const zMetric = 'year';
  const xLabel = METRICS[xMetric].label;
  const yLabel = METRICS[yMetric].label;
  const zLabel = METRICS[zMetric].label;

  const xFunc = d => d[METRICS[xMetric][scale]];
  const yFunc = d => d[METRICS[yMetric][scale]];
  const zFunc = d => d[METRICS[zMetric].display];

  dataGrouped = filterData(dataGrouped, 3, xFunc, yFunc);

  dataGrouped = sortData(dataGrouped, sortOrder, xFunc, yFunc, zFunc);

  // var colorScale = d3
  //   .scaleSequential(d3.interpolatePlasma)
  //   .domain([2020, 1995]);

  const tooltipTextFunc = d => {
    const tooltipData = {
      [xLabel]: d[METRICS[xMetric].display],
      [yLabel]: d[METRICS[yMetric].display],
      Population: d.population,
    };
    return tableContent(tooltipData, {
      title: `${d.year}`,
      valueFormat: formatNumber,
    });
  };

  return {
    dataGrouped,
    xLabel,
    yLabel,
    zLabel,
    xFunc,
    yFunc,
    zFunc,
    tooltipTextFunc,
  };
}

/**
 *
 */
class SmallMultipleConnected extends Component {
  static propTypes = {
    dataGrouped: PropTypes.array,
    scale: PropTypes.string,
    sortOrder: PropTypes.string,
    colorScale: PropTypes.func,
  };

  static defaultProps = {
    dataGrouped: [],
    xMetric: 'hdi',
    yMetric: 'gni',
    scale: 'global',
    colorScale: d => '#333',
  };

  renderChart(chartData, chartIndex) {
    const {
      xFunc,
      yFunc,
      zFunc,
      xLabel,
      yLabel,
      zLabel,
      tooltipTextFunc,
      xMetric,
      yMetric,
      scale,
      colorScale,
      dataGrouped,
    } = this.props;

    const annotationKey = `${chartData.key}:${yMetric}:${xMetric}:${scale}`;
    const annotations = ANNOTATIONS[annotationKey];
    return (
      <Col sm={12} md={6} lg={4} key={chartData.key}>
        <AutoWidth>
          <ConnectedScatterPlot
            key={chartData.key}
            name={chartData.key}
            data={chartData.valuesFilter}
            xFunc={xFunc}
            yFunc={yFunc}
            zFunc={zFunc}
            xLabel={xLabel}
            yLabel={yLabel}
            zLabel={zLabel}
            xExtent={EXTENT}
            yExtent={EXTENT}
            tooltipTextFunc={tooltipTextFunc}
            colorScale={colorScale}
            xMetric={xMetric}
            yMetric={yMetric}
            scale={scale}
            dataBackground={dataGrouped}
            annotations={annotations}
          />
        </AutoWidth>
      </Col>
    );
  }

  renderRegion(chartData, index) {
    const { sortOrder, dataGrouped } = this.props;
    const region = chartData.region;
    if (sortOrder === 'region') {
      if (index === 0) {
        return (
          <Col sm={12} key={region}>
            <h3 className="region">{region}</h3>
          </Col>
        );
      } else {
        const preRegion = dataGrouped[index - 1].region;
        if (region !== preRegion) {
          return (
            <Col key={region} sm={12}>
              <h3 className="region">{region}</h3>
            </Col>
          );
        }
      }
    }
    return null;
  }

  /**
   *
   */
  renderLegend() {
    const { colorScale } = this.props;
    return <ColorLegend colorScale={colorScale} domain={[2001, 2017]} />;
  }

  /**
   *
   */
  render() {
    const { dataGrouped } = this.props;
    return (
      <div className="SmallMultipleConnected">
        <Row>
          <Col sm={6}>
            <span className="align-middle">
              Data from 2000 to 2017 for {dataGrouped.length} countries.
            </span>
          </Col>
          <Col sm={6}>{this.renderLegend()}</Col>
        </Row>
        <Row>{dataGrouped.map((d, i) => [this.renderRegion(d, i), this.renderChart(d, i)])}</Row>
      </div>
    );
  }
}

export default addComputedProps(chartProps)(SmallMultipleConnected);
