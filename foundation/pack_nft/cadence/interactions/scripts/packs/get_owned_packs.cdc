import PackContract from "../../../contracts/Project/PackContract.cdc"
import NonFungibleToken from "../../../contracts/Flow/NonFungibleToken.cdc"

// Gets all the owned Packs in the user's PackCollection

pub fun main(acct: Address): [UInt64] {
  // Borrows the acct's Pack Collection
  let acctPackCollectionRef = getAccount(acct).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  // Returns all the IDs of the Packs in the Collection
  return acctPackCollectionRef.getIDs()
}