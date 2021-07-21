const sc = require('./smartContract');
const walletsEthers = require("./wallets");
const { ethersNumToWeis } = require('./utils');
const transactionsRepo = require("../db/repositories/transactionsRepo");
const projectsRepo = require("../db/repositories/projectsRepo");
const { log } = require("../log");


async function fund(
  amountEthers, 
  funderPrivateKey, 
  projectSCId, 
  transcationId, 
  projectPublicId
  ) {
  log(`Mining 'fund' transaction ${transcationId}`);
  const funderWallet = walletsEthers.getFromPrivateKey(funderPrivateKey);
  const seedyFiubaContract = await sc.getContract(funderWallet);
  let overrides = { value: ethersNumToWeis(amountEthers) };
  const tx = await seedyFiubaContract.fund(projectSCId, overrides);
  await transactionsRepo.update(transcationId, {transactionState: 'mining'});

  tx.wait(1).then(receipt => {
    console.log("Transaction mined");
    const firstEvent = receipt && receipt.events && receipt.events[0];
    // This could also be a ProjectStarted event
    console.log(firstEvent);
    updatesTransactionDict = null;
    if (firstEvent && firstEvent.event === "ProjectFunded") {
      const projectId = firstEvent.args.projectId.toNumber();
      const funderAddress = firstEvent.args.funder.toString();
      const funds = firstEvent.args.funds.toNumber();
      log(`Event 'ProjectFunded': ` + 
          `\n\tprojectId: ${projectId}` + 
          `\n\tfunderAddress: ${funderAddress}` + 
          `\n\tfunds: ${funds} weis`
          );
      updatesTransactionDict = { transactionState: 'done', amountEthers: funds};
      projectsRepo.addBalance(projectPublicId, funds);
    } else {
      log(`Fund tx ${tx.hash}: failed`);
      updatesTransactionDict = { transactionState: 'failed'};
    }
    transactionsRepo.update(transcationId, updatesTransactionDict);
  });
}

module.exports = { fund };
