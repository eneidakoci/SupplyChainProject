// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplyChain {
    struct Product {
        uint256 id;
        string name;
        string currentLocation;
        address owner;
        string[] history;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;

    event ProductUpdated(uint256 productId, string location, address owner);

    // Add a new product to the supply chain
    function addProduct(string memory name, string memory initialLocation) public {
        productCount++; // Increment the product count
        string[] memory emptyHistory; // Initialize an empty string array
        products[productCount] = Product(
            productCount,
            name,
            initialLocation,
            msg.sender,
            emptyHistory
        );
        products[productCount].history.push(initialLocation); // Add the initial location to history
        emit ProductUpdated(productCount, initialLocation, msg.sender);
    }

    // Update the location of a product
    function updateLocation(uint256 productId, string memory newLocation) public {
        require(productId > 0 && productId <= productCount, "Product does not exist");
        Product storage product = products[productId];
        require(msg.sender == product.owner, "Only the owner can update the product");

        product.currentLocation = newLocation;
        product.history.push(newLocation); // Add the new location to the history
        emit ProductUpdated(productId, newLocation, msg.sender);
    }

    // Retrieve the location history of a product
    function getProductHistory(uint256 productId) public view returns (string[] memory) {
        require(productId > 0 && productId <= productCount, "Product does not exist");
        return products[productId].history;
    }

    // Retrieve all products in the supply chain
    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory productList = new Product[](productCount);
        for (uint256 i = 1; i <= productCount; i++) {
            productList[i - 1] = products[i]; // Populate the array with products
        }
        return productList;
    }
}
