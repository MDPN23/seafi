use alloy_primitives::U256;
use crate::{SeaFi, IERC20, IAavePool};

/// Manually stake a specified amount of USDC into Aave V3.
pub fn stake_to_aave(contract: &mut SeaFi, amount: U256) -> Result<(), Vec<u8>> {
    let usdc_addr = contract.usdc_token.get();
    let aave_pool_addr = contract.aave_pool.get();
    let self_addr = stylus_sdk::contract::address();
    
    let usdc = IERC20::new(usdc_addr);
    let aave_pool = IAavePool::new(aave_pool_addr);
    
    // 1. Approve Aave Pool to spend the contract's USDC
    let approve_success = usdc.approve(&mut *contract, aave_pool_addr, amount)
        .map_err(|e| e)?;
        
    if !approve_success {
        return Err("Aave USDC approval failed".as_bytes().to_vec());
    }
    
    // 2. Supply USDC to the Aave Pool
    aave_pool.supply(&mut *contract, usdc_addr, amount, self_addr, 0)
        .map_err(|e| e)?;
        
    Ok(())
}

/// Automatically rebalances the vault.
/// In a production environment, this function pulls down yield-bearing capital (aUSDC -> USDC)
/// if raw USDC in the contract is low, or stakes excess USDC to Aave V3.
pub fn rebalance(contract: &mut SeaFi) -> Result<(), Vec<u8>> {
    let usdc_addr = contract.usdc_token.get();
    let aave_pool_addr = contract.aave_pool.get();
    let self_addr = stylus_sdk::contract::address();
    
    let usdc = IERC20::new(usdc_addr);
    
    // Get the raw USDC balance of this contract
    let raw_balance = usdc.balance_of(&mut *contract, self_addr)
        .map_err(|e| e)?;
        
    // Define a target liquidity threshold for local withdrawals (e.g. 100 USDC = 100_000_000 micro-USDC)
    let min_liquidity = U256::from(100_000_000u64);
    
    if raw_balance < min_liquidity {
        // We need to withdraw some liquidity from Aave V3
        let to_withdraw = min_liquidity - raw_balance;
        let aave_pool = IAavePool::new(aave_pool_addr);
        
        // Call withdraw from Aave
        aave_pool.withdraw(&mut *contract, usdc_addr, to_withdraw, self_addr)
            .map_err(|e| e)?;
    } else if raw_balance > min_liquidity * U256::from(2u64) {
        // We have excess local liquidity; stake the surplus to Aave V3
        let surplus = raw_balance - min_liquidity;
        stake_to_aave(&mut *contract, surplus)?;
    }
    
    Ok(())
}
