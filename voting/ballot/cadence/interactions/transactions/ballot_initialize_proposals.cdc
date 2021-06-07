import Ballot from Project.BallotContract

transaction(proposals: [String]) {

    prepare(admin: AuthAccount) {

        // borrow a reference to the admin Resource
        let adminRef = admin.borrow<&Ballot.Administrator>(from: /storage/VotingAdmin)!
        
        // Call the initializeProposals function
        // to create the proposals array as an array of strings
        adminRef.initializeProposals(proposals)
    }
}