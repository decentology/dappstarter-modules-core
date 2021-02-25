

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

    // Interface that the NFTs have to conform to
    //
    pub resource interface INFT {
        // The unique ID that each NFT has
        pub let id: UInt64
    }

    // Requirement that all conforming NFT smart contracts have
    // to define a resource called NFT that conforms to INFT
    pub resource NFT: INFT {

        pub let id: UInt64
        init(initID: UInt64) {
            self.id = initID;
        }
    }

    pub resource ChromataNFT: INFT {

        pub let id: UInt64
        pub let style: String

        init(initID: UInt64) {
            self.id = initID;
            self.style = "demo";
        }
    }

    pub resource MandalaNFT: INFT {

        pub let id: UInt64
        pub let color: String
        pub let thickness: UInt64

        init(initID: UInt64) {
            self.id = initID;
            self.color = "#cc0000";
            self.thickness = 44;
        }
    }


   

    // Interface to mediate withdraws from the Collection
    //
    pub resource interface Provider {
        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @AnyResource{DappState.INFT} {
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
		pub fun deposit(token: @AnyResource{DappState.INFT})
    }

    // Interface that an account would commonly 
    // publish for their collection
    pub resource interface CollectionPublic {
        pub fun deposit(token: @AnyResource{DappState.INFT})
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &AnyResource{DappState.INFT}
    }

    // Requirement for the the concrete resource type
    // to be declared in the implementing contract
    //
    pub resource Collection: Provider, Receiver, CollectionPublic {

        // Dictionary to hold the NFTs in the Collection
        pub var ownedNFTs: @{UInt64: AnyResource{DappState.INFT}}

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @AnyResource{DappState.INFT} {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @AnyResource{DappState.INFT}) {
            let token <- token as! @AnyResource{DappState.INFT}

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token as! @AnyResource{DappState.INFT}

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // Returns a borrowed reference to an NFT in the collection
        // so that the caller can read data and call methods from it
        pub fun borrowNFT(id: UInt64): &AnyResource{DappState.INFT} {
            pre {
                self.ownedNFTs[id] != nil: "NFT does not exist in the collection!"
            }
            return &self.ownedNFTs[id] as &AnyResource{DappState.INFT}
        }

        init () {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // createEmptyCollection creates an empty Collection
    // and returns it to the caller so that they can own NFTs
    pub fun createEmptyCollection(): @Collection {
        post {
            result.getIDs().length == 0: "The created collection must be empty!"
        }
        return <- create Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
	pub resource NFTMinter {

		// mintNFT mints a new NFT with a new ID
		// and deposit it in the recipients collection using their collection reference
		pub fun mintNFT(recipient: &{CollectionPublic}, generator: String) {


            switch generator {
                case "mandala": recipient.deposit(token: <- create MandalaNFT(initID: DappState.totalSupply))
                case "chromata": recipient.deposit(token: <- create ChromataNFT(initID: DappState.totalSupply))
                default: recipient.deposit(token: <- create NFT(initID: DappState.totalSupply))
            }			

            DappState.totalSupply = DappState.totalSupply + (1 as UInt64)
		}
	}

///)
