import NonFungibleToken from Flow.NonFungibleToken
import KittyItems from Project.KittyItemsMarket

// This script returns an array of all the NFT IDs in an account's collection.

pub fun main(address: Address): [UInt64] {
    let account = getAccount(address)

    let collectionRef = account.getCapability(KittyItems.CollectionPublicPath)
                            .borrow<&{NonFungibleToken.CollectionPublic}>()
                            ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs()
}