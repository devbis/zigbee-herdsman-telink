/* istanbul ignore file */
/* eslint-disable */
import TelinkFrame from './frame';
import BuffaloTelink, {BuffaloTelinkOptions} from './buffaloTelink';
import {TelinkCommandCode, TelinkMessageCode, TelinkObjectPayload} from "./constants";
import {TelinkMessage, TelinkMessageParameter} from "./messageType";
import {TelinkCommand, TelinkCommandParameter, TelinkCommandType} from "./commandType";
import {Debug} from '../debug';

type TelinkCode = TelinkCommandCode | TelinkMessageCode;
type TelinkParameter = TelinkCommandParameter | TelinkMessageParameter;


const debug = Debug('driver:TelinkObject');

const BufferAndListTypes = [
    'BUFFER', 'BUFFER8', 'BUFFER16',
    'BUFFER18', 'BUFFER32', 'BUFFER42',
    'BUFFER100', 'LIST_UINT16', 'LIST_ROUTING_TABLE',
    'LIST_BIND_TABLE', 'LIST_NEIGHBOR_LQI', 'LIST_NETWORK',
    'LIST_ASSOC_DEV', 'LIST_UINT8',
];

class TelinkObject {
    private readonly _code: TelinkCode;
    private readonly _payload: TelinkObjectPayload;
    private readonly _parameters: TelinkParameter[];
    private readonly _frame: TelinkFrame;

    private constructor(
        code: TelinkCode,
        payload: TelinkObjectPayload,
        parameters: TelinkParameter[],
        frame?: TelinkFrame
    ) {
        this._code = code;
        this._payload = payload;
        this._parameters = parameters;
        this._frame = frame;
    }

    get code(): TelinkCode {
        return this._code;
    }

    get frame(): TelinkFrame {
        return this._frame;
    }

    get payload(): TelinkObjectPayload {
        return this._payload;
    }

    get command(): TelinkCommandType {
        return TelinkCommand[this._code];
    }

    public static createRequest(
        commandCode: TelinkCommandCode,
        payload: TelinkObjectPayload
    ): TelinkObject {
        const cmd = TelinkCommand[commandCode];

        if (!cmd) {
            throw new Error(`Command '${commandCode}' not found`);
        }

        return new TelinkObject(commandCode, payload, cmd.request);
    }

    public static fromTelinkFrame(frame: TelinkFrame): TelinkObject {
        const code = frame.readMsgCode();
        return TelinkObject.fromBufer(code, frame.msgPayloadBytes, frame);
    }

    public static fromBufer(code: number, buffer: Buffer, frame?: TelinkFrame): TelinkObject {
        const msg = TelinkMessage[code];

        if (!msg) {
            throw new Error(`Message '${code.toString(16)}' not found`);
        }

        const parameters = msg.response;
        if (parameters === undefined) {
            throw new Error(`Message '${code.toString(16)}' cannot be a response`);
        }

        const payload = this.readParameters(buffer, parameters);

        return new TelinkObject(code, payload, parameters, frame);
    }

    private static readParameters(buffer: Buffer, parameters: TelinkParameter[]): TelinkObjectPayload {
        const buffalo = new BuffaloTelink(buffer);
        const result: TelinkObjectPayload = {};

        for (const parameter of parameters) {
            const options: BuffaloTelinkOptions = {};

            if (BufferAndListTypes.includes(parameter.parameterType)) {
                // When reading a buffer, assume that the previous parsed parameter contains
                // the length of the buffer
                const lengthParameter = parameters[parameters.indexOf(parameter) - 1];
                const length = result[lengthParameter.name];

                if (typeof length === 'number') {
                    options.length = length;
                }
            }

            try {
                result[parameter.name] = buffalo.read(parameter.parameterType, options);
            } catch (e) {
                debug.error(e.stack);
            }
        }

        if (buffalo.isMore()) {
            let bufferString = buffalo.getBuffer().toString('hex');
            debug.error(
                "Last bytes of data were not parsed \x1b[32m%s\x1b[31m%s\x1b[0m ",
                bufferString.slice(0, (buffalo.getPosition() * 2)).replace(/../g, "$& "),
                bufferString.slice(buffalo.getPosition() * 2).replace(/../g, "$& ")
            )
        }

        return result;
    }

    public toTelinkFrame(): TelinkFrame {
        const buffer = this.createPayloadBuffer();
        const frame = new TelinkFrame();
        frame.writeMsgCode(this._code as number);
        frame.writeMsgPayload(buffer);
        return frame;
    }

    private createPayloadBuffer(): Buffer {
        const buffalo = new BuffaloTelink(Buffer.alloc(256)); // hardcode @todo

        for (const parameter of this._parameters) {
            const value = this._payload[parameter.name];
            buffalo.write(parameter.parameterType, value, {});
        }
        return buffalo.getWritten();
    }

}

export default TelinkObject;
