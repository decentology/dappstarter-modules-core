import DappState from Project.DappState
import NonFungibleToken from Flow.NonFungibleToken

// This transaction is what an account would run
// to set itself up to receive NFTs

transaction {

    prepare(acct: AuthAccount) {

        // Return early if the account already has a collection
        if acct.borrow<&DappState.Collection>(from: /storage/NFTCollection) != nil {
            return
        }

        // Create a new empty collection
        let collection <- DappState.createEmptyCollection()

        // save it to the account
        acct.save(<-collection, to: /storage/NFTCollection)

        // create a public capability for the collection
        acct.link<&{DappState.DappStateCollectionPublic, NonFungibleToken.CollectionPublic}>(
            /public/NFTCollection,
            target: /storage/NFTCollection
        )

        let collectionRef = acct.getCapability<&{DappState.DappStateCollectionPublic, NonFungibleToken.CollectionPublic}>(/public/NFTCollection)
        assert(collectionRef.borrow() != nil, message: "Missing or mis-typed Collection")
    }
}