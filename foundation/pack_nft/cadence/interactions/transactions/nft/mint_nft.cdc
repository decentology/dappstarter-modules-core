import AdminContract from Project.AdminContract

transaction(numberOfNFTs: UInt64) {

  let minterRef: &AdminContract.Admin

  prepare(acct: AuthAccount) {
    self.minterRef = acct.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
  }

  execute {
    self.minterRef.mintNFTs(numberOfNFTs: numberOfNFTs)

    log("Minted an NFT")
  }
}