/**
 * @copyright 2018 Zymergen
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

const propTypes = {
  children: PropTypes.object,

  /* The amount of delay between debounced calls (default: 100) */
  debounceTime: PropTypes.number,

  /* If set, the default width is set to this value and the child is
     rendered. If null, the child is not rendered until a width is provided */
  defaultRenderWidth: PropTypes.number,

  /* If true, the component checks on componentDidUpdate to see if it needs to resize */
  parentMayResize: PropTypes.bool,
};

const defaultProps = {
  parentMayResize: false,
  defaultRenderWidth: null,
  debounceTime: 100,
};

/**
 * Component for automatically setting a width prop to the DOM
 * node of the first child. Note that checking offsetWidth is a
 * somewhat expensive operation (forced reflow), so try and leave
 * `parentMayResize` false if you are having performance issues.
 *
 * Example usage:
 * <AutoWidth>
 *   <MyComponent />
 * </AutoWidth>
 *
 * MyComponent gets a `width` prop set.
 *
 */
class AutoWidth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      width: props.defaultRenderWidth,
    };

    if (props.debounceTime) {
      this.updateWidth = debounce(this.updateWidth.bind(this), props.debounceTime);
    } else {
      this.updateWidth = this.updateWidth.bind(this);
    }
  }

  componentDidMount() {
    this.updateWidth();
    window.addEventListener('resize', this.updateWidth);
  }

  componentDidUpdate() {
    const { parentMayResize } = this.props;

    // have to update width of the parent can cause a resize without a window resize
    // e.g. something collapses or expands.
    if (parentMayResize) {
      this.updateWidth();
    }
  }

  componentWillUnmount() {
    this.updateWidth.cancel();
    window.removeEventListener('resize', this.updateWidth);
  }

  getResizeDOMNode() {
    return ReactDOM.findDOMNode(this);
  }

  // Call set state to update the width so it starts an update of the child component
  updateWidth() {
    const { width } = this.state;
    const domWidth = this.getResizeDOMNode().offsetWidth;
    if (width !== domWidth) {
      this.setState({
        width: domWidth,
      });
    }
  }

  render() {
    const { width } = this.state;

    if (process.env.NODE_ENV !== 'production' && React.Children.count(this.props.children) > 1) {
      console.warn('AutoWidth only works with a single child element.');
    }

    const child = this.props.children;
    let childToRender;

    // if we have a child and a width is provided, render the child with the width as a prop
    if (child && width != null) {
      childToRender = React.cloneElement(child, { width: this.state.width });
    }

    // we rely on this div getting the full width from the browser's layout
    // and read its offsetWidth to set as the width to the child component.
    return <div className="auto-width">{childToRender}</div>;
  }
}

AutoWidth.propTypes = propTypes;
AutoWidth.defaultProps = defaultProps;

export default AutoWidth;
