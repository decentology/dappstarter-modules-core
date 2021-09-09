import PackContract from "../../../contracts/Project/PackContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"

// Sets up an account to handle Packs. Must be called by an account before
// interacting with Packs or an error will be thrown.

transaction {

  prepare(acct: AuthAccount) {
    // if the account doesn't already have a pack collection
    if (acct.borrow<&PackContract.Collection>(from: /storage/packCollection) == nil) {

      // create a new empty collection
      let packCollection <- PackContract.createEmptyCollection()
            
      // save it to the account
      acct.save(<-packCollection, to: /storage/packCollection)

      // create a public capability for the collection
      acct.link<&PackContract.Collection{PackContract.IPackCollectionPublic, PackContract.IPackCollectionAdminAccessible, NonFungibleToken.CollectionPublic}>(/public/packCollection, target: /storage/packCollection)
    
      log("Gave account a pack collection")
    }
  }

  execute {
    
  }
}