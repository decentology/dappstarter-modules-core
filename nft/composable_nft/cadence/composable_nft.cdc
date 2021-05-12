///(import
import Generator from "./imports/composable_nft/generator/Generator.cdc"

///)

///(initialize

    // Initialize the total supply
    self.totalSupply = 0

    // Create a Collection resource and save it to storage
    let collection <- create Collection()
    self.account.save(<-collection, to: /storage/NFTCollection)

    // create a public capability for the collection
    self.account.link<&{CollectionPublic}>(
        /public/NFTCollection,
        target: /storage/NFTCollection
    )

    // Create a Minter resource and save it to storage
    let minter <- create NFTMinter()
    self.account.save(<-minter, to: /storage/NFTMinter)

    emit ContractInitialized()
    
///)

///(functions

    // The total number of tokens of this type in existence
    pub var totalSupply: UInt64

    // Event that emitted when the NFT contract is initialized
    //
    pub event ContractInitialized()

    // Event that is emitted when a token is withdrawn,
    // indicating the owner of the collection that it was withdrawn from.
    //
    // If the collection is not in an account's storage, `from` will be `nil`.
    //
    pub event Withdraw(id: UInt64, from: Address?)

    // Event that emitted when a token is deposited to a collection.
    //
    // It indicates the owner of the collection that it was deposited to.
    //
    pub event Deposit(id: UInt64, to: Address?)

    pub resource interface INFT {
        // The unique ID that each NFT has
        pub let id: UInt64
    }

    // ChromataNFT
    pub resource NFT: INFT {
        pub let id: UInt64

        pub let metadata: Generator.Metadata

        init(_id: UInt64, _metadata: Generator.Metadata) {
             self.id = _id
             self.metadata = _metadata
        }
    }

    // Interface to mediate withdraws from the Collection
    //
    pub resource interface Provider {
        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @GeneratorNFT.NFT {
            post {
                result.id == withdrawID: "The ID of the withdrawn token must be the same as the requested ID"
            }
        }
    }

    // Interface to mediate deposits to the Collection
    //
    pub resource interface Receiver {

        // deposit takes an NFT as an argument and adds it to the Collection
        //
        pub fun deposit(token: @GeneratorNFT.NFT)
    }

    // Interface that an account would commonly 
    // publish for their collection
    pub resource interface CollectionPublic {
        pub fun deposit(token: @GeneratorNFT.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &GeneratorNFT.NFT
    }

    pub resource Collection: Provider, Receiver, CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: GeneratorNFT.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @GeneratorNFT.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @GeneratorNFT.NFT) {
            let token <- token as! @GeneratorNFT.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &GeneratorNFT.NFT {
            return &self.ownedNFTs[id] as &GeneratorNFT.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
    pub resource NFTMinter {

        // mintNFT mints a new NFT with a new ID
        // and deposit it in the recipients collection using their collection reference
        pub fun mintNFT(recipient: &{CollectionPublic}, metadata: Generator.Metadata) {

            // create a new NFT
            var newNFT <- create NFT(_initID: NFTContract.totalSupply, _metadata: metadata)

            // deposit it in the recipient's account using their reference
            recipient.deposit(token: <-newNFT)

            NFTContract.totalSupply = NFTContract.totalSupply + (1 as UInt64)
        }
    }

///)
