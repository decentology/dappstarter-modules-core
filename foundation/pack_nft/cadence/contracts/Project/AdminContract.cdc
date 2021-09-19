import NFTContract from "./NFTContract.cdc"
import NonFungibleToken from "../Flow/NonFungibleToken.cdc"
import PackContract from "./PackContract.cdc"

pub contract AdminContract {
    // Admin
    // the admin resource is defined so that only the admin account
    // can have this resource. It possesses the ability to open packs
    // given a user's Pack Collection and NFT Collection reference.
    // It can also create a new pack type and mint Packs.
    //
    pub resource Admin {

        // openPack
        // calls openPack on the user's Pack Collection
        //
        pub fun openPack(id: UInt64, packCollectionRef: &PackContract.Collection{PackContract.IPackCollectionAdminAccessible}, nftCollectionRef: &{NonFungibleToken.CollectionPublic}) {
            packCollectionRef.openPack(id: id, nftCollectionRef: nftCollectionRef)
        }

        // addPackType
        // adds a new packType to the packTypes dictionary
        // at the beginning of the PackContract contract.
        //
        // The number of NFTs represents the amount of NFTs
        // that will be minted when a Pack of this packType
        // is opened.
        //
        pub fun addPackType(packType: UInt64, numberOfNFTs: UInt64, ipfsHash: String) {
            pre {
                PackContract.packTypes[packType] == nil:
                    "This pack type already exists!"
            }
            // Adds this pack type
            PackContract.packTypes[packType] = PackContract.PackType(_packType: packType, _numberOfNFTs: numberOfNFTs, _ipfsHash: ipfsHash)
        }

        // mintPacks
        // a function that mints new Pack(s) and deposits
        // them into the admin's Pack Collection.
        //
        pub fun mintPacks(packType: UInt64, numberOfPacks: UInt64) {
            pre {
                PackContract.packTypes[packType] != nil:
                    "This pack type does not exist!"
                numberOfPacks > (0 as UInt64):
                    "Number of packs to be minted must be greater than 0"
            }
            
            // Gets the admin's Pack Collection
            let adminPackCollection = AdminContract.account.borrow<&PackContract.Collection{NonFungibleToken.CollectionPublic}>(from: /storage/packCollection)!

            var i: UInt64 = 0
            while i < numberOfPacks {
                let newPack <- PackContract.mintPack(packType: packType)
            
                // Adds the new pack to the admin's Pack Collection
                adminPackCollection.deposit(token: <- newPack)

                i = i + (1 as UInt64)
            }
        }

        // createAdmin
        // only an admin can ever create
        // a new Admin resource
        //
        pub fun createAdmin(): @Admin {
            return <- create Admin()
        }

        init() {
            
        }
    }

    init() {
        self.account.save(<- create Admin(), to: /storage/admin)

        /* store an nft collection */

        // create a new empty collection
        let nftCollection <- NFTContract.createEmptyCollection()
                
        // save it to the account
        self.account.save(<-nftCollection, to: /storage/nftCollection)

        // create a public capability for the collection
        self.account.link<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>(/public/nftCollection, target: /storage/nftCollection)


        /* store a pack collection */

        // create a new empty collection
        let packCollection <- PackContract.createEmptyCollection()
                
        // save it to the account
        self.account.save(<-packCollection, to: /storage/packCollection)

        // create a public capability for the collection
        self.account.link<&PackContract.Collection{PackContract.IPackCollectionPublic, PackContract.IPackCollectionAdminAccessible, NonFungibleToken.CollectionPublic}>(/public/packCollection, target: /storage/packCollection)
    }
}