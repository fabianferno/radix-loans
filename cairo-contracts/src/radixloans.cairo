#![allow(unused)]
fn main() {
use starknet::ContractAddress;

#[derive(Drop, Serde, starknet::Store)]
enum LoanStatus {
    Active,
    Liquidated,
    Repaid,
    Defaulted,
}

#[derive(Drop, Serde, starknet::Store)]
struct Collateral {
    token: felt252,
    amount: u128,
    valuation: u128,
    owner: ContractAddress,
    last_tax_payment: u128,
}

#[starknet::interface]
trait ILoans<TContractState> {
    fn deposit_collateral(ref self: TContractState, token: felt252, amount: u128, valuation: u128);
    fn request_loan(ref self: TContractState, collateral_id: u128, loan_amount: u128);
    fn pay_harberger_tax(ref self: TContractState, collateral_id: u128);
    fn adjust_valuation(ref self: TContractState, collateral_id: u128, new_valuation: u128);
    fn purchase_collateral(ref self: TContractState, collateral_id: u128);
    fn repay_loan(ref self: TContractState, loan_id: u128);
    fn handle_default(ref self: TContractState, loan_id: u128);
    fn get_collateral(self: @TContractState, collateral_id: u128) -> Collateral;
    fn get_loan_status(self: @TContractState, loan_id: u128) -> LoanStatus;
}

#[starknet::contract]
mod RadixLoans {
    use starknet::{get_caller_address, get_block_timestamp, ContractAddress};
    use super::{ILoansDispatcher, ILoansDispatcherTrait, LoanStatus, Collateral};

    #[storage]
    struct Storage {
        collaterals: Dict<u128, Collateral>,
        loans: Dict<u128, u128>,  // Maps loan_id to collateral_id
        loan_status: Dict<u128, LoanStatus>,
        loan_amounts: Dict<u128, u128>,
        last_collateral_id: u128,
        last_loan_id: u128,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.last_collateral_id.write(0);
        self.last_loan_id.write(0);
    }

    #[external(v0)]
    impl RadixLoansImpl of super::ILoansTrait<ContractState> {
        fn deposit_collateral(ref self: ContractState, token: felt252, amount: u128, valuation: u128) {
            let caller = get_caller_address();
            let collateral_id = self.last_collateral_id.read() + 1;
            self.last_collateral_id.write(collateral_id);

            let collateral = Collateral {
                token,
                amount,
                valuation,
                owner: caller,
                last_tax_payment: get_block_timestamp().into(),
            };
            self.collaterals.write(collateral_id, collateral);
        }

        fn request_loan(ref self: ContractState, collateral_id: u128, loan_amount: u128) {
            let caller = get_caller_address();
            let collateral = self.collaterals.read(collateral_id);
            assert!(collateral.owner == caller, "Caller is not the owner of the collateral");
            assert!(loan_amount <= collateral.valuation * 50 / 100, "Loan amount exceeds 50% of collateral valuation");

            let loan_id = self.last_loan_id.read() + 1;
            self.last_loan_id.write(loan_id);

            self.loans.write(loan_id, collateral_id);
            self.loan_amounts.write(loan_id, loan_amount);
            self.loan_status.write(loan_id, LoanStatus::Active);
        }

        fn pay_harberger_tax(ref self: ContractState, collateral_id: u128) {
            let caller = get_caller_address();
            let mut collateral = self.collaterals.read(collateral_id);
            assert!(collateral.owner == caller, "Caller is not the owner of the collateral");

            let current_timestamp = get_block_timestamp().into();
            let time_elapsed = current_timestamp - collateral.last_tax_payment;
            let tax = collateral.valuation * 1 / 100 * time_elapsed / (30 * 86400);  // Assuming 30 days in a month

            // Deduct tax from borrower's account (pseudo code)
            // self.transfer(caller, platform_address, tax);

            collateral.last_tax_payment = current_timestamp;
            self.collaterals.write(collateral_id, collateral);
        }

        fn adjust_valuation(ref self: ContractState, collateral_id: u128, new_valuation: u128) {
            let caller = get_caller_address();
            let mut collateral = self.collaterals.read(collateral_id);
            assert!(collateral.owner == caller, "Caller is not the owner of the collateral");

            collateral.valuation = new_valuation;
            self.collaterals.write(collateral_id, collateral);
        }

        fn purchase_collateral(ref self: ContractState, collateral_id: u128) {
            let caller = get_caller_address();
            let collateral = self.collaterals.read(collateral_id);
            let premium = collateral.valuation * 10 / 100;
            let purchase_price = collateral.valuation + premium;

            // Transfer purchase price from purchaser to owner and repay the loan (pseudo code)
            // self.transfer(caller, collateral.owner, purchase_price);

            self.loan_status.write(collateral_id, LoanStatus::Repaid);
            self.collaterals.write(collateral_id, Collateral { owner: caller, ..collateral });
        }

        fn repay_loan(ref self: ContractState, loan_id: u128) {
            let caller = get_caller_address();
            let loan_amount = self.loan_amounts.read(loan_id);

            // Transfer loan amount from borrower to lender (pseudo code)
            // self.transfer(caller, lender_address, loan_amount);

            self.loan_status.write(loan_id, LoanStatus::Repaid);
        }

        fn handle_default(ref self: ContractState, loan_id: u128) {
            let collateral_id = self.loans.read(loan_id);
            let collateral = self.collaterals.read(collateral_id);
            let current_timestamp = get_block_timestamp().into();
            let time_elapsed = current_timestamp - collateral.last_tax_payment;
            let tax = collateral.valuation * 1 / 100 * time_elapsed / (30 * 86400);

            assert!(self.loan_amounts.read(loan_id) <= tax, "Loan is not in default");

            self.loan_status.write(loan_id, LoanStatus::Defaulted);
            // Liquidate collateral (pseudo code)
            // self.transfer(collateral.owner, platform_address, collateral.amount);
        }

        fn get_collateral(self: @ContractState, collateral_id: u128) -> Collateral {
            self.collaterals.read(collateral_id)
        }

        fn get_loan_status(self: @ContractState, loan_id: u128) -> LoanStatus {
            self.loan_status.read(loan_id)
        }
    }
}
}
