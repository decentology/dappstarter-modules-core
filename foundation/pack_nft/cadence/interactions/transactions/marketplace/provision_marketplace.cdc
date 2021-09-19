import MarketplaceContract from "../../../contracts/Project/MarketplaceContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"
import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"

// Sets up the admin to list Packs for sale by giving them a SaleCollection

transaction {

  prepare(acct: AuthAccount) {
    if acct.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) == nil && acct.borrow<&NonFungibleToken.Collection>(from: /storage/packCollection) != nil {
      // same as doing <&FlowToken.Vault{FungibleToken.Receiver}> but we don't have
      // to import FlowToken this way
      let ownerVault = acct.getCapability<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
      assert(ownerVault.borrow() != nil, message: "Missing or mis-typed Token Vault")

      /** The reason we do this part is because we cannot do getCapability for something
      in storage, so because we need a Capability specifically we just put it in a private
      path and get it from there. By making it private its also only available to us **/
      acct.link<&NonFungibleToken.Collection>(/private/packCollection, target: /storage/packCollection)
      
      let ownerPackCollection = acct.getCapability<&NonFungibleToken.Collection>(/private/packCollection)
      assert(ownerPackCollection.borrow() != nil, message: "Missing or mis-typed PackCollection")
      /** **/
      
      // create a new empty collection
      let packSaleCollection <- MarketplaceContract.createSaleCollection(ownerVault: ownerVault, ownerCollection: ownerPackCollection)
            
      // save it to the account
      acct.save(<-packSaleCollection, to: /storage/packSaleCollection)

      // create a public capability for the collection
      acct.link<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>(/public/packSaleCollection, target: /storage/packSaleCollection)
    
      log("Gave account a sale collection")
    }
  }

  execute {
    
  }
}