import FungibleToken from Flow.FungibleToken
import MarketplaceContract from Project.MarketplaceContract
import NonFungibleToken from Flow.NonFungibleToken

transaction(id: UInt64, adminAddr: Address) {

    let packSaleCollection: &MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}

    let userVaultRef: &{FungibleToken.Provider}

    let userCollection: &{NonFungibleToken.CollectionPublic}
    
    prepare(user: AuthAccount) {

        self.packSaleCollection = getAccount(adminAddr).getCapability(/public/packSaleCollection)
            .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
            ?? panic("Could not borrow from the Admin's saleCollection")

        // we get a &{FungibleToken.Provider} because purchase needs to be able
        // to take in a bunch of different FungibleToken Vault types since we have
        // 1 singular (generic) function.
        self.userVaultRef = user.borrow<&{FungibleToken.Provider}>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        self.userCollection = user.getCapability(/public/packCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow from the user's PackCollection")

    }

    execute {
        let cost = self.packSaleCollection.idPrice(id: id) ?? panic("A Pack with this id is not up for sale")
        let vault <- self.userVaultRef.withdraw(amount: cost)

        self.packSaleCollection.purchase(id: id, recipient: self.userCollection, buyTokens: <-vault)
    }
}
