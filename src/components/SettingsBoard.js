import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SettingsBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      settingsLoaded: false
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sensor && this.props.sensor !== newProps.sensor) {
      this.setState({
        settingsLoaded: false
      }, () => {
        this.loadSettings();
      });
    }
  }

  async loadSettings() {
    try {
      const preset = await this.props.sensor.readPresetAsync();

      console.log('preset is: ', preset);
    } catch (error) {
      console.log('MIDI read error: ', error);
    }
  }

  render() {
    if (!this.props.sensor) {
      return null;
    }

    return (<div>
      {this.props.sensor.id}
    </div>);
  }
}

SettingsBoard.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    readPresetAsync: PropTypes.func.isRequired
  })
};

SettingsBoard.defaultProps = {
  sensor: null
};

export default SettingsBoard;
