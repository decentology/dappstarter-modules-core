import PackContract from Project.PackContract
import AdminContract from Project.AdminContract
import NonFungibleToken from Flow.NonFungibleToken

// Called by the admin to open a Pack in the "recipient" account.

transaction(id: UInt64, recipient: Address) {

    let recipientPackCollectionRef: &PackContract.Collection{PackContract.IPackCollectionAdminAccessible}

    let recipientNFTCollectionRef: &{NonFungibleToken.CollectionPublic}

    let adminRef: &AdminContract.Admin
    
    prepare(admin: AuthAccount) {
        // Borrows the Pack owner's Pack Collection
        self.recipientPackCollectionRef = getAccount(recipient).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{PackContract.IPackCollectionAdminAccessible}>()
            ?? panic("Could not borrow the account's pack collection ref")
            
        // Borrows the Pack owner's NFT Collection so we can deposit the NFTs into it
        self.recipientNFTCollectionRef = getAccount(recipient).getCapability(/public/nftCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the account's NFT collection ref")

        // Borrows a reference to an Admin resource
        self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
            ?? panic("Could not get admin's ref")
    }

    execute {
        // Calls openPack on the admin resource reference
        self.adminRef.openPack(id: id, packCollectionRef: self.recipientPackCollectionRef, nftCollectionRef: self.recipientNFTCollectionRef)
    
        log("Pack opened")
    }
}