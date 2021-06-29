pub contract BallotContract {

    init() {
        // initializes the contract by setting the proposals and votes to empty 
        // and creating a new Admin resource to put in storage
        self.proposals = []
        self.votes = {}
        self.account.save(<-create Administrator(), to: /storage/VotingAdmin)
    }


    //list of proposals to be approved
    pub var proposals: [String]

    // number of votes per proposal
    pub let votes: {Int: Int}

    // This is the resource that is issued to users.
    // When a user gets a Ballot object, they call the `vote` function
    // to include their votes, and then cast it in the smart contract 
    // using the `cast` function to have their vote included in the polling
    pub resource Ballot {

        // array of all the proposals 
        pub let proposals: [String]

        // corresponds to an array index in proposals after a vote
        pub var choices: {Int: Bool}

        init() {
            self.proposals = BallotContract.proposals
            self.choices = {}
            
            // Set each choice to false
            var i = 0
            while i < self.proposals.length {
                self.choices[i] = false
                i = i + 1
            }
        }

        // modifies the ballot
        // to indicate which proposals it is voting for
        pub fun vote(proposal: Int) {
            pre {
                self.proposals[proposal] != nil: "Cannot vote for a proposal that doesn't exist"
            }
            self.choices[proposal] = true
        }
    }

    // Resource that the Administrator of the vote controls to
    // initialize the proposals and to pass out ballot resources to voters
    pub resource Administrator {

        // function to initialize all the proposals for the voting
        pub fun initializeProposals(_ proposals: [String]) {
            pre {
                BallotContract.proposals.length == 0: "Proposals can only be initialized once"
                proposals.length > 0: "Cannot initialize with no proposals"
            }
            BallotContract.proposals = proposals

            // Set each tally of votes to zero
            var i = 0
            while i < proposals.length {
                BallotContract.votes[i] = 0
                i = i + 1
            }
        }

        // The admin calls this function to create a new Ballot
        // that can be transferred to another user
        pub fun issueBallot(): @Ballot {
            return <-create Ballot()
        }
    }

    // A user moves their ballot to this function in the contract where 
    // its votes are tallied and the ballot is destroyed
    pub fun cast(ballot: @Ballot) {
        var index = 0
        // look through the ballot
        while index < self.proposals.length {
            if ballot.choices[index]! {
                // tally the vote if it is approved
                self.votes[index] = self.votes[index]! + 1
            }
            index = index + 1
        }
        // Destroy the ballot because it has been tallied
        destroy ballot
    }

    pub fun proposalList(): [String] {
        return self.proposals
    }
}