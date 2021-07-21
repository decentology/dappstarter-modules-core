import PackContract from Project.PackContract
import MarketplaceContract from Project.MarketplaceContract

// Transfers a Pack from the giver to the recipient.

transaction(id: UInt64, recipient: Address) {

  let packCollectionRef: &PackContract.Collection

  let recipientPackCollectionRef: &PackContract.Collection{PackContract.IPackCollectionPublic}

  prepare(giver: AuthAccount) {
    // Borrows the giver's Pack Collection
    self.packCollectionRef = giver.borrow<&PackContract.Collection>(from: /storage/packCollection)
      ?? panic("Could not borrow the user's pack collection")

    // Borrows the recipient's Pack Collection
    self.recipientPackCollectionRef = getAccount(recipient).getCapability(/public/packCollection)
      .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
      ?? panic("Could not borrow the public capability for the recipient's account")

    // If the Pack owner currently has this Pack up for sale, take it off the market
    if let packSaleCollectionRef = giver.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) {
      packSaleCollectionRef.unlistSale(id: id)
    }
  }

  execute {
    // Withdraw the Pack from the giver's Pack Collection
    let pack <- self.packCollectionRef.withdraw(withdrawID: id)
    
    // Deposit the Pack into the recipient's Pack Collection
    self.recipientPackCollectionRef.deposit(token: <- pack)

    log("Transfered the pack from the giver to the recipient")
  }
}
