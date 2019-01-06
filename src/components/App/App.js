import React, { Component } from 'react';
import * as d3 from 'd3';
import { Container, Row, Col } from 'reactstrap';

import AutoWidth from '../AutoWidth/AutoWidth';
import ScatterPlot from '../ScatterPlot/ScatterPlot';
import { tableContent } from '../tooltip/tooltip';
import { formatNumber, roundNumber } from '../../utils/format';
import { METRICS, SCATTER_LABELS } from '../../constants';
import SmallMultipleConnected from '../SmallMultipleConnected/SmallMultipleConnected';
import ConfigurePanel from '../ConfigurePanel/ConfigurePanel';
import ColorLegend from '../ColorLegend/ColorLegend';
import BigGraph from '../BigGraph/BigGraph';

import './App.scss';

/**
 *
 */
function getData() {
  const changesPath = `${process.env.PUBLIC_URL}/data/gov_data_year.csv`;
  return d3.csv(changesPath);
}

const STRING_COLUMNS = ['country', 'iso3c', 'iso2c', 'region', 'sub-region'];
const ROUND_COLUMNS = {
  gdp_per_cap: { decimals: 0 },
};
const NULL_STRING = 'NA';

/**
 *
 */
function normalizeMinMax(data, attr, normAttr) {
  const minData = d3.min(data, d => d[attr]);
  const maxData = d3.max(data, d => d[attr]);
  data.forEach(datum => {
    datum[normAttr] = datum[attr] ? (datum[attr] - minData) / (maxData - minData) : NaN;
  });

  return data;
}

const EXCLUDE = ['Kuwait', 'Turkmenistan', 'Eritrea', 'Oman', 'Armenia', 'Albania'];

/**
 *
 * @param {*} data
 */
function processData(data) {
  data.forEach(datum => {
    Object.keys(datum).forEach(key => {
      if (!STRING_COLUMNS.includes(key)) {
        datum[key] = datum[key] === NULL_STRING ? null : +datum[key];
      }
      if (ROUND_COLUMNS[key]) {
        datum[key] = datum[key] ? roundNumber(datum[key], ROUND_COLUMNS[key].decimals) : null;
      }
    });

    datum.key = `${datum.country}:${datum.year}`;
  });

  // FILTER LOW POPULATION
  const MIN_POP = 3000000;
  data = data.filter(d => d.population > MIN_POP && !EXCLUDE.includes(d.country));

  normalizeMinMax(data, 'hdi', 'hdi_norm');
  normalizeMinMax(data, 'gni_per_cap', 'gni_norm');
  normalizeMinMax(data, 'efree', 'efree_norm');
  normalizeMinMax(data, 'gdp_per_cap', 'gdp_norm');
  normalizeMinMax(data, 'gini', 'gini_norm');

  // nest by country to get normalized by country
  const dataByCountry = d3
    .nest()
    .key(d => d.country)
    .entries(data);

  dataByCountry.forEach(country => {
    normalizeMinMax(country.values, 'gdp_per_cap', 'gdp_norm_local');
    normalizeMinMax(country.values, 'gni_per_cap', 'gni_norm_local');
    normalizeMinMax(country.values, 'hdi', 'hdi_norm_local');
    normalizeMinMax(country.values, 'efree', 'efree_norm_local');
    normalizeMinMax(country.values, 'gini', 'gini_norm_local');
  });

  return data;
}

/**
 *
 * @param {*} data
 */
function groupData(data) {
  let dataGrouped = d3
    .nest()
    .key(d => d.country)
    .entries(data);

  return dataGrouped;
}

/**
 *
 * @param {*} data
 */
function processGroupedData(data) {
  data.forEach(country => {
    country.region = country.values[0].region || 'Other';
    country[METRICS['gdp'].sortable] = d3.max(country.values, d => d[METRICS['gdp']['display']]);
    country[METRICS['hdi'].sortable] = d3.max(country.values, d => d[METRICS['hdi']['display']]);
    country[METRICS['efree'].sortable] = d3.max(
      country.values,
      d => d[METRICS['efree']['display']],
    );
    country[METRICS['gini'].sortable] = d3.min(country.values, d => d[METRICS['gini']['display']]);
  });
  return data;
}

