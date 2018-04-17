import React, {Component} from 'react';
import PropTypes from 'prop-types';
import theme from '../theme';

const MIN_VALUE = 0;
const MAX_VALUE = 127;

const styles = {
  numberPicker: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    width: 40,
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: theme.secondary
  },
  arrow: {
    color: theme.font,
    textAlign: 'center'
  },
  valueText: {
    color: theme.font
  }
};

class NumberPicker extends Component {
  render() {
    return (<div style={styles.numberPicker}>
      <div
        onClick={() => {
          this.props.onValueChange(Math.max(MIN_VALUE, this.props.value - 1));
        }}
        style={styles.arrow}
      >{'<'}</div>
      <div style={styles.valueText}>{this.props.value}</div>
      <div
        onClick={() => {
          this.props.onValueChange(Math.min(MAX_VALUE, this.props.value + 1));
        }}
        style={styles.arrow}
      >{'>'}</div>
    </div>);
  }
}

NumberPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired
};

export default NumberPicker;
