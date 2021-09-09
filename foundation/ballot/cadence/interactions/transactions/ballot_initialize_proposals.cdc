import BallotContract from "../../contracts/Project/BallotContract.cdc"

transaction(proposals: [String]) {

    prepare(admin: AuthAccount) {

        // borrow a reference to the admin Resource
        let adminRef = admin.borrow<&BallotContract.Administrator>(from: /storage/VotingAdmin)!
        
        // Call the initializeProposals function
        // to create the proposals array as an array of strings
        adminRef.initializeProposals(proposals)
    }
}