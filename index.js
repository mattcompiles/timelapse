const fs = require('fs');
const path = require('path');
const NodeWebcam = require('node-webcam');
const videoshow = require('videoshow');
const commandLineArgs = require('command-line-args');

const CAPTURE_FOLDER = 'captures';
const VIDEO_FOLDER = 'videos';
const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'interval', alias: 'i', type: Number, defaultValue: '15' }
];

const { name, interval } = commandLineArgs(optionDefinitions);

if (!fs.existsSync(CAPTURE_FOLDER)) {
  fs.mkdirSync(CAPTURE_FOLDER);
}

if (!fs.existsSync(VIDEO_FOLDER)) {
  fs.mkdirSync(VIDEO_FOLDER);
}

const captureFolder = `${CAPTURE_FOLDER}/${name}`;

if (fs.existsSync(captureFolder)) {
  throw new Error(`Directory ${captureFolder} already exists`);
}

fs.mkdirSync(captureFolder);

const Webcam = NodeWebcam.create({});

const capture = (num = 1) => {
  setTimeout(() => {
    console.log('Capturing timelapse photo', num);
    Webcam.capture(`${captureFolder}/${num}`, function(err, data) {});

    capture(num + 1);
  }, interval * 1000);
};

capture();

const videoOptions = {
  fps: 25,
  loop: 1 / 25, // seconds
  transition: false,
  transitionDuration: 0, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  format: 'mp4',
  pixelFormat: 'yuv420p'
};

process.on('SIGINT', function() {
  console.log('Rendering video');
  const capturedImages = fs
    .readdirSync(captureFolder)
    .map(file => path.join(__dirname, captureFolder, file));

  videoshow(capturedImages, videoOptions)
    .save(`${VIDEO_FOLDER}/${name}.mp4`)
    .on('error', (err, stdout, stderr) => {
      console.error('Error:', err);
      console.error('ffmpeg stderr:', stderr);
      throw err;
    })
    .on('end', () => {
      console.log('Created timelapse', `${VIDEO_FOLDER}/${name}.mp4`);
      process.exit(0);
    });
});
