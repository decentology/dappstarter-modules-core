import PackContract from Project.PackContract

pub fun main(packType: UInt64): PackContract.PackType {
  return PackContract.getPackTypeInfo(packType: packType) 
}