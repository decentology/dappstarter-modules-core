import NFTContract from Project.NFTContract
import NonFungibleToken from Flow.NonFungibleToken

pub fun main(acct: Address, id: UInt64): [UInt64] {
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/nftCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  let borrowedNFT = acctNFTCollectionRef.borrowNFT(id: id)
  
  let infoArray: [UInt64] = [borrowedNFT.id] 
  return infoArray
}