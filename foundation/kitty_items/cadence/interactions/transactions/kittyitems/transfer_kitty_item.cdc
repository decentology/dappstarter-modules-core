import NonFungibleToken from Flow.NonFungibleToken
import KittyItems from Project.KittyItems

// This transaction transfers a Kitty Item from one account to another.

transaction(recipient: Address, withdrawID: UInt64) {
    // A reference to the signer's Kitty Items Collection
    let collectionRef: &KittyItems.Collection

    // A reference to the receiver's Kitty Items Collection for depositing
    let depositRef: &{NonFungibleToken.CollectionPublic}

    prepare(signer: AuthAccount) {
        // borrow a reference to the signer's NFT collection
        self.collectionRef = signer.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath)
                                ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receiver's collection
        self.depositRef = getAccount(recipient).getCapability(KittyItems.CollectionPublicPath)
                            .borrow<&{NonFungibleToken.CollectionPublic}>()
                            ?? panic("Could not borrow the recipient's Kitty Items Collection")
    }

    execute {
        // withdraw the NFT from the owner's collection
        let nft <- self.collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        self.depositRef.deposit(token: <-nft)
    }
}