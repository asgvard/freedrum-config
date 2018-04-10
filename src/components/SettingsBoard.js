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
    if (this.props.sensor !== newProps.sensor) {
      this.setState({
        settingsLoaded: false
      }, () => {
        this.loadSettings();
      });
    }
  }

  loadSettings() {

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
  sensor: PropTypes.object
};

SettingsBoard.defaultProps = {
  sensor: null
};

export default SettingsBoard;
