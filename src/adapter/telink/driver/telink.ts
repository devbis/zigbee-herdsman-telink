/* istanbul ignore file */
/* eslint-disable */

import {DelimiterParser} from '@serialport/parser-delimiter'
import {EventEmitter} from 'events';
import {Debug} from '../debug';
import {SerialPort} from '../../serialPort';
import SerialPortUtils from "../../serialPortUtils";
import SocketPortUtils from "../../socketPortUtils";
import net from "net";
import {Queue, Wait} from "../../../utils";
import {SerialPortOptions} from "../../tstype";
import {STATUS, TelinkCommandCode, TelinkMessageCode, TelinkObjectPayload} from "./constants";
import TelinkObject from "./telinkObject";
import {ZclFrame} from "../../../zcl";
import Waitress from "../../../utils/waitress";
import {equal, TelinkResponseMatcher, TelinkResponseMatcherRule} from "./commandType";
import TelinkFrame from "./frame";
import {Buffalo} from "../../../buffalo";

const debug = Debug('driver');

const autoDetectDefinitions = [
    {manufacturer: 'zigate_PL2303', vendorId: '067b', productId: '2303'},
    // {manufacturer: 'zigate_cp2102', vendorId: '10c4', productId: 'ea60'},
];

const timeouts = {
    reset: 30000,
    default: 10000,
};

type WaitressMatcher = {
    telinkObject: TelinkObject,
    rules: TelinkResponseMatcher,
    extraParameters?: object
};

function zeroPad(number: number, size?: number): string {
    return (number).toString(16).padStart(size || 4, '0');
}

function resolve(path: string | [], obj: { [k: string]: any }, separator = '.'): any {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}

export default class Telink extends EventEmitter {
    private path: string;
    private baudRate: number;
    private rtscts: boolean;
    private initialized: boolean;
    // private timeoutResetTimeout: any;
    // private apsRequestFreeSlots: number;

    private parser: EventEmitter;
    private serialPort: SerialPort;
    private seqNumber: number;
    private portType: 'serial' | 'socket';
    private socketPort: net.Socket;
    private queue: Queue;

    public portWrite: SerialPort | net.Socket;
    private waitress: Waitress<TelinkObject, WaitressMatcher>;

    public constructor(path: string, serialPortOptions: SerialPortOptions) {
        super();
        this.path = path;
        this.baudRate = typeof serialPortOptions.baudRate === 'number' ? serialPortOptions.baudRate : 115200;
        this.rtscts = typeof serialPortOptions.rtscts === 'boolean' ? serialPortOptions.rtscts : false;
        this.portType = SocketPortUtils.isTcpPath(path) ? 'socket' : 'serial';
        this.initialized = false;
        this.queue = new Queue(1);

        this.waitress = new Waitress<TelinkObject, WaitressMatcher>(
            this.waitressValidator, this.waitressTimeoutFormatter);
    }

    public async sendCommand(
        code: TelinkCommandCode,
        payload?: TelinkObjectPayload,
        timeout?: number,
        extraParameters?: object,
        disableResponse: boolean = false
    ): Promise<TelinkObject> {
        const waiters: Promise<TelinkObject>[] = [];
        const waitersId: number[] = [];
        return await this.queue.execute(async () => {
            try {
                debug.log(
                    'Send command \x1b[32m>>>> '
                    + TelinkCommandCode[code]
                    + ' 0x' + zeroPad(code)
                    + ' <<<<\x1b[0m \nPayload: %o',
                    payload
                );
                const telinkObject = TelinkObject.createRequest(code, payload);
                const frame = telinkObject.toTelinkFrame();
                debug.log('%o', frame);

                const sendBuffer = frame.toBuffer();
                debug.log('<-- send command ', sendBuffer);
                debug.log(`DisableResponse: ${disableResponse}`);

                if (!disableResponse && Array.isArray(telinkObject.command.response)) {
                    telinkObject.command.response.forEach((rules) => {
                        let waiter = this.waitress.waitFor(
                            {telinkObject, rules, extraParameters},
                            timeout || timeouts.default
                        );
                        waitersId.push(waiter.ID);
                        waiters.push(
                            waiter.start().promise
                        );
                    });
                }

                let resultPromise: Promise<TelinkObject>;
                if (telinkObject.command.waitStatus !== false) {
                    const ruleStatus: TelinkResponseMatcher = [
                        {receivedProperty: 'code', matcher: equal, value: TelinkMessageCode.ZBHCI_CMD_DATA_CONFIRM},
                        {receivedProperty: 'payload.packetType', matcher: equal, value: telinkObject.code},
                    ];

                    const statusWaiter = this.waitress.waitFor(
                        {telinkObject, rules: ruleStatus},
                        timeout || timeouts.default
                    ).start();
                    resultPromise = statusWaiter.promise;
                }

                // @ts-ignore
                this.portWrite.write(sendBuffer);

                if (telinkObject.command.waitStatus !== false) {
                    let statusResponse: TelinkObject = await resultPromise;
                    if (statusResponse.payload.status !== STATUS.E_SL_MSG_STATUS_SUCCESS) {
                        waitersId.map((id) => this.waitress.remove(id));
                        return Promise.reject(statusResponse);
                    } else if (waiters.length === 0) {
                        return Promise.resolve(statusResponse);
                    }
                }
                return Promise.race(waiters);
            } catch (e) {
                debug.error('sendCommand error:', e);
                return Promise.reject(new Error('sendCommand error: ' + e));
            }
        });


    }

