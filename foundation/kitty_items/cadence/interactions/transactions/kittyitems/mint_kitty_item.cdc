import NonFungibleToken from Flow.NonFungibleToken
import KittyItems from Project.KittyItems

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, typeID: UInt64) {
    
    // local variable for storing the minter reference
    let minter: &KittyItems.NFTMinter
    // the recipient's Kitty Items Collection for depositing
    let receiver: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {

        // borrow a reference to the NFTMinter resource in storage
        self.minter = signer.borrow<&KittyItems.NFTMinter>(from: KittyItems.MinterStoragePath)
                            ?? panic("Could not borrow a reference to the NFT minter")

        // borrow the recipient's public NFT collection reference
        self.receiver = getAccount(recipient).getCapability(KittyItems.CollectionPublicPath)
                            .borrow<&{NonFungibleToken.CollectionPublic}>()
                            ?? panic("Could not get receiver reference to the NFT Collection")
    }

    execute {
        // mint the NFT and deposit it to the recipient's collection
        self.minter.mintNFT(recipient: self.receiver, typeID: typeID)
    }
}