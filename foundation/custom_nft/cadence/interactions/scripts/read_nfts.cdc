import NonFungibleToken from Flow.NonFungibleToken

pub fun main(account: Address): [UInt64] {
    // Get the public collection of the owner of the token
    let collectionRef = getAccount(account)
        .getCapability(/public/NFTCollection)
        .borrow<&{NonFungibleToken.CollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    // Borrow a reference to a specific NFT in the collection
    let nfts = collectionRef.getIDs()

    return nfts
}