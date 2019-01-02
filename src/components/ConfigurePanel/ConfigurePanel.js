import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import { CONFIGS } from "../../constants";

import "./ConfigurePanel.scss";

class ConfigurePanel extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.click = this.click.bind(this);

    this.state = {
      dataDisplay: {
        dropdownOpen: false,
        selectIndex: 0,
        selectedId: CONFIGS.dataDisplay.options[0].id
      },
      sortOrder: {
        dropdownOpen: false,
        selectIndex: 0,
        selectedId: CONFIGS.sortOrder.options[0].id
      },
      scale: {
        dropdownOpen: false,
        selectIndex: 0,
        selectedId: CONFIGS.scale.options[0].id
      }
    };
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
      <DropdownItem
        key={d.id}
        onClick={this.click.bind(this, dropdownId, d, index)}
      >
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
    return (
      <div className="ConfigurePanel">
        Showing {this.renderDropdown("dataDisplay")} sorted{" "}
        {this.renderDropdown("sortOrder")} using a{" "}
        {this.renderDropdown("scale")} scale.
      </div>
    );
  }
}
export default ConfigurePanel;
