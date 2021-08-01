import FungibleToken from Flow.FungibleToken
import FlowToken from Flow.FlowToken

// Returns the balance of a FlowToken Vault

pub fun main(account: Address): UFix64 {
    // Borrow the account's FlowToken Vault
    let vaultRef = getAccount(account)
        .getCapability(/public/flowTokenBalance)
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow Balance reference to the Vault")

    // Return the balance in the FlowToken Vault
    return vaultRef.balance
}  