// TODO: 
// Add imports here, then do steps 1, 2, and 3.

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be signed by the account that has the minter resource
// stored at path 'KittyItems.MinterStoragePath'.

transaction(recipient: Address, typeID: UInt64) {
    
    // local variable for storing the minter reference
    let minter: &KittyItems.NFTMinter
    // local variable for a reference to the recipient's Kitty Items Collection
    let receiver: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {

        // 1) borrow a reference to the NFTMinter resource in the signer's storage
        
        // 2) borrow a public reference to the recipient's Kitty Items Collection
        
    }

    execute {

        // 3) mint the NFT and deposit it into the recipient's Collection
        
    }
}