import FungibleToken from Flow.FungibleToken
import KittyItemsMarket from Project.KittyItemsMarket
import NonFungibleToken from Flow.NonFungibleToken
import KittyItems from Project.KittyItems
import Kibble from Project.Kibble

// This transaction allows the signer to purchase a Kitty Item
// with id == itemID from the marketCollectionAddress

transaction(itemID: UInt64, marketCollectionAddress: Address) {

    let saleCollection: &KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}

    let signerKibbleVaultRef: &Kibble.Vault

    let buyerKittyItemsCollection: &KittyItems.Collection{NonFungibleToken.CollectionPublic}
    
    prepare(signer: AuthAccount) {
        // Borrows the MarketCollectionAddress' public SaleCollection so we can purchase from it
        self.saleCollection = getAccount(marketCollectionAddress).getCapability(KittyItemsMarket.MarketPublicPath)
            .borrow<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>()
            ?? panic("Could not borrow the SaleCollection")

        // Borrow the signer's Kibble Vault as a reference
        self.signerKibbleVaultRef = signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
            ?? panic("Could not borrow reference to the owner's Vault!")

        // Borrows the signer's Kitty Items Collection so we can deposit the newly purchased
        // Kitty Item into it
        self.buyerKittyItemsCollection = signer.getCapability(KittyItems.CollectionPublicPath)
            .borrow<&KittyItems.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow from the signer's Kitty Items Collection")

    }

    execute {
        // Checks the price of the Kitty Item we want to purchase
        let cost = self.saleCollection.idPrice(itemID: itemID) ?? panic("A Kitty Item with this itemID is not up for sale")
        // Withdraw the correct amount of tokens from the signer's FlowToken Vault
        let vault <- self.signerKibbleVaultRef.withdraw(amount: cost)

        // Purchase the Kitty Item
        self.saleCollection.purchase(itemID: itemID, recipient: self.buyerKittyItemsCollection, buyTokens: <-vault)
    }
}
