import MarketplaceContract from Project.MarketplaceContract

pub fun main(adminAddr: Address): {UFix64: UFix64} {
  let acctPackCollectionRef = getAccount(adminAddr).getCapability(/public/packSaleCollection)
              .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
              ?? panic("Could not borrow the public capability for the recipient's account")
  let ids = acctPackCollectionRef.getIDs()
  let available: {UFix64: UFix64} = {}

  for id in ids {
    available[UFix64(id)] = acctPackCollectionRef.idPrice(id: id)!
  }

  return available
}