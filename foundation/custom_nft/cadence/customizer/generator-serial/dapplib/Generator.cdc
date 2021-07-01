pub contract Generator {
    pub struct Metadata {
        pub var serial: UInt64

        init(_metadata: Generator.Metadata) {
            self.serial = _metadata.serial
        }
    }
}