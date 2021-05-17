import DappState from Project.DappState
import Generator from Project.Generator
import NonFungibleToken from Flow.NonFungibleToken

pub fun main(accountAddr: Address, id: UInt64): Generator.Metadata {
    // Get the public collection of the owner of the token
    let collectionRef = getAccount(accountAddr)
        .getCapability(/public/NFTCollection)
        .borrow<&{DappState.DappStateCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    // Borrow a reference to a specific NFT in the collection
    let nft = collectionRef.borrowNFTMetadata(id: id)

    return nft!.metadata
}