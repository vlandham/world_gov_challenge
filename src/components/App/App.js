import React, { Component } from "react";
import * as d3 from "d3";
import { Container, Row, Col } from "reactstrap";

import AutoWidth from "../AutoWidth/AutoWidth";
import ScatterPlot from "../ScatterPlot/ScatterPlot";
import { tableContent } from "../tooltip/tooltip";
import { formatNumber } from "../../utils/format";
import SmallMultipleConnected from "../SmallMultipleConnected/SmallMultipleConnected";

import "./App.scss";
import ConfigurePanel from "../ConfigurePanel/ConfigurePanel";

function getData() {
  const changesPath = `${process.env.PUBLIC_URL}/data/gov_data_year.csv`;
  return d3.csv(changesPath);
}

const STRING_COLUMNS = ["country", "iso3c", "iso2c"];
const NULL_STRING = "NA";

function normalizeMinMax(data, attr, normAttr) {
  const minData = d3.min(data, d => d[attr]);
  const maxData = d3.max(data, d => d[attr]);
  data.forEach(datum => {
    datum[normAttr] = (datum[attr] - minData) / (maxData - minData);
  });

  return data;
}

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
    });

    datum.key = `${datum.country}:${datum.year}`;
  });

  normalizeMinMax(data, "hdi", "hdi_norm");
  normalizeMinMax(data, "gni_per_cap", "gni_norm");
  normalizeMinMax(data, "efree", "efree_norm");

  // nest by country to get normalized by country
  const dataByCountry = d3
    .nest()
    .key(d => d.country)
    .entries(data);

  dataByCountry.forEach(country => {
    normalizeMinMax(country.values, "hdi", "hdi_norm_local");
    normalizeMinMax(country.values, "gni_per_cap", "gni_norm_local");
    normalizeMinMax(country.values, "efree", "efree_norm_local");
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
      focusYear: 2017,
      scatterHover: null
    };

    this.handleScatterHover = this.handleScatterHover.bind(this);
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

  /**
   *
   */
  componentDidMount() {
    getData()
      .then(processData)
      .then(data => {
        console.log(data);
        this.setState({ data });
      });
  }

  /**
   *
   */
  renderScatterGNIvsKDI() {
    const { data, focusYear, scatterHover } = this.state;
    const displayData = data.filter(d => d.year === focusYear);
    const xFunc = d => d.gni_per_cap;
    const yFunc = d => d.hdi;

    const xLabel = "GNI per Capita";
    const yLabel = "Human Development Index";

    const tooltipTextFunc = d => {
      const tooltipData = { [xLabel]: xFunc(d), [yLabel]: yFunc(d) };
      return tableContent(tooltipData, {
        title: d.country,
        valueFormat: formatNumber
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
    const xFunc = d => d.gni_per_cap;
    const yFunc = d => d.efree;

    const xLabel = "GNI per capita";
    const yLabel = "Economic Freedom Score";

    const tooltipTextFunc = d => {
      const tooltipData = { [xLabel]: xFunc(d), [yLabel]: yFunc(d) };
      return tableContent(tooltipData, {
        title: d.country,
        valueFormat: formatNumber
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
        />
      </AutoWidth>
    );
  }

  renderSmallMult() {
    const { data } = this.state;

    return <SmallMultipleConnected data={data} />;
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
              <p className="small-blue-title">Visualization</p>
              <h1>Good Government</h1>
            </Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="line" />
              <p>
                What makes a good government? Often when we think of successful
                governments, we focus on the output of its people and its
                mightiness when compared to its peers. But perhaps a more
                important measure of a good government is its ability to provide
                comfort and success to the individuals it governs.
              </p>
              <blockquote cite="Thomas Jefferson">
                The care of human life and happiness, and not their destruction,
                is the first and only object of good government.
              </blockquote>
              <p>Something Something Something.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Quality of Life is Connected to Progress</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="line" />
              <p>But we don't have to have it only one way.</p>
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
              <p>But that is not the whole story.</p>
            </Col>
          </Row>
          <Row>
            <Col>
              <h2>Progress of Countries</h2>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <div className="line" />
              <ConfigurePanel />
            </Col>
          </Row>
          <Row>
            <Col sm={12}>{this.renderSmallMult()}</Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
