import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class MultiSelect extends Component {
  constructor(props) {
    super(props);

    const {
      selectedOptions,
      wrapperClasses,
      itemClasses,
      labelClasses,
      options
    } = props;

    this.state = {
      selectedOptions,
      wrapperClassName: classnames('list-group', wrapperClasses),
      itemClassName: classnames('list-group-item', itemClasses),
      labelClassName: classnames('form-control-label', labelClasses),
      options: options.map((item) => {
        item.active = selectedOptions.includes(item.value);
        return item;
      })
    };

    this.updateControlFunc = this.updateControlFunc.bind(this);
  }

  render() {
    const {
      wrapperClassName
    } = this.state;

    return (
      <div className="form-group">
        <label>{ this.generateTitle() }</label>
        <ul className={wrapperClassName}>
          { this.generateItems() }
        </ul>
      </div>
    );
  }

  generateItems() {
    var self = this;
    const {
      options,
      itemClassName
    } = this.state;

    return options.map(function (item) {

      let classes = classnames(
        itemClassName,
        { active: item.active }
      );

      return(
        <li
          className={classes}
          key={item.value}
          value={item.value}
          onClick={self.updateControlFunc.bind(null, item)}
        >
          { item.label }
          { self.activeIcon(item.active) }
        </li>
      );
    });
  }

  generateTitle() {
    const {
      title,
      titleMessage,
      titleSeparator
    } = this.props;

    if (titleMessage) {
      if (typeof(titleMessage) === 'string') {
        return title + titleSeparator + titleMessage;
      }

      return (
        <span>
          {title} {titleMessage}
        </span>
      );
    }

    return title;
  }

  updateControlFunc(item) {
    const {
      name,
      controlFunc
    } = this.props;

    const {
      selectedOptions
    } = this.state;

    let rtn = {};

    if (item.active) {
      rtn[name] = selectedOptions.filter((opt) => {
        item.active = false;
        return opt !== item.value;
      });
    } else {
      item.active = true;
      rtn[name] = selectedOptions.concat(item.value);
    }

    controlFunc(rtn);
    this.setState({selectedOptions: rtn[name]});
  }

  activeIcon(active) {
    const {
      activeIcon
    } = this.props;

    if (active) {
      if (typeof activeIcon === 'object' && activeIcon.$$typeof) {
        return (activeIcon);
      }

      return (
        <i className={classnames(activeIcon)} />
      );
    }
  }
}

MultiSelect.propTypes = {
  options: PropTypes.array.isRequired,
  selectedOptions: PropTypes.array,
  controlFunc: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  titleSeparator: PropTypes.string,
  titleMessage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  wrapperClasses: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object
  ]),
  itemClasses: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object
  ]),
  labelClasses: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string
  ]),
  activeIcon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object,
    PropTypes.node
  ])
};

MultiSelect.defaultProps = {
  activeIcon: (<i className={classnames('fa', 'fa-check', 'pull-right')} />),
  selectedOptions: [],
  options: [],
  titleSeparator: ': '
};

export default MultiSelect;
