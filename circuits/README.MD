# MetaCitizen Circuits

This folder contains the zero-knowledge circuits used by MetaCitizen.

## How to Run

Follow these steps to compile, test, and generate proofs for your circuits.

---

### 1. Check the Circuit

Compile the circuit and check for errors:

```bash
nargo check
```

This will also generate a Prover.toml file, where you can define the input values to test your circuit.

--- 

### 2. Execute the Circuit
Run the circuit with the provided inputs:

```bash
nargo execute
```

This command uses the inputs from Prover.toml and produces a witness and ACIR bytecode (which functions similarly to an ABI in Solidity).

---

### 3. Generate a Proof
Use Barretenberg to generate a proof:

```bash
bb prove -b ./target/circuits.json -w ./target/circuits.wtns -o ./target
```

-b: Path to the compiled circuit bytecode.

-w: Path to the witness file.

-o: Output directory where the proof will be saved.

---

### 4. Generate a Verification Key
   
Create a verification key from the circuit bytecode:

```bash
bb write_vk -b ./target/<circuit_name>.json -o ./target
```

---

### 5. Verify the Proof

Use the verification key to validate the proof:

```bash
bb verify -k ./target/vk -p ./target/proof
```

If successful, this confirms that the proof satisfies the circuit constraints.



# Output chatgpt


Summary
You can achieve reusable proofs by decoupling (a) the private witness (all user data) from (b) the public policy parameters (thresholds, flags, lists). At proof‐generation time, the prover commits to all private fields in a single Merkle/commitment structure, then produces a proof over that commitment. Each verifier circuit is compiled with its own public inputs (e.g. minRisk, allowedCountries, requiredDocs) but uses the same proof verification key. Because only the commitment root and public policy inputs appear on‐chain, no raw user data is revealed—only boolean pass/fail flags. Techniques like nullifiers or external identifiers prevent replay or double‐use across contexts.

1. Parameterizing Verifier Logic via Public Inputs
Single Verification Key

Compile one zkSNARK circuit that always checks “commitment consistency” & “field inclusion” but does not hardcode policy values 
arXiv
.

Public Policy Inputs

At verifier deploy time, supply policy values (e.g. minRiskThreshold, maxCountryRisk, requireDocFlag) as public inputs to the verifyProof(vk, publicInputs, proof) call 
arXiv
.

Verifier Circuits with Identical Structure

Use the same circuit structure for all jurisdictions; only the public inputs differ. Each on‐chain verifier reads its configured parameters from storage or constants.

2. Commitment‐Based Witness Abstraction
Merkle/Poseidon Commitments

Prover places all private fields (riskScore, kycDataHash, geoFlags, etc.) as leaves in a Merkle tree (or Poseidon‐based “forest”) and computes the root 
obj.umiacs.umd.edu
.

Inclusion Proofs in the Circuit

The circuit takes the commitment root as a fixed public input and verifies membership proofs for each required leaf (e.g. that the user’s docScanFlag leaf equals 1) 
obj.umiacs.umd.edu
.

Single Proof, Multiple Shows

Systems like zk‑creds reuse a membership proof across “credential shows” without revealing or linking leaf values—perfect for multi‐verifier contexts 
obj.umiacs.umd.edu
.

3. Preventing Replay & Cross‐Context Linking
Nullifiers / External Nullifiers

Derive a nullifier from the user’s secret witness plus a context‐specific tag (e.g. verifier ID or jurisdiction ID). Including the nullifier as a public input prevents double‐use in the same context while remaining unlinkable across different contexts 
What Is Semaphore? | Semaphore
.

Context Salt

Each verifier’s public inputs include a unique salt so that even the same private witness yields a different nullifier for each jurisdiction.

4. Real‑World Patterns & Examples
Semaphore

Uses an identity commitment + externalNullifier to allow the same group‐membership proof to be verified by many contracts (e.g. voting, access control) without revealing which user nor leaking identity data 
What Is Semaphore? | Semaphore
.

Polygon ID / zkKYC

Polygon ID issues zk‑credentials anchored in a Merkle tree; verifiers request proofs for specific claims (e.g. age ≥ 18, country ∉ sanctions) by supplying different public parameters, all using the same proof format.

5. Ensuring Zero Data Leakage
Only Public Inputs & Flags

On‐chain, verifiers see:

The commitment root (doesn’t reveal leaf contents)

The public policy inputs (thresholds, flags)

The nullifier (unlinkable across contexts)

A final boolean “proofValid” output

No raw fields (riskScore, dob, address) ever appear on‐chain 
circularise.com
.

Simulation Soundness

Standard zkSNARK security (e.g. Groth16) guarantees that the only information exposed is the fact “I know fields satisfying these constraints,” not the fields themselves 
cyfrin.io
.

6. Putting It All Together: Noir‐Style Circuit Sketch
rust
Copiar
Editar
// All private data is committed off‐chain into a Poseidon Merkle tree.
// CommitRoot = PoseidonMerkleRoot([riskScore, kycFlag, docFlag, countryCode, ...])

fn main(
    // Private
    root:  Field,
    leafValues: [Field],         // e.g. [riskScore, kycFlag, docFlag, countryCode]
    merkleProofs: [[Field; N]],  // inclusion proofs
    secretTrapdoor: Field,
    // Public policy
    policyMinRisk:     pub Field,
    policyDocRequired: pub Field,
    policyCountryMask: pub Field,
    contextSalt:       pub Field,
    nullifierHash:     pub Field,
) {
    // 1. Check Merkle inclusion
    assert(verify_merkle(root, leafValues, merkleProofs) == true);
    // 2. Extract and check individual leaves
    let riskScore = leafValues[0];
    let docFlag   = leafValues[2];
    let country   = leafValues[3];
    assert(riskScore as u64 <= policyMinRisk as u64);
    assert(docFlag   == policyDocRequired);
    assert((country & policyCountryMask) == 0);  // e.g. not in disallowed set
    // 3. Prevent replay with nullifier
    assert(nullifierHash == Poseidon([secretTrapdoor, contextSalt]));
}
One proof, one vk, many verifiers (each with its own policy* and contextSalt).

No sensitive data is ever disclosed on‑chain; verifiers only see the commitment root, public parameters, and proof validity.

Key Takeaways
Versatility is achieved by moving all policy logic to public inputs, not the witness.

Privacy is preserved via commitments, Merkle proofs, and nullifiers—only boolean outcomes are revealed.

Real‑world systems (Semaphore, zk‑creds, Polygon ID) already follow these patterns to support multi‐verifier, multi‑use zk‑proofs without data leakage.