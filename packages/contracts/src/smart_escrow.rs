use alloc::vec::Vec;
use alloy_primitives::{Address, U256};
use stylus_sdk::{msg, call::Call, contract as stylus_contract};
use crate::{SeaFi, IERC20};

pub fn lock_funds(contract: &mut SeaFi, freelancer: Address, amount: U256) -> Result<U256, Vec<u8>> {
    let client = msg::sender();
    let escrow_id = contract.next_escrow_id.get();
    
    let mut escrow = contract.escrows.setter(escrow_id);
    escrow.client.set(client);
    escrow.freelancer.set(freelancer);
    escrow.amount.set(amount);
    escrow.is_released.set(false);
    
    contract.next_escrow_id.set(escrow_id + U256::from(1));
    
    let usdc = IERC20::new(contract.usdc_token.get());
    
    // Lock funds inside this contract securely
    let _ = usdc.transfer_from(Call::new_in(contract), client, stylus_contract::address(), amount)?;
    
    Ok(escrow_id)
}

pub fn release_milestone(contract: &mut SeaFi, escrow_id: U256) -> Result<(), Vec<u8>> {
    let mut escrow = contract.escrows.setter(escrow_id);
    
    if escrow.is_released.get() {
        return Err("Escrow already released".into());
    }
    
    let client = escrow.client.get();
    let freelancer = escrow.freelancer.get();
    let amount = escrow.amount.get();
    
    // Security Authorization: Only the client can release the locked funds
    if msg::sender() != client {
        return Err("Only client can release funds".into());
    }
    
    // Checks-Effects-Interactions: Mark released before transferring
    escrow.is_released.set(true);
    
    let usdc = IERC20::new(contract.usdc_token.get());
    
    // Transfer funds from contract to freelancer
    let _ = usdc.transfer(Call::new_in(contract), freelancer, amount)?;
    
    Ok(())
}
