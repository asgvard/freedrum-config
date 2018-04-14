import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {isUndefined, isEqual} from 'lodash';
import {CONSTANTS} from '../constants';
import NumberPicker from './NumberPicker';

const styles = {
  settingsBoard: {
    flex: 2
  },
  zonesWrapper: {
    display: 'flex',
    flexDirection: 'row'
  },
  zoneWrapper: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    borderStyle: 'solid'
  },
  zoneWrapperHighlighted: {
    backgroundColor: 'green'
  },
  midiNoteWrapper: {
    marginRight: 10
  }
};

const BLINK_TIMEOUT = 200;

class SettingsBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /* To compare with original preset to indicate if there are any unsaved changes */
      originalPreset: null,
      updatedPreset: null,
      loading: false,
      loadError: null,

      blinkNote: null,

      saving: false
    };

    this.blinkTimeout = null;

    this.onSensorMessage = this.onSensorMessage.bind(this);
    this.onUpdateValue = this.onUpdateValue.bind(this);
    this.onSavePreset = this.onSavePreset.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sensor && this.props.sensor !== newProps.sensor) {
      if (newProps.sensor.addOnMessageListener) {
        newProps.sensor.addOnMessageListener(this.onSensorMessage);
      }

      this.setState({
        loading: true,
        originalPreset: null,
        updatedPreset: null,
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

  onUpdateValue(settingKey, value, zoneNumber) {
    if (isUndefined(zoneNumber)) {
      this.setState({
        updatedPreset: {
          ...this.state.updatedPreset,
          [settingKey]: value
        }
      });
    } else {
      const newZones = [...this.state.updatedPreset.zones];

      newZones[zoneNumber][settingKey] = value;

      this.setState({
        updatedPreset: {
          ...this.state.updatedPreset,
          zones: newZones
        }
      });
    }
  }

  onSavePreset() {
    if (isEqual(this.state.originalPreset, this.state.updatedPreset) || this.state.saving) {
      return;
    }

    this.setState({
      saving: true
    }, () => {
      this.props.sensor.savePreset(this.state.updatedPreset);

      setTimeout(() => {
        this.setState({
          saving: false,
          originalPreset: JSON.parse(JSON.stringify(this.state.updatedPreset))
        });
      }, CONSTANTS.MIDI_WRITE_INTERVAL * 50);
    });
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
    try {
      const preset = await this.props.sensor.readPresetAsync();

      this.setState({
        loading: false,
        loadError: null,
        originalPreset: JSON.parse(JSON.stringify(preset)),
        updatedPreset: JSON.parse(JSON.stringify(preset))
      });
    } catch (error) {
      this.setState({
        loading: false,
        originalPreset: null,
        updatedPreset: null,
        loadError: error.toString ? error.toString() : error
      });
    }
  }

  renderZone(zoneIndex) {
    const zone = this.state.originalPreset.zones[zoneIndex];

    const blinkedStyle = this.state.blinkNote === zone.midiNote ? styles.zoneWrapperHighlighted : {};

    return (<div
      key={zone.id}
      style={{
        ...styles.zoneWrapper,
        ...blinkedStyle
      }}
    >
      <div style={styles.midiNoteWrapper}>
        <NumberPicker
          value={this.state.updatedPreset.zones[zoneIndex].midiNote}
          onValueChange={(value) => {
            this.onUpdateValue('midiNote', value, zoneIndex);
          }}
        />
      </div>
      <div style={styles.midiNoteWrapper}>
        <NumberPicker
          value={this.state.updatedPreset.zones[zoneIndex].midiTwistNote}
          onValueChange={(value) => {
            this.onUpdateValue('midiTwistNote', value, zoneIndex);
          }}
        />
      </div>
    </div>);
  }

  render() {
    if (!this.props.sensor) {
      return (<div style={styles.settingsBoard} />);
    }

    return (<div style={styles.settingsBoard}>
      <div>{this.props.sensor.id}</div>
      {this.state.loading && <div>{'loading preset...'}</div>}
      {this.state.loadError !== null && <div>{`loading failed ${this.state.loadError}`}</div>}
      {!this.state.loading && !this.state.loadError && this.state.originalPreset !== null && <div>
        <div>
          {'Sensitivity: '}
          <NumberPicker
            value={this.state.updatedPreset.sensitivity}
            onValueChange={(value) => {
              this.onUpdateValue('sensitivity', value);
            }}
          />
        </div>
        <div>
          {'Threshold: '}
          <NumberPicker
            value={this.state.updatedPreset.threshold}
            onValueChange={(value) => {
              this.onUpdateValue('threshold', value);
            }}
          />
        </div>
        <div>
          {'Reference Drum Strength: '}
          <NumberPicker
            value={this.state.updatedPreset.refDrumStrength}
            onValueChange={(value) => {
              this.onUpdateValue('refDrumStrength', value);
            }}
          />
        </div>
        <div>
          {'Reference Drum Window: '}
          <NumberPicker
            value={this.state.updatedPreset.refDrumWindow}
            onValueChange={(value) => {
              this.onUpdateValue('refDrumWindow', value);
            }}
          />
        </div>
        <div style={styles.zonesWrapper}>
          <div>
            {this.renderZone(6)}
            {this.renderZone(8)}
          </div>
          <div>
            {this.renderZone(3)}
            {this.renderZone(0)}
          </div>
          <div>
            {this.renderZone(4)}
            {this.renderZone(1)}
          </div>
          <div>
            {this.renderZone(5)}
            {this.renderZone(2)}
          </div>
          <div>
            {this.renderZone(7)}
            {this.renderZone(9)}
          </div>
        </div>
        <div onClick={this.onSavePreset}>{'Save'}</div>
        <div>{this.state.saving ? ' - Saving...' : ''}</div>
      </div>}
    </div>);
  }
}

SettingsBoard.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    readPresetAsync: PropTypes.func.isRequired,
    savePreset: PropTypes.func.isRequired,
    addOnMessageListener: PropTypes.func.isRequired,
    removeOnMessageListener: PropTypes.func.isRequired
  })
};

SettingsBoard.defaultProps = {
  sensor: null
};

export default SettingsBoard;
