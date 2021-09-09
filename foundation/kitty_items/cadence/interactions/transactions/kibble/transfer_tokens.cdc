import Kibble from "../../../contracts/Project/Kibble.cdc"
import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"

// This transaction is a template for a transaction that
// could be used by anyone to send tokens to another account
// that has been set up to receive tokens.
//
// The withdraw amount and the account from getAccount
// would be the parameters to the transaction

transaction(amount: UFix64, to: Address) {

    // A reference to the signer's stored vault
    let vaultRef: &Kibble.Vault
    // A reference to the recipient's Receiver
    let receiverRef: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {

        // Get a reference to the signer's stored vault
        self.vaultRef = signer.borrow<&Kibble.Vault>(from: Kibble.VaultStoragePath)
			?? panic("Could not borrow reference to the owner's Vault!")

        // Get a reference to the recipient's Receiver
        self.receiverRef = getAccount(to).getCapability(Kibble.ReceiverPublicPath)
                            .borrow<&{FungibleToken.Receiver}>()
			                ?? panic("Could not borrow receiver reference to the recipient's Vault")
    }

    execute {
        // Withdraw tokens from the signer's stored vault
        let sentVault <- self.vaultRef.withdraw(amount: amount)

        // Deposit the withdrawn tokens in the recipient's receiver
        self.receiverRef.deposit(from: <-sentVault)
    }
}