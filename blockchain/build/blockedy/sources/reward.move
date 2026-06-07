#[allow(lint(public_entry))]
module blockedy::reward {
    use sui::coin::{Self, TreasuryCap};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::object::{Self, UID};

    public struct REWARD has drop {}

    /// Shared registry holding the TreasuryCap for testing/hackathon purposes
    public struct RewardRegistry has key {
        id: UID,
        treasury_cap: TreasuryCap<REWARD>
    }

    fun init(witness: REWARD, ctx: &mut TxContext) {
        let (treasury_cap, metadata) = coin::create_currency<REWARD>(
            witness, 
            9, 
            b"RWD", 
            b"Reward Coin", 
            b"Custom coin for hackathon reward distribution", 
            option::none(), 
            ctx
        );
        
        transfer::public_freeze_object(metadata);
        
        // Share the TreasuryCap in a registry so sponsors can mint prizes
        let registry = RewardRegistry {
            id: object::new(ctx),
            treasury_cap
        };
        transfer::share_object(registry);
    }

    /// Mint new REWARD coins using the shared registry
    public fun mint_prize(
        registry: &mut RewardRegistry, 
        amount: u64, 
        ctx: &mut TxContext
    ): coin::Coin<REWARD> {
        coin::mint(&mut registry.treasury_cap, amount, ctx)
    }
}
