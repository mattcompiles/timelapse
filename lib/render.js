const fs = require('fs');
const path = require('path');
const videoshow = require('videoshow');
const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'name', alias: 'n', type: String },
  { name: 'images', alias: 'i', type: String },
  { name: 'fps', alias: 'f', type: Number },
  {
    name: 'location',
    alias: 'l',
    type: String,
    defaultValue: path.join(__dirname, '../videos')
  }
];

const getVideoOptions = fps => ({
  fps,
  loop: 1 / fps, // seconds
  transition: false,
  transitionDuration: 0, // seconds
  videoBitrate: 1024,
  videoCodec: 'libx264',
  size: '640x?',
  audioBitrate: '128k',
  format: 'mp4',
  pixelFormat: 'yuv420p'
});

module.exports = argv => {
  const { name, images, fps, location } = commandLineArgs(optionDefinitions, {
    argv
  });

  if (!fs.existsSync(location)) {
    fs.mkdirSync(location);
  }

  console.log('Rendering...');

  const imageDirectory = path.join(process.cwd(), images);

  const capturedImages = fs
    .readdirSync(imageDirectory)
    .map(file => path.join(imageDirectory, file));

  videoshow(capturedImages, getVideoOptions(fps))
    .save(`${location}/${name}.mp4`)
    .on('error', (err, stdout, stderr) => {
      console.error('Error:', err);
      console.error('ffmpeg stderr:', stderr);
      throw err;
    })
    .on('end', () => {
      console.log('Created timelapse', `${location}/${name}.mp4`);
    });
};
