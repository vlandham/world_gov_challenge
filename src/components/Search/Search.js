import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

import './Search.scss';

class Search extends Component {
  static defaultProps = {
    data: [],
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(selected) {
    this.props.onChange(selected);
  }

  /**
   *
   */
  render() {
    const { data, selected } = this.props;
    return (
      <div className="Search">
        <Typeahead
          bsSize="large"
          labelKey="key"
          options={data}
          selected={selected}
          clearButton={true}
          multiple={true}
          minLength={2}
          onChange={this.handleChange}
          placeholder="Filter countries..."
        />
      </div>
    );
  }
}

export default Search;
