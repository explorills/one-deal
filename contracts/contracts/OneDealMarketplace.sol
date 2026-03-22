// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title OneDealMarketplace
/// @notice Simple NFT marketplace for Flare and Songbird networks.
///         Supports listing, buying, and cancelling ERC-721 NFTs.
///         No auction or bidding — fixed-price sales only.
contract OneDealMarketplace is ReentrancyGuard {

    struct Listing {
        address seller;
        uint256 price;
    }

    /// @notice Platform fee in basis points (e.g., 250 = 2.5%)
    uint256 public constant PLATFORM_FEE_BPS = 250;

    /// @notice Address that receives platform fees
    address public immutable feeRecipient;

    /// @notice nftAddress => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    event ItemListed(address indexed nftAddress, uint256 indexed tokenId, address indexed seller, uint256 price);
    event ItemBought(address indexed nftAddress, uint256 indexed tokenId, address indexed buyer, address seller, uint256 price);
    event ItemCancelled(address indexed nftAddress, uint256 indexed tokenId, address indexed seller);

    error NotOwner();
    error NotListed();
    error AlreadyListed();
    error PriceZero();
    error InsufficientPayment();
    error NotApproved();
    error TransferFailed();

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    /// @notice List an ERC-721 NFT for sale at a fixed price.
    /// @dev Caller must own the NFT and have approved this contract.
    function listItem(address nftAddress, uint256 tokenId, uint256 price) external {
        if (price == 0) revert PriceZero();
        if (listings[nftAddress][tokenId].price != 0) revert AlreadyListed();

        IERC721 nft = IERC721(nftAddress);
        if (nft.ownerOf(tokenId) != msg.sender) revert NotOwner();
        if (nft.getApproved(tokenId) != address(this) && !nft.isApprovedForAll(msg.sender, address(this))) revert NotApproved();

        listings[nftAddress][tokenId] = Listing(msg.sender, price);
        emit ItemListed(nftAddress, tokenId, msg.sender, price);
    }

    /// @notice Buy a listed NFT by sending the exact listing price.
    function buyItem(address nftAddress, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price == 0) revert NotListed();
        if (msg.value < listing.price) revert InsufficientPayment();

        delete listings[nftAddress][tokenId];

        // Calculate fee
        uint256 fee = (listing.price * PLATFORM_FEE_BPS) / 10000;
        uint256 sellerProceeds = listing.price - fee;

        // Transfer NFT to buyer
        IERC721(nftAddress).safeTransferFrom(listing.seller, msg.sender, tokenId);

        // Pay seller
        (bool sellerPaid,) = payable(listing.seller).call{value: sellerProceeds}("");
        if (!sellerPaid) revert TransferFailed();

        // Pay platform fee
        if (fee > 0) {
            (bool feePaid,) = payable(feeRecipient).call{value: fee}("");
            if (!feePaid) revert TransferFailed();
        }

        // Refund excess payment
        uint256 excess = msg.value - listing.price;
        if (excess > 0) {
            (bool refunded,) = payable(msg.sender).call{value: excess}("");
            if (!refunded) revert TransferFailed();
        }

        emit ItemBought(nftAddress, tokenId, msg.sender, listing.seller, listing.price);
    }

    /// @notice Cancel a listing. Only the original seller can cancel.
    function cancelListing(address nftAddress, uint256 tokenId) external {
        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price == 0) revert NotListed();
        if (listing.seller != msg.sender) revert NotOwner();

        delete listings[nftAddress][tokenId];
        emit ItemCancelled(nftAddress, tokenId, msg.sender);
    }

    /// @notice Check if an NFT is currently listed.
    function isListed(address nftAddress, uint256 tokenId) external view returns (bool) {
        return listings[nftAddress][tokenId].price != 0;
    }

    /// @notice Get listing details.
    function getListing(address nftAddress, uint256 tokenId) external view returns (address seller, uint256 price) {
        Listing memory listing = listings[nftAddress][tokenId];
        return (listing.seller, listing.price);
    }
}
