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

    pub fn register_candidate(ctx: Context<RegistreCandidate>, poll_id: u64, name: String) -> Result<()> {
        let poll = &mut ctx.accounts.poll;

        if poll.id != poll_id {
            return Err(ErrorCode::PollDoesNotExist.into());
        }

        let candidate = &mut ctx.accounts.candidate;
        if candidate.has_registered {
            return Err(ErrorCode::CandidateAlreadyRegistered.into());
        }

        let registrations = &mut ctx.accounts.registrations;
        registrations.count += 1;

        candidate.id = registrations.count;
        candidate.poll_id = poll_id;
        candidate.name = name;
        candidate.has_registered = true;

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

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    pub id: u64,
    pub poll_id: u64,
    #[max_len(32)]
    pub name: String,
    pub votes: u64,
    pub has_registered: bool,
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

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct RegistreCandidate<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref()],       
         bump,
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Candidate::INIT_SPACE,
        seeds = [(counter.count + 1).to_le_bytes().as_ref()],       
         bump,
    )]
    pub candidate: Account<'info, Candidate>,

    #[account(mut)]
    pub counter: Account<'info, Counter>,

    #[account(
        seeds = [b"registrations"],
        bump
    )]
    pub registrations: Account<'info, Registration>,

    pub system_program: Program<'info, System>,
}



#[error_code]
pub enum ErrorCode {
    #[msg("Start date cannot be greater than End date")]
    InvalidDate,
    #[msg("Poll not found")]
    PollDoesNotExist,
    #[msg("Candidate is already registered")]
    CandidateAlreadyRegistered,
}