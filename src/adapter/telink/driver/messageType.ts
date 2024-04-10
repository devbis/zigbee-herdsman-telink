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

    // [TelinkMessageCode.PermitJoinStatus]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status:uint8_t>
    //     ]
    // },

    // [TelinkMessageCode.ZBHCI_CMD_DATA_CONFIRM]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         {name: 'profileID', parameterType: ParameterType.UINT16BE}, // <Profile ID: uint16_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint: uint8_t>
    //         {name: 'sourceAddressMode', parameterType: ParameterType.UINT8}, // <source address mode: uint8_t>
    //         {name: 'sourceAddress', parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY},
    //         // <source address: uint16_t or uint64_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8},
    //         // <destination address mode: uint8_t>
    //         {name: 'destinationAddress', parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY},
    //         // <destination address: uint16_t or uint64_t>
    //         // {name: 'payloadSize', parameterType: ParameterType.UINT8}, // <payload size : uint8_t>
    //         {name: 'payload', parameterType: ParameterType.BUFFER_RAW}, // <payload : data each element is
    //         // uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.NodeClusterList]: {
    //     response: [
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, //<source endpoint: uint8_t t>
    //         {name: 'profileID', parameterType: ParameterType.UINT16}, // <profile ID: uint16_t>
    //         {name: 'clusterCount', parameterType: ParameterType.UINT8},
    //         {name: 'clusterList', parameterType: ParameterType.LIST_UINT16}, // <cluster list: data each entry is uint16_t>
    //     ]
    // },
    // [TelinkMessageCode.NodeAttributeList]: {
    //     response: [
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, //<source endpoint: uint8_t t>
    //         {name: 'profileID', parameterType: ParameterType.UINT16}, // <profile ID: uint16_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16}, // <cluster ID: uint16_t>
    //         {name: 'attributeCount', parameterType: ParameterType.UINT8},
    //         {name: 'attributeList', parameterType: ParameterType.LIST_UINT16}, //  <attribute list: data each entry is uint16_t>
    //     ]
    // },
    // [TelinkMessageCode.NodeCommandIDList]: {
    //     response: [
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, //<source endpoint: uint8_t t>
    //         {name: 'profileID', parameterType: ParameterType.UINT16}, // <profile ID: uint16_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16}, // <cluster ID: uint16_t>
    //         {name: 'commandIDCount', parameterType: ParameterType.UINT8},
    //         {name: 'commandIDList', parameterType: ParameterType.LIST_UINT8}, // <command ID list:data each entry is uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.APSDataACK]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         // {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
    //         // {name: 'destinationAddressMode', parameterType: ParameterType.UINT8},
    //         // // <destination address mode: uint8_t>
    //         {name: 'destinationAddress', parameterType: ParameterType.UINT16BE},
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <destination endpoint: uint8_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16BE},
    //         // // <destination address: uint16_t or uint64_t>
    //         {name: 'seqNumber', parameterType: ParameterType.UINT8}, // <seq number: uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.APSDataConfirm]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <source endpoint: uint8_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8},

    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8},
    //         // <destination address mode: uint8_t>
    //         {name: 'destinationAddress', parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY},
    //         // <destination address: uint16_t or uint64_t>
    //         {name: 'seqNumber', parameterType: ParameterType.UINT8}, // <seq number: uint8_t>
    //         // from 3.1e
    //         {name: 'PDUM_u8GetNpduUse', parameterType: ParameterType.MAYBE_UINT8},
    //         {name: 'u8GetApduUse', parameterType: ParameterType.MAYBE_UINT8},
    //     ]
    // },
    // [TelinkMessageCode.APSDataConfirmFailed]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, // <src endpoint: uint8_t>
    //         {name: 'destinationEndpoint', parameterType: ParameterType.UINT8}, // <dst endpoint: uint8_t>
    //         {name: 'destinationAddressMode', parameterType: ParameterType.UINT8}, // <dst address mode: uint8_t>
    //         {name: 'destinationAddress', parameterType: ParameterType.ADDRESS_WITH_TYPE_DEPENDENCY},
    //         // <destination address: uint64_t>
    //         {name: 'seqNumber', parameterType: ParameterType.UINT8}, // <seq number: uint8_t>
    //         // from 3.1e
    //         {name: 'PDUM_u8GetNpduUse', parameterType: ParameterType.MAYBE_UINT8},
    //         {name: 'u8GetApduUse', parameterType: ParameterType.MAYBE_UINT8},
    //     ]
    // },
    // [TelinkMessageCode.NetworkState]: {
    //     response: [
    //         {name: 'shortAddress', parameterType: ParameterType.UINT16BE}, // <Short Address: uint16_t>
    //         {name: 'extendedAddress', parameterType: ParameterType.IEEEADDR}, // <Extended Address: uint64_t>
    //         {name: 'PANID', parameterType: ParameterType.UINT16BE}, // <PAN ID: uint16_t>
    //         {name: 'ExtPANID', parameterType: ParameterType.IEEEADDR}, // <Ext PAN ID: uint64_t>
    //         {name: 'Channel', parameterType: ParameterType.UINT8}, // <Channel: uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.VersionList]: {
    //     response: [
    //         {name: 'major', parameterType: ParameterType.UINT8},
    //         {name: 'minor', parameterType: ParameterType.UINT8},
    //         {name: 'revision', parameterType: ParameterType.UINT16},
    //     ]
    // },
    // [TelinkMessageCode.NetworkJoined]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         // Status:
    //         // 0 = Joined existing network
    //         // 1 = Formed new network
    //         // 128 – 244 = Failed (ZigBee event codes)
    //         {name: 'shortAddress', parameterType: ParameterType.UINT16BE}, // <short address: uint16_t>
    //         // {name: 'extendedAddress', parameterType: ParameterType.IEEEADDR}, // <extended address:uint64_t>
    //         // {name: 'channel', parameterType: ParameterType.UINT8}, // <channel: uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.LeaveIndication]: {
    //     response: [
    //         {name: 'extendedAddress', parameterType: ParameterType.IEEEADDR}, // <extended address: uint64_t>
    //         {name: 'rejoin', parameterType: ParameterType.UINT8}, // <rejoin status: uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.ManagementLeaveResponse]: {
    //     response: [
    //         {name: 'sqn', parameterType: ParameterType.UINT8},
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //     ]
    // },
    // [TelinkMessageCode.RouterDiscoveryConfirm]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         // {name: 'nwkStatus', parameterType: ParameterType.UINT8}, // <nwk status: uint8_t>
    //         // {name: 'dstAddress', parameterType: ParameterType.UINT16BE}, // <nwk status: uint16_t>
    //     ]
    // },
    // [TelinkMessageCode.SimpleDescriptorResponse]: {
    //     response: [
    //         {name: 'sourceEndpoint', parameterType: ParameterType.UINT8}, //<source endpoint: uint8_t>
    //         {name: 'profile ID', parameterType: ParameterType.UINT16BE}, // <profile ID: uint16_t>
    //         {name: 'clusterID', parameterType: ParameterType.UINT16BE}, // <cluster ID: uint16_t>
    //         {name: 'attributeList', parameterType: ParameterType.LIST_UINT16BE}, // <attribute list: data each entry is uint16_t>
    //     ]
    // },
    // [TelinkMessageCode.ManagementLQIResponse]: {
    //     response: [
    //         {name: 'sequence', parameterType: ParameterType.UINT8}, // <Sequence number: uint8_t>
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         {name: 'neighbourTableEntries', parameterType: ParameterType.UINT8}, // <Neighbour Table Entries : uint8_t>
    //         {name: 'neighbourTableListCount', parameterType: ParameterType.UINT8}, // <Neighbour Table List Count : uint8_t>
    //         {name: 'startIndex', parameterType: ParameterType.UINT8}, // <Start Index : uint8_t>
    //         // @TODO list TYPE
    //         // <List of Entries elements described below :>
    //         // Note: If Neighbour Table list count is 0, there are no elements in the list.
    //         {name: 'NWKAddress', parameterType: ParameterType.UINT16BE}, // NWK Address : uint16_t
    //         {name: 'Extended PAN ID', parameterType: ParameterType.UINT64}, // Extended PAN ID : uint64_t
    //         {name: 'IEEE Address', parameterType: ParameterType.IEEEADR}, // IEEE Address : uint64_t
    //         {name: 'Depth', parameterType: ParameterType.UINT8}, // Depth : uint_t
    //         {name: 'linkQuality', parameterType: ParameterType.UINT8}, // Link Quality : uint8_t
    //         {name: 'bitMap', parameterType: ParameterType.UINT8}, // Bit map of attributes Described below: uint8_t
    //         // bit 0-1 Device Type
    //         // (0-Coordinator 1-Router 2-End Device)
    //         // bit 2-3 Permit Join status
    //         // (1- On 0-Off)
    //         // bit 4-5 Relationship
    //         // (0-Parent 1-Child 2-Sibling)
    //         // bit 6-7 Rx On When Idle status
    //         // (1-On 0-Off)
    //         {name: 'srcAddress', parameterType: ParameterType.UINT16BE}, // <Src Address : uint16_t> ( only from v3.1a)
    //     ]
    // },
    // [TelinkMessageCode.PDMEvent]: {
    //     response: [
    //         {name: 'eventStatus', parameterType: ParameterType.UINT8}, // <event status: uint8_t>
    //         {name: 'recordID', parameterType: ParameterType.UINT32BE}, // <record ID: uint32_t>

    //     ]
    // },
    // [TelinkMessageCode.PDMLoaded]: {
    //     response: [
    //         {name: 'length', parameterType: ParameterType.UINT8},
    //     ]
    // },
    // [TelinkMessageCode.RestartNonFactoryNew]: { // Non “Factory new” Restart
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         //	0 – STARTUP
    //         // 1 – RUNNING
    //         // 2 – NFN_START
    //     ]
    // },
    // [TelinkMessageCode.RestartFactoryNew]: { // “Factory New” Restart
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8}, // <status: uint8_t>
    //         // 0 – STARTUP
    //         // 2 – NFN_START
    //         // 6 – RUNNING
    //         // The node is not yet provisioned.
    //     ]
    // },
    // [TelinkMessageCode.ExtendedStatusCallBack]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT8},
    //         // https://github.com/fairecasoimeme/Telink/blob/aac14153db332eb5b898cba0f57f5999e5cf11eb/Module%20Radio/Firmware/src/sdk/JN-SW-4170/Components/ZPSNWK/Include/zps_nwk_pub.h#L89
    //     ]
    // },
    // [0x8001]: {
    //     response: [
    //         {name: 'logLevel', parameterType: ParameterType.LOG_LEVEL},
    //         {name: 'log', parameterType: ParameterType.STRING},
    //     ]
    // },
    // [TelinkMessageCode.AddGroupResponse]: {
    //     response: [
    //         {name: 'status', parameterType: ParameterType.UINT16BE},
    //         {name: 'groupAddress', parameterType: ParameterType.UINT16BE},
    //     ]
    // }
};
