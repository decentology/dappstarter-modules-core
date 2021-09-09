import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"
import KittyItems from "../../../contracts/Project/KittyItems.cdc"

// This script returns the size of an account's KittyItems collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(KittyItems.CollectionPublicPath)
                            .borrow<&{NonFungibleToken.CollectionPublic}>()
                            ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}