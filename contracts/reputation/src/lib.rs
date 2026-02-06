#![no_std]
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct ReputationContract;

#[contractimpl]
impl ReputationContract {
    //Increases the reputation score of the given address.
    //Requires authorization from the user (for Phase 3 demo purposes).
    pub fn add_points(env: Env, user: Address, amount: u32) {
        user.require_auth();

        if amount == 0 {
            panic!("Amount must be positive");
        }

        let current_score: u32 = env.storage().persistent().get(&user).unwrap_or(0);
        let new_score = current_score + amount;

        env.storage().persistent().set(&user, &new_score);
    }

    //Returns the current reputation score of the user.
    pub fn get_score(env: Env, user: Address) -> u32 {
        env.storage().persistent().get(&user).unwrap_or(0)
    }
}
