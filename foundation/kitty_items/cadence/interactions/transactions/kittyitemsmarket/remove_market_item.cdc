import KittyItemsMarket from "../../../contracts/Project/KittyItemsMarket.cdc"

// This transaction allows a SaleCollection owner to remove a Kitty Item
// from sale

transaction(itemID: UInt64) {

  let saleCollection: &KittyItemsMarket.SaleCollection

  prepare(signer: AuthAccount) {
      // Borrows the signer's SaleCollection
      self.saleCollection = signer.borrow<&KittyItemsMarket.SaleCollection>(from: KittyItemsMarket.MarketStoragePath) 
          ?? panic("Could not borrow the signer's SaleCollection")
  }

  execute {
      // Unlist Kitty Items from sale
      self.saleCollection.unlistSale(itemID: itemID)

      log("Unlisted Kitty Item for sale")
  }
}
