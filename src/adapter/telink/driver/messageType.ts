/* istanbul ignore file */
/* eslint-disable */
import {TelinkMessageCode} from "./constants";
import ParameterType from "./parameterType";

export interface TelinkMessageParameter {
    name: string;
    parameterType: ParameterType;
    options?: object;
}

export interface TelinkMessageType {
    response: TelinkMessageParameter[];
}

export const TelinkMessage: { [k: number]: TelinkMessageType } = {
    [TelinkMessageCode.ZBHCI_CMD_ACKNOWLEDGE]: {
        response: [
            {name: 'messageCode', parameterType: ParameterType.UINT16BE},
            {name: 'status', parameterType: ParameterType.UINT8},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
        ]
    },

    [TelinkMessageCode.ZBHCI_CMD_RAW_DATA_MSG]: {
        response: [
            {name: 'destinationAddressMode', parameterType: ParameterType.UINT8},
            {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint: uint8_t>
            {name: 'destinationAddress', parameterType: ParameterType.UINT16},

            {name: 'sourceAddressMode', parameterType: ParameterType.UINT8}, // <source address mode: uint8_t>
            {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
            {name: 'profileID', parameterType: ParameterType.UINT16}, // <Profile ID: uint16_t>
            {name: 'clusterID', parameterType: ParameterType.UINT16}, // <cluster ID: uint16_t>

            // {name: 'length', parameterType: ParameterType.UINT16}, // removed from packet
            // {name: 'ptr', parameterType: ParameterType.UINT32}, // removed from packet
            // {name: 'tick', parameterType: ParameterType.UINT32}, // removed from packet
            {name: 'sourceAddress', parameterType: ParameterType.SHORT_OR_IEEE_LE},
            {name: 'sourceMacAddress', parameterType: ParameterType.UINT16},

            {name: 'status', parameterType: ParameterType.UINT8},
            {name: 'securityStatus', parameterType: ParameterType.UINT8},
            {name: 'lqi', parameterType: ParameterType.UINT8},
            {name: 'rssi', parameterType: ParameterType.INT8},
            {name: 'apsCounter', parameterType: ParameterType.UINT8},

            {name: 'payloadSize', parameterType: ParameterType.UINT16}, // <payload size : uint8_t>
            {name: 'payload', parameterType: ParameterType.BUFFER_RAW}, // <payload : data each element is
        ]
    },

    // [TelinkMessageCode.GetTimeServer]: {
    //     response: [
    //         {name: 'timestampUTC', parameterType: ParameterType.UINT32}, // <Timestamp UTC: uint32_t> from 2000-01-01 00:00:00
    //     ]
    // },
    [TelinkMessageCode.ZBHCI_CMD_MAC_ADDR_IND]: {
        response: [
            {name: 'ieee', parameterType: ParameterType.IEEEADDR},
        ]
    },
    [TelinkMessageCode.ZBHCI_CMD_NODES_DEV_ANNCE_IND]: {
        response: [
            {name: 'shortAddress', parameterType: ParameterType.UINT16BE},
            {name: 'ieee', parameterType: ParameterType.IEEEADDR},
            {name: 'MACcapability', parameterType: ParameterType.MACCAPABILITY},
            // MAC capability
            // Bit 0 – Alternate PAN Coordinator
            // Bit 1 – Device Type
            // Bit 2 – Power source
            // Bit 3 – Receiver On when Idle
            // Bit 4,5 – Reserved
            // Bit 6 – Security capability
            // Bit 7 – Allocate Address
            // {name: 'rejoin', parameterType: ParameterType.UINT8},
        ]
    },
    [TelinkMessageCode.ZBHCI_CMD_NODE_LEAVE_IND]: {
        response: [
            {name: 'totalCount', parameterType: ParameterType.UINT16BE}, // <Packet Type: uint16_t>
            {name: 'ieee', parameterType: ParameterType.IEEEADDR},
        ]
    },
    [TelinkMessageCode.ZBHCI_CMD_DATA_CONFIRM]: {
        response: [
            {name: 'status', parameterType: ParameterType.UINT8}, // <status:uint8_t>
            // 0 = Success
            // 1 = Incorrect parameters
            // 2 = Unhandled command
            // 3 = Command failed
            // eslint-disable-next-line max-len
            // 4 = Busy (Node is carrying out a lengthy operation and is currently unable to handle the incoming command)
            // 5 = Stack already started (no new configuration accepted)
            // 128 – 244 = Failed (ZigBee event codes)
            // Packet Type: The value of the initiating command request.
            {name: 'sequence', parameterType: ParameterType.UINT8}, // <sequence number: uint8_t>
            {name: 'packetType', parameterType: ParameterType.UINT16BE}, // <Packet Type: uint16_t>

            // from 3.1d
            // {name: 'requestSent', parameterType: ParameterType.MAYBE_UINT8},// <requestSent: uint8_t>  - 1 if a request been sent to
            // // a device(aps ack/nack 8011 should be expected) , 0 otherwise
            // {name: 'seqApsNum', parameterType: ParameterType.MAYBE_UINT8},// <seqApsNum: uint8_t>  - sqn of the APS layer - used to
            // // check sqn sent back in aps ack
            //
            // // from 3.1e
            // {name: 'PDUM_u8GetNpduUse', parameterType: ParameterType.MAYBE_UINT8},
            // {name: 'u8GetApduUse', parameterType: ParameterType.MAYBE_UINT8},
            //
            // // debug 3.1e++
            // {name: 'PDUM_u8GetMaxNpduUse', parameterType: ParameterType.MAYBE_UINT8},
            // {name: 'u8GetMaxApduUse', parameterType: ParameterType.MAYBE_UINT8},
        ]
    },
    [TelinkMessageCode.ZBHCI_CMD_ZCL_REPORT_MSG_RCV]: {
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
            {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint: uint8_t>
            {name: 'seqNum', parameterType: ParameterType.UINT8}, // <seqNum: uint8_t>
            {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
            {name: 'numAttr', parameterType: ParameterType.UINT8}, // <seqNum: uint8_t>
            {name: 'attrData', parameterType: ParameterType.BUFFER_RAW}, // <data: auint8_t>
        ],
    },
    [TelinkMessageCode.ZBHCI_CMD_DISCOVERY_NODE_DESC_RSP]: {
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
            {name: 'status', parameterType: ParameterType.UINT8},
            {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE},
            {name: 'logicalType', parameterType: ParameterType.UINT8},
            {name: 'flags', parameterType: ParameterType.UINT8},
            {name: 'MACcapability', parameterType: ParameterType.MACCAPABILITY},
            {name: 'manufacturerCode', parameterType: ParameterType.UINT16BE},
            {name: 'payload', parameterType: ParameterType.BUFFER_RAW},
        ],
    },
    [TelinkMessageCode.ZBHCI_CMD_DISCOVERY_SIMPLE_DESC_RSP]: {
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
            {name: 'status', parameterType: ParameterType.UINT8},
            {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE},
            {name: 'payload', parameterType: ParameterType.BUFFER_RAW},
        ],
    },
    [TelinkMessageCode.ZBHCI_CMD_DISCOVERY_ACTIVE_EP_RSP]: {
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
            {name: 'status', parameterType: ParameterType.UINT8},
            {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE},
            {name: 'payload', parameterType: ParameterType.BUFFER_RAW},
        ],
    },
    [TelinkMessageCode.ZBHCI_CMD_MGMT_LEAVE_RSP]: {
        // src_addr, seq_num, status, ieee_addr, rejoin = struct.unpack("!H2BQB", bytes_data)
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
            {name: 'status', parameterType: ParameterType.UINT8},
            {name: 'ieee', parameterType: ParameterType.IEEEADDR},
            {name: 'rejoin', parameterType: ParameterType.UINT8},
        ],
    },

    [TelinkMessageCode.ZBHCI_CMD_GET_LOCAL_NWK_INFO_RSP]: {
        response: [
            {name: 'devType', parameterType: ParameterType.UINT8},
            {name: 'MACcapability', parameterType: ParameterType.MACCAPABILITY},
            {name: 'onANetwork', parameterType: ParameterType.UINT8},
            {name: 'panID', parameterType: ParameterType.UINT16BE},
            {name: 'extPanID', parameterType: ParameterType.IEEEADDR},
            {name: 'nwkAddr', parameterType: ParameterType.UINT16BE},
            {name: 'ieee', parameterType: ParameterType.IEEEADDR},
        ],
    },

    [TelinkMessageCode.ZBHCI_CMD_AF_DATA_SEND_RSP] : {
        response: [
            {name: 'targetShortAddress', parameterType: ParameterType.UINT16BE}, // <target short address: uint16_t>
            {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
            {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint: uint8_t>
            {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
            // {name: 'profileID', parameterType: ParameterType.UINT16BE}, // <profile ID: uint16_t>
            // {name: 'securityMode', parameterType: ParameterType.UINT8}, // <security mode: uint8_t>
            // {name: 'radius', parameterType: ParameterType.UINT8}, // <radius: uint8_t>
            {name: 'dataLength', parameterType: ParameterType.UINT16BE}, // <data length: uint8_t>
            {name: 'data', parameterType: ParameterType.BUFFER}, // <data: auint8_t>
        ]
    },

    [TelinkMessageCode.ZBHCI_CMD_BINDING_RSP]: {
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
            {name: 'status', parameterType: ParameterType.UINT8},
        ],
    },

    [TelinkMessageCode.ZBHCI_CMD_UNBINDING_RSP]: {
        response: [
            {name: 'sourceAddress', parameterType: ParameterType.UINT16BE},
            {name: 'seqNum', parameterType: ParameterType.UINT8},
            {name: 'status', parameterType: ParameterType.UINT8},
        ],
    },

};
