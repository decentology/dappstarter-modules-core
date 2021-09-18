import SimpleNFTContract from "../../contracts/Project/SimpleNFTContract.cdc"
import NonFungibleToken from "../../contracts/Flow/NonFungibleToken.cdc"

transaction(receiverAddr: Address, withdrawID: UInt64) {

    prepare(acct: AuthAccount) {

        // get the recipients public account object
        let recipient = getAccount(receiverAddr)

        // borrow a reference to the signer's NFT collection
        let collectionRef = acct.borrow<&SimpleNFTContract.Collection>(from: /storage/NFTCollection)
            ?? panic("Could not borrow a reference to the owner's collection")

        // borrow a public reference to the receivers collection
        let depositRef = recipient.getCapability(/public/NFTCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not borrow a reference to the receiver's collection")

        // withdraw the NFT from the owner's collection
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)

        // Deposit the NFT in the recipient's collection
        depositRef.deposit(token: <-nft)
    }
}
 