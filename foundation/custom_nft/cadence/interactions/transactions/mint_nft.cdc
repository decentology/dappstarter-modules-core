import Generator from Project.Generator
import CustomNFTContract from Project.CustomNFTContract
import NonFungibleToken from Flow.NonFungibleToken

// This script uses the NFTMinter resource to mint a new NFT
// It must be run with the account that has the minter resource
// stored in /storage/NFTMinter

transaction(recipient: Address, metadata: Generator.Metadata) {

    // The reference to the Minter resource stored in account storage
    let minterRef: &CustomNFTContract.NFTMinter

    prepare(acct: AuthAccount) {
        // borrow a reference to the NFTMinter resource in storage
        self.minterRef = acct.borrow<&CustomNFTContract.NFTMinter>(from: /storage/NFTMinter)
            ?? panic("Could not borrow a reference to the NFT minter")
        // Borrow the recipient's public NFT collection reference
        let receiver = getAccount(recipient)
            .getCapability(/public/NFTCollection)
            .borrow<&{NonFungibleToken.CollectionPublic}>()
            ?? panic("Could not get receiver reference to the NFT Collection")

        // Mint the NFT and deposit it to the recipient's collection
        self.minterRef.mintNFT(recipient: receiver, metadata: metadata)
    }

    execute {

    }
}