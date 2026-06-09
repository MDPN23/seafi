use stylus_sdk::{msg, block};
use alloy_primitives::{Address, U256};
use crate::{SeaFi, IERC20};

/// Allows an employer to deposit USDC into the contract to fund payroll.
pub fn deposit_salary(contract: &mut SeaFi, amount: U256) -> Result<(), Vec<u8>> {
    let sender = msg::sender();
    let usdc_addr = contract.usdc_token.get();
    
    let usdc = IERC20::new(usdc_addr);
    let self_addr = stylus_sdk::contract::address();
    
    // Transfer USDC from the employer to this contract
    let success = usdc.transfer_from(&mut *contract, sender, self_addr, amount)
        .map_err(|e| e)?;
        
    if !success {
        return Err("USDC transfer_from failed".as_bytes().to_vec());
    }
    
    // Update the employer's unallocated balance
    let current_balance = contract.employer_balances.get(sender);
    contract.employer_balances.insert(sender, current_balance + amount);
    
    Ok(())
}

/// Sets up or updates a salary stream for an employee.
pub fn stream_salary(contract: &mut SeaFi, employee: Address, rate_per_second: U256) -> Result<(), Vec<u8>> {
    let employer = msg::sender();
    
    // Map employee to employer
    contract.employee_employers.insert(employee, employer);
    
    // Set streaming parameters
    contract.stream_rates.insert(employee, rate_per_second);
    contract.last_withdrawal_timestamp.insert(employee, U256::from(block::timestamp()));
    
    Ok(())
}

/// Allows an employee to withdraw their earned salary since the last update.
pub fn withdraw(contract: &mut SeaFi) -> Result<U256, Vec<u8>> {
    let employee = msg::sender();
    let rate = contract.stream_rates.get(employee);
    
    if rate == U256::ZERO {
        return Err("No active stream found".as_bytes().to_vec());
    }
    
    let last_ts = contract.last_withdrawal_timestamp.get(employee);
    let current_ts = U256::from(block::timestamp());
    
    if current_ts <= last_ts {
        return Err("No time elapsed".as_bytes().to_vec());
    }
    
    let elapsed = current_ts - last_ts;
    let earned = elapsed * rate;
    
    if earned == U256::ZERO {
        return Err("No salary accrued yet".as_bytes().to_vec());
    }
    
    let employer = contract.employee_employers.get(employee);
    let employer_bal = contract.employer_balances.get(employer);
    
    if employer_bal < earned {
        return Err("Employer has insufficient funds".as_bytes().to_vec());
    }
    
    // Deduct from employer's balance
    contract.employer_balances.insert(employer, employer_bal - earned);
    
    // Update last withdrawal time to now
    contract.last_withdrawal_timestamp.insert(employee, current_ts);
    
    // Send USDC to the employee
    let usdc_addr = contract.usdc_token.get();
    let usdc = IERC20::new(usdc_addr);
    
    let success = usdc.transfer(&mut *contract, employee, earned)
        .map_err(|e| e)?;
        
    if !success {
        return Err("USDC transfer failed".as_bytes().to_vec());
    }
    
    Ok(earned)
}
