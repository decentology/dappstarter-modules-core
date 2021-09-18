import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract NFTContract: NonFungibleToken {
    // The total number of NFTs in existence
    pub var totalSupply: UInt64

    // Event that emitted when the NFTContract contract is initialized
    //
    pub event ContractInitialized()

    // Event that is emitted when a NFT is withdrawn,
    // indicating the owner of the collection that it was withdrawn from.
    //
    // If the collection is not in an account's storage, `from` will be `nil`.
    //
    pub event Withdraw(id: UInt64, from: Address?)

    // Event that emitted when a NFT is deposited to a collection.
    //
    // It indicates the owner of the collection that it was deposited to.
    //
    pub event Deposit(id: UInt64, to: Address?)

    // NFT
    //
    pub resource NFT: NonFungibleToken.INFT {
        // unique id (completely sequential)
        pub let id: UInt64
        

        // initializer
        //
        init() {
            self.id = NFTContract.totalSupply

            NFTContract.totalSupply = NFTContract.totalSupply + (1 as UInt64)
        }
    }

    // mintNFT
    // allows us to create an NFT from another contract in this
    // account
    //
    access(account) fun mintNFT(): @NFT {
        return <- create NFT()
    }

    // Collection
    // This resource defines a collection of NFT
    // that a user will have.
    //
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // A dictionary that maps a NFT's id to a 
        // NFT in the collection.
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // deposit
        // deposits a NFT into the Collection
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @NFTContract.NFT

            let id: UInt64 = token.id

            // add the new NFT to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            // Only emit a deposit event if the Collection 
            // is in an account's storage
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            destroy oldToken
        }

        // withdraw
        // withdraw removes a NFT from the collection and moves it to the caller
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // getIDs
        // returns the ids of all the NFT this
        // collection has
        // 
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT
        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its id field
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }

        init () {
            self.ownedNFTs <- {}
        }
    }

    // createEmptyCollection
    // creates a new Collection resource and returns it.
    // This will primarily be used to give a user a new Collection
    // so they can store NFTs
    //
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    init() {
        self.totalSupply = 0

        emit ContractInitialized()
    }

}