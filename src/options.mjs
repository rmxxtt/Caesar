import colors from 'colors'
import { Command } from 'commander/esm.mjs';

const exitHandler = (message, isError = true, errorCode = 1) => {
    process.stderr.write(`${isError ? 'ERR '.red : ''}${message}`);
    process.exit(errorCode);
}

const actionHandler = (action) => {
    if (['encode', 'decode'].includes(action)) {
        return action;
    }
    exitHandler("required option '-a, --action <action>' Supports only values 'encode' or 'decode'");
}

const shiftHandler = (shift) => {
    const matches = shift.match(/^(-|\+)?([1-9][0-9]*|[0-9]{1})$/);
    if (matches) {
        shift = parseInt(matches.input);
        if (shift <= Number.MAX_SAFE_INTEGER && shift >= Number.MIN_SAFE_INTEGER) {
            return shift;
        }
    }
    exitHandler(
        "required option '-s, --shift <number>' " +
        "Supports numbers from '9007199254740991' to '-9007199254740991'"
    );
}

const program = new Command();

program
    .requiredOption('-a, --action <action>', "an action 'encode' or 'decode'", actionHandler)
    .option('-i, --input  [path]', 'an input file or use stdin as an input source')
    .option('-o, --output [path]', 'an output file or use stdout as an output destination')
    .requiredOption('-s, --shift <number>', "a shift" +
        "Supports numbers from '9007199254740991' to '-9007199254740991'", shiftHandler)
    .configureOutput({
        writeErr: (message) => exitHandler(message)
    });

program.parse(process.argv);

const options = program.opts();

module.exports = { options, exitHandler }
