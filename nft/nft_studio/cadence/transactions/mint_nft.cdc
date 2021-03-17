transaction(recipient: Address) {

    // The reference to the Minter resource stored in account storage
    let minterRef: &DappState.NFTMinter

    prepare(acct: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minterRef = acct.borrow<&DappState.NFTMinter>(from: /storage/NFTMinter)
            ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(/public/NFTCollection)!
            .borrow<&{DappState.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minterRef.mintNFT(recipient: receiver, generator: "")
    }
}