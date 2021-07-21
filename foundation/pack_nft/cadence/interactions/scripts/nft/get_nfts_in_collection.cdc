import NonFungibleToken from Flow.NonFungibleToken

// Returns all the IDs of the NFTs in the acct's NFT Collection

pub fun main(acct: Address): [UInt64] {
  // Borrows the acct's NFT Collection
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/nftCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  // Returns all NFT IDs in that Collection
  return acctNFTCollectionRef.getIDs()
}