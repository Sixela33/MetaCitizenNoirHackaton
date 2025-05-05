import { Injectable, Logger } from '@nestjs/common';
import { ProofData, UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from './circuits.json';

@Injectable()
export class NoirService {
    private noir: Noir;
    private backend: UltraHonkBackend;

    constructor() {}

    async onModuleInit() {
        try {
            if (!circuit) {
                throw new Error('Circuit not found');
            }

            this.noir = new Noir(circuit as any);
            this.backend = new UltraHonkBackend(circuit.bytecode);
            
            /**
                const witness = await this.generateWitness(20);
                console.log('Witness', witness);
                const proof = await this.generateProof(witness.witness);
                
                console.log('Proof', proof);
                
                const verified = await this.verifyProof(proof);
                console.log('Verified', verified);
            */
        } catch (error) {
            Logger.error( error.message, 'Error initializing Noir');
        }
    }

    async generateWitness(age: number): Promise<{ witness: Uint8Array; returnValue: any }> {
        const witness = await this.noir.execute({ age });
        return witness;
    }

    async generateProof(witness: Uint8Array): Promise<ProofData> {
        const proof = await this.backend.generateProof(witness);
        return proof;
    }

    async verifyProof(proof: ProofData): Promise<boolean> {
        const verified = await this.backend.verifyProof(proof);
        return verified;
    }
}

