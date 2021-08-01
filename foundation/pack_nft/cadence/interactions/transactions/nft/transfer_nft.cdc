import NFTContract from Project.NFTContract
import NonFungibleToken from Flow.NonFungibleToken

// Transfers an NFT from the giver to the recipient

transaction(id: UInt64, recipient: Address) {
  let nftCollectionRef: &NFTContract.Collection

  let recipientNFTCollectionRef: &NFTContract.Collection{NonFungibleToken.CollectionPublic}

  prepare(giver: AuthAccount) {
      // Borrows the giver's NFT Collection
      self.nftCollectionRef = giver.borrow<&NFTContract.Collection>(from: /storage/nftCollection)
        ?? panic("Could not borrow the user's NFT Collection")

      // Borrows the recipient's NFT Collection
      self.recipientNFTCollectionRef = getAccount(recipient).getCapability(/public/nftCollection)
          .borrow<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow the public capability for the recipient's account")
    } 

  execute {
      // withdraws an NFT from the giver's NFT Collection
      let nft <- self.nftCollectionRef.withdraw(withdrawID: id)
      
      // deposits an NFT into the recipient's NFT Collection
      self.recipientNFTCollectionRef.deposit(token: <-nft)

      log("Transfered the NFT from the giver to the recipient")
  }
}