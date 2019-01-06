import React, { Component } from 'react';
import PropTypes from 'prop-types';
import addComputedProps from 'react-computed-props';
import { Row, Col } from 'reactstrap';
import * as d3 from 'd3';
import ConnectedScatterPlot from '../ConnectedScatterPlot/ConnectedScatterPlot';
import isfinite from 'lodash.isfinite';

import { isMobile, MobileView } from 'react-device-detect';

import ColorLegend from '../ColorLegend/ColorLegend';
import { tableContent } from '../tooltip/tooltip';
import { formatNumber } from '../../utils/format';
import AutoWidth from '../AutoWidth/AutoWidth';
import Search from '../Search/Search';

import './SmallMultipleConnected.scss';

import { METRICS, EXTENT, ANNOTATIONS } from '../../constants';

/**
 *
 * @param {*} data
 * @param {*} sortOrder
 * @param {*} xFunc
 * @param {*} yFunc
 * @param {*} zFunc
 */
function sortData(data, sortOrder) {
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
  return data.filter((country, index) => {
    country.valuesFilter = country.values.filter(year => {
      return isfinite(xFunc(year)) && isfinite(yFunc(year));
    });

    const keep = country.valuesFilter.length > threshold;
    return keep;
  });
}

function filterSearch(data, search) {
  if (!search || search.length === 0) {
    return data;
  }
  const searchKeys = search.map(s => s.key);
  return data.filter(country => {
    return searchKeys.includes(country.key);
  });
}

/**
 *
 * @param {*} data
 * @param {*} sortOrder
 */
function limitData(data, sortOrder) {
  const regionCounts = d3.map();
  const filtered = data.filter((c, index) => {
    let keep = true;
    if (sortOrder === 'region') {
      const region = c.region;
      if (!regionCounts.has(region)) {
        regionCounts.set(region, 0);
      }

      const regionCount = regionCounts.get(region);

      regionCounts.set(region, regionCount + 1);
      keep = regionCount < 6;
    } else {
      keep = index < 20;
    }
    return keep;
  });

  return filtered;
}

/**
 *
 * @param {*} props
 */
function chartProps(props) {
  const { xMetric, yMetric, scale, sortOrder, search } = props;
  let { dataGrouped } = props;

  const zMetric = 'year';
  const xLabel = METRICS[xMetric].label;
  const yLabel = METRICS[yMetric].label;
  const zLabel = METRICS[zMetric].label;

  const xFunc = d => d[METRICS[xMetric][scale]];
  const yFunc = d => d[METRICS[yMetric][scale]];
  const zFunc = d => d[METRICS[zMetric].display];

  dataGrouped = filterData(dataGrouped, 3, xFunc, yFunc);
  const searchKeys = dataGrouped.map(d => ({ key: d.key }));
  dataGrouped = filterSearch(dataGrouped, search);

  dataGrouped = sortData(dataGrouped, sortOrder, xFunc, yFunc, zFunc);

  if (isMobile) {
    dataGrouped = limitData(dataGrouped, sortOrder);
  }

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
    searchKeys,
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

  /**
   *
   */
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

  /**
   *
   * @param {*} chartData
   * @param {*} index
   */
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

  renderSearch() {
    const { searchKeys, search, onSearchChange } = this.props;
    return <Search onChange={onSearchChange} data={searchKeys} selected={search} />;
  }

  /**
   *
   */
  render() {
    const { dataGrouped } = this.props;
    return (
      <div className="SmallMultipleConnected">
        <Row>
          <Col sm={12} lg={7} className="search-section">
            {this.renderSearch()}
            <span className="align-middle">
              Data from 2000 to 2017 for {dataGrouped.length} countries.
              <MobileView>Explore all countries on a desktop browser.</MobileView>
            </span>
          </Col>
          <Col sm={12} lg={5}>
            {this.renderLegend()}
          </Col>
        </Row>
        <Row className="regions">
          {dataGrouped.map((d, i) => [this.renderRegion(d, i), this.renderChart(d, i)])}
        </Row>
        <MobileView>Explore all countries on a desktop browser.</MobileView>
      </div>
    );
  }
}

export default addComputedProps(chartProps)(SmallMultipleConnected);
