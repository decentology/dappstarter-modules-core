import PackContract from Project.PackContract
import MarketplaceContract from Project.MarketplaceContract

transaction(id: UInt64, recipient: Address) {

  let packCollectionRef: &PackContract.Collection

  let recipientPackCollectionRef: &PackContract.Collection{PackContract.IPackCollectionPublic}

  prepare(acct: AuthAccount) {
    // This is to support peer to peer pack transfers
    self.packCollectionRef = acct.borrow<&PackContract.Collection>(from: /storage/packCollection)
      ?? panic("Could not borrow the user's pack collection")

    self.recipientPackCollectionRef = getAccount(recipient).getCapability(/public/packCollection)
      .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
      ?? panic("Could not borrow the public capability for the recipient's account")

    if let packSaleCollectionRef = acct.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) {
      packSaleCollectionRef.unlistSale(id: id)
    }
  }

  execute {
    let pack <- self.packCollectionRef.withdraw(withdrawID: id)
    
    self.recipientPackCollectionRef.deposit(token: <- pack)

    log("Transfered the pack from the giver to the recipient")
  }
}
