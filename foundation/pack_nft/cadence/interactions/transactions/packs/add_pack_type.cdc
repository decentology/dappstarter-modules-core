import AdminContract from Project.AdminContract

transaction(packType: UInt64, numberOfNFTs: UInt64) {

  let adminRef: &AdminContract.Admin
  prepare(acct: AuthAccount) {
      self.adminRef = acct.borrow<&AdminContract.Admin>(from: /storage/admin)
      ?? panic("Could not borrow admin resource")
  }

  execute {
      self.adminRef.addPackType(packType: packType, numberOfNFTs: numberOfNFTs)
      
      log("Added new pack type")
  }
}
