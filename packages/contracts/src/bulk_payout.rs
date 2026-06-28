use alloc::vec::Vec;
use alloy_primitives::{Address, U256};
use stylus_sdk::{msg, call::Call};
use crate::{SeaFi, IERC20};

pub fn batch_pay(contract: &mut SeaFi, recipients: Vec<Address>, amounts: Vec<U256>) -> Result<(), Vec<u8>> {
    // Security check to prevent out-of-bounds or mismatch
    if recipients.len() != amounts.len() {
        return Err("Array lengths mismatch".into());
    }
    
    let usdc = IERC20::new(contract.usdc_token.get());
    let client = msg::sender();
    
    // Gas Efficient Bulk Transfer:
    // Loops over the arrays and transfers directly from client to each freelancer.
    // This removes the need for the contract to hold funds, drastically reducing state changes.
    for (i, recipient) in recipients.iter().enumerate() {
        let amount = amounts[i];
        
        // Skip zero amounts to save gas
        if amount == U256::ZERO {
            continue;
        }
        
        let _ = usdc.transfer_from(Call::new_in(contract), client, *recipient, amount)?;
    }
    
    Ok(())
}
