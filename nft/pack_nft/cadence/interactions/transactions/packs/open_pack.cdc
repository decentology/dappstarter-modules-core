import PackContract from Project.PackContract
import NFTContract from Project.NFTContract
import AdminContract from Project.AdminContract
import NonFungibleToken from Flow.NonFungibleToken

transaction(id: UInt64, recipient: Address) {
    
  prepare(admin: AuthAccount) {
      let recipientAccount = getAccount(recipient)
      let recipientPackCollectionRef = recipientAccount.getCapability(/public/packCollection)
          .borrow<&PackContract.Collection{PackContract.IPackCollectionAdminAccessible}>()
          ?? panic("Could not borrow the account's pack collection ref")
        
      let recipientNFTCollectionRef = recipientAccount.getCapability(/public/nftCollection)
          .borrow<&{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow the account's NFT collection ref")

      let adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
          ?? panic("Could not get admin's ref")

      adminRef.openPack(id: id, packCollectionRef: recipientPackCollectionRef, nftCollectionRef: recipientNFTCollectionRef)
  
      log("Pack opened")
  }

  execute {
      
  }
}