import PackContract from Project.PackContract
import AdminContract from Project.AdminContract
import NonFungibleToken from Flow.NonFungibleToken

transaction(id: UInt64, recipient: Address) {

    let recipientPackCollectionRef: &PackContract.Collection{PackContract.IPackCollectionAdminAccessible}

    let recipientNFTCollectionRef: &{NonFungibleToken.CollectionPublic}

    let adminRef: &AdminContract.Admin
    
    prepare(admin: AuthAccount) {
        self.recipientPackCollectionRef = getAccount(recipient).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{PackContract.IPackCollectionAdminAccessible}>()
            ?? panic("Could not borrow the account's pack collection ref")
            
        self.recipientNFTCollectionRef = getAccount(recipient).getCapability(/public/nftCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the account's NFT collection ref")

        self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
            ?? panic("Could not get admin's ref")
    }

    execute {
        self.adminRef.openPack(id: id, packCollectionRef: self.recipientPackCollectionRef, nftCollectionRef: self.recipientNFTCollectionRef)
    
        log("Pack opened")
    }
}