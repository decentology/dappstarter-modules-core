import NFTContract from Project.NFTContract
import NonFungibleToken from Flow.NonFungibleToken

transaction {

  prepare(acct: AuthAccount) {
    // if the account doesn't already have a NFT collection
    if acct.borrow<&NFTContract.Collection>(from: /storage/nftCollection) == nil {

      // create a new empty collection
      let nftCollection <- NFTContract.createEmptyCollection()
            
      // save it to the account
      acct.save(<-nftCollection, to: /storage/nftCollection)

      // create a public capability for the collection
      acct.link<&{NonFungibleToken.CollectionPublic}>(/public/nftCollection, target: /storage/nftCollection)
    
      log("Gave account a NFT collection")
    }
  }

  execute {
    
  }
}
