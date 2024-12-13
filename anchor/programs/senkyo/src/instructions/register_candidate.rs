use crate::constants::ANCHOR_DISCRIMINATOR_SIZE;
use crate::errors::ErrorCode::*;
use crate::states::*;
use anchor_lang::prelude::*;

pub fn register_candidate(
    ctx: Context<RegisterCandidate>,
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

    poll.candidates += 1;

    Ok(())
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct RegisterCandidate<'info> {
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

    #[account(mut, seeds = [b"registrations"], bump)]
    pub registrations: Account<'info, Registration>,

    pub system_program: Program<'info, System>,
}
