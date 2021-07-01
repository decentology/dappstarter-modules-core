import Kibble from Project.Kibble

// This script returns the total amount of Kibble currently in existence.

pub fun main(): UFix64 {

    let supply = Kibble.totalSupply

    log(supply)

    return supply
}