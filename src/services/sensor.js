import {findIndex} from 'lodash';
import {CONSTANTS} from '../constants';

/* eslint-disable no-underscore-dangle */
export class Sensor {
  constructor() {
    this._id = null;
    this._name = null;
    this._input = null;
    this._output = null;
    this._inputId = null;
    this._outputId = null;

    this.pendingWrites = 0;

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
    value.onmidimessage = this.onMidiMessage;

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
        callback(channel, command, value);
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

    this.pendingWrites++;

    setTimeout(() => {
      const data = [CONSTANTS.MIDI_STATUS_CONTROL_CHANGE | channel, command, value];
      output.send(data);

      this.pendingWrites = Math.max(this.pendingWrites - 1, 0);
    }, CONSTANTS.MIDI_WRITE_INTERVAL * this.pendingWrites);
  }

  readValueAsync(channel, value) {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject('MIDI read timeout');
      }, CONSTANTS.MIDI_MESSAGE_READ_TIMEOUT + (CONSTANTS.MIDI_WRITE_INTERVAL * this.pendingWrites));

      const callback = (responseChannel, responseCommand, responseValue) => {
        if (value === responseCommand) {
          clearTimeout(timeout);
          this.removeOnMessageListener(callback);
          resolve(responseValue);
        }
      };

      this.addOnMessageListener(callback);
      this.writeCommand(channel, CONSTANTS.MIDI_CC_READ_VALUE, value);
    });
  }
}
