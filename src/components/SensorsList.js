import React from 'react';
import PropTypes from 'prop-types';
import Sensor from './Sensor';

const styles = {
  sensorsList: {
    flex: 1,
    display: 'flex'
  }
};

const SensorsList = (props) => (<div style={styles.sensorsList}>
  {props.sensors.map((sensor) => {
    return (<Sensor
      key={sensor.id}
      sensor={sensor}
      onPress={() => {
        props.onSensorPress(sensor.id);
      }}
      active={sensor.id === props.activeSensorId}
    />);
  })}
</div>);

SensorsList.propTypes = {
  sensors: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired
  })).isRequired,
  activeSensorId: PropTypes.string,
  onSensorPress: PropTypes.func.isRequired // eslint-disable-line
};

SensorsList.defaultProps = {
  activeSensorId: null
};

export default SensorsList;
