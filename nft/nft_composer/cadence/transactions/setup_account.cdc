// This transaction configures a user's account
// to use the NFT contract by creating a new empty collection,
// storing it in their account storage, and publishing a capability
transaction {
    prepare(acct: AuthAccount) {

        // Create a new empty collection
        let collection <- DappState.createEmptyCollection()

        // store the empty NFT Collection in account storage
        acct.save<@DappState.Collection>(<-collection, to: /storage/NFTCollection)

        // create a public capability for the Collection
        acct.link<&{DappState.NFTReceiver}>(/public/NFTReceiver, target: /storage/NFTCollection)

    }
}
 