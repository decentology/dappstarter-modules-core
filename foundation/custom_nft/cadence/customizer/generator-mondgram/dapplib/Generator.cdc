pub contract Generator {
    pub struct Metadata {
        pub var scale: UInt64
        pub var mdna: String
        pub var color: String

        init(_metadata: Generator.Metadata) {
            self.scale = _metadata.scale
            self.mdna = _metadata.mdna
            self.color = _metadata.color
        }
    }
}