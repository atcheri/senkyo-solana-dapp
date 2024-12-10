use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod states;

pub use constants::ANCHOR_DISCRIMINATOR_SIZE;
pub use errors::ErrorCode::*;
pub use states::*;

declare_id!("CLDgc2Q7uUP7hqhvxkbCAWrFK88qNNmcXqusQUR3dhVp");

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

    pub fn create_poll(
        ctx: Context<CreatePoll>,
        description: String,
        start: u64,
        end: u64
    ) -> Result<()> {
        if start > end {
            return Err(InvalidDate.into());
        }

        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        let poll = &mut ctx.accounts.poll;
        poll.id = counter.count;
        poll.description = description;
        poll.start = start;
        poll.end = end;
        poll.candidates = 0;

        Ok(())
    }

    pub fn register_candidate(
        ctx: Context<RegistreCandidate>,
        poll_id: u64,
        name: String
    ) -> Result<()> {
        let poll = &mut ctx.accounts.poll;

        if poll.id != poll_id {
            return Err(PollDoesNotExist.into());
        }

        let candidate = &mut ctx.accounts.candidate;
        if candidate.has_registered {
            return Err(CandidateAlreadyRegistered.into());
        }

        let registrations = &mut ctx.accounts.registrations;
        registrations.count += 1;

        candidate.cid = registrations.count;
        candidate.poll_id = poll_id;
        candidate.name = name;
        candidate.has_registered = true;

        Ok(())
    }

    pub fn vote(ctx: Context<VoteCandidate>, poll_id: u64, cid: u64) -> Result<()> {
        let voter = &mut ctx.accounts.voter;
        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;

        if !candidate.has_registered || candidate.poll_id != poll_id {
            return Err(CandidateNotRegistered.into());
        }

        if voter.has_voted {
            return Err(VoterAlreadyVoted.into());
        }

        let current_timestamp = Clock::get()?.unix_timestamp as u64;
        if current_timestamp < poll.start || current_timestamp > poll.end {
            return Err(PollNotActive.into());
        }

        voter.poll_id = poll_id;
        voter.cid = cid;
        voter.has_voted = true;

        candidate.votes += 1;

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

#[derive(Accounts)]
pub struct CreatePoll<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + Poll::INIT_SPACE,
        seeds = [(counter.count + 1).to_le_bytes().as_ref()],
        bump
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
        seeds = [poll_id.to_le_bytes().as_ref(), (registrations.count + 1).to_le_bytes().as_ref()],
        bump
    )]
    pub candidate: Account<'info, Candidate>,

    #[account(mut)]
    pub counter: Account<'info, Counter>,

    #[account(seeds = [b"registrations"], bump)]
    pub registrations: Account<'info, Registration>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(poll_id: u64, cid: u64)]
pub struct VoteCandidate<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds= [poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll: Account<'info, Poll>,

    #[account(
        mut,
        seeds = [poll_id.to_le_bytes().as_ref(), cid.to_le_bytes().as_ref()],
        bump
    )]
    pub candidate: Account<'info, Candidate>,

    #[account(
        init,
        payer = user,
        space = ANCHOR_DISCRIMINATOR_SIZE + 25,
        seeds = [b"voter", poll_id.to_le_bytes().as_ref(), user.key().as_ref()],
        bump
    )]
    pub voter: Account<'info, Voter>,

    pub system_program: Program<'info, System>,
}
