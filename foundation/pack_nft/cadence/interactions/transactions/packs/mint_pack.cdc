import AdminContract from Project.AdminContract

transaction(packType: UInt64, numberOfPacks: UInt64) {

  let minterRef: &AdminContract.Admin

  prepare(acct: AuthAccount) {
    self.minterRef = acct.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
  }

  execute {
    self.minterRef.mintPacks(packType: packType, numberOfPacks: numberOfPacks)

    log("Minted a pack")
  }
}