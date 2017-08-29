const commandLineCommands = require('command-line-commands');

const capture = require('./capture');
const render = require('./render');

const validCommands = ['capture', 'render'];
const { command, argv } = commandLineCommands(validCommands);

switch (command) {
  case 'capture': {
    capture(argv);
    break;
  }

  case 'render': {
    render(argv);
    break;
  }

  default: {
    console.error('Available options are capture & render');
    break;
  }
}
