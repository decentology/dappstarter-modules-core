import FlowToken from "../../../contracts/Flow/FlowToken.cdc"
import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"

// Mints FlowTokens

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &FlowToken.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(acct: AuthAccount) {
        // NOTE: acct MUST be the service account in the wallet. 
        // This borrows a FlowToken Administrator resource reference to mint FlowToken.
        self.tokenAdmin = acct.borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin)
            ?? panic("Signer is not the token admin")

        // Borrows the recipient's FlowToken Vault
        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        // Creates a new minter
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        // Mints FlowToken and receives a Vault with the FlowToken
        let mintedVault <- minter.mintTokens(amount: amount)

        // Deposits the Vault filled with FlowToken into the receiver's 
        // FlowToken Vault
        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}