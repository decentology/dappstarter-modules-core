///(program

    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> EXAMPLES: HELLO DEV  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    // Iterating accounts is safer then indexing
    let accounts_iter = &mut accounts.iter();

    // Get the account to say hello to
    let account = next_account_info(accounts_iter)?;

    // The account must be owned by the program in order to modify its data
    if account.owner != program_id {
        info!("Account does not have the correct program id");
        return Err(ProgramError::IncorrectProgramId);
    }

    // The data must be large enough to hold a u64 count
    if account.try_data_len()? < mem::size_of::<u32>() {
        info!("Account data length too small for u32");
        return Err(ProgramError::InvalidAccountData);
    }

    // Increment and store the number of times the account has been greeted
    let mut data = account.try_borrow_mut_data()?;
    let mut sample_counter = LittleEndian::read_u32(&data);
    sample_counter += 1;
    LittleEndian::write_u32(&mut data[0..], sample_counter);

    info!("Sample Program");
    
///)
