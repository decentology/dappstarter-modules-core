import KittyItemsMarket from Project.KittyItemsMarket

// This script returns an array of all the NFT IDs for sale 
// in an account's SaleCollection.

pub fun main(marketCollectionAddress: Address): [UInt64] {
    let marketCollectionRef = getAccount(marketCollectionAddress)
        .getCapability<&KittyItemsMarket.SaleCollection{KittyItemsMarket.SalePublic}>(
            KittyItemsMarket.MarketPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return marketCollectionRef.getIDs()
}