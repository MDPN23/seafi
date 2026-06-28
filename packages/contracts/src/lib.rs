#![cfg_attr(not(any(test, feature = "export-abi")), no_main)]
extern crate alloc;

use alloy_primitives::{Address, U256};
use stylus_sdk::prelude::*;

pub mod cross_border_invoice;
pub mod bulk_payout;
pub mod smart_escrow;

sol_interface! {
    interface IERC20 {
        function transfer(address to, uint256 value) external returns (bool);
        function transferFrom(address from, address to, uint256 value) external returns (bool);
        function balanceOf(address owner) external view returns (uint256);
    }
}

sol_storage! {
    #[entrypoint]
    pub struct SeaFi {
        address usdc_token;
        
        uint256 next_invoice_id;
        mapping(uint256 => Invoice) invoices;
        
        uint256 next_escrow_id;
        mapping(uint256 => Escrow) escrows;
    }

    pub struct Invoice {
        address freelancer;
        uint256 amount;
        bool is_paid;
    }

    pub struct Escrow {
        address client;
        address freelancer;
        uint256 amount;
        bool is_released;
    }
}

#[public]
impl SeaFi {
    pub fn init(&mut self, usdc: Address) -> Result<(), alloc::vec::Vec<u8>> {
        self.usdc_token.set(usdc);
        Ok(())
    }

    // --- Cross-Border Invoicing ---
    pub fn create_invoice(&mut self, amount: U256) -> Result<U256, alloc::vec::Vec<u8>> {
        cross_border_invoice::create_invoice(self, amount)
    }

    pub fn pay_invoice(&mut self, invoice_id: U256) -> Result<(), alloc::vec::Vec<u8>> {
        cross_border_invoice::pay_invoice(self, invoice_id)
    }

    // --- Bulk Payouts ---
    pub fn batch_pay(&mut self, recipients: alloc::vec::Vec<Address>, amounts: alloc::vec::Vec<U256>) -> Result<(), alloc::vec::Vec<u8>> {
        bulk_payout::batch_pay(self, recipients, amounts)
    }

    // --- Smart Escrow ---
    pub fn lock_funds(&mut self, freelancer: Address, amount: U256) -> Result<U256, alloc::vec::Vec<u8>> {
        smart_escrow::lock_funds(self, freelancer, amount)
    }

    pub fn release_milestone(&mut self, escrow_id: U256) -> Result<(), alloc::vec::Vec<u8>> {
        smart_escrow::release_milestone(self, escrow_id)
    }

    // --- Views ---
    pub fn get_usdc_token(&self) -> Result<Address, alloc::vec::Vec<u8>> {
        Ok(self.usdc_token.get())
    }
}
