// This transaction allows the Minter account to mint an NFT
// and deposit it into its collection.
transaction {

    // The reference to the collection that will be receiving the NFT
    let receiverRef: &{DappState.NFTReceiver}

    // The reference to the Minter resource stored in account storage
    let minterRef: &DappState.NFTMinter

    prepare(acct: AuthAccount) {
        // Get the owner's collection capability and borrow a reference
        self.receiverRef = acct.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow receiver reference")
        
        // Borrow a capability for the NFTMinter in storage
        self.minterRef = acct.borrow<&DappState.NFTMinter>(from: /storage/NFTMinter)
            ?? panic("could not borrow minter reference")
    }

    execute {
        // Use the minter reference to mint an NFT, which deposits
        // the NFT into the collection that is sent as a parameter.
        let newNFT <- self.minterRef.mintNFT()

        self.receiverRef.deposit(token: <-newNFT)
    }
}
