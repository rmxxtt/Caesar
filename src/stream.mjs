import { exitHandler, options } from "./options.mjs";
import fs from "fs";
import { Transform } from "stream";
import { caesarCipher } from "./ceasar.mjs";
import colors from 'colors';


export const readStream = () => {
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

export const writeStream = () => {
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

export const streamTransform = () => {
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
