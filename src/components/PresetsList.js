import React from 'react';
import PropTypes from 'prop-types';
import {isEqual} from 'lodash';
import {CONSTANTS} from '../constants';
import theme from '../theme';

const styles = {
  presetsList: {
    flex: 1,
    backgroundColor: theme.background
  },
  presetWrapper: {
    flex: 1,
    height: 120,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderBottomColor: theme.secondary,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid'
  },
  activePreset: {
    height: '100%',
    width: '10%',
    backgroundColor: theme.accent
  },
  presetName: {
    height: 18,
    width: '90%',
    textAlign: 'center',
    color: theme.font,
    fontSize: 18,
    textDecoration: 'none',
    userSelect: 'none'
  }
};

const PresetsList = (props) => (<div style={styles.presetsList}>
  {CONSTANTS.PRESETS.map((predefinedPreset) => (<div
    key={predefinedPreset.name}
    onClick={() => {
      props.onPresetClick(predefinedPreset.preset);
    }}
    style={styles.presetWrapper}
  >
    {isEqual(predefinedPreset.preset, props.currentPreset) && <div style={styles.activePreset} />}
    <div style={styles.presetName}>{predefinedPreset.name}</div>
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
