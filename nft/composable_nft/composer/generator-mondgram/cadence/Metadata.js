const t = require('@onflow/types');

module.exports = class Metadata {
    static getCadenceType(metaData, addressOfGenerator) {
        let struct = {
            // the actual values of the struct
            value: {
                fields: [
                    { name: 'scale', value: parseInt(metaData.scale) },
                    { name: 'mdna', value: metaData.mdna },
                    { name: 'color', value: metaData.color },
                ]
            },
            // the layout of the struct
            type: t.Struct(`A.${addressOfGenerator}.Generator.Metadata`, [
                { name: 'scale', value: t.UInt64 },
                { name: 'mdna', value: t.String },
                { name: 'color', value: t.String },
            ])
        }
        return struct
    }
}