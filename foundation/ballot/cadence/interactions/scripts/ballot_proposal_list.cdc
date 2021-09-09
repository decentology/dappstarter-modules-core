import BallotContract from "../../contracts/Project/BallotContract.cdc"

pub fun main(): [String] {
    return BallotContract.proposalList()
}

