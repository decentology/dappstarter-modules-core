import NFTContract from "./NFTContract.cdc"
import NonFungibleToken from "../Flow/NonFungibleToken.cdc"

pub contract PackContract: NonFungibleToken {
    // The total number of Packs that have been minted
    pub var totalSupply: UInt64

    // An dictionary of all the pack types that have been
    // created using addPackType method defined 
    // in the AdminContract
    //
    // It maps the packType # to the 
    // information of that pack type
    access(account) var packTypes: {UInt64: PackType}

    // Event that emitted when the PackContract contract is initialized
    //
    pub event ContractInitialized()

    // Event that is emitted when a Pack is withdrawn,
    // indicating the owner of the collection that it was withdrawn from.
    //
    // If the collection is not in an account's storage, `from` will be `nil`.
    //
    pub event Withdraw(id: UInt64, from: Address?)

    // Event that emitted when a Pack is deposited to a collection.
    //
    // It indicates the owner of the collection that it was deposited to.
    //
    pub event Deposit(id: UInt64, to: Address?)

    // NFT
    // Represents a Pack
    //
    pub resource NFT: NonFungibleToken.INFT {
        // The Pack's id (completely sequential)
        pub let id: UInt64

        // An ID that represents that type of pack this is
        pub var packType: UInt64

        init(_packType: UInt64) {
            self.id = PackContract.totalSupply
            self.packType = _packType

            PackContract.totalSupply = PackContract.totalSupply + (1 as UInt64)
        }
    }

    // mintPack
    // allows us to create Packs from another contract
    // in this account. This is helpful for 
    // allowing AdminContract to mint Packs.
    //
    access(account) fun mintPack(packType: UInt64): @NFT {
        return <- create NFT(_packType: packType)
    }

    // PackType
    // holds all the information for
    // a specific pack type
    //
    pub struct PackType {

        pub let packType: UInt64

        // the number of NFTs that will be minted
        // when a pack of this pack type is opened
        pub let numberOfNFTs: UInt64

        pub var ipfsHash: String

        init(_packType: UInt64, _numberOfNFTs: UInt64, _ipfsHash: String) {
            self.packType = _packType
            self.numberOfNFTs = _numberOfNFTs
            self.ipfsHash = _ipfsHash
        }
    }

    // IPackCollectionPublic
    // This defines an interface to only expose a
    // Collection of Packs to the public.
    //
    pub resource interface IPackCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT

        pub fun borrowPack(id: UInt64): &PackContract.NFT? {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result?.id == id): 
                    "Cannot borrow Pack reference: The ID of the returned reference is incorrect"
            }
        }
    }

    // IPackCollectionAdminAccessible
    // Exposes the openPack which allows an admin to
    // open a pack in this collection.
    //
    pub resource interface IPackCollectionAdminAccessible {
        access(account) fun openPack(id: UInt64, nftCollectionRef: &{NonFungibleToken.CollectionPublic})
    }

    // Collection
    // a collection of Pack resources so that users can
    // own Packs in a collection and trade them back and forth.
    //
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, IPackCollectionPublic, IPackCollectionAdminAccessible  {
        // A dictionary that maps ids to the pack with that id
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        // deposit
        // deposits a Pack into the users Collection
        //
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @PackContract.NFT

            let id: UInt64 = token.id

            // add the new Pack to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            // Only emit a deposit event if the Collection 
            // is in an account's storage
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            destroy oldToken
        }

        // withdraw
        // withdraws a Pack from the collection
        //
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing Pack")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        // openPack
        // This method removes a Pack from this Collection and then
        // deposits newly minted NFTs into the Collection reference
        //
        // The Pack is also destroyed in the process so it will no longer
        // exist
        //
        access(account) fun openPack(id: UInt64, nftCollectionRef: &{NonFungibleToken.CollectionPublic}) {
            let packRef = self.borrowPack(id: id)
                ?? panic("Could not borrow a reference to a Pack with this id")
            let numberOfNFTs = PackContract.packTypes[packRef.packType]!.numberOfNFTs

            let pack <- self.withdraw(withdrawID: id)
            
            var i: UInt64 = 0
            // Mints new NFTs into this empty Collection
            while i < numberOfNFTs {
                let newNFT <- NFTContract.mintNFT()
                
                nftCollectionRef.deposit(token: <-newNFT)

                i = i + (1 as UInt64)
            }
        
            destroy pack
        }

        // getIDs
        // returns the ids of all the Packs this
        // collection has
        // 
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT
        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its id
        //
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        // borrowPack
        // borrowPack returns a borrowed reference to a Pack
        // so that the caller can read data from it.
        // They can use this to read its PackInfo and id
        //
        pub fun borrowPack(id: UInt64): &PackContract.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
                return ref as! &PackContract.NFT
            } else {
                return nil
            }
        }

        destroy() {
            destroy self.ownedNFTs
        }

        init() {   
            self.ownedNFTs <- {}
        }
    }

    // createEmptyCollection
    // creates an empty Collection so that users
    // can be able to receive and deal with Pack resources.
    //
    pub fun createEmptyCollection(): @Collection {
        return <- create Collection()
    }

    // getPackTypeInfo
    // returns a PackType struct, which represents the info
    // of a specific PackType that is passed in
    //
    pub fun getPackTypeInfo(packType: UInt64): PackType {
        return self.packTypes[packType] ?? panic("This pack type does not exist")
    }

    init() {
        self.totalSupply = 0
        self.packTypes = {}

        emit ContractInitialized()
    }
}