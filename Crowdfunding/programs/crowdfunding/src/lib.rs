use anchor_lang::prelude::*;

declare_id!("DesyngxQ6MChgDjU34NegCKdSjVAm56FLKXS299x6gS6"); // Se actualizará al compilar

#[program]
pub mod crowdfunding {
    use super::*;

    // 1. Crear una campaña
    pub fn create_campaign(
        ctx: Context<Create>,
        name: String,
        description: String,
        target: u64,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.admin = *ctx.accounts.user.key;
        campaign.name = name;
        campaign.description = description;
        campaign.target = target;
        campaign.amount_donated = 0;
        Ok(())
    }

    // 2. Donar a una campaña
    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.campaign.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.campaign.to_account_info(),
            ],
        )?;

        (&mut ctx.accounts.campaign).amount_donated += amount;
        Ok(())
    }

    // 3. Retirar fondos (solo el admin)
    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let user = &mut ctx.accounts.user;

        if campaign.admin != *user.key {
            return Err(ProgramError::IncorrectProgramId.into());
        }

        let rent_balance = Rent::get()?.minimum_balance(campaign.to_account_info().data_len());
        if **campaign.to_account_info().lamports.borrow() - amount < rent_balance {
            return Err(ProgramError::InsufficientFunds.into());
        }

        **campaign.to_account_info().try_borrow_mut_lamports()? -= amount;
        **user.to_account_info().try_borrow_mut_lamports()? += amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer = user, space = 9000, seeds = [b"CAMPAIGN_DEMO", user.key().as_ref()], bump)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Campaign {
    pub admin: Pubkey,
    pub name: String,
    pub description: String,
    pub target: u64,
    pub amount_donated: u64,
}
