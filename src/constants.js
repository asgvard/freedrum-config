export const CONSTANTS = {
  MIDI_CONNECTION_STATE_CONNECTED: 'connected',
  MIDI_CONNECTION_STATE_DISCONNECTED: 'disconnected',
  MIDI_CONNECTION_TYPE_INPUT: 'input',
  MIDI_CONNECTION_TYPE_OUTPUT: 'output',
  MIDI_STATUS_CONTROL_CHANGE: 0xB0,
  MIDI_WRITE_INTERVAL: 100,

  /**
   * Send CC 22 to read the value:
   * Channel = zone if applicable
   * Command = 22
   * Value = value of CC to be read
   */
  MIDI_CC_READ_VALUE: 22,

  /**
   * Global sensor commands
   */

  /* suggested values are between 10 and 30 */
  MIDI_CC_SENSITIVITY: 105,
  MIDI_CC_THRESHOLD: 104,

  /* default value 12 */
  MIDI_CC_REF_DRUM_STRENGTH: 111,

  /* default value 40 */
  MIDI_CC_REF_DRUM_WINDOW: 110,

  /**
   * Per zone settings
   * Send Channel number as a Zone
   *
   * Zones positions:
   * 6 | 3 | 4 | 5 | 7
   * 8 | 0 | 1 | 2 | 9
   */
  MIDI_CC_NOTE: 106,
  MIDI_CC_TWIST_NOTE: 112,

  /**
   * Vertical angle of the pad. 0deg - low row, 50deg high row
   * Value is from 0 to 126, scaled to 0 - 360 degrees
   * E.g. 126 = 360deg
   */
  MIDI_CC_Y_POS: 23,

  /**
   * Horizontal position of the zone
   * Angle represents a central point of the zone
   */
  MIDI_CC_Z_POS: 103,

  /* Set these values > 0 to make sensor stream current values as CC 107 messages */
  MIDI_CC_X_POS_STREAM: 107,
  MIDI_CC_Y_POS_STREAM: 108,
  MIDI_CC_Z_POS_STREAM: 109,

  MIDI_CONFIG_COMMAND_CC: 20,
  MIDI_CONFIG_COMMAND_FACTORY_RESET: 1,
  MIDI_CONFIG_COMMAND_SAVE: 0,

  MIDI_MESSAGE_DATA_LENGTH: 3,

  PAD_ANGLE_SCALE: 360.0 / 127,

  PRESET_LOAD_TIMEOUT: 10000,

  MIDI_MESSAGE_CHANNEL_NOTE_SET: 41,
  MIDI_MESSAGE_CHANNEL_NOTE_RELEASE: 57
};
