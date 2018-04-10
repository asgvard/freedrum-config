import {CONSTANTS} from '../constants';

/**
 * Number of pending writes, executed with 100ms delay
 * example:
 * {
 *   "sensorId1": 2,
 *   "sensorId2": 0,
 *   ...
 * }
 */
const pendingWrites = {};

const writeCommand = (sensor, channel, command, value) => {
  const {id, output} = sensor;

  if (!pendingWrites[id]) {
    pendingWrites[id] = 0;
  }

  pendingWrites[id]++;

  setTimeout(() => {
    const data = [CONSTANTS.MIDI_STATUS_CONTROL_CHANGE | channel, command, value];
    output.send(data);

    pendingWrites[id] = Math.max(pendingWrites[id] - 1, 0);
  }, CONSTANTS.MIDI_WRITE_INTERVAL * pendingWrites[id]);
};
