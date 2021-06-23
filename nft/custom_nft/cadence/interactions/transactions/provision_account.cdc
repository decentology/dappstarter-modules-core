import CustomNFTContract from Project.CustomNFTContract
import NonFungibleToken from Flow.NonFungibleToken

// This transaction is what an account would run
// to set itself up to receive NFTs

transaction {

    prepare(acct: AuthAccount) {

        // Return early if the account already has a collection
        if acct.borrow<&CustomNFTContract.Collection>(from: /storage/NFTCollection) != nil {
            return
        }

        // Create a new empty collection
        let collection <- CustomNFTContract.createEmptyCollection()

        // save it to the account
        acct.save(<-collection, to: /storage/NFTCollection)

        // create a public capability for the collection
        acct.link<&{CustomNFTContract.CustomNFTCollectionPublic, NonFungibleToken.CollectionPublic}>(
            /public/NFTCollection,
            target: /storage/NFTCollection
        )

        let collectionRef = acct.getCapability<&{CustomNFTContract.CustomNFTCollectionPublic, NonFungibleToken.CollectionPublic}>(/public/NFTCollection)
        assert(collectionRef.borrow() != nil, message: "Missing or mis-typed Collection")
    }
}