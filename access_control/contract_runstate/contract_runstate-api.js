///(api-controller-import
///)

///(api-admin-controller-import
///)

///(api-service-import
///)

///(api-admin-service-import
///)

///(api-controller

 @Get('isContractRunStateActive')
 @ApiOperation({ summary: 'Get contract run-state' })
 async isContractRunStateActive(): Promise<string> {
   return this.dappService.isContractRunStateActive();
 }
///)

///(api-service

async isContractRunStateActive() : Promise<any> {
   return await DappLib.isContractRunStateActive();
 }
///)

///(api-admin-controller
///)

///(api-admin-service
///)
