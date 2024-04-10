import * as stream from 'stream';
import TelinkFrame from './frame';
import Debug from "debug";

const debug = Debug('zigbee-herdsman:adapter:telink:driver:parser');
const MinMessageLength = 7;
const START_BYTE = 0x55;
const STOP_BYTE = 0xAA;
const PositionDataLength = 3;

class Parser extends stream.Transform {
    private buffer: Buffer;

    public constructor() {
        super();
        this.buffer = Buffer.from([]);
    }

    public _transform(chunk: Buffer, _: string, cb: () => void): void {
        // debug(`<-- [${[...chunk]}]`);
        this.buffer = Buffer.concat([this.buffer, chunk]);
        this.parseNext();
        cb();
    }

    private parseNext(): void {
        // debug(`--`- parseNext [${[...this.buffer]}]`);

        if (this.buffer.length !== 0 && this.buffer.readUInt8(0) !== START_BYTE) {
            // Buffer doesn't start with SOF, skip till SOF.
            const index = this.buffer.indexOf(START_BYTE);
            if (index !== -1) {
                this.buffer = this.buffer.subarray(index, this.buffer.length);
            }
        }

        if (this.buffer.length >= MinMessageLength && this.buffer.readUInt8(0) == START_BYTE) {
            const dataLength = this.buffer.readInt16BE(PositionDataLength);
            // debug(`telink frame data len = ${dataLength}`);
            const frameLength = dataLength + MinMessageLength;

            if (this.buffer.length >= frameLength && this.buffer.readUInt8(frameLength - 1) == STOP_BYTE) {
                const frameBuffer = this.buffer.subarray(0, frameLength);
                // this.emit('parsed', frameBuffer);

                try {
                    const frame = new TelinkFrame(frameBuffer);
                    debug(`--> parsed %o`, frame);
                    this.emit('parsed', frame);
                } catch (error) {
                    debug(`--> error ${error.stack}`);
                }

                this.buffer = this.buffer.subarray(frameLength, this.buffer.length);
                this.parseNext();
            }
        }
    }
}

export default Parser;
