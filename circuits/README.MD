# MetaCitizen Circuits

This folder contains the zero-knowledge circuits used by MetaCitizen.


## How to Run

Follow these steps to compile, test, and generate proofs for your circuits.

### Automated Build Process

For convenience, a script is provided that builds the circuit and copies the necessary files to the backend and frontend:

```bash
    ./move_circuit.sh
```

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

