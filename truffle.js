// For working with INFURA
const HDWalletProvider = require("truffle-hdwallet-provider")
const fs = require("fs")

// First read in the secrets.json to get our mnemonic
let secrets
let mnemonic
if (fs.existsSync("secrets.json")) {
    secrets = JSON.parse(fs.readFileSync("secrets.json", "utf8"))
    mnemonic = secrets.mnemonic
} else {
    console.log("No secrets.json found. If you are trying to publish EPM " +
        "this will fail. Otherwise, you can ignore this message!")
    mnemonic = "thing burst differ file brown alert lunch giant book web emerge awkward"
}

var infura_apikey = "VJGiIBhLMhHDsBQ09MJu";


module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!

    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*",
            gasPrice: 2000000000,
            gas: 6.5e6

        },

        ropsten: {
            host: "127.0.0.1",
            port: 8547,
            network_id: "3" // Match any network id
        },


        ropsten_inf: {
            // provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/VJGiIBhLMhHDsBQ09MJu"),
            provider: function() {
                return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/" + infura_apikey)
            },        port: 8545,
            network_id: 3,
            //  from: "0x0073a284FE9C6f9ad578F23E2397BF2fe6De59A1"
            gasPrice: 2000000000,
            gas: 4000000

        },

    },




    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
};
