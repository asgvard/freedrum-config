import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CONSTANTS} from '../constants';

const BLINK_TIMEOUT = 200;

class Sensor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blink: false
    };

    this.blinkTimeout = null;

    this.onMessage = this.onMessage.bind(this);

    if (props.sensor && props.sensor.addOnMessageListener) {
      props.sensor.addOnMessageListener(this.onMessage);
    }
  }

  componentWillUnmount() {
    const {props: {sensor}} = this;

    if (sensor && sensor.removeOnMessageListener) {
      sensor.removeOnMessageListener(this.onMessage);
    }
  }

  onMessage(channel) {
    if (channel === CONSTANTS.MIDI_MESSAGE_CHANNEL_NOTE_SET) {
      this.blink();
    }
  }

  blink() {
    if (this.blinkTimeout) {
      clearTimeout(this.blinkTimeout);
    }

    this.setState({
      blink: true
    }, () => {
      setTimeout(() => {
        this.setState({
          blink: false
        });
      }, BLINK_TIMEOUT);
    });
  }

  render() {
    if (!this.props.sensor) {
      return null;
    }

    return (<div onClick={this.props.onPress}>
      {`${this.props.sensor.name} ${this.props.active ? '*' : ''} - ${this.state.blink ? 'PAM!' : ''}`}
    </div>);
  }
}

Sensor.propTypes = {
  sensor: PropTypes.shape({
    name: PropTypes.string.isRequired,
    addOnMessageListener: PropTypes.func.isRequired,
    removeOnMessageListener: PropTypes.func.isRequired
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired
};

export default Sensor;
