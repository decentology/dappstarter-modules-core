import MarketplaceContract from Project.MarketplaceContract

// This should be called by the admin to list Packs for sale in 
// their SaleCollection

transaction(ids: [UInt64], price: UFix64) {

  let packSaleCollection: &MarketplaceContract.SaleCollection

  prepare(admin: AuthAccount) {
      // Borrows the admin's SaleCollection
      self.packSaleCollection = admin.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) 
          ?? panic("Could not borrow the admin's Pack SaleCollection")
  }

  execute {
      // Lists Packs for sale
      self.packSaleCollection.listForSale(ids: ids, price: price)

      log("Listed Pack(s) for sale")
  }
}