    public static async isValidPath(path: string): Promise<boolean> {
        return SerialPortUtils.is(path, autoDetectDefinitions);
    }

    public static async autoDetectPath(): Promise<string> {
        const paths = await SerialPortUtils.find(autoDetectDefinitions);
        return paths.length > 0 ? paths[0] : null;
    }

    public open(): Promise<void> {
        return this.portType === 'serial' ? this.openSerialPort() : this.openSocketPort();
    }

    public close(): Promise<void> {
        debug.info('close');
        return new Promise((resolve, reject) => {
            if (this.initialized) {
                this.initialized = false;
                this.portWrite = null;
                if (this.portType === 'serial') {
                    this.serialPort.flush((): void => {
                        this.serialPort.close((error): void => {
                            this.serialPort = null;
                            error == null ?
                                resolve() :
                                reject(new Error(`Error while closing serialPort '${error}'`));
                            this.emit('close');
                        });
                    });
                } else {
                    // @ts-ignore
                    this.socketPort.destroy((error?: Error): void => {
                        this.socketPort = null;
                        error == null ?
                            resolve() :
                            reject(new Error(`Error while closing serialPort '${error}'`));
                        this.emit('close');
                    });
                }
            } else {
                resolve();
                this.emit('close');
            }
        });
    }

    public waitFor(matcher: WaitressMatcher, timeout: number = timeouts.default):
        { start: () => { promise: Promise<TelinkObject>; ID: number }; ID: number } {
        return this.waitress.waitFor(matcher, timeout);
    }

    private async openSerialPort(): Promise<void> {
        this.serialPort = new SerialPort({
            path: this.path,
            baudRate: this.baudRate,
            dataBits: 8,
            parity: 'none', /* one of ['none', 'even', 'mark', 'odd', 'space'] */
            stopBits: 1, /* one of [1,2] */
            lock: false,
            autoOpen: false
        });
        this.parser = this.serialPort.pipe(
            new DelimiterParser(
                {delimiter: [TelinkFrame.STOP_BYTE], includeDelimiter: true}
            ),
        );
        this.parser.on('data', this.onSerialData.bind(this));

        this.portWrite = this.serialPort;
        return new Promise((resolve, reject): void => {
            this.serialPort.open(async (err: unknown): Promise<void> => {
                if (err) {
                    this.serialPort = null;
                    this.parser = null;
                    this.path = null;
                    this.initialized = false;
                    const error = `Error while opening serialPort '${err}'`;
                    debug.error(error);
                    reject(new Error(error));
                } else {
                    debug.log('Successfully connected Telink port \'' + this.path + '\'');
                    this.serialPort.on('error', (error) => {
                        debug.error(`serialPort error: ${error}`);
                    });
                    this.serialPort.on('close', this.onPortClose.bind(this));
                    this.initialized = true;
                    resolve();
                }
            });
        });
    }

    private async openSocketPort(): Promise<void> {
        const info = SocketPortUtils.parseTcpPath(this.path);
        debug.log(`Opening TCP socket with ${info.host}:${info.port}`);

        this.socketPort = new net.Socket();
        this.socketPort.setNoDelay(true);
        this.socketPort.setKeepAlive(true, 15000);


        this.parser = this.socketPort.pipe(
            new DelimiterParser({delimiter: [TelinkFrame.STOP_BYTE], includeDelimiter: true}),
        );
        this.parser.on('data', this.onSerialData.bind(this));

        this.portWrite = this.socketPort;
        return new Promise((resolve, reject): void => {
            this.socketPort.on('connect', function () {
                debug.log('Socket connected');
            });

            // eslint-disable-next-line
            const self = this;

            this.socketPort.on('ready', async function () {
                debug.log('Socket ready');
                self.initialized = true;
                resolve();
            });

            this.socketPort.once('close', this.onPortClose);

            this.socketPort.on('error', (error) => {
                debug.log('Socket error', error);
                // reject(new Error(`Error while opening socket`));
                reject();
                self.initialized = false;
            });

            this.socketPort.connect(info.port, info.host);
        });
    }

    private onSerialError(err: string): void {
        debug.error('serial error: ', err);
    }

    private onPortClose(): void {
        debug.log('serial closed');
        this.initialized = false;
        this.emit('close');
    }

    private onSerialData(buffer: Buffer): void {
        try {
            // debug.log(`--- parseNext `, buffer);

            const frame = new TelinkFrame(buffer);
            if (!(frame instanceof TelinkFrame)) return; // @Todo fix

            const code = frame.readMsgCode();
            const msgName = (TelinkMessageCode[code] ? TelinkMessageCode[code] : '') + ' 0x' + zeroPad(code);

            debug.log(`--> parsed frame \x1b[1;34m>>>> ${msgName} <<<<\x1b[0m `);

            try {
                const telinkObject = TelinkObject.fromTelinkFrame(frame);
                debug.log('%o', telinkObject.payload);
                this.waitress.resolve(telinkObject);

                switch (code) {
                    case TelinkMessageCode.ZBHCI_CMD_DATA_CONFIRM:
                        switch (telinkObject.payload.profileID) {
                            case 0x0000:
                                switch (telinkObject.payload.clusterID) {
                                    case 0x0013:
                                        let networkAddress = telinkObject.payload.payload.readUInt16LE(1);
                                        let ieeeAddr = new Buffalo(telinkObject.payload.payload.slice(3, 11)).readIeeeAddr();
                                        this.emit('DeviceAnnounce', networkAddress, ieeeAddr);
                                        break;
                                }
                                break;
                            case 0x0104:
                                this.emit('received', {telinkObject});
                                break;
                            default:

                                debug.error("not implemented profile: " + telinkObject.payload.profileID);
                        }
                        break;
                    case TelinkMessageCode.ZBHCI_CMD_NODE_LEAVE_IND:
                        this.emit('LeaveIndication', {telinkObject});
                        break;
                    case TelinkMessageCode.ZBHCI_CMD_MAC_ADDR_IND:
                        this.emit('DeviceAnnounce', telinkObject.payload.shortAddress, telinkObject.payload.ieee);
                        break;
                }

            } catch (error) {
                debug.error('Parsing error: %o', error)
            }

        } catch (error) {
            debug.error(`Error while parsing Frame '${error.stack}'`);
        }
    }

    private waitressTimeoutFormatter(matcher: WaitressMatcher, timeout: number): string {
        return `${matcher} after ${timeout}ms`;
    }

    private waitressValidator(telinkObject: TelinkObject, matcher: WaitressMatcher): boolean {
        const validator = (rule: TelinkResponseMatcherRule): boolean => {
            try {
                let expectedValue: string | number;
                if (typeof rule.value === "undefined" && typeof rule.expectedProperty !== "undefined") {
                    expectedValue = resolve(rule.expectedProperty, matcher.telinkObject);
                } else if (typeof rule.value === "undefined" && typeof rule.expectedExtraParameter !== "undefined") {
                    expectedValue = resolve(rule.expectedExtraParameter, matcher.extraParameters);
                } else {
                    expectedValue = rule.value;
                }
                const receivedValue = resolve(rule.receivedProperty, telinkObject);
                return rule.matcher(expectedValue, receivedValue);
            } catch (e) {
                return false;
            }
        };
        return matcher.rules.every(validator);
    }
}
