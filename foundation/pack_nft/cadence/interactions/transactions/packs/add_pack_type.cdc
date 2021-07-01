import AdminContract from Project.AdminContract

transaction(packType: UInt64, numberOfNFTs: UInt64) {
  prepare(acct: AuthAccount) {
      let adminRef = acct.borrow<&AdminContract.Admin>(from: /storage/admin)
      ?? panic("Could not borrow admin resource")
      
      adminRef.addPackType(packType: packType, numberOfNFTs: numberOfNFTs)
      
      log("Added new pack type")
  }

  execute {
      
  }
}
