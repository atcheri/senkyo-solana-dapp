use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Voter {
    pub cid: u64, // reference to the candidate the voter voted for
    pub poll_id: u64, // reference to the poll
    pub has_voted: bool,
}
