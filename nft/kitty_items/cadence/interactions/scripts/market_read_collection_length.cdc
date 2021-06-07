import KittyItemsMarket from Project.KittyItemsMarket

// This script returns the size of an account's SaleOffer collection.

pub fun main(marketCollectionAddress: Address): Int {
    let marketCollectionRef = getAccount(marketCollectionAddress)
        .getCapability<&KittyItemsMarket.Collection{KittyItemsMarket.CollectionPublic}>(
             KittyItemsMarket.CollectionPublicPath
        )
        .borrow()
        ?? panic("Could not borrow market collection from market address")
    
    return marketCollectionRef.getSaleOfferIDs().length
}