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
        acct.link<&{DappState.CollectionPublic}>(
            /public/NFTCollection,
            target: /storage/NFTCollection
        )
    }
}
 