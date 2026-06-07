#[allow(lint(public_entry))]
module blockedy::competition {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::event;
    use std::string::{Self, String};

    /// Error codes
    const E_NOT_DEVELOPER: u64 = 1;
    const E_NOT_SPONSOR: u64 = 2;
    const E_NOT_CONTESTANT: u64 = 3;
    const E_NOT_TEAM_LEADER: u64 = 4;
    const E_TEAM_NOT_FOUND: u64 = 8;
    const E_COMPETITION_NOT_FOUND: u64 = 9;
    const E_INSUFFICIENT_PRIZE: u64 = 10;
    const E_INVALID_TEAM_CONFIG: u64 = 11;

    // ========== CAPABILITY STRUCTS ==========
    
    /// Developer capability - only given to deployer
    public struct DeveloperCap has key, store {
        id: UID,
    }

    /// Sponsor capability - given to sponsors
    public struct SponsorCap has key, store {
        id: UID,
        sponsor_address: address,
    }

    /// Contestant capability - given to contestants
    public struct ContestantCap has key, store {
        id: UID,
        contestant_address: address,
    }

    /// Emitted when a contestant registers
    public struct ContestantRegistered has copy, drop {
        contestant_address: address,
        cap_id: ID,
    }

    /// Emitted when prizes are distributed to winners
    public struct PrizeDistributed has copy, drop {
        competition_id: ID,
        winning_team_id: ID,
        winner_address: address,
        prize_amount: u64,
    }

    /// Global registry to track all contestants
    public struct ContestantRegistry has key {
        id: UID,
        contestants: vector<address>,
    }

    // ========== MAIN DATA STRUCTURES ==========

    /// Competition structure
    public struct Competition has key, store {
        id: UID,
        sponsor: address,
        rules: String,
        prize_pool: Coin<SUI>,
        teams: vector<ID>,
        is_active: bool,
        winning_team: Option<ID>,
    }

    /// Team structure
    public struct Team has key, store {
        id: UID,
        competition_id: ID,
        members: vector<address>,
        leader: address,
    }

    // ========== INIT FUNCTION ==========

    /// Module initializer - creates DeveloperCap for deployer and ContestantRegistry
    fun init(ctx: &mut TxContext) {
        let developer_cap = DeveloperCap {
            id: object::new(ctx),
        };
        transfer::transfer(developer_cap, tx_context::sender(ctx));
        
        // Create global contestant registry
        let registry = ContestantRegistry {
            id: object::new(ctx),
            contestants: vector::empty(),
        };
        transfer::share_object(registry);
    }

    // ========== DEVELOPER FUNCTIONS ==========

    /// Assign role to a user (Sponsor or Contestant) - DEPRECATED, use self-registration instead
    public entry fun assign_role(
        _admin_cap: &DeveloperCap,
        user: address,
        is_sponsor: bool,
        ctx: &mut TxContext
    ) {
        if (is_sponsor) {
            let sponsor_cap = SponsorCap {
                id: object::new(ctx),
                sponsor_address: user,
            };
            transfer::transfer(sponsor_cap, user);
        } else {
            let contestant_cap = ContestantCap {
                id: object::new(ctx),
                contestant_address: user,
            };
            transfer::transfer(contestant_cap, user);
        };
    }

    // ========== SELF-REGISTRATION FUNCTIONS ==========

    /// User registers as Developer
    public entry fun create_developer(ctx: &mut TxContext) {
        let developer_cap = DeveloperCap {
            id: object::new(ctx),
        };
        transfer::transfer(developer_cap, tx_context::sender(ctx));
    }

    /// User registers as Sponsor
    public entry fun create_sponsor(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let sponsor_cap = SponsorCap {
            id: object::new(ctx),
            sponsor_address: sender,
        };
        transfer::transfer(sponsor_cap, sender);
    }

