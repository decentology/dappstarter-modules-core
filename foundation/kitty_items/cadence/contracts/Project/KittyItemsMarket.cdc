import FungibleToken from "../Flow/FungibleToken.cdc"
import KittyItems from "../Project/KittyItems.cdc"
import Kibble from "../Project/Kibble.cdc"
import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract KittyItemsMarket {
    // Event that is emitted when a new NFT is put up for sale
    //
    pub event ForSale(itemID: UInt64, price: UFix64)
    
    // Event that is emitted when a NFT is purchased
    //
    pub event NFTPurchased(itemID: UInt64, price: UFix64)

    // Event that is emitted when a seller withdraws their NFT from the sale
    //
    pub event SaleWithdrawn(itemID: UInt64)

    // Named Paths
    //
    pub let MarketStoragePath: StoragePath
    pub let MarketPublicPath: PublicPath

    // SalePublic
    // Interface that users will publish for their SaleCollection
    // that only exposes the methods that are supposed to be public
    //
    // The public can purchase a NFT from this SaleCollection, get the
    // price of a NFT, or get all the ids of all the NFT up for sale
    //
    pub resource interface SalePublic {
        pub fun purchase(itemID: UInt64, recipient: &KittyItems.Collection{NonFungibleToken.CollectionPublic}, buyTokens: @FungibleToken.Vault)
        pub fun idPrice(itemID: UInt64): UFix64?
        pub fun getIDs(): [UInt64]
    }

    // SaleCollection
    //
    // A Collection that acts as a marketplace for NFTs. The owner
    // can list NFTs for sale and take sales down by unlisting it.
    //
    // Other users can also purchase NFTs that are for sale
    // in this SaleCollection, check the price of a sale, or check
    // all the NFTs that are for sale by their ids.
    //
    pub resource SaleCollection: SalePublic {

        // Dictionary that maps the itemID of the NFTs for 
        // sale and the price of that NFT
        pub var forSale: {UInt64: UFix64}

        // The fungible token vault of the owner of this sale.
        // When someone buys a token, this will be used to deposit
        // tokens into the owner's account.
        access(self) let ownerVault: Capability<&Kibble.Vault{FungibleToken.Receiver}>

        // The owner's Kitty Items Collection that we will withdraw from when a user purchases a NFT.
        access(self) let ownerCollection: Capability<&KittyItems.Collection>

        init (_vault: Capability<&Kibble.Vault{FungibleToken.Receiver}>, _collection: Capability<&KittyItems.Collection>) {
            self.forSale = {}
            self.ownerVault = _vault
            self.ownerCollection = _collection
        }

        // unlistSale
        // simply unlists the NFT from the SaleCollection
        // so it is no longer for sale
        //
        pub fun unlistSale(itemID: UInt64) {
            // remove the itemID from the forSale dictionary
            // this does not need to have a panic associated with it
            // because there is no harm in unlisting a NFT that wasn't previously
            // for sale. 
            self.forSale[itemID] = nil

            emit SaleWithdrawn(itemID: itemID)
        }

        // listForSale
        // listForSale lists Kitty Items for sale
        //
        pub fun listForSale(itemID: UInt64, price: UFix64) {
            pre {
                price > 0.0:
                    "Cannot list a NFT for 0.0"
            }

            var ownedNFTs = self.ownerCollection.borrow()!.getIDs()
            
            if (ownedNFTs.contains(itemID)) {
                // store the price in the price array
                self.forSale[itemID] = price

                emit ForSale(itemID: itemID, price: price)
            }
        }

        // purchase
        // purchase lets a user send tokens to purchase a NFT that is for sale
        //
        pub fun purchase(itemID: UInt64, recipient: &KittyItems.Collection{NonFungibleToken.CollectionPublic}, buyTokens: @FungibleToken.Vault) {
            pre {
                // ensures only Kibble is passed in as a payment
                buyTokens.isInstance(Type<@Kibble.Vault>()):
                    "Only Flow Tokens are supported for purchase."
                self.forSale[itemID] != nil:
                    "No NFT matching this itemID for sale!"
                buyTokens.balance >= (self.forSale[itemID]!):
                    "Not enough tokens to buy the NFT!"
            }

            // get the value out of the optional
            let price = self.forSale[itemID]!

            let vaultRef = self.ownerVault.borrow()
                ?? panic("Could not borrow reference to owner token vault")
            
            // deposit the user's tokens into the owners vault
            vaultRef.deposit(from: <-buyTokens)
            
            // remove the NFT from the owner's NFT Collection
            let token <- self.ownerCollection.borrow()!.withdraw(withdrawID: itemID)

            // deposit the NFT into the buyers NFT Collection
            recipient.deposit(token: <-token)

            // unlist the sale
            self.unlistSale(itemID: itemID)

            emit NFTPurchased(itemID: itemID, price: price)
        }

        // idPrice
        // idPrice returns the price of a specific NFT in the sale
        // if it exists, otherwise nil
        //
        pub fun idPrice(itemID: UInt64): UFix64? {
            return self.forSale[itemID]
        }

        // getIDs
        // getIDs returns an array of all the NFT IDs that are up for sale
        //
        pub fun getIDs(): [UInt64] {
            return self.forSale.keys
        }
    }

    // createSaleCollection
    // createCollection returns a new SaleCollection resource to the caller
    //
    pub fun createSaleCollection(ownerVault: Capability<&Kibble.Vault{FungibleToken.Receiver}>, ownerCollection: Capability<&KittyItems.Collection>): @SaleCollection {
        return <- create SaleCollection(_vault: ownerVault, _collection: ownerCollection)
    }

    init() {
        // Set our named paths
        self.MarketStoragePath = /storage/marketSaleCollection
        self.MarketPublicPath = /public/marketSaleCollection
    }
}