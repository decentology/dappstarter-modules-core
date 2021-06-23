import NonFungibleToken from Flow.NonFungibleToken

pub fun main(accountAddr: Address): [UInt64] {
    // Get the public collection of the owner of the token
    let collectionRef = getAccount(accountAddr)
        .getCapability(/public/NFTCollection)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    // Borrow a reference to a specific NFT in the collection
    let nfts = collectionRef.getIDs()

    return nfts
}