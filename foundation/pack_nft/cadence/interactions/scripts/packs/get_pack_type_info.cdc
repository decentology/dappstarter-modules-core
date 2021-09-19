import PackContract from "../../../contracts/Project/PackContract.cdc"

// Gets the info of a Pack Type

pub fun main(packType: UInt64): PackContract.PackType {
  // Gets the info of the packType
  return PackContract.getPackTypeInfo(packType: packType) 
}