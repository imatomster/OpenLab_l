# OpenLab_L

A decentralized data labeling platform utilizing a zero-knowledge reputation system to enable an anonymous yet reputable marketplace for requesting and fulfilling data labeling.

## Problem 
Traditional data labeling processes often struggle with lack of participation, transparency, community engagement, and accuracy, which can impede the development of robust and inclusive machine learning models.

As AI models become a core aspect of our day to day systems, we must ensure that influence over these critical systems is not centralized in the hands of a few key players. Rather, we must build tooling and systems for ensuring that AI development can be approached from the *community level*, in a democratic fashion which lends power away from closed-source technical design and misaligned business strategy.


## Our Solution
Blockchain is at its core a technology for building coordination systems. It's primarily effective at enabling markets for digital goods. This is OpenLab_L - bringing the digital good of quality, labeled training data to a robust free market system.


OpenLab_L can be summarized in a few key points, which we'll delve into further. 

Tools for open source
* The goal of the system is to allow for an open, permissionless, and  community of data providers and labelers. This improves on existing popular services such as HuggingFace, which can *host* training data but lack the tools to *improve* them by coordinating markets around data labeling.

Reputable & Transparent
* We introduce ZK technology to empower a key design element:  anonymous attestations of reputation. This unlocks an ability to ensure the quality of participants' labeling through reputation scores, while not sacrificing on design elements of permissionlessness and transparency.

Incentivized contribution
* With the marketplace, data labelers and providers can contribute to an ecosystem of data not only for open source spirit, but with an additional economic lever which can bridge the gap in unmet needs from either party. 

## Product

OpenLab_L's frontend consists of two main screens: uploading data (jobs), and accepting jobs for labeling. 

On the side of accepting jobs for labeling, the interface is designed as an intuitive A/B test. Users will be provided an image preview of the data stored on Filecoin and asked two choose one of two labels which correctly identifies the image. Upon choice of a label, the user will be asked to sign a message, which will be the *nullifier* representing the user and their label in the ZK circuit. Then, the user will be asked to sign a transaction which enters this nullifier into set of nullifier stored in the smart contract.

After labeling, the user will be shown a list of all labels provided by users for the data. This information is polled from the smart contract, which stores a mapping of hashed Filecoin data links to nullifiers. Each label can be independently verified to have been submitted by a user with a sufficient (n>3) amount of reputation points by validating the ZK proof associated with the given message. Users can generate proofs claiming that their reputation score is above a certain threshold (say, n>3), while not specifying their specific score, and maintaining anonymity. This allows the community to verify the trustworthiness of each label produced, without ever having to keep track of any identities in this global userbase. 


## Technology Stack

OpenLab_L consists of a user-facing dApp frontend and storage layer. The OpenLab_L smart contract runs on Aleph Zero, a blazing fast L1 which provides the application with the speed and responsiveness to ensure a quality product and experience for users, particularly data labelers. 

Data storage is provided by Filecoin, a time-tested decentralized storage solution which helps us ensure the longevity and immutability of the data shared and labeled on OpenLab_L. 

OpenLab_L's smart contract is an implementation of zk for negative reputation. To implement this, we followed the design described in Vitalik's [*Some ways to use ZK-SNARKs for privacy*](https://vitalik.eth.limo/general/2022/06/15/using_snarks.html). 

> Unfortunately, due the technical limitation of RiscZero and SP1's STARK-to-SNARK offerings and the lack of groth16 support on Aleph Zero, we foregoed the implementation of the circuits themselves for this initial version of our product, opting for a always-true verification function for demo purposes. 

In final production (particularly after the availability of the STARK-to-SNARK wrapper from SP1, coming soon), we will build a rust server backend which builds the necessary proofs from our existing smart contract state, and performs verification on-chain. 

Additionally, our system currently abstracts away the implementation of data labeling verification. Data labeling verification refers to the algorithm for determinig reputation scores for users' data label submissions. Currently, the smart contract does not implement any logic for determining reputation scores. However, this could be done in several ways. One is based on majority rule, in which positive nor negative reputation scores are distributed until enough label submissions have been made to determine a supermajority, after which labelers in the minority will be punished due to probable error. Given our current focus on just A/B labeling, this would be straightforward and effective to implement.

## ZK Circuit Explained

We'll delve into the purposed implementation of the zk circuits and their synergy with our smart contracts. 

The high level goal of the circuit is for a user to be able to add "tickets" to a set of tickets, and be able to attest to the ownership of some of these tickets without revealing ownership of any specific ones.

In this case, each ticket represents a label that a user has submitted. We call the ticket the *nullifier*, which is simply generated by encrypting a nonce (incrementing counter) with the user's private key. A proof is generated in which the public inputs are this nullifier, the state root of the merkle tree containing all participating users, the identifier of the user submitting the label, the contents of the label, and a hash of the Filecoin link. Additionally, public inputs include a hiding commitment of the user's sum reputation score, and a reference to the block height at the time of the previous nullifier. These last two elements allow our proof to aggregate the results of the previous proofs to determine the current reputation score. By publicly inputting the smart contract's list of moderation actions, the proof can privately compute the sum of the user's reputation score and the sum of negative points accrued from moderation actions. 

Lastly, the output of this proof is simply the statement that "the user's negative reputation score is greater than 3". This represents a 3-strike system, where 3 faulty labels identified by the moderator will disable the user from being able to submit more labels. Alternatively, their positive reputation score can used to highlight their labels as particularly trustworthy (proving that n > 50 for example).


### Team

Tommy Hang, Daniel Gushchyan