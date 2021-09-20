import KittyItemsMarket from "../../../contracts/Project/KittyItemsMarket.cdc"

// This script returns the size of an account's SaleCollection.

pub fun main(marketCollectionAddress: Address): Int {
    let marketCollectionRef = getAccount(marketCollectionAddress)
        .getCapability<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>(
             KittyItemsMarket.MarketPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return marketCollectionRef.getIDs().length
}