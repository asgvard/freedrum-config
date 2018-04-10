import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Sensor extends Component {
  render() {
    return (<div onClick={this.props.onPress}>
      {`${this.props.name} ${this.props.active ? '*' : ''}`}
    </div>);
  }
}

Sensor.propTypes = {
  name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired
};

export default Sensor;
