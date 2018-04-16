import React from 'react';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import {CONSTANTS} from '../constants';

const styles = {
  presetsList: {
    flex: 1
  }
};

const PresetsList = (props) => (<div style={styles.presetsList}>
  {CONSTANTS.PRESETS.map((predefinedPreset) => (<div
    key={predefinedPreset.name}
    onClick={() => {
      props.onPresetClick(predefinedPreset.preset);
    }}
  >
    {`${predefinedPreset.name} ${isEqual(predefinedPreset.preset, props.currentPreset) ? '*' : ''}`}
  </div>))}
</div>);

PresetsList.propTypes = {
  onPresetClick: PropTypes.func.isRequired, // eslint-disable-line
  currentPreset: PropTypes.object
};

PresetsList.defaultProps = {
  currentPreset: null
};

export default PresetsList;
