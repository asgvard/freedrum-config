import React, {Component} from 'react';
import PropTypes from 'prop-types';

class SettingsBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      preset: null,
      loading: false,
      unsavedChanges: false,
      loadError: null
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.sensor && this.props.sensor !== newProps.sensor) {
      this.setState({
        loading: true,
        preset: null,
        unsavedChanges: false,
        loadError: null
      }, () => {
        this.loadSettings();
      });
    }
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
        {this.state.preset.zones.map((zone) => (<div key={zone.id}>
          {`${zone.midiNote} - ${zone.midiTwistNote}`}
        </div>))}
      </div>}
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