    /// User registers as Contestant
    public entry fun create_contestant(registry: &mut ContestantRegistry, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        
        // Check if already registered
        let mut i = 0;
        let len = vector::length(&registry.contestants);
        while (i < len) {
            if (*vector::borrow(&registry.contestants, i) == sender) {
                // Already registered, just return
                return
            };
            i = i + 1;
        };
        
        // Add to registry
        vector::push_back(&mut registry.contestants, sender);
        
        let contestant_cap = ContestantCap {
            id: object::new(ctx),
            contestant_address: sender,
        };
        // Emit registration event for off-chain discovery
        let cap_id = object::id(&contestant_cap);
        event::emit(ContestantRegistered { contestant_address: sender, cap_id });
        transfer::transfer(contestant_cap, sender);
    }

    // ========== SPONSOR FUNCTIONS ==========

    /// Create a new competition
    public entry fun create_competition(
        _sponsor_cap: &SponsorCap,
        rules: vector<u8>,
        prize_amount: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let competition = Competition {
            id: object::new(ctx),
            sponsor: tx_context::sender(ctx),
            rules: string::utf8(rules),
            prize_pool: prize_amount,   
            teams: vector::empty(),
            is_active: true,
            winning_team: option::none(),
        };
        
        transfer::share_object(competition);
    }

    /// Create teams from contestants
    public entry fun create_teams(
        _sponsor_cap: &SponsorCap,
        competition: &mut Competition,
        team_configs: vector<vector<address>>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == competition.sponsor, E_NOT_SPONSOR);
        
        let mut i = 0;
        let len = vector::length(&team_configs);
        
        while (i < len) {
            let members = *vector::borrow(&team_configs, i);
            let member_count = vector::length(&members);
            
            assert!(member_count > 0, E_INVALID_TEAM_CONFIG);
            
            let leader = *vector::borrow(&members, 0);
            
            let team = Team {
                id: object::new(ctx),
                competition_id: object::id(competition),
                members,
                leader,
            };
            
            let team_id = object::id(&team);
            vector::push_back(&mut competition.teams, team_id);
            
            transfer::share_object(team);
            
            i = i + 1;
        };
    }

    /// Distribute prizes to winning team
    public entry fun distribute_prizes(
        _sponsor_cap: &SponsorCap,
        competition: &mut Competition,
        winning_team_id: ID,
        winner_addresses: vector<address>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == competition.sponsor, E_NOT_SPONSOR);
        assert!(competition.is_active, E_COMPETITION_NOT_FOUND);
        
        competition.winning_team = option::some(winning_team_id);
        competition.is_active = false;
        
        let total_prize = coin::value(&competition.prize_pool);
        let winner_count = vector::length(&winner_addresses);
        assert!(winner_count > 0, E_INVALID_TEAM_CONFIG);
        
        let prize_per_winner = total_prize / winner_count;
        
        let competition_id = object::id(competition);
        let mut i = 0;
        while (i < winner_count) {
            let winner = *vector::borrow(&winner_addresses, i);
            let prize_coin = coin::split(&mut competition.prize_pool, prize_per_winner, ctx);
            transfer::public_transfer(prize_coin, winner);
            // Emit event for each prize distribution
            event::emit(PrizeDistributed {
                competition_id,
                winning_team_id: winning_team_id,
                winner_address: winner,
                prize_amount: prize_per_winner,
            });
            i = i + 1;
        };
    }

    // ========== VIEW FUNCTIONS ==========

    public fun get_all_contestants(registry: &ContestantRegistry): &vector<address> {
        &registry.contestants
    }

    public fun get_contestant_count(registry: &ContestantRegistry): u64 {
        vector::length(&registry.contestants)
    }

    public fun get_competition_sponsor(competition: &Competition): address {
        competition.sponsor
    }

    public fun get_competition_active(competition: &Competition): bool {
        competition.is_active
    }

    public fun get_team_leader(team: &Team): address {
        team.leader
    }

    public fun get_team_members(team: &Team): &vector<address> {
        &team.members
    }

    public fun is_team_member(team: &Team, addr: address): bool {
        let mut i = 0;
        let len = vector::length(&team.members);
        while (i < len) {
            if (*vector::borrow(&team.members, i) == addr) {
                return true
            };
            i = i + 1;
        };
        false
    }
}