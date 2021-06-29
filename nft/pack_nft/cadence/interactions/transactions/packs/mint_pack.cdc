import AdminContract from Project.AdminContract

transaction(packType: UInt64, numberOfPacks: UInt64) {

  prepare(acct: AuthAccount) {
    let minterRef = acct.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
    
    minterRef.mintPacks(packType: packType, numberOfPacks: numberOfPacks)

    log("Minted a pack")
  }

  execute {
    
  }
}