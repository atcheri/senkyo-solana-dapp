use anchor_lang::prelude::*;

declare_id!("CLDgc2Q7uUP7hqhvxkbCAWrFK88qNNmcXqusQUR3dhVp");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod senkyo {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;

        let registrations = &mut ctx.accounts.registrations;
        registrations.count = 0;

        Ok(())
    }

    pub fn creat_poll(ctx: Context<CreatePoll>, description: String, start: u64, end: u64) -> Result<()> {
        if start > end {
            return Err(ErrorCode::InvalidDate.into())
        }

        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        let poll = &mut ctx.accounts.poll;
        poll.id =  counter.count;
        poll.description = description;
        poll.start = start;
        poll.end = end;
        poll.candidates = 0;        

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
        seeds = [b"counter"],
        bump
    )]
    pub counter: Account<'info, Counter>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + 8,
        seeds = [b"registrations"],
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

#[derive(Accounts)]
pub struct CreatePoll<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Poll::INIT_SPACE,
        seeds = [(counter.count + 1).to_le_bytes().as_ref()],       
         bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        mut,
        seeds = [b"counter"],
        bump
    )]
    pub counter: Account<'info, Counter>,

    pub system_program: Program<'info, System>,
}
#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub id: u64,
    #[max_len(280)]
    pub description: String,
    pub start: u64,
    pub end: u64,
    pub candidates: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Start date cannot be greater than End date")]
    InvalidDate
}