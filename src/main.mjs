import colors from 'colors'
import { Transform, pipeline } from 'stream'
import fs from 'fs'
import { options, exitHandler } from './options'
import { caesarCipher } from "./ceasar";

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
                const action = options.action === 'encode' ? 'зашифрованы' : 'расшифрованы';
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
