import BallotContract from "../../contracts/Project/BallotContract.cdc"

transaction(proposalVote: Int) {

    prepare(voter: AuthAccount) {

        // take the voter's ballot our of storage
        let ballot <- voter.load<@BallotContract.Ballot>(from: /storage/Ballot)
            ?? panic("A Ballot does not exist in this voter's storage")

        // Vote on the proposal 
        ballot.vote(proposal: proposalVote)

        // Cast the vote by submitting it to the smart contract
        BallotContract.cast(ballot: <-ballot)
    }
}