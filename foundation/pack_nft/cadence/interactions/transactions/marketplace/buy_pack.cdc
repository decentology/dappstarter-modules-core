import MarketplaceContract from "../../../contracts/Project/MarketplaceContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"
import FlowToken from "../../../contracts/Flow/FlowToken.cdc"
import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"

// Buys a Pack from the admin's Pack Collection

transaction(id: UInt64, admin: Address) {

    let packSaleCollection: &MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}

    let userVaultRef: &{FungibleToken.Provider}

    let userCollection: &{NonFungibleToken.CollectionPublic}
    
    prepare(user: AuthAccount) {
        // Borrows the Admin's public SaleCollection so we can purchase from it
        self.packSaleCollection = getAccount(admin).getCapability(/public/packSaleCollection)
            .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
            ?? panic("Could not borrow from the Admin's saleCollection")

        // Borrow the user's FlowToken Vault
        self.userVaultRef = user.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Borrows the user's Pack Collection so we can deposit the newly purchased Pack
        // into it
        self.userCollection = user.getCapability(/public/packCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow from the user's PackCollection")

    }

    execute {
        // Checks the price of the Pack we want to purchase
        let cost = self.packSaleCollection.idPrice(id: id) ?? panic("A Pack with this id is not up for sale")
        // Withdraw the correct amount of tokens from the user's FlowToken Vault
        let vault <- self.userVaultRef.withdraw(amount: cost)

        // Purchase the Pack
        self.packSaleCollection.purchase(id: id, recipient: self.userCollection, buyTokens: <-vault)
    }
}
