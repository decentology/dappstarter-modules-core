import MarketplaceContract from "../../../contracts/Project/MarketplaceContract.cdc"

// Gets all the Packs up for sale in the admin's account

pub fun main(admin: Address): {UFix64: UFix64} {
  // Borrows the admin's SaleCollection so we can see what Packs are available
  let acctPackCollectionRef = getAccount(admin).getCapability(/public/packSaleCollection)
              .borrow<&MarketplaceContract.SaleCollection{MarketplaceContract.SalePublic}>()
              ?? panic("Could not borrow the public capability for the recipient's account")
  // Gets all the IDs in the SaleCollection above
  let ids = acctPackCollectionRef.getIDs()
  let available: {UFix64: UFix64} = {}

  // Loops over every ID and maps it to the price of the Pack with that ID
  for id in ids {
    available[UFix64(id)] = acctPackCollectionRef.idPrice(id: id)!
  }

  return available
}