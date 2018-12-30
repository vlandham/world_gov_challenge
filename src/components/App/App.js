import React, { Component } from "react";
import * as d3 from "d3";
import { Container, Row, Col } from "reactstrap";

import AutoWidth from "../AutoWidth/AutoWidth";
import ScatterPlot from "../ScatterPlot/ScatterPlot";
import { tableContent } from "../tooltip/tooltip";
import { formatNumber } from "../../utils/format";

import "./App.scss";

function getData() {
  const changesPath = `${process.env.PUBLIC_URL}/data/gov_data_year.csv`;
  return d3.csv(changesPath);
}

const STRING_COLUMNS = ["country", "iso3c", "iso2c"];
const NULL_STRING = "NA";

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

    const xLabel = "GNI per capita";
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
                What makes a good government? Some would say this is a good
                question.
              </p>
              <p>
                What makes a good government? Some would say this is a good
                question.
              </p>
            </Col>
          </Row>
          <Row>
            <Col md={5}>{this.renderScatterGNIvsKDI()}</Col>
            <Col md={5}>{this.renderScatterGNIvsEfree()}</Col>
          </Row>
          <Row>
            <Col sm={2} />
            <Col sm={9}>
              <div className="blank" />
              <p>But that is not the whole story.</p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
