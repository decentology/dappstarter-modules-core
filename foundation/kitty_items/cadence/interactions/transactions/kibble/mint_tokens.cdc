import Kibble from "../../../contracts/Project/Kibble.cdc"
import FungibleToken from "../../../contracts/Flow/FungibleToken.cdc"

transaction(recipient: Address, amount: UFix64) {
    let tokenMinter: &Kibble.Minter
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenMinter = signer.borrow<&Kibble.Minter>(from: Kibble.MinterStoragePath)
                                ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient).getCapability(Kibble.ReceiverPublicPath)
                                .borrow<&{FungibleToken.Receiver}>()
                                ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let mintedVault <- self.tokenMinter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)
    }
}