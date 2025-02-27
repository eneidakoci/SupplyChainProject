let web3;
let contract;
// const contractAddress = '0xA1d2cc7F965e252AE76667E229891cD0D7275052';
const contractAddress = '0x75297c9B55CaD6cb110f24fB51128f26C186811A';

// Contract ABI - copied this from build/contracts/SupplyChain.json
const abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "location",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ProductUpdated",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "productCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "products",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "currentLocation",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "initialLocation",
          "type": "string"
        }
      ],
      "name": "addProduct",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "newLocation",
          "type": "string"
        }
      ],
      "name": "updateLocation",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "productId",
          "type": "uint256"
        }
      ],
      "name": "getProductHistory",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    },
    {
      "inputs": [],
      "name": "getAllProducts",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "currentLocation",
              "type": "string"
            },
            {
              "internalType": "address",
              "name": "owner",
              "type": "address"
            },
            {
              "internalType": "string[]",
              "name": "history",
              "type": "string[]"
            }
          ],
          "internalType": "struct SupplyChain.Product[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function",
      "constant": true
    }
  ];

async function init() {
  if (typeof window.ethereum !== 'undefined') {
      try {
          // request account access
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          web3 = new Web3(window.ethereum);
          contract = new web3.eth.Contract(abi, contractAddress);
          
          // log the current account
          console.log('Currently connected account:', accounts[0]);
          
          // listen for any account changes
          window.ethereum.on('accountsChanged', function (accounts) {
              console.log('Account changed to:', accounts[0]);
              window.location.reload();
          });

          // listen for network changes
          window.ethereum.on('chainChanged', function (networkId) {
              // refresh the page to ensure everything is reset
              window.location.reload();
          });

          console.log('Web3 and contract initialized successfully');
      } catch (error) {
          console.error("Error initializing Web3:", error);
          alert('Error connecting to MetaMask. Please make sure it is installed and unlocked.');
      }
  } else {
      console.error('MetaMask not found');
      alert('Please install MetaMask!');
  }
}

// function for retrieving last created account
async function getCurrentAccount() {
  const accounts = await web3.eth.getAccounts();
  console.log('Current account:', accounts[0]);
  return accounts[0];
}

async function addProduct() {
  if (!contract) {
      alert('Contract not initialized. Please wait or refresh the page.');
      return;
  }
  
  const name = document.getElementById('productName').value;
  const location = document.getElementById('initialLocation').value;
  
  try {
      const currentAccount = await getCurrentAccount();
      if (!currentAccount) {
          alert('No account found. Please connect MetaMask.');
          return;
      }
      console.log('Using account:', currentAccount);
      await contract.methods.addProduct(name, location)
          .send({ from: currentAccount });
      alert('Product added successfully!');
  } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + error.message);
  }
}

async function updateLocation() {
  if (!contract) {
      alert('Contract not initialized. Please wait or refresh the page.');
      return;
  }

  const productId = document.getElementById('productId').value;
  const newLocation = document.getElementById('newLocation').value;
  
  try {
      const currentAccount = await getCurrentAccount();
      await contract.methods.updateLocation(productId, newLocation)
          .send({ from: currentAccount });
      alert('Location updated successfully!');
  } catch (error) {
      alert('Error updating location: ' + error.message);
  }
}

async function getProductHistory() {
    if (!contract) {
        alert('Contract not initialized. Please wait or refresh the page.');
        return;
    }

    const productId = document.getElementById('historyProductId').value;
    
    try {
        const history = await contract.methods.getProductHistory(productId).call();
        const historyList = document.getElementById('history');
        historyList.innerHTML = '';
        history.forEach((location, index) => {
            const li = document.createElement('li');
            li.textContent = `Step ${index + 1}: ${location}`;
            historyList.appendChild(li);
        });
    } catch (error) {
        alert('Error getting history: ' + error.message);
    }
}

// initialize when page loads
window.addEventListener('load', init);