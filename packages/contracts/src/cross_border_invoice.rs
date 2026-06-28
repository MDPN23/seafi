use alloc::vec::Vec;
use alloy_primitives::{U256};
use stylus_sdk::{msg, call::Call};
use crate::{SeaFi, IERC20};

pub fn create_invoice(contract: &mut SeaFi, amount: U256) -> Result<U256, Vec<u8>> {
    let freelancer = msg::sender();
    let invoice_id = contract.next_invoice_id.get();
    
    let mut invoice = contract.invoices.setter(invoice_id);
    invoice.freelancer.set(freelancer);
    invoice.amount.set(amount);
    invoice.is_paid.set(false);
    
    contract.next_invoice_id.set(invoice_id + U256::from(1));
    
    Ok(invoice_id)
}

pub fn pay_invoice(contract: &mut SeaFi, invoice_id: U256) -> Result<(), Vec<u8>> {
    let mut invoice = contract.invoices.setter(invoice_id);
    
    // Check if already paid
    if invoice.is_paid.get() {
        return Err("Invoice already paid".into());
    }
    
    let amount = invoice.amount.get();
    let freelancer = invoice.freelancer.get();
    let client = msg::sender();
    
    // CEI Pattern (Checks-Effects-Interactions) for Security
    // Mark as paid before the transfer to prevent reentrancy attacks
    invoice.is_paid.set(true);
    
    let usdc = IERC20::new(contract.usdc_token.get());
    
    // Gas Efficient: Transfer USDC directly from client to freelancer
    // bypassing the contract's balance to save on SSTORE operations
    let _ = usdc.transfer_from(Call::new_in(contract), client, freelancer, amount)?;
    
    Ok(())
}