/**
 *
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      dataGrouped: [],
      focusYear: 2017,
      scatterHover: null,
      search: [],
      configs: {
        dataDisplay: 'hdi_gdp',
        sortOrder: 'hdi',
        scale: 'local',
      },
      colorScale: d3.scaleSequential(d3.interpolateOranges).domain([1990, 2020]),
    };

    this.handleScatterHover = this.handleScatterHover.bind(this);
    this.handleConfigClick = this.handleConfigClick.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  /**
   *
   * @param {*} hoverData
   */
  handleScatterHover(hoverData) {
    const { scatterHover } = this.state;

    if (hoverData) {
      if (!scatterHover || !scatterHover.values.includes(hoverData.key)) {
        this.setState({ scatterHover: { values: [hoverData.key] } });
      }
    } else {
      this.setState({ scatterHover: null });
    }
  }

  handleConfigClick(configId, valueId) {
    const { configs } = this.state;
    configs[configId] = valueId;
    this.setState({ configs });
  }

  handleSearchChange(search) {
    this.setState({ search });
  }

  /**
   *
   */
  componentDidMount() {
    getData()
      .then(processData)
      .then(data => {
        let dataGrouped = groupData(data);
        dataGrouped = processGroupedData(dataGrouped);
        this.setState({ data, dataGrouped });
      });
  }

  /**
   *
   */
  renderScatterGNIvsKDI() {
    const { data, focusYear, scatterHover } = this.state;
    const displayData = data.filter(d => d.year === focusYear);
    const yFunc = d => d.hdi;
    const xFunc = d => d.gdp_per_cap;

    const xLabel = 'GDP per Capita';
    const yLabel = 'Human Development Index';

    const tooltipTextFunc = d => {
      const tooltipData = { [xLabel]: xFunc(d), [yLabel]: yFunc(d) };
      return tableContent(tooltipData, {
        title: d.country,
        valueFormat: formatNumber,
      });
    };

    return (
      <AutoWidth>
        <ScatterPlot
          data={displayData}
          xFunc={xFunc}
          yFunc={yFunc}
          xLabel={xLabel}
          yLabel={yLabel}
          hoverData={scatterHover}
          tooltipTextFunc={tooltipTextFunc}
          onHover={this.handleScatterHover}
          labels={SCATTER_LABELS.hdi}
        />
      </AutoWidth>
    );
  }

  /**
   *
   */
  renderScatterGNIvsEfree() {
    const { data, focusYear, scatterHover } = this.state;
    const displayData = data.filter(d => d.year === focusYear);
    const xFunc = d => d.gdp_per_cap;
    const yFunc = d => d.efree;

    const xLabel = 'GDP per Capita';
    const yLabel = 'Economic Freedom Score';

    const tooltipTextFunc = d => {
      const tooltipData = { [xLabel]: xFunc(d), [yLabel]: yFunc(d) };
      return tableContent(tooltipData, {
        title: d.country,
        valueFormat: formatNumber,
      });
    };

    return (
      <AutoWidth>
        <ScatterPlot
          data={displayData}
          xFunc={xFunc}
          yFunc={yFunc}
          xLabel={xLabel}
          yLabel={yLabel}
          hoverData={scatterHover}
          tooltipTextFunc={tooltipTextFunc}
          onHover={this.handleScatterHover}
          labels={SCATTER_LABELS.efree}
        />
      </AutoWidth>
    );
  }

  /**
   *
   */
  renderBigGraph() {
    const { data, dataGrouped, configs, colorScale } = this.state;
    const [yMetric, xMetric] = configs.dataDisplay.split('_');

    return (
      <BigGraph
        data={data}
        dataGrouped={dataGrouped}
        colorScale={colorScale}
        xMetric={xMetric}
        yMetric={yMetric}
      />
    );
  }

  /**
   *
   */
  renderSmallMult() {
    const { dataGrouped, configs, colorScale, search } = this.state;

    const [yMetric, xMetric] = configs.dataDisplay.split('_');

    return (
      <SmallMultipleConnected
        dataGrouped={dataGrouped}
        xMetric={xMetric}
        yMetric={yMetric}
        scale={configs.scale}
        sortOrder={configs.sortOrder}
        colorScale={colorScale}
        search={search}
        onSearchChange={this.handleSearchChange}
      />
    );
  }

  /**
   *
   */
  renderConfigPanel(size = null) {
    const { configs } = this.state;
    return (
      <div className={`config-${size}`}>
        <ConfigurePanel configs={configs} size={size} onClick={this.handleConfigClick} />
      </div>
    );
  }

  /**
   *
   */
  renderLegend() {
    const { colorScale } = this.state;
    return <ColorLegend colorScale={colorScale} domain={[2001, 2017]} />;
  }

  /**
   *
   */
  render() {
    return (
      <div className="App">
        <Container>
          <Row>
            <Col>
              <div className="top-bar">
                <a
                  className="align-middle float-right"
                  href="http://vallandingham.me/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  vallandingham.me
                </a>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <h1>Good Governments Help People Succeed</h1>
              <h5 className="author">by Jim Vallandingham</h5>
            </Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="blank" />
              <p>What makes a “good” government?</p>
              <p>
                When answering this question, it is easy to fall back on a commonly used measurement
                like the <strong>Gross Domestic Product (GDP)</strong> that showcases a government’s
                power and progress. The GDP measures the value of goods and services produced in a
                period of time. It ranks countries, and their governments, by output, with more
                output being associated with a “better” government.
              </p>

              <p>
                Economic progress is a tempting answer for what makes a government successful but
                metrics like the GDP <strong>fail</strong> to explain what makes a government good
                or bad for the <strong>individuals</strong> living under that government. A high GDP
                doesn’t necessarily mean a high quality of life.
              </p>

              <blockquote cite="Thomas Jefferson">
                The care of human life and happiness, and not their destruction, is the first and
                only object of good government.
              </blockquote>

              <p>
                We, as governed people, need to take a more nuanced look at the quality of
                government, through the lense of social well-being and enablement of individual
                progress.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="blank" />
              <h2>New Metrics to Understand Progress</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="line" />
              <p>
                From a data perspective, many organizations and researchers have developed a variety
                of metrics that can be used to better understand a government’s individual impact.
                We will focus on three of these measurements.
              </p>
              <p>
                The <strong>Human Development Index (HDI)</strong> combines statistics on life
                expectancy, education, and income per capita to rank countries into tiers of
                development. This index provides a measure of how good a government is at enabling
                individuals to do the things they want to do, and be the people they want to be.
              </p>
              <p>
                The <strong>Economic Freedom Score</strong>, calculated by the Heritage Foundation,
                tracks how well a government enables an individual the freedom to work, produce,
                consume, and invest in any way they please.
              </p>
              <p>
                The <strong>Gini Index</strong> is a measure of inequality in the distribution of
                individual or family income. A <strong>lower</strong> value indicates a more equal
                distribution of wealth.
              </p>
              <p>
                The good news is that these individual well-being metrics are correlated with
                economic performance metrics like GDP.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={6}>{this.renderScatterGNIvsKDI()}</Col>
            <Col md={6}>{this.renderScatterGNIvsEfree()}</Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="blank" />
              <p>
                Governments <strong>can</strong> achieve success in being good for both the
                individuals being governed, and good in the amount of wealth produced.
              </p>
              <div className="blank" />
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Progress Over Time</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="line" />
              <p>
                This simple snapshot of government performance on these metrics is useful, but what
                is perhaps more interesting is a country’s progress over time, and how values for an
                individual country change year by year.
              </p>
              <p>
                The visualization below allows comparison and exploration of these metrics through{' '}
                <strong>connected scatterplots</strong> for each country.
              </p>
              <p>
                The graph uses the <strong>x</strong> and <strong>y</strong> dimensions to plot
                different metrics, with each <strong>year</strong> of data displayed as a dot,
                connected together by a line.
              </p>
              <p>
                Display options allow us to find connections between countries and patterns within a
                country, both at a <strong>global</strong> scale, and also at a{' '}
                <strong>country-level</strong> scale for seeing year-to-year changes up close.
                Individual country charts are <strong>annotated</strong> with explanations for the
                patterns displayed.
              </p>
              <p>
                After exploring the visualization{' '}
                <a
                  href="http://vallandingham.me/world_gov_challenge/analysis.nb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  check out the analysis behind it
                </a>
                .
              </p>
              <p>
                With this visualization, we can see the progress of the governments of the world
                toward or away from what is good for their peoples, as well as what is good for
                economic growth.
              </p>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div className="blank" />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>{this.renderConfigPanel('small')}</Col>
            <Col sm={6}>{this.renderLegend()}</Col>
          </Row>
          <Row>
            <Col sm={12}>{this.renderBigGraph()}</Col>
          </Row>
          <Row className="smallmult-section">
            <Col sm={12}>{this.renderConfigPanel()}</Col>
          </Row>

          <Row>
            <Col sm={12}>{this.renderSmallMult()}</Col>
          </Row>
          <Row>
            <div className="blank" />
          </Row>
          <Row>
            <Col sm={12} className="footer">
              <p>
                Jim Vallandingham |{' '}
                <a href="http://vallandingham.me" target="_blank" rel="noopener noreferrer">
                  vallandingham.me
                </a>{' '}
                |{' '}
                <a
                  href="http://vallandingham.me/world_gov_challenge/analysis.nb.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Analysis
                </a>{' '}
                | Developed for the{' '}
                <a
                  href="https://wdvp.worldgovernmentsummit.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  World Data Visualization Prize
                </a>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
