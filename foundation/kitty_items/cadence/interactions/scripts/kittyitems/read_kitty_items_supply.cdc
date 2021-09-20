import KittyItems from "../../../contracts/Project/KittyItems.cdc"

// This scripts returns the number of KittyItems currently in existence.

pub fun main(): UInt64 {    
    return KittyItems.totalSupply
}