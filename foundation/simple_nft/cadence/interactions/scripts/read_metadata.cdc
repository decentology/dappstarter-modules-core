import SimpleNFTContract from "../../contracts/Project/SimpleNFTContract.cdc"

pub fun main(account: Address, id: UInt64): &SimpleNFTContract.NFT {
    // Get the public collection of the owner of the token
    let collectionRef = getAccount(account)
        .getCapability(/public/NFTCollection)
        .borrow<&{SimpleNFTContract.SimpleNFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")

    // Borrow a reference to a specific NFT in the collection
    let nft = collectionRef.borrowNFTMetadata(id: id)

    return nft!
}