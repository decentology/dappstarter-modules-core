import AdminContract from Project.AdminContract

transaction(numberOfNFTs: UInt64) {

  prepare(acct: AuthAccount) {
    let minterRef = acct.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
    
    minterRef.mintNFTs(numberOfNFTs: numberOfNFTs)

    log("Minted an NFT")
  }

  execute {
    
  }
}