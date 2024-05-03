/* istanbul ignore file */
/* eslint-disable */
import {TelinkCommandCode, TelinkMessageCode, TelinkObjectPayload} from "./constants";
import ParameterType from "./parameterType";


export interface PermitJoinPayload extends TelinkObjectPayload {
    targetShortAddress: number
    interval: number
    TCsignificance?: number
}

export interface RawAPSDataRequestPayload extends TelinkObjectPayload {
    addressMode: number
    targetShortAddress: number
    sourceEndpoint: number
    destinationEndpoint: number
    profileID: number
    clusterID: number
    securityMode: number
    radius: number
    dataLength: number
    data: Buffer,
}

export interface TelinkCommandParameter {
    name: string;
    parameterType: ParameterType;
}

export interface TelinkCommandType {
    request: TelinkCommandParameter[];
    response?: TelinkResponseMatcher[];
    waitStatus?: boolean;
}

export interface TelinkResponseMatcherRule {
    receivedProperty: string;
    matcher: (expected: string | number | TelinkMessageCode,
              received: string | number | TelinkMessageCode) => boolean;
    expectedProperty?: string; // or
    expectedExtraParameter?: string; // or
    value?: string | number | TelinkMessageCode;

}

export function equal(
    expected: string | number | TelinkMessageCode,
    received: string | number | TelinkMessageCode): boolean {

    return expected === received;
}

export function notEqual(
    expected: string | number | TelinkMessageCode,
    received: string | number | TelinkMessageCode): boolean {

    return expected !== received;
}

export type TelinkResponseMatcher = TelinkResponseMatcherRule[];


export const TelinkCommand: { [key: string]: TelinkCommandType } = {
    // [TelinkCommandCode.SetDeviceType]: {  // 0x0023
    //     request: [
    //         {name: 'deviceType', parameterType: ParameterType.UINT8} //<device type: uint8_t>
    //     ],
    // },
    // [TelinkCommandCode.StartNetwork]: { // 0x0024
    //     request: [],
    //     response: [
    //         [
    //             {receivedProperty: 'code', matcher: equal, value: TelinkMessageCode.NetworkJoined}
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.StartNetworkScan]: {
    //     request: [],
    // },
    // [TelinkCommandCode.GetNetworkState]: { // 0x0009
    //     request: [],
    //     response: [
    //         [
    //             {receivedProperty: 'code', matcher: equal, value: TelinkMessageCode.NetworkState},
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.GetTimeServer]: { // 0x0017
    //     request: []
    // },
    // [TelinkCommandCode.ErasePersistentData]: { // 0x0012
    //     request: [],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.RestartFactoryNew
    //             },
    //         ]
    //     ],
    //     waitStatus: false
    // },
    // [TelinkCommandCode.Reset]: { // 0x0011
    //     request: [],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.RestartNonFactoryNew
    //             },
    //         ],
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.RestartFactoryNew
    //             },
    //         ],
    //     ],
    //     waitStatus: false
    // },
    // [TelinkCommandCode.SetTXpower]: { // SetTXpower
    //     request: [
    //         {name: 'value', parameterType: ParameterType.UINT8}
    //     ]
    // },
    // [TelinkCommandCode.ManagementLQI]: { // 0x004E
    //     request: [
    //         {name: 'targetAddress', parameterType: ParameterType.UINT16BE}, //<Target Address : uint16_t>	Status
    //         {name: 'startIndex', parameterType: ParameterType.UINT8}, //<Start Index : uint8_t>

    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.DataIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetAddress'
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8031
    //             },
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.SetSecurityStateKey]: { // 0x0022
    //     request: [
    //         {name: 'keyType', parameterType: ParameterType.UINT8}, // 	<key type: uint8_t>
    //         {name: 'key', parameterType: ParameterType.BUFFER}, //   <key: data>

    //     ],
    // },
    // [TelinkCommandCode.GetVersion]: {
    //     request: [],
    //     response: [
    //         [
    //             {receivedProperty: 'code', matcher: equal, value: TelinkMessageCode.VersionList}
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.RawMode]: {
    //     request: [
    //         {name: 'enabled', parameterType: ParameterType.INT8},
    //     ]
    // },
    // [TelinkCommandCode.SetExtendedPANID]: {
    //     request: [
    //         {name: 'panId', parameterType: ParameterType.BUFFER}, //<64-bit Extended PAN ID:uint64_t>
    //     ]
    // },
    // [TelinkCommandCode.SetChannelMask]: {
    //     request: [
    //         {name: 'channelMask', parameterType: ParameterType.UINT32BE}, //<channel mask:uint32_t>
    //     ]
    // },

    // [TelinkCommandCode.ManagementLeaveRequest]: {
    //     request: [
    //         {name: 'shortAddress', parameterType: ParameterType.UINT16BE},
    //         {name: 'extendedAddress', parameterType: ParameterType.IEEEADDR}, // <extended address: uint64_t>
    //         {name: 'rejoin', parameterType: ParameterType.UINT8},
    //         {name: 'removeChildren', parameterType: ParameterType.UINT8}, // <Remove Children: uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.LeaveIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.extendedAddress', matcher: equal,
    //                 expectedProperty: 'payload.extendedAddress'
    //             },
    //         ],
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.ManagementLeaveResponse
    //             },
    //             {
    //                 receivedProperty: 'payload.sqn', matcher: equal,
    //                 expectedProperty: 'status.seqApsNum'
    //             },
    //         ],
    //     ]
    // },

    // [TelinkCommandCode.RemoveDevice]: {
    //     request: [
    //         {name: 'parentAddress', parameterType: ParameterType.IEEEADDR}, // <parent address: uint64_t>
    //         {name: 'extendedAddress', parameterType: ParameterType.IEEEADDR}, // <extended address: uint64_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.LeaveIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.extendedAddress', matcher: equal,
    //                 expectedProperty: 'payload.extendedAddress'
    //             },
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.PermitJoin]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, //<target short address: uint16_t> -
    //         // broadcast 0xfffc
    //         {name: 'interval', parameterType: ParameterType.UINT8}, //<interval: uint8_t>
    //         // 0 = Disable Joining
    //         // 1 – 254 = Time in seconds to allow joins
    //         // 255 = Allow all joins
    //         // {name: 'TCsignificance', parameterType: ParameterType.UINT8}, //<TCsignificance: uint8_t>
    //         // 0 = No change in authentication
    //         // 1 = Authentication policy as spec
    //     ]
    // },
    // [TelinkCommandCode.PermitJoinStatus]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, //<target short address: uint16_t> -
    //         // broadcast 0xfffc
    //         {name: 'interval', parameterType: ParameterType.UINT8}, //<interval: uint8_t>
    //         // 0 = Disable Joining
    //         // 1 – 254 = Time in seconds to allow joins
    //         // 255 = Allow all joins
    //         {name: 'TCsignificance', parameterType: ParameterType.UINT8}, //<TCsignificance: uint8_t>
    //         // 0 = No change in authentication
    //         // 1 = Authentication policy as spec
    //     ],
    //     response: [
    //         [
    //             {receivedProperty: 'code', matcher: equal, value: TelinkMessageCode.PermitJoinStatus}
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.RawAPSDataRequest]: {
    //     request: [
    //         {name: 'addressMode', parameterType: ParameterType.UINT8}, // <address mode: uint8_t>
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, // <target short address: uint16_t>
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint: uint8_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
    //         {name: 'profileID', parameterType: ParameterType.UINT16BE}, // <profile ID: uint16_t>
    //         {name: 'securityMode', parameterType: ParameterType.UINT8}, // <security mode: uint8_t>
    //         {name: 'radius', parameterType: ParameterType.UINT8}, // <radius: uint8_t>
    //         {name: 'dataLength', parameterType: ParameterType.UINT8}, // <data length: uint8_t>
    //         {name: 'data', parameterType: ParameterType.BUFFER}, // <data: auint8_t>
    //     ],
    // },
    // [TelinkCommandCode.NodeDescriptor]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, // <target short address: uint16_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.DataIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetShortAddress'
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8002
    //             }
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.ActiveEndpoint]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, // <target short address: uint16_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.DataIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetShortAddress'
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8005
    //             }
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.SimpleDescriptor]: {
    //     request: [
    //         {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, // <target short address: uint16_t>
    //         {name: 'endpoint', parameterType: ParameterType.UINT8}, // <endpoint: uint8_t>
    //     ],
    //     response: [
    //         [
    //             {receivedProperty: 'code', matcher: equal, value: TelinkMessageCode.DataIndication},
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedProperty: 'payload.targetShortAddress'
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8004
    //             }
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.Bind]: {
    //     request: [
    //         {name: 'targetExtendedAddress', parameterType: ParameterType.IEEEADDR}, // <target extended address: uint64_t>
    //         {name: 'targetEndpoint', parameterType: ParameterType.UINT8}, // <target endpoint: uint8_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8}, // <destination address mode: uint8_t>
    //         {
    //             name: 'destinationAddress',
    //             parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY
    //         }, // <destination address:uint16_t or uint64_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint (
    //         // value ignored for group address): uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.DataIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedExtraParameter: 'destinationNetworkAddress'
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8021
    //             },
    //             {
    //                 receivedProperty: 'payload.profileID',
    //                 matcher: equal,
    //                 value: 0x0000
    //             },
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.UnBind]: {
    //     request: [
    //         {name: 'targetExtendedAddress', parameterType: ParameterType.IEEEADDR}, // <target extended address: uint64_t>
    //         {name: 'targetEndpoint', parameterType: ParameterType.UINT8}, // <target endpoint: uint8_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8}, // <destination address mode: uint8_t>
    //         {
    //             name: 'destinationAddress',
    //             parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY
    //         }, // <destination address:uint16_t or uint64_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint (
    //         // value ignored for group address): uint8_t>
    //     ],
    //     response: [
    //         [
    //             {
    //                 receivedProperty: 'code',
    //                 matcher: equal,
    //                 value: TelinkMessageCode.DataIndication
    //             },
    //             {
    //                 receivedProperty: 'payload.sourceAddress',
    //                 matcher: equal,
    //                 expectedExtraParameter: 'destinationNetworkAddress'
    //             },
    //             {
    //                 receivedProperty: 'payload.clusterID',
    //                 matcher: equal,
    //                 value: 0x8022
    //             },
    //             {
    //                 receivedProperty: 'payload.profileID',
    //                 matcher: equal,
    //                 value: 0x0000
    //             },
    //         ],
    //     ]
    // },
    // [TelinkCommandCode.AddGroup]: {
    //     request: [
    //         { name: 'addressMode', parameterType: ParameterType.UINT8 }, //<device type: uint8_t>
    //         { name: 'shortAddress', parameterType: ParameterType.UINT16BE },
    //         { name: 'sourceEndpoint', parameterType: ParameterType.UINT8 },
    //         { name: 'destinationEndpoint', parameterType: ParameterType.UINT8 },
    //         { name: 'groupAddress', parameterType: ParameterType.UINT16BE },
    //     ]
    // }
};
