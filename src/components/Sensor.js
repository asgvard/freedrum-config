import React, {Component} from 'react';
import PropTypes from 'prop-types';
import theme from '../theme';
import {CONSTANTS} from '../constants';
import imageSrc from '../resources/images/sensor.jpg';
import imageActiveSrc from '../resources/images/sensor-active.jpg';

const styles = {
  sensor: {
    height: 120,
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 10,
    paddingRight: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderBottomColor: theme.secondary,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  },
  sensorImage: {
    height: '100%',
    width: '90%',
    objectFit: 'contain'
  },
  blink: {
    height: '100%',
    width: '10%',
    backgroundColor: theme.accent
  }
};

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

    return (<div
      style={styles.sensor}
      onClick={this.props.onPress}
    >
      <img
        src={this.props.active ? imageActiveSrc : imageSrc}
        alt={''}
        style={styles.sensorImage}
      />
      {this.state.blink === true && <div style={styles.blink} />}
    </div>);
  }
}

Sensor.propTypes = {
  sensor: PropTypes.shape({
    addOnMessageListener: PropTypes.func.isRequired,
    removeOnMessageListener: PropTypes.func.isRequired
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired
};

export default Sensor;
