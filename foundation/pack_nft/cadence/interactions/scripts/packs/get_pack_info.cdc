import PackContract from "../../../contracts/Project/PackContract.cdc"

// Returns all the info of a Pack

pub fun main(id: UInt64, acct: Address): &PackContract.NFT {
  // Borrows the account's Pack Collection
  let packCollectionRef = getAccount(acct).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  
  // Borrows the a reference to that Pack
  let packRef = packCollectionRef.borrowPack(id: id) 
    ?? panic("This Pack does not belong to this user or does not exist")
  
  // Will return all the info of the Pack to the client
  return packRef
}