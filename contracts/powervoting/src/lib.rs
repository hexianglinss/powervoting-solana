use borsh::{BorshDeserialize, BorshSchema, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    clock::Clock,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::Sysvar,
};

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq, BorshSchema)]
pub struct VoteResult {
    pub option_id: u128,
    pub votes: u128,
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq, BorshSchema)]
pub struct Proposal {
    pub cid: String,
    pub proposal_type: u8,
    pub creator: String,
    pub exp_time: i64,
    pub chain_id: u128,
    pub vote_list_cid: String,
    pub status: u8,
    pub vote_results: Vec<VoteResult>,
}
#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq, BorshSchema)]
pub struct Vote {
    pub voter: String,
    pub vote_info: String,
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq, BorshSchema)]
pub struct Pv {
    pub proposal: Proposal,
    pub votes: Vec<Vote>,
}

#[derive(Clone, Debug, BorshSerialize, BorshDeserialize, PartialEq, BorshSchema)]
pub enum PowerVotingInstruction {
    CreateProposal(String, i64, u128, u8),
    CancelProposal(),
    Vote(String),
    Count(Vec<VoteResult>, String),
}

// Declare and export the program's entrypoint
entrypoint!(process_instruction);

// Program entrypoint's implementation
pub fn process_instruction(
    program_id: &Pubkey, // Public key of the account the hello world program was loaded into
    accounts: &[AccountInfo], // The account to say hello to
    _instruction_data: &[u8], // Ignored, all helloworld instructions are hellos
) -> ProgramResult {
    msg!("program id: {}", program_id);
    msg!("accounts: {:?}", accounts);
    msg!("_instruction_data: {:?}", _instruction_data);

    let instruction = PowerVotingInstruction::try_from_slice(_instruction_data)
        .map_err(|_| ProgramError::InvalidInstructionData)?;

    msg!("instruction: {:?}", instruction);

    match instruction {
        PowerVotingInstruction::CreateProposal(cid, exp_time, chain_id, proposal_type) => {
            create_proposal(accounts, cid, exp_time, chain_id, proposal_type)?;
        }
        PowerVotingInstruction::CancelProposal() => {
            cancel_proposal(accounts)?;
        }
        PowerVotingInstruction::Vote(vote_info) => {
            vote(accounts, vote_info)?;
        }
        PowerVotingInstruction::Count(vote_result, vote_history_list) => {
            count(program_id, accounts, vote_result, vote_history_list)?;
        }
    }
    msg!("success");
    Ok(())
}

pub fn create_proposal(
    accounts: &[AccountInfo],
    cid: String,
    exp_time: i64,
    chain_id: u128,
    proposal_type: u8,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let data_account = next_account_info(accounts_iter)?;

    let proposal = Proposal {
        cid,
        exp_time,
        chain_id,
        proposal_type,
        creator: creator.key.to_string(),
        status: 1,
        vote_list_cid: "".to_string(),
        vote_results: Vec::new(),
    };

    let pv = Pv {
        proposal,
        votes: Vec::new(),
    };
    pv.serialize(&mut *data_account.data.borrow_mut())?;

    msg!("create proposal success");
    Ok(())
}

pub fn cancel_proposal(accounts: &[AccountInfo]) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let creator = next_account_info(accounts_iter)?;
    let data_account = next_account_info(accounts_iter)?;
    let mut pv = Pv::try_from_slice(&data_account.data.borrow())?;
    if pv.proposal.creator != creator.key.to_string() {
        return Err(ProgramError::UnsupportedSysvar);
    }
    if pv.proposal.status != 1 {
        msg!("proposal status error");
        return Err(ProgramError::Custom(1));
    }
    pv.proposal.status = 3;
    pv.serialize(&mut *data_account.data.borrow_mut())?;
    msg!("cancel proposal success");
    Ok(())
}

pub fn vote(accounts: &[AccountInfo], vote_info: String) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let voter = next_account_info(accounts_iter)?;
    let data_account = next_account_info(accounts_iter)?;
    let mut pv = Pv::try_from_slice(&data_account.data.borrow())?;
    if pv.proposal.status != 1 {
        msg!("proposal status error");
        return Err(ProgramError::Custom(1));
    }
    let clock = Clock::from_account_info(&voter)?;
    let current_timestamp = clock.unix_timestamp;
    if current_timestamp < pv.proposal.exp_time {
        msg!("proposal expired");
        return Err(ProgramError::Custom(2));
    }

    let mut flag = true;
    for i in 0..pv.votes.len() {
        if pv.votes[i].voter == voter.key.to_string() {
            pv.votes[i].vote_info = String::from(&vote_info);
            flag = false;
        }
    }

    if flag {
        let vote = Vote {
            voter: voter.key.to_string(),
            vote_info,
        };
        pv.votes.push(vote);
    }

    pv.serialize(&mut *data_account.data.borrow_mut())?;
    msg!("vote success");
    Ok(())
}

pub fn count(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    vote_result: Vec<VoteResult>,
    vote_history_list: String,
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;
    let data_account = next_account_info(accounts_iter)?;
    if account.owner != program_id {
        return Err(ProgramError::Custom(3));
    }
    let mut pv = Pv::try_from_slice(&data_account.data.borrow())?;
    if pv.proposal.status != 1 {
        msg!("proposal status error");
        return Err(ProgramError::Custom(1));
    }
    pv.proposal.vote_list_cid = vote_history_list;
    pv.proposal.vote_results = vote_result;
    pv.proposal.status = 2;
    pv.proposal
        .serialize(&mut *data_account.data.borrow_mut())?;
    msg!("vount success");
    Ok(())
}
