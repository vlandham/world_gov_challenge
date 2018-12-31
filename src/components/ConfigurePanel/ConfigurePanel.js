import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";

import "./ConfigurePanel.scss";

const DROPDOWNS = {
  dataDisplay: {
    options: [
      { label: "GNI vs HDI", id: "gni_hdi" },
      { label: "GNI vs Economic Freedom", id: "gni_efree" },
      { label: "HDI vs Economic Freedom", id: "hdi_efree" }
    ]
  },
  sortOrder: {
    options: [{ label: "Alphabetically", id: "alpha" }]
  },
  scale: {
    options: [
      { label: "Global", id: "global" },
      { label: "Country-level", id: "local" }
    ]
  }
};

class ConfigurePanel extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dataDisplay: { dropdownOpen: false, selectIndex: 0 },
      sortOrder: { dropdownOpen: false, selectIndex: 0 },
      scale: { dropdownOpen: false, selectIndex: 0 }
    };
  }

  toggle(dropdownId) {
    this.setState(prevState => {
      const data = prevState[dropdownId];
      data.dropdownOpen = !data.dropdownOpen;
      return { [dropdownId]: data };
    });
  }

  renderDropdown(dropdownId) {
    const dropdownState = this.state[dropdownId];
    const data = DROPDOWNS[dropdownId];
    const items = data.options.map(d => (
      <DropdownItem key={d.id}>{d.label}</DropdownItem>
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
        Displaying {this.renderDropdown("dataDisplay")} sorted{" "}
        {this.renderDropdown("sortOrder")} using a{" "}
        {this.renderDropdown("scale")} scale.
      </div>
    );
  }
}
export default ConfigurePanel;
