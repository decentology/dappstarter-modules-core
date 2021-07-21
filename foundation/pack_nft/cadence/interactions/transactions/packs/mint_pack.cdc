import AdminContract from Project.AdminContract

// Called by the admin to mint a Pack.

transaction(packType: UInt64, numberOfPacks: UInt64) {

  let adminRef: &AdminContract.Admin

  prepare(admin: AuthAccount) {
    // Borrows an Admin resource reference
    self.adminRef = admin.borrow<&AdminContract.Admin>(from: /storage/admin)
        ?? panic("Could not borrow the minter reference from the admin")
  }

  execute {
    // Calls mintPacks on the Admin resource reference
    self.adminRef.mintPacks(packType: packType, numberOfPacks: numberOfPacks)

    log("Minted a pack")
  }
}