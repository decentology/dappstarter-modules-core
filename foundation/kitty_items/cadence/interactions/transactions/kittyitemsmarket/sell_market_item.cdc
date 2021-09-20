import KittyItemsMarket from "../../../contracts/Project/KittyItemsMarket.cdc"

// This transaction allows the signer to list a Kitty Item for sale
// from their Kitty Items Collection

transaction(itemID: UInt64, price: UFix64) {

  let saleCollection: &KittyItemsMarket.SaleCollection

  prepare(signer: AuthAccount) {
      // Borrows the signer's SaleCollection
      self.saleCollection = signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) 
          ?? panic("Could not borrow the SaleCollection")
  }

  execute {
      // Lists Packs for sale
      self.saleCollection.listForSale(itemID: itemID, price: price)

      log("Listed Kitty Items for sale")
  }
}
