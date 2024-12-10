use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("Start date cannot be greater than End date")]
    InvalidDate,
    #[msg("Candidate is already registered")]
    CandidateAlreadyRegistered,
    #[msg("Voter cannot vote twice")]
    VoterAlreadyVoted,
    #[msg("Candidate is not in the poll")]
    CandidateNotRegistered,
    #[msg("Poll not found")]
    PollDoesNotExist,
    #[msg("Poll not currently active")]
    PollNotActive,
    #[msg("Poll counter cannot be less than zero")]
    PollCounterUnderflow,
}
