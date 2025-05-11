# Meta Citizen

MetaCitizen Noir brings on-chain KYC and AML compliance to Web3 using zero-knowledge proofs. Our protocol enables tokenized asset platforms, DAOs, and DeFi applications to verify user identity and risk without compromising privacy. By leveraging zk-SNARKs, we ensure regulatory compliance while preserving anonymity — empowering the next generation of compliant, privacy-preserving digital economies.

## How It Works

MetaCitizen uses zero-knowledge proofs to allow users to verify their identity without revealing sensitive personal information. The protocol creates cryptographic proofs that confirm a user has passed KYC/AML checks without exposing the underlying data.

## User Flow

### Sequence diagram
:::mermaid
sequenceDiagram
    participant User
    participant GoogleAuth
    participant Server
    participant SumSub
    participant Blockchain
    participant ExternalProtocol
    
    User->>GoogleAuth: Log in with Google
    GoogleAuth->>Server: Authentication token
    Server->>User: Authentication successful
    
    User->>Server: Start KYC verification
    Server->>SumSub: Request user data for KYC
    SumSub->>Server: Provide user data for KYC
    
    Server->>Server: Generate Zero-Knowledge Proof (ZKProof)
    Server->>User: Send ZKProof
    
    User->>Blockchain: Register ZKProof to validate identity
    
    ExternalProtocol->>Blockchain: Query identity registry
    Blockchain->>ExternalProtocol: Validate user identity for access control
:::

### Multi Platform use diagram
:::mermaid
flowchart TD
E[Identity Registry]
E <-->|Time-limited validity| F[On-chain Verification]
F -->|Access granted| G[External Protocols]
G1[DeFi Protocol] -->|Query identity| F
G2[DAO Governance] -->|Query identity| F
G3[Tokenized Assets] -->|Query identity| F
:::


### User Story:
1. User logs in to the server with Google authentication
2. User completes KYC verification process
3. the server retrieves the user's data from sumsub
4. The server generates a zero-knowledge proof of the user's verified information
5. the zkproof is sent to the user
6. This ZK proof is used to validate the user's identity on-chain for a specific time period
7. External protocols can query the identity registry to gate access to their services

## Technical Implementation

MetaCitizen leverages several key technologies:

- **Zero-Knowledge Proofs**: Using zk-SNARKs to create verifiable proofs without revealing sensitive data
- **On-chain Identity Registry**: Smart contracts that store and validate identity proofs
- **Time-limited Verification**: Proofs expire after a set period, requiring renewal
- **Privacy-Preserving Verification**: External protocols can verify user compliance without accessing personal data

## Benefits

- **Regulatory Compliance**: Meet KYC/AML requirements for DeFi and tokenized assets
- **User Privacy**: Protect sensitive user information through zero-knowledge technology
- **Seamless Integration**: Simple API for protocols to verify user identity
- **Decentralized Verification**: No central authority controls the verification process
- **Time-bound Validity**: Identity proofs expire, ensuring up-to-date compliance

## Use Cases

- **Compliant DeFi**: Enable protocols to meet regulatory requirements
- **DAO Governance**: Verify member identity for voting rights
- **Tokenized Securities**: Ensure investors meet accreditation requirements
- **Cross-chain Identity**: Portable identity verification across multiple blockchains

## Possible routes to take

1. Google oauth like implementation
2. Site Admin side where he creates a new identity registry with his own permissions (could be used)
3. 