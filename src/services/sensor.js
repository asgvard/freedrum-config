import {findIndex, isUndefined, isObject, isNumber, isFunction} from 'lodash';
import {CONSTANTS} from '../constants';

/**
 * Preset format example:
 * {
 *   sensivity: 10,
 *   threshold: 20,
 *   refDrumStrength: 12,
 *   refDrumWindow: 40,
 *   zones: [{
 *     midiNote: 42,
 *     midiTwistNote: 46,
 *     yAngle: 0,
 *     zAngle: -50
 *   }]
 * }
 */

const ANGLES = {
  0: [0, -50],
  1: [0, 0],
  2: [0, 50],
  3: [50, -50],
  4: [50, 0],
  5: [50, 50],
  6: [50, -90],
  7: [50, 90],
  8: [0, -90],
  9: [0, 90]
};

/* eslint-disable no-underscore-dangle */
export class Sensor {
  static getAnglesByZone(zoneIndex) {
    return ANGLES[zoneIndex];
  }

  static midiAngleToDecimalAngle(midiAngle) {
    const decimalAngle = Math.round(midiAngle * CONSTANTS.PAD_ANGLE_SCALE);

    if (decimalAngle > 180) {
      return decimalAngle - 360;
    }

    return decimalAngle;
  }

  static decimalAngleToMidiAngle(decimalAngle) {
    const midiAngle = Math.round(decimalAngle / CONSTANTS.PAD_ANGLE_SCALE);

    if (midiAngle < 0) {
      return midiAngle + 127;
    }

    return midiAngle;
  }

  constructor() {
    this._id = null;
    this._name = null;
    this._input = null;
    this._output = null;
    this._inputId = null;
    this._outputId = null;

    this.pendingWrites = 0;

    this.readPresetPromiseReject = null;

    this.onMessageListeners = [];
    this.onMidiMessage = this.onMidiMessage.bind(this);
  }

  get id() {
    return this._id;
  }

