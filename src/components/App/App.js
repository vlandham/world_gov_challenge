import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";

import "./App.scss";

class App extends Component {
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
                What makes a good government? Some would say this is a dumb
                question.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
