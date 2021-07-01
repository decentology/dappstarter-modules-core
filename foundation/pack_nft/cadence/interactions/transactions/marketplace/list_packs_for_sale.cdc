import MarketplaceContract from Project.MarketplaceContract

transaction(ids: [UInt64], price: UFix64) {

  prepare(user: AuthAccount) {
      let packSaleCollection = user.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) 
          ?? panic("Could not borrow the user's Pack SaleCollection")

      packSaleCollection.listForSale(ids: ids, price: price)

      log("Listed Pack(s) for sale")
  }

  execute {
      
  }
}
