import React, {Component} from 'react';
import {findIndex, first, find} from 'lodash';
import {initMidi, addOnSensorAddedListener, addOnSensorRemovedListener} from './services/midi';
import SensorsList from './components/SensorsList';
import SettingsBoard from './components/SettingsBoard';
import PresetsList from './components/PresetsList';

const styles = {
  root: {
    flexDirection: 'row',
    display: 'flex'
  }
};

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sensors: [],
      activeSensorId: null
    };

    this.onSensorAdded = this.onSensorAdded.bind(this);
    this.onSensorRemoved = this.onSensorRemoved.bind(this);
    this.onSensorPress = this.onSensorPress.bind(this);
    this.onSettingsChanged = this.onSettingsChanged.bind(this);
    this.onPresetClick = this.onPresetClick.bind(this);
  }

  componentDidMount() {
    addOnSensorAddedListener(this.onSensorAdded);
    addOnSensorRemovedListener(this.onSensorRemoved);
    initMidi();
  }

  onSensorAdded(sensor) {
    const isFirstAdded = this.state.sensors.length === 0;

    this.setState({
      sensors: [...this.state.sensors, sensor],
      activeSensorId: isFirstAdded ? sensor.id : this.state.activeSensorId
    });
  }

  onSensorRemoved(sensor) {
    const sensorIndex = findIndex(this.state.sensors, (existingSensor) => existingSensor.id === sensor.id);
    const newSensors = [...this.state.sensors];

    newSensors.splice(sensorIndex, 1);

    let newActiveSensorId = null;

    if (newSensors.length > 0) {
      if (sensor.id === this.state.activeSensorId) {
        ({id: newActiveSensorId} = first(newSensors));
      } else {
        newActiveSensorId = this.state.activeSensorId;
      }
    }

    this.setState({
      sensors: newSensors,
      activeSensorId: newActiveSensorId
    });
  }

  onSensorPress(sensorId) {
    this.setState({
      activeSensorId: sensorId
    });
  }

  onSettingsChanged(updatedPreset) {
    this.setState({
      currentPreset: updatedPreset
    });
  }

  onPresetClick(preset) {
    this.setState({
      externalPreset: JSON.parse(JSON.stringify(preset))
    });
  }

  render() {
    const {state: {sensors, activeSensorId}} = this;

    return (
      <div style={styles.root}>
        <SensorsList
          sensors={sensors}
          activeSensorId={activeSensorId}
          onSensorPress={this.onSensorPress}
        />
        <SettingsBoard
          sensor={find(sensors, (sensor) => sensor.id === activeSensorId)}
          onSettingsChanged={this.onSettingsChanged}
          externalPreset={this.state.externalPreset}
        />
        <PresetsList
          onPresetClick={this.onPresetClick}
          currentPreset={this.state.currentPreset}
        />
      </div>
    );
  }
}

export default Root;
