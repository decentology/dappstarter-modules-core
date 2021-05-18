const t = require('@onflow/types');

module.exports = class Metadata {
    static getCadenceType(metaData, addressOfGenerator) {
        let struct = {
            // the actual values of the struct
            value: {
                fields: [
                    { name: 'serial', value: parseInt(metaData.serial) },
                ]
            },
            // the layout of the struct
            type: t.Struct(`A.${addressOfGenerator}.Generator.Metadata`, [
                { name: 'serial', value: t.UInt64 },
            ])
        }
        return struct
    }
}