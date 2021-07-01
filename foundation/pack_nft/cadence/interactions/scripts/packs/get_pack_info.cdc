import PackContract from Project.PackContract

pub fun main(id: UInt64, acct: Address): {String: UInt64} {
  let packCollectionRef = getAccount(acct).getCapability(/public/packCollection)
            .borrow<&PackContract.Collection{PackContract.IPackCollectionPublic}>()
            ?? panic("Could not borrow the public capability for the recipient's account")
  
  let packRef = packCollectionRef.borrowPack(id: id) 
    ?? panic("This Pack does not belong to this user or does not exist")
  
  let infoArray: {String: UInt64} = {"id": packRef.id, "packType": packRef.packType}
  return infoArray
}