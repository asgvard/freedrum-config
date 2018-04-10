/**
 * Docs: https://developer.mozilla.org/en-US/docs/Web/API/MIDIAccess
 *
 * The only way to combine input and output into one sensor is by their order in inputs and outputs arrays
 * Connect and disconnect events are always coming in pairs
 * This is an assumption, and might be potentially wrong :)
 *
 * TODO: find more reliable way to know exactly that certain Input corresponds to the same sensor's Output
 */

import {findIndex, sortBy, reverse} from 'lodash';
import {CONSTANTS} from '../constants';
import {Sensor} from './sensor';

/**
 * input and output example:
 * {
 *   connection: "closed",
 *   id: "685305796", // unique ID
 *   manufacturer: "Manufacturer",
 *   name: "FD1 v7 Bluetooth",
 *   onstatechange: null,
 *   state: "disconnected", // or "connected"
 *   type: "output", // or "input"
 *   version: ""
 * }
 */
const availableInputs = [];
const availableOutputs = [];

/**
 * collection of Sensor instances
 * See /services/sensor.js
 */
const availableSensors = [];

const getSensors = () => availableSensors;

const onSensorAddedListeners = [];
const onSensorRemovedListeners = [];

const addOnSensorAddedListener = (callback) => {
  onSensorAddedListeners.push(callback);
};

const addOnSensorRemovedListener = (callback) => {
  onSensorRemovedListeners.push(callback);
};

const removeOnSensorAddedListener = (callback) => {
  const callbackIndex = findIndex(onSensorAddedListeners, (existingCallback) => existingCallback === callback);

  onSensorAddedListeners.splice(callbackIndex, 1);
};

const removeOnSensorRemovedListener = (callback) => {
  const callbackIndex = findIndex(onSensorRemovedListeners, (existingCallback) => existingCallback === callback);

  onSensorRemovedListeners.splice(callbackIndex, 1);
};

const cleanupSensors = () => {
  const toDeleteIndices = [];

  availableSensors.forEach((existingSensor, sensorIndex) => {
    let toDelete = true;

    availableInputs.forEach((existingInput, index) => {
      /**
       * Corresponding output
       */
      const existingOutput = availableOutputs[index];

      const inputId = existingInput.id;
      const outputId = existingOutput.id;

      if (existingSensor.inputId === inputId && existingSensor.outputId === outputId) {
        toDelete = false;
      }
    });

    if (toDelete) {
      toDeleteIndices.push(sensorIndex);
    }
  });

  const reversedIndicesToDelete = reverse(sortBy(toDeleteIndices));

  reversedIndicesToDelete.forEach((indexToDelete) => {
    const sensorToDelete = availableSensors[indexToDelete];

    availableSensors.splice(indexToDelete, 1);

    onSensorRemovedListeners.forEach((callback) => {
      callback(sensorToDelete);
    });
  });
};

const addSensorByIndex = (index) => {
  const newInput = availableInputs[index];
  const newOutput = availableOutputs[index];

  const newSensor = new Sensor();

  newSensor.id = `${newInput.id}:${newOutput.id}`;
  newSensor.inputId = newInput.id;
  newSensor.input = newInput;
  newSensor.outputId = newOutput.id;
  newSensor.output = newOutput;
  newSensor.name = newInput.name;

  availableSensors.push(newSensor);

  onSensorAddedListeners.forEach((callback) => {
    callback(newSensor);
  });
};

const findExisting = (port) => {
  const collection = port.type === CONSTANTS.MIDI_CONNECTION_TYPE_INPUT ? availableInputs : availableOutputs;

  return findIndex(collection, (existingPort) => existingPort.id === port.id);
};

const addPort = (port) => {
  const collection = port.type === CONSTANTS.MIDI_CONNECTION_TYPE_INPUT ? availableInputs : availableOutputs;
  const correspondingCollection = port.type === CONSTANTS.MIDI_CONNECTION_TYPE_INPUT ?
    availableOutputs : availableInputs;

  if (findExisting(port) > -1) {
    return;
  }

  collection.push(port);

  const addedAtIndex = collection.length - 1;

  /**
   * If there was existing item in corresponding collection, we can combine them into a sensor now
   */
  if (correspondingCollection[addedAtIndex]) {
    addSensorByIndex(addedAtIndex);
  }
};

const removePort = (port) => {
  const collection = port.type === CONSTANTS.MIDI_CONNECTION_TYPE_INPUT ? availableInputs : availableOutputs;
  const correspondingCollection = port.type === CONSTANTS.MIDI_CONNECTION_TYPE_INPUT ?
    availableOutputs : availableInputs;

  const existingIndex = findExisting(port);

  if (existingIndex === -1) {
    return;
  }

  collection.splice(existingIndex, 1);

  /**
   * If the collection lengths are equal now, means we have to remove corresponding sensor
   */
  if (collection.length === correspondingCollection.length) {
    cleanupSensors();
  }
};

const initMidi = () => {
  navigator.requestMIDIAccess().then((midi) => {
    const {inputs, outputs} = midi;

    inputs.forEach(input => {
      console.log('Init run, added input: ', input);

      addPort(input);
    });

    outputs.forEach(output => {
      console.log('Init run, added output: ', output);

      addPort(output);
    });

    midi.onstatechange = (event) => {
      const {port} = event;

      if (port.state === CONSTANTS.MIDI_CONNECTION_STATE_CONNECTED) {
        addPort(port);
      } else if (port.state === CONSTANTS.MIDI_CONNECTION_STATE_DISCONNECTED) {
        removePort(port);
      }
    };
  }, (error) => {
    console.log('Error when getting browser MIDI access: ', error.toString ? error.toString() : error);
  });
};

export {
  initMidi,
  addOnSensorAddedListener,
  addOnSensorRemovedListener,
  removeOnSensorAddedListener,
  removeOnSensorRemovedListener,
  getSensors
};
