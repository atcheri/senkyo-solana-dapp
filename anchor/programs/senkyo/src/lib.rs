use anchor_lang::prelude::*;

declare_id!("CLDgc2Q7uUP7hqhvxkbCAWrFK88qNNmcXqusQUR3dhVp");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod senkyo {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;

        let registration = &mut ctx.accounts.registrations;
        counter.count = 0;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + 8,
        seed = [b"counter"],
        bump
    )]
    pub counter: Account<'info, Counter>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + 8,
        seed = [b"registrations"],
        bump
    )]
    pub registrations: Account<'info, Registration>,

    pub system_program: Program<'info, System>,
}

#[account]
pub struct Counter {
    pub count: u64,
}

#[account]
pub struct Registration {
    pub count: u64,
}

