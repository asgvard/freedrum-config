import React, {Component} from 'react';
import PropTypes from 'prop-types';

const MIN_VALUE = 0;
const MAX_VALUE = 127;

const styles = {
  numberPicker: {
    display: 'flex',
    flexDirection: 'row'
  }
};

class NumberPicker extends Component {
  render() {
    return (<div style={styles.numberPicker}>
      <div
        onClick={() => {
          this.props.onValueChange(Math.max(MIN_VALUE, this.props.value - 1));
        }}
      >{'<'}</div>
      <div>{this.props.value}</div>
      <div
        onClick={() => {
          this.props.onValueChange(Math.min(MAX_VALUE, this.props.value + 1));
        }}
      >{'>'}</div>
    </div>);
  }
}

NumberPicker.propTypes = {
  value: PropTypes.number.isRequired,
  onValueChange: PropTypes.func.isRequired
};

export default NumberPicker;