  set id(value) {
    this._id = value;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get input() {
    return this._input;
  }

  set input(value) {
    if (isObject(value) && !isUndefined(value.onmidimessage)) {
      value.onmidimessage = this.onMidiMessage;
    }

    this._input = value;
  }

  get output() {
    return this._output;
  }

  set output(value) {
    this._output = value;
  }

  get inputId() {
    return this._inputId;
  }

  set inputId(value) {
    this._inputId = value;
  }

  get outputId() {
    return this._outputId;
  }

  set outputId(value) {
    this._outputId = value;
  }

  onMidiMessage(event) {
    const {data} = event;

    if (data.length === CONSTANTS.MIDI_MESSAGE_DATA_LENGTH) {
      const [channel, command, value] = data;

      this.onMessageListeners.forEach((callback) => {
        callback(channel ^ CONSTANTS.MIDI_STATUS_CONTROL_CHANGE, command, value);
      });
    }
  }

  addOnMessageListener(callback) {
    this.onMessageListeners.push(callback);
  }

  removeOnMessageListener(callback) {
    const callbackIndex = findIndex(this.onMessageListeners, (listener) => listener === callback);

    this.onMessageListeners.splice(callbackIndex, 1);
  }

  writeCommand(channel, command, value) {
    const {output} = this;

    if (!output) {
      return;
    }

    this.pendingWrites++;

    setTimeout(() => {
      const data = [CONSTANTS.MIDI_STATUS_CONTROL_CHANGE | channel, command, value];
      output.send(data);

      this.pendingWrites = Math.max(this.pendingWrites - 1, 0);
    }, CONSTANTS.MIDI_WRITE_INTERVAL * this.pendingWrites);
  }

  readValueAsync(channel, value) {
    return new Promise((resolve) => {
      const callback = (responseChannel, responseCommand, responseValue) => {
        if (value === responseCommand && responseChannel === channel) {
          this.removeOnMessageListener(callback);
          resolve(responseValue);
        }
      };

      this.addOnMessageListener(callback);
      this.writeCommand(channel, CONSTANTS.MIDI_CC_READ_VALUE, value);
    });
  }

  cancelPresetLoad() {
    if (isFunction(this.readPresetPromiseReject)) {
      this.readPresetPromiseReject(CONSTANTS.PRESET_LOADING_CANCELLED_MESSAGE);
    }
  }

  readPresetAsync() {
    return new Promise((resolve, reject) => {
      this.readPresetPromiseReject = reject;

      const timeout = setTimeout(() => {
        reject('Preset load timeout');
      }, CONSTANTS.PRESET_LOAD_TIMEOUT);

      const sensorValuesPromise = Promise.all([
        this.readValueAsync(0, CONSTANTS.MIDI_CC_SENSITIVITY),
        this.readValueAsync(0, CONSTANTS.MIDI_CC_THRESHOLD),
        this.readValueAsync(0, CONSTANTS.MIDI_CC_REF_DRUM_STRENGTH),
        this.readValueAsync(0, CONSTANTS.MIDI_CC_REF_DRUM_WINDOW)
      ]);

      const zonesValuesPromises = [];

      for (let i = 0; i < 10; i++) {
        zonesValuesPromises.push(Promise.all([
          this.readValueAsync(i, CONSTANTS.MIDI_CC_NOTE),
          this.readValueAsync(i, CONSTANTS.MIDI_CC_TWIST_NOTE),
          this.readValueAsync(i, CONSTANTS.MIDI_CC_Y_POS),
          this.readValueAsync(i, CONSTANTS.MIDI_CC_Z_POS),
        ]));
      }

      Promise.all([sensorValuesPromise, Promise.all(zonesValuesPromises)]).then(([sensorValues, zonesValues]) => {
        const [sensitivity, threshold, refDrumStrength, refDrumWindow] = sensorValues;

        const preset = {
          sensitivity,
          threshold,
          refDrumStrength,
          refDrumWindow,
          zones: []
        };

        zonesValues.forEach((zoneValues, index) => {
          const [midiNote, midiTwistNote, yAngle, zAngle] = zoneValues;

          preset.zones.push({
            id: index,
            midiNote,
            midiTwistNote,
            yAngle: Sensor.midiAngleToDecimalAngle(yAngle),
            zAngle: Sensor.midiAngleToDecimalAngle(zAngle)
          });
        });

        clearTimeout(timeout);

        resolve(preset);

        this.readPresetPromiseReject = null;
      }).catch(reject);
    });
  }

  savePreset(preset) {
    isNumber(preset.sensitivity) && this.writeCommand(0, CONSTANTS.MIDI_CC_SENSITIVITY, preset.sensitivity);
    isNumber(preset.sensitivity) && this.writeCommand(0, CONSTANTS.MIDI_CC_THRESHOLD, preset.threshold);
    isNumber(preset.sensitivity) && this.writeCommand(0, CONSTANTS.MIDI_CC_REF_DRUM_STRENGTH, preset.refDrumStrength);
    isNumber(preset.sensitivity) && this.writeCommand(0, CONSTANTS.MIDI_CC_REF_DRUM_WINDOW, preset.refDrumWindow);

    const {zones} = preset;

    for (let i = 0; i < 10; i++) {
      const zone = zones[i];

      if (zone) {
        isNumber(zone.midiNote) && this.writeCommand(i, CONSTANTS.MIDI_CC_NOTE, zone.midiNote);

        const twistNote = zone.midiNote > 0 && isNumber(zone.midiTwistNote) ? zone.midiTwistNote : 0;
        this.writeCommand(i, CONSTANTS.MIDI_CC_TWIST_NOTE, twistNote);

        if (zone.midiNote > 0) {
          const [yAngle, zAngle] = Sensor.getAnglesByZone(i);

          this.writeCommand(i, CONSTANTS.MIDI_CC_Y_POS, Sensor.decimalAngleToMidiAngle(yAngle));
          this.writeCommand(i, CONSTANTS.MIDI_CC_Z_POS, Sensor.decimalAngleToMidiAngle(zAngle));
        }
      } else {
        this.writeCommand(i, CONSTANTS.MIDI_CC_NOTE, 0);
        this.writeCommand(i, CONSTANTS.MIDI_CC_TWIST_NOTE, 0);
      }
    }

    this.writeCommand(0, CONSTANTS.MIDI_CONFIG_COMMAND_CC, CONSTANTS.MIDI_CONFIG_COMMAND_SAVE);
  }

  factoryReset() {
    this.writeCommand(0, CONSTANTS.MIDI_CONFIG_COMMAND_CC, CONSTANTS.MIDI_CONFIG_COMMAND_FACTORY_RESET);
  }
}
