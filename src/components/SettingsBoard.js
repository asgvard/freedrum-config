import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CONSTANTS} from '../constants';

const BLINK_TIMEOUT = 200;

class SettingsBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preset: null,
      loading: false,
      unsavedChanges: false,
      loadError: null,

      blinkNote: null
    };

    this.blinkTimeout = null;

    this.onSensorMessage = this.onSensorMessage.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sensor && this.props.sensor !== newProps.sensor) {
      if (newProps.sensor.addOnMessageListener) {
        newProps.sensor.addOnMessageListener(this.onSensorMessage);
      }

      this.setState({
        loading: true,
        preset: null,
        unsavedChanges: false,
        loadError: null
      }, () => {
        this.loadSettings();
      });
    }

    if (this.props.sensor && this.props.sensor !== newProps.sensor) {
      if (this.props.sensor.removeOnMessageListener) {
        this.props.sensor.removeOnMessageListener(this.onSensorMessage);
      }
    }
  }

  onSensorMessage(channel, command) {
    if (channel === CONSTANTS.MIDI_MESSAGE_CHANNEL_NOTE_SET) {
      this.blinkNote(command);
    }
  }

  blinkNote(note) {
    if (this.blinkTimeout) {
      clearTimeout(this.blinkTimeout);
    }

    this.setState({
      blinkNote: note
    }, () => {
      setTimeout(() => {
        this.setState({
          blinkNote: null
        });
      }, BLINK_TIMEOUT);
    });
  }

  async loadSettings() {
    const stateUpdates = {
      unsavedChanges: false,
      loading: false
    };

    try {
      const preset = await this.props.sensor.readPresetAsync();

      this.setState({
        ...stateUpdates,
        preset,
        loadError: null
      });
    } catch (error) {
      this.setState({
        ...stateUpdates,
        preset: null,
        loadError: error.toString ? error.toString() : error
      });
    }
  }

  render() {
    if (!this.props.sensor) {
      return null;
    }

    return (<div>
      <div>{this.props.sensor.id}</div>
      {this.state.loading && <div>{'loading preset...'}</div>}
      {this.state.loadError !== null && <div>{`loading failed ${this.state.loadError}`}</div>}
      {!this.state.loading && !this.state.loadError && this.state.preset !== null && <div>
        {`Sensitivity: ${this.state.preset.sensitivity}`}
        {`Threshold: ${this.state.preset.threshold}`}
        {`Reference Drum Strength: ${this.state.preset.refDrumStrength}`}
        {`Reference Drum Window: ${this.state.preset.refDrumWindow}`}
        {this.state.preset.zones.map((zone) => (<div key={zone.id}>
          {`${zone.midiNote} - ${zone.midiTwistNote} ${this.state.blinkNote === zone.midiNote ? 'PAM!' : ''}`}
        </div>))}
      </div>}
    </div>);
  }
}

SettingsBoard.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    readPresetAsync: PropTypes.func.isRequired,
    addOnMessageListener: PropTypes.func.isRequired,
    removeOnMessageListener: PropTypes.func.isRequired
  })
};

SettingsBoard.defaultProps = {
  sensor: null
};

export default SettingsBoard;
