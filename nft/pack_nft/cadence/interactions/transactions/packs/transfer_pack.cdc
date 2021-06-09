import PackContract from Project.PackContract
import MarketplaceContract from Project.MarketplaceContract
import NonFungibleToken from Flow.NonFungibleToken

transaction(id: UInt64, recipient: Address) {
  let pack: @NonFungibleToken.NFT

  prepare(acct: AuthAccount) {
    // This is to support peer to peer pack transfers
    let packCollectionRef = acct.borrow<&PackContract.Collection>(from: /storage/packCollection)
      ?? panic("Could not borrow the user's pack collection")
    self.pack <- packCollectionRef.withdraw(withdrawID: id)

    if let packSaleCollectionRef = acct.borrow<&MarketplaceContract.SaleCollection>(from: /storage/packSaleCollection) {
      packSaleCollectionRef.unlistSale(id: id)
    }
  }

  execute {
    let recipientAccount = getAccount(recipient)
    let recipientPackCollectionRef = recipientAccount.getCapability(/public/packCollection)
        .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
        ?? panic("Could not borrow the public capability for the recipient's account")
    
    recipientPackCollectionRef.deposit(token: <- self.pack)

    log("Transfered the pack from the giver to the recipient")
  }
}
