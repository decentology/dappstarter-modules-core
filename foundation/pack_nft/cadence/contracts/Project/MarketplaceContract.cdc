import FungibleToken from "../Flow/FungibleToken.cdc"
import FlowToken from "../Flow/FlowToken.cdc"
import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract MarketplaceContract {
    // Event that is emitted when a new NFT is put up for sale
    //
    pub event ForSale(id: UInt64, price: UFix64)
    
    // Event that is emitted when a NFT is purchased
    //
    pub event NFTPurchased(id: UInt64, price: UFix64)

    // Event that is emitted when a seller withdraws their NFT from the sale
    //
    pub event SaleWithdrawn(id: UInt64)

    // SalePublic
    // Interface that users will publish for their SaleCollection
    // that only exposes the methods that are supposed to be public
    //
    // The public can purchase a NFT from this SaleCollection, get the
    // price of a NFT, or get all the ids of all the NFT up for sale
    //
    pub resource interface SalePublic {
        pub fun purchase(id: UInt64, recipient: &{NonFungibleToken.CollectionPublic}, buyTokens: @FungibleToken.Vault)
        pub fun idPrice(id: UInt64): UFix64?
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

        // Dictionary that maps the id of the NFTs for 
        // sale and the price of that NFT
        pub var forSale: {UInt64: UFix64}

        // The fungible token vault of the owner of this sale.
        // When someone buys a token, this will be used to deposit
        // tokens into the owner's account.
        access(self) let ownerVault: Capability<&{FungibleToken.Receiver}>

        // The owner's NFT Collection that we will withdraw from when a user purchases a NFT.
        access(self) let ownerCollection: Capability<&NonFungibleToken.Collection>

        init (_vault: Capability<&{FungibleToken.Receiver}>, _collection: Capability<&NonFungibleToken.Collection>) {
            self.forSale = {}
            self.ownerVault = _vault
            self.ownerCollection = _collection
        }

        // unlistSale
        // simply unlists the NFT from the SaleCollection
        // so it is no longer for sale
        //
        pub fun unlistSale(id: UInt64) {
            // remove the id from the forSale dictionary
            // this does not need to have a panic associated with it
            // because there is no harm in unlisting a NFT that wasn't previously
            // for sale. 
            self.forSale[id] = nil

            emit SaleWithdrawn(id: id)
        }

        // listForSale
        // listForSale lists NFT(s) for sale
        //
        pub fun listForSale(ids: [UInt64], price: UFix64) {
            pre {
                price > 0.0:
                    "Cannot list a NFT for 0.0"
            }

            var ownedNFTs = self.ownerCollection.borrow()!.getIDs()
            for id in ids {
                if (ownedNFTs.contains(id)) {
                    // store the price in the price array
                    self.forSale[id] = price

                    emit ForSale(id: id, price: price)
                }
            }
        }

        // purchase
        // purchase lets a user send tokens to purchase a NFT that is for sale
        //
        pub fun purchase(id: UInt64, recipient: &{NonFungibleToken.CollectionPublic}, buyTokens: @FungibleToken.Vault) {
            pre {
                // ensures only FlowTokens are passed in
                buyTokens.isInstance(Type<@FlowToken.Vault>()):
                    "Only Flow Tokens are supported for purchase."
                self.forSale[id] != nil:
                    "No NFT matching this id for sale!"
                buyTokens.balance >= (self.forSale[id]!):
                    "Not enough tokens to buy the NFT!"
            }

            // get the value out of the optional
            let price = self.forSale[id]!

            let vaultRef = self.ownerVault.borrow()
                ?? panic("Could not borrow reference to owner token vault")
            
            // deposit the user's tokens into the owners vault
            vaultRef.deposit(from: <-buyTokens)
            
            // remove the NFT from the owner's NFT Collection
            let token <- self.ownerCollection.borrow()!.withdraw(withdrawID: id)

            // deposit the NFT into the buyers NFT Collection
            recipient.deposit(token: <-token)

            // unlist the sale
            self.unlistSale(id: id)

            emit NFTPurchased(id: id, price: price)
        }

        // idPrice
        // idPrice returns the price of a specific NFT in the sale
        // if it exists, otherwise nil
        //
        pub fun idPrice(id: UInt64): UFix64? {
            return self.forSale[id]
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
    pub fun createSaleCollection(ownerVault: Capability<&AnyResource{FungibleToken.Receiver}>, ownerCollection: Capability<&NonFungibleToken.Collection>): @SaleCollection {
        return <- create SaleCollection(_vault: ownerVault, _collection: ownerCollection)
    }
}