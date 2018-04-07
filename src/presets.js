var preset10zones = {
  "name": "10 zones",
  "zones": [{
    "midiNote": 42,
    "midiNoteLeftTwist": 46,
    "y": 0,
    "z": -50
  }, {
    "midiNote": 38,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": 0
  }, {
    "midiNote": 41,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": 50
  }, {
    "midiNote": 51,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": -50
  }, {
    "midiNote": 50,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 0
  }, {
    "midiNote": 47,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 50
  }, {
    "midiNote": 57,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": -90
  }, {
    "midiNote": 57,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 90
  }, {
    "midiNote": 57,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": -90
  }, {
    "midiNote": 51,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": 90
  }]
}
var preset6zones = {
  "name": "6 zones",
  "zones": [{
    "midiNote": 42,
    "midiNoteLeftTwist": 46,
    "y": 0,
    "z": -50
  }, {
    "midiNote": 38,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": 0
  }, {
    "midiNote": 41,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": 50
  }, {
    "midiNote": 57,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": -50
  }, {
    "midiNote": 47,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 0
  }, {
    "midiNote": 51,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 50
  }]
}

var preset7zones = {
  "name": "7 zones",
  "zones": [{
    "midiNote": 42,
    "midiNoteLeftTwist": 46,
    "y": 0,
    "z": -50
  }, {
    "midiNote": 38,
    "midiNoteLeftTwist": 40,
    "y": 0,
    "z": 0
  }, {
    "midiNote": 43,
    "midiNoteLeftTwist": null,
    "y": 0,
    "z": 50
  }, {
    "midiNote": 57,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": -75
  }, {
    "midiNote": 48,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": -25
  }, {
    "midiNote": 45,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 25
  },
  {
    "midiNote": 51,
    "midiNoteLeftTwist": null,
    "y": 50,
    "z": 75
  }
]
}

var footpedal = {
    "name": "Foot pedal",
    "zones": [{
      "midiNote": 44,
      "midiNoteLeftTwist": null,
      "y": 0,
      "z": -50
    }, {
      "midiNote": 36,
      "midiNoteLeftTwist": null,
      "y": 0,
      "z": 0
    }
    ]
};
export var presets=[preset10zones,preset6zones,preset7zones,footpedal]
export {preset10zones};
export {preset6zones as factoryPreset}


// WEBPACK FOOTER //
// ./src/presets.js