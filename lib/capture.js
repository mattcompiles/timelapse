const fs = require('fs');
const path = require('path');
const NodeWebcam = require('node-webcam');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  {
    name: 'captures',
    alias: 'c',
    type: String,
    defaultValue: path.join(__dirname, '../captures')
  },
  { name: 'interval', alias: 'i', type: Number, defaultValue: '15' }
];

const capture = (location, interval, num = 1) => {
  setTimeout(() => {
    console.log('Capturing timelapse photo', num);
    Webcam.capture(`${location}/${num}`, function(err, data) {});

    capture(location, interval, num + 1);
  }, interval * 1000);
};

module.exports = argv => {
  const { name, interval, captures } = commandLineArgs(optionDefinitions, {
    argv
  });

  if (!fs.existsSync(captures)) {
    fs.mkdirSync(captures);
  }

  const location = `${captures}/${name}`;

  if (fs.existsSync(location)) {
    throw new Error(`Directory ${location} already exists`);
  }

  fs.mkdirSync(location);

  const Webcam = NodeWebcam.create({});

  capture(location, interval);
};
