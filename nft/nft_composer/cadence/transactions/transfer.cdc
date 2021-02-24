// This transaction transfers an NFT from one user's collection
// to another user's collection.
transaction(receiverAddr: Address) {

    // The field that will hold the NFT as it is being
    // transferred to the other account
    let transferToken: @DappState.NFT
	
    prepare(acct: AuthAccount) {

        // Borrow a reference from the stored collection
        let collectionRef = acct.borrow<&DappState.Collection>(from: /storage/NFTCollection)
            ?? panic("Could not borrow a reference to the owner's collection")

        // Call the withdraw function on the sender's Collection
        // to move the NFT out of the collection
        self.transferToken <- collectionRef.withdraw(withdrawID: 1)
    }

    execute {
        // Get the recipient's public account object
        let recipient = getAccount(receiverAddr)

        // Get the Collection reference for the receiver
        // getting the public capability and borrowing a reference from it
        let receiverRef = recipient.getCapability<&{DappState.NFTReceiver}>(/public/NFTReceiver)
            .borrow()
            ?? panic("Could not borrow receiver reference")

        // Deposit the NFT in the receivers collection
        receiverRef.deposit(token: <-self.transferToken)
    }
}
 