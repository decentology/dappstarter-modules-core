import AdminContract from "../../../contracts/Project/AdminContract.cdc"

// Should be called by the admin to create a new Pack Type.

transaction(packType: UInt64, numberOfNFTs: UInt64, ipfsHash: String) {

  let adminRef: &AdminContract.Admin
  prepare(admin: AuthAccount) {
      // Borrows an Admin resource reference
      self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
      ?? panic("Could not borrow admin resource")
  }

  execute {
      // Calls addPackType on the Admin resource reference
      self.adminRef.addPackType(packType: packType, numberOfNFTs: numberOfNFTs, ipfsHash: ipfsHash)
      
      log("Added new pack type")
  }
}
