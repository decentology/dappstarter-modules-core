import NonFungibleToken from Flow.NonFungibleToken

pub fun main(acct: Address): [UInt64] {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/nftCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  return acctNFTCollectionRef.getIDs()
}