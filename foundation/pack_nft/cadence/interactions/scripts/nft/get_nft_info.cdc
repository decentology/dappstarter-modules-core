import NFTContract from "../../../contracts/Project/NFTContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"

// Simply returns the id of the NFT back to the client

pub fun main(acct: Address, id: UInt64): &NonFungibleToken.NFT {
  // Borrows the user's NFT Collection
  let acctNFTCollectionRef = getAccount(acct).getCapability(/public/nftCollection)
            .borrow<&NFTContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  // Gets the info for the NFT with correct id
  let borrowedNFT = acctNFTCollectionRef.borrowNFT(id: id)
  
  // You'll notice that this simply returns the id back. 
  // Yes, I know... it's useless. But a good example! Haha :)
  return borrowedNFT
}