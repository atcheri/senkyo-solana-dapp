use anchor_lang::prelude::*;

#[account]
pub struct Registration {
    pub count: u64,
}
