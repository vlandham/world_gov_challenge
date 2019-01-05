import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

import { CONFIGS } from '../../constants';

import './ConfigurePanel.scss';

function indexOf(key, objs) {
  const keys = objs.map(o => o.id);
  return keys.indexOf(key);
}

class ConfigurePanel extends Component {
  constructor(props) {
    super(props);

    const { configs } = props;

    this.toggle = this.toggle.bind(this);
    this.click = this.click.bind(this);

    const dataDisplayIndex = indexOf(configs.dataDisplay, CONFIGS.dataDisplay.options);

    this.state = {
      dataDisplay: {
        dropdownOpen: false,
        selectIndex: dataDisplayIndex,
        selectedId: CONFIGS.dataDisplay.options[dataDisplayIndex].id,
      },
      sortOrder: {
        dropdownOpen: false,
        selectIndex: 0,
        selectedId: CONFIGS.sortOrder.options[0].id,
      },
      scale: {
        dropdownOpen: false,
        selectIndex: 0,
        selectedId: CONFIGS.scale.options[0].id,
      },
    };
  }

  /**
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    const { configs } = this.props;
    const { dataDisplay } = this.state;
    const dataDisplayIndex = indexOf(configs.dataDisplay, CONFIGS.dataDisplay.options);

    if (dataDisplayIndex !== dataDisplay.selectIndex) {
      dataDisplay.selectIndex = dataDisplayIndex;
      dataDisplay.selectedId = CONFIGS.dataDisplay.options[dataDisplayIndex].id;
      this.setState({ dataDisplay });
    }
  }

  toggle(dropdownId) {
    this.setState(prevState => {
      const data = prevState[dropdownId];
      data.dropdownOpen = !data.dropdownOpen;
      return { [dropdownId]: data };
    });
  }

  click(dropdownId, option, optionIndex) {
    const { onClick } = this.props;
    this.setState(prevState => {
      const data = prevState[dropdownId];
      data.selectIndex = optionIndex;
      data.selectedId = option.id;
      return { [dropdownId]: data };
    });

    if (onClick) {
      onClick(dropdownId, option.id);
    }
  }

  renderDropdown(dropdownId) {
    const dropdownState = this.state[dropdownId];
    const data = CONFIGS[dropdownId];
    const items = data.options.map((d, index) => (
      <DropdownItem key={d.id} onClick={this.click.bind(this, dropdownId, d, index)}>
        {d.label}
      </DropdownItem>
    ));

    const display = data.options[dropdownState.selectIndex];

    return (
      <Dropdown
        isOpen={this.state[dropdownId].dropdownOpen}
        toggle={this.toggle.bind(this, dropdownId)}
      >
        <DropdownToggle caret>{display.label}</DropdownToggle>
        <DropdownMenu>{items}</DropdownMenu>
      </Dropdown>
    );
  }

  render() {
    const { size } = this.props;
    if (size === 'small') {
      return <div className="ConfigurePanel">Showing {this.renderDropdown('dataDisplay')}</div>;
    }

    return (
      <div className="ConfigurePanel">
        Showing {this.renderDropdown('dataDisplay')} sorted {this.renderDropdown('sortOrder')} using
        a {this.renderDropdown('scale')} scale.
      </div>
    );
  }
}
export default ConfigurePanel;
