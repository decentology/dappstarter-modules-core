import AdminContract from Project.AdminContract

// To be called by the admin to mint NFT(s)

transaction(numberOfNFTs: UInt64) {

  let adminRef: &AdminContract.Admin

  prepare(admin: AuthAccount) {
    // Borrow a Admin resource reference
    self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
  }

  execute {
    // Calls mintNFTs on the Admin resource reference
    self.adminRef.mintNFTs(numberOfNFTs: numberOfNFTs)

    log("Minted an NFT")
  }
}