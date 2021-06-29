import NFTContract from Project.NFTContract
import NonFungibleToken from Flow.NonFungibleToken

transaction(id: UInt64, recipient: Address) {
  let nftCollectionRef: &NFTContract.Collection

  prepare(acct: AuthAccount) {
      self.nftCollectionRef = acct.borrow<&NFTContract.Collection>(from: /storage/nftCollection)
        ?? panic("Could not borrow the user's NFT collection")
    } 

  execute {
      let nft <- self.nftCollectionRef.withdraw(withdrawID: id)

      let recipientAccount = getAccount(recipient)
      let recipientNFTCollectionRef = recipientAccount.getCapability(/public/nftCollection)
          .borrow<&{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow the public capability for the recipient's account")
      
      recipientNFTCollectionRef.deposit(token: <-nft)

      log("Transfered the NFT from the giver to the recipient")
  }
}