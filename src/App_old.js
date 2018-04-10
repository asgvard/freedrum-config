/* eslint-disable */

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { presets, preset10zones,factoryPreset } from './presets'


class Square extends React.Component {
  render() {
    return (
      <button className="square" style={{ height: "50px", width: "50px" }} >
        {this.props.midiNote} {this.props.value ? "*" : ""}
      </button>
    );
  }
}
var handlePadChange;
var theboard;

class Board extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentPad: 1,
      preset: currentPreset
    };
    theboard = this
    handlePadChange = (pad) => {

      this.setState({
        currentPad: pad
      })
    }
  }
  renderSquare(i) {
    return (<Square midiNote={this.state.preset.zones.length > i ? this.state.preset.zones[i].midiNote : -1} value={this.state.currentPad === i} />);
  }


  render() {
    const status = '';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(9)}

        </div>

      </div>
    );
  }
}

function logText(str) {
  console.log(str)
  // log.innerHTML += str;
  // log.innerHTML += "<br>";
  // log.scrollTop = log.scrollHeight;
}
var MidiConstants = {
  STATUS_CONTROL_CHANGE: 0xB0
}
class Sensor {
  constructor(midi) {
    this.midiOut = midi

  }

  outstandingWrites = 0
  writeCC(channel, cc, value) {

    this.outstandingWrites++
    setTimeout(() => {
      var data = [MidiConstants.STATUS_CONTROL_CHANGE | channel, cc, value]
      this.midiOut.send(data)
      console.log("cc" + cc)
      this.outstandingWrites--
    }, 100 * this.outstandingWrites)

  }
  setNote(zone, note) {
    console.log("zone" + zone + " note:" + note)
    this.writeCC(zone, 106, note)

  }
  sendPadPos(padNr, y, z) {

    var angleScale = 360.0 / 127;
    function scaleAngle(x) {
      if (x >= 0) return (x / angleScale)
      else return 127 + (x / angleScale)
    }

    var y_pos = 23
    var z_pos = 103
    this.writeCC(padNr, y_pos, scaleAngle(y))
    this.writeCC(padNr, z_pos, scaleAngle(z))

  }
  sendPreset(preset) {
    var zones = preset.zones
    for (var i = 0; i < 10; i++){
      if (i < zones.length) {
        var s = zones[i]
        this.setNote(i, s.midiNote)
        if (s.z != null && s.y != null)
          this.sendPadPos(i, s.y, s.z)
      }
      else
        this.setNote(i, 0)
    }
    this.saveSettings()
  }
  freedrumCommandCC=20
  factoryReset(){
    const factoryResetCmd=1;

    this.writeCC(0,this.freedrumCommandCC,factoryResetCmd);
  }

  saveSettings(){
    const saveCmd=0;
    this.writeCC(0,this.freedrumCommandCC,saveCmd);
  }
}
var currentSensor = null
var currentPreset = preset10zones
class PresetList extends Component {

  sendPreset(zones) {
    currentSensor.sendPreset(zones)
    currentPreset = zones
    theboard.setState({
      preset: zones
    })
  }
  render() {

    return (
      <div>
        <div>
          {presets.map((p) => {
            return (
              <div>
                <button onClick={() => { this.sendPreset(p) }}>
                  Send preset: {p.name}
                </button>
              </div>)
          })}

        </div>
      </div>
    )
  }
}


class MidiDeviceList extends Component {

  onFailure() {

  }
  constructor() {
    super()

    this.state = {
      outputs: [{ id: 3, name: "dsdf" }],
      currentOutput: 0
    }

    logText("Initializing MIDI...");
    navigator.requestMIDIAccess().then((midi) => { this.onSuccess(midi) }, this.onFailure); //get midi access
  }
  o = []
  onSuccess(midi) {
    var outputs = midi.outputs;

    logText("Found " + outputs.size + " MIDI outputs(s)");

    var state = this.state

    //connect to first device found
    outputs.forEach(val => {
      this.o.push({
        name: val.name,
        id: val.id,
        device: val
      });
    });
    midi.inputs.forEach(inp => {
      var id = inp.id

      inp.onmidimessage = (event) => {
        if (event.data.length === 3) {
          var cc = event.data[1];
          const val = event.data[2];
          logText('controller id: ' + cc + ', value: ' + val);
          if (cc === 16) {
            handlePadChange(val)
          }
        }
      }
    });

    this.setState({
      outputs: this.o
    })

    if (outputs.size > 0) {
      var iterator = outputs.values();
      currentSensor = new Sensor(iterator.next().value)
    }
    // if(inputs.size > 0) {
    // 	var iterator = inputs.values(); // returns an iterator that loops over all inputs
    // 	var input = iterator.next().value; // get the first input
    // 	logText("Connected first input: " + input.name);
    // 	//input.onmidimessage = handleMIDIMessage;
    // }
  }



  onChange(val) {
    logText(val)

    var dev = this.o[val]
    currentSensor = new Sensor(dev.device)
  }
  render() {
    var midiOptions = this.state.outputs.map(element => {
      return (<option id={element.id}>
        {element.name}
      </option>)
    })



    return (
      <div>
        <select
          onChange={(sel) => { this.onChange(sel.target.selectedIndex) }} >
          {midiOptions}
        </select>

      </div>
    );
  }
}
class App extends Component {



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Freedrum config</h1>
        </header>

        <MidiDeviceList />
        <PresetList />
        <Board />
        <button onClick={() => { currentSensor.factoryReset();
          theboard.setState({
            preset: factoryPreset
          })
        }}>
        Factory reset
        </button>
      </div>
    );
  }
}

export default App;
