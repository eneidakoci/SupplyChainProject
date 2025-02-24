const SupplyChain = artifacts.require("SupplyChain");

module.exports = async function(deployer) {
  await deployer.deploy(SupplyChain);
  console.log("SupplyChain contract deployed at:", SupplyChain.address);
};