// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILiquidityPool {
    function addLiquidity(uint256 amount) external;
    function removeLiquidity(uint256 amount) external;
}