// Allow the contract to be compiled for non-test/export-abi targets
#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use stylus_sdk::prelude::*;
use alloy_primitives::{Address, U256};
use stylus_sdk::storage::{StorageAddress, StorageMap, StorageU256};

pub mod payroll_stream;
pub mod staking_vault;

// External ERC-20 contract interface (specifically USDC)
sol_interface! {
    interface IERC20 {
        function transfer(address to, uint256 value) external returns (bool);
        function transferFrom(address from, address to, uint256 value) external returns (bool);
        function balanceOf(address owner) external view returns (uint256);
        function approve(address spender, uint256 value) external returns (bool);
    }
}

// External Aave V3 Pool interface
sol_interface! {
    interface IAavePool {
        function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external;
        function withdraw(address asset, uint256 amount, address to) external returns (uint256);
    }
}

#[entrypoint]
#[storage]
pub struct SeaFi {
    // Token and protocol addresses
    pub usdc_token: StorageAddress,
    pub aave_pool: StorageAddress,
    
    // Employer deposits (unallocated and staked)
    // employer -> total USDC deposited in the contract
    pub employer_balances: StorageMap<Address, StorageU256>,
    
    // Streaming state
    // employee -> rate of USDC per second (using USDC decimals)
    pub stream_rates: StorageMap<Address, StorageU256>,
    // employee -> timestamp of last withdrawal or when the stream started
    pub last_withdrawal_timestamp: StorageMap<Address, StorageU256>,
    // employee -> employer address
    pub employee_employers: StorageMap<Address, StorageAddress>,
}

#[public]
impl SeaFi {
    /// Initializes the contract with external dependencies
    pub fn init(&mut self, usdc: Address, aave: Address) -> Result<(), Vec<u8>> {
        self.usdc_token.set(usdc);
        self.aave_pool.set(aave);
        Ok(())
    }

    /// Deposit salary as an employer
    pub fn deposit_salary(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        payroll_stream::deposit_salary(self, amount)
    }

    /// Set salary streaming parameters for an employee
    pub fn stream_salary(&mut self, employee: Address, rate_per_second: U256) -> Result<(), Vec<u8>> {
        payroll_stream::stream_salary(self, employee, rate_per_second)
    }

    /// Withdraw accumulated streamed wages as an employee
    pub fn withdraw(&mut self) -> Result<U256, Vec<u8>> {
        payroll_stream::withdraw(self)
    }

    /// Manually stake an amount of idle contract capital to Aave V3
    pub fn stake_to_aave(&mut self, amount: U256) -> Result<(), Vec<u8>> {
        staking_vault::stake_to_aave(self, amount)
    }

    /// Automatically rebalance funds between Aave yield pool and streaming liquidity
    pub fn rebalance(&mut self) -> Result<(), Vec<u8>> {
        staking_vault::rebalance(self)
    }

    // View functions for utility / UI integration
    
    pub fn get_usdc_token(&self) -> Result<Address, Vec<u8>> {
        Ok(self.usdc_token.get())
    }

    pub fn get_aave_pool(&self) -> Result<Address, Vec<u8>> {
        Ok(self.aave_pool.get())
    }

    pub fn get_employer_balance(&self, employer: Address) -> Result<U256, Vec<u8>> {
        Ok(self.employer_balances.get(employer))
    }

    pub fn get_stream_rate(&self, employee: Address) -> Result<U256, Vec<u8>> {
        Ok(self.stream_rates.get(employee))
    }

    pub fn get_last_withdrawal(&self, employee: Address) -> Result<U256, Vec<u8>> {
        Ok(self.last_withdrawal_timestamp.get(employee))
    }
}
