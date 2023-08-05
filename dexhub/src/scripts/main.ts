import Web3 from "web3";
import { networks } from "./networks";

const web3: Web3 = new Web3(window.ethereum);
window.ethereum.enable();

const createUserAccount = async (wallet: any) => {
    if (wallet != null) {
        const chainId: number | string = web3.utils.hexToNumber(window.ethereum.chainId);
        const calldata: string = web3.eth.abi.encodeFunctionCall({
            "inputs": [],
            "name": "createNewUserAccount",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }, []);
        const transaction = {
            'from': wallet,
            'to': networks[Number(chainId)].manager,
            'value': "0x00",
            'data': calldata
        }
        await window.ethereum.request({
            method: "eth_sendTransaction",
            params: [transaction],
        }).then((result: any) => {console.log(result)}).catch((error: Error) => {console.log(error)}); 
    }
}

const requestChangeNetwork = async (chainId: string) => {
    const connectedChain: string | number = web3.utils.hexToNumber(window.ethereum.chainId);
    if (connectedChain != chainId) {
        try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: web3.utils.toHex(chainId) }]
            });
        }
        catch (err) { console.log(err) }
    }
}

const disconnectWallet = async () => {
    await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [{eth_accounts: {}}]
    })
}

export default {
    disconnectWallet,
    createUserAccount,
    requestChangeNetwork
}