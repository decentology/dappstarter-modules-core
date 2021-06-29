import FungibleToken from Flow.FungibleToken
import PackContract from Project.PackContract
import MarketplaceContract from Project.MarketplaceContract
import NonFungibleToken from Flow.NonFungibleToken

transaction(id: UInt64, adminAddr: Address) {

  prepare(user: AuthAccount) {

      let packSaleCollection = getAccount(adminAddr).getCapability(/public/packSaleCollection)
          .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
          ?? panic("Could not borrow from the Admin's saleCollection")

      // we get a &{FungibleToken.Provider} because purchase needs to be able
      // to take in a bunch of different FungibleToken Vault types since we have
      // 1 singular (generic) function.
      let userVaultRef = user.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)
          ?? panic("Could not borrow reference to the owner's Vault!")
      
      let cost = packSaleCollection.idPrice(id: id) ?? panic("A Pack with this id is not up for sale")
      let vault <- userVaultRef.withdraw(amount: cost)

      let userCollection = user.getCapability(/public/packCollection)
          .borrow<&{NonFungibleToken.CollectionPublic}>()
          ?? panic("Could not borrow from the user's PackCollection")

      packSaleCollection.purchase(id: id, recipient: userCollection, buyTokens: <-vault)
  }

  execute {
      
  }
}
