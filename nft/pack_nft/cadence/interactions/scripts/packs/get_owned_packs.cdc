import PackContract from Project.PackContract
import NonFungibleToken from Flow.NonFungibleToken

pub fun main(accountAddr: Address): [UInt64] {
  let acctPackCollectionRef = getAccount(accountAddr).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  return acctPackCollectionRef.getIDs()
}