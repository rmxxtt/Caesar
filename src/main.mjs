import { pipeline } from 'stream'
import { exitHandler } from './options.mjs'
import { readStream, streamTransform, writeStream} from './stream.mjs'


function main() {
    pipeline(
        readStream(),
        streamTransform(),
        writeStream(),
        (err) => { exitHandler(err.message) }
    );
}

main();
