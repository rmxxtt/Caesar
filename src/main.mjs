import colors from 'colors'
import { Command } from 'commander/esm.mjs';
import { Transform, pipeline } from 'stream'
import fs from 'fs'


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

const readStream = () => {
    if (options.input) {
        return fs.createReadStream(options.input, {
            'flags': fs.constants.O_RDONLY
        });
    } else {
        if (!options.input && !options.output) {
            process.stdout.write('Введите текcт для шифрования: '.yellow)
        }
        return process.stdin
    }
}

const writeStream = () => {
    if (options.output) {
        return fs.createWriteStream(options.output, {
            flags: fs.constants.O_APPEND | fs.constants.O_RDWR
        }).on('finish', () => {
            if (options.input && options.output) {
                const action = options.action == 'encode' ? 'зашифрованы' : 'расшифрованы';
                exitHandler(`${('Данные ' + action + ':').green} смотрите файл ${options.output}`, false)
            }
        }).on('ready', () => {
            if (!options.input && options.output) {
                process.stdout.write('Введите текcт для шифрования: '.yellow)
            }
        })
    } else {
        return process.stdout
    }
}

const caesarCipher = (data) => {
    const char = {
        minUpper: 65,
        maxUpper: 90,
        minLetter: 97,
        maxLetter: 122
    }
    const positionUpper = options.shift >= 0 ? char.minUpper : char.maxUpper;
    const positionLetter = options.shift >= 0 ? char.minLetter : char.maxLetter;
    if(options.action == 'decode'){
        options.shift = options.shift * -1
    }
    return data.toString().replace(/[a-zA-Z]/g, char => {
        if (char == char.toUpperCase()) {
            return String.fromCharCode(
                (char.charCodeAt() - positionUpper + options.shift) % 26 + positionUpper
            );
        } else {
            return String.fromCharCode(
                (char.charCodeAt() - positionLetter + options.shift) % 26 + positionLetter
            );
        }
    });
}

const streamTransform = () => {
    return new Transform({
        transform(chunk, _, callback) {
            let data = caesarCipher(chunk)
            if (!options.output) {
                data = 'Результат: '.green + data;
            }
            this.push(data)
            if (!options.output && !options.input) {
                process.stdout.write('Введите текcт для шифрования: '.yellow);
            }
            callback();
        }
    })
}

function main() {
    pipeline(
        readStream(),
        streamTransform(),
        writeStream(),
        (err) => { exitHandler(err.message) }
    );
}

main();
