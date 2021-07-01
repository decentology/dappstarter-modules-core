import MarketplaceContract from Project.MarketplaceContract

transaction(ids: [UInt64], price: UFix64) {

  let packSaleCollection: &MarketplaceContract.SaleCollection

  prepare(user: AuthAccount) {
      self.packSaleCollection = user.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) 
          ?? panic("Could not borrow the user's Pack SaleCollection")
  }

  execute {
      self.packSaleCollection.listForSale(ids: ids, price: price)

      log("Listed Pack(s) for sale")
  }
}
