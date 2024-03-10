#![cfg_attr(not(feature = "std"), no_std, no_main)]


#[ink::contract]
mod mytoken {
    use ink::storage::Mapping;
    use ink::prelude::string::String;
    use ink::prelude::vec::Vec;

    /// Defines the storage of your contract.
    /// Add new fields to the below struct in order
    /// to add new static storage fields to your contract.
    #[ink(storage)]
    pub struct ZeroRep {
        /// Global state.
        
        // Global permissioned moderator address

        // TODO: mapping of all moderation actions
        moderation_action: Mapping<u32, (u32, u32)>,

        // TODO: Merkle tree

        // A mapping from files to nullifiers of labels of that data
        datatolabels: Mapping<Hash, Vec<(Hash, String)>>
    }

    impl ZeroRep {
        //// TODO: build constructor. 
        /// Initialize merkle tree null values
        #[ink(constructor)]
        pub fn new() -> Self {

            Self {
                moderation_action: Mapping::new(),
                datatolabels: Mapping::new()
            }
        }

        #[ink(message)]
        pub fn add_user(&mut self) {

        }

        /*
        
        Proof inputs posted on chain:
         - Identifier A = Address of user who is being submitting a post and getting reputation
         - Nullifier (N) = enc(k, i) where k = private key and i = nonce
         - Merkle Root (R) = root of merkle tree containing participating addresses
         - Data = Post contents (filecoin link)
         - label_val = Label contents (string)
         - h_bar = hash(h, r) where h = Block height since last post attestation
         - u_bar = hash(u, r) where u = Account’s reputation score
         - moderation_actions = hashmap mapping nullifiers to reputation scores and block heights. Proof generation tallies user's reputation score based on valid nonces
        
         */
        #[ink(message)]
        pub fn add_post(&mut self, data: Hash, nullifier: Hash, label_val: String) {
            let mut list = self.datatolabels.get(data).unwrap_or(Vec::new());
            let val = (nullifier, label_val);
            // Update your mapping here
            list.push(val);

            self.datatolabels.insert(data, &list);
        }

        #[ink(message)]
        pub fn get_nullifiers(&self, data: Hash) -> Vec<(Hash, String)> {            
            // Return the nullifier and label hashes from here
            self.datatolabels.get(data).unwrap_or(Vec::new())
        }

        /* 
        
        Function for a moderator oracle to assign a reputation score to a particular post (represented by the nullifier)
        Updates a hashmap mapping nullifiers to reputation scores. 
        This hashmap is submitted as an input by the reputation
        */
        #[ink(message)]
        pub fn add_reputation(&mut self) {
            //
        }

        // Verify proof that rep associated with nullifier is greater than threshold.
        #[ink(message)]
        pub fn verify_reputation(&self, _nullifier: Hash) -> bool {
            true
        }
    }
}
