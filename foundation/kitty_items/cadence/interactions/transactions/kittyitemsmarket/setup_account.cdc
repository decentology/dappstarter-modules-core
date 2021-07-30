import KittyItemsMarket from Project.KittyItemsMarket
import FungibleToken from Flow.FungibleToken
import NonFungibleToken from Flow.NonFungibleToken
import KittyItems from Project.KittyItems
import Kibble from Project.Kibble

// This transaction is confusing. But, all it's doing is allowing the signer
// to setup their account so they can list Kitty Items for sale. This happens in a few steps:

// 1) Get a capability to the signer's Kibble Vault so when a purchase is made
// on their SaleCollection, the payment goes to this Kibble Vault.
// 2) Get a (private) capability to the signer's Kitty Items Collection so when
// a user wants to purchase from this SaleCollection, it takes it out of 
// this collection.
// 3) Create a new SaleCollection and expose it to the public
// so people can purchase from it.

transaction() {

  prepare(signer: AuthAccount) {
    if signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) == nil && signer.borrow<&KittyItems.Collection>(from: KittyItems.CollectionStoragePath) != nil {
      let ownerKibbleVault = signer.getCapability<&Kibble.Vault{FungibleToken.Receiver}>(Kibble.ReceiverPublicPath)
      assert(ownerKibbleVault.borrow() != nil, message: "Missing or mis-typed Kibble Vault")

      /** The reason we do this part is because we cannot do getCapability for something
      in storage, so because we need a Capability specifically we just put it in a private
      path and get it from there. By making it private its also only available to us **/
      signer.link<&KittyItems.Collection>(/private/privateKittyItemsCollection, target: KittyItems.CollectionStoragePath)
      
      let ownerKittyItemsCollection = signer.getCapability<&KittyItems.Collection>(/private/privateKittyItemsCollection)
      assert(ownerKittyItemsCollection.borrow() != nil, message: "Missing or mis-typed Kitty Items Collection")

      
      // create a new empty collection
      let saleCollection <- KittyItemsMarket.createSaleCollection(ownerVault: ownerKibbleVault, ownerCollection: ownerKittyItemsCollection)
            
      // save it to the account
      signer.save(<-saleCollection, to: KittyItemsMarket.MarketStoragePath)

      // create a public capability for the collection
      signer.link<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>(KittyItemsMarket.MarketPublicPath, target: KittyItemsMarket.MarketStoragePath)
    
      log("Gave account a sale collection")
    }
  }
}