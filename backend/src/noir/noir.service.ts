import { Injectable, Logger } from '@nestjs/common';
import { ProofData, UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from './circuits.json';

type witnessGenerationParams = {
    age: number;
    min_age: number;
    passport_is_valid: boolean;
    passport_should_be_valid: boolean;
    aml_security: number;
    min_aml_security: number;
    user_country_hash: string;
    restricted_country_hashes: string[];
}

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
            
        } catch (error) {
            Logger.error( error.message, 'Error initializing Noir');
        }
    }

  

    async generateWitness(userData: witnessGenerationParams): Promise<{ witness: Uint8Array; returnValue: any }> {
        const witness = await this.noir.execute(userData);
        return witness;
    }

    async generateProof(witness: Uint8Array): Promise<ProofData> {
        const proof = await this.backend.generateProof(witness, {keccak: true});
        return proof;
    }

    async verifyProof(proof: ProofData): Promise<boolean> {
        const verified = await this.backend.verifyProof(proof);
        return verified;
    }

    async formatUserDataForWitnessGeneration(userData: any): Promise<witnessGenerationParams> {
        // Extract the main applicant info
        const applicantInfo = userData.list?.items?.[0]?.info;
        const reviewData = userData.list?.items?.[0]?.review;
        
        if (!applicantInfo) {
            throw new Error('No KYC data found for this user');
        }
      
        // Calculate age from dateOfBirth
        const dateOfBirth = new Date(applicantInfo.dob);
        const today = new Date();

        let age = today.getFullYear() - dateOfBirth.getFullYear();
        
        const monthDiff = today.getMonth() - dateOfBirth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
            age--;
        }
        
        // Check passport validity
        const idDoc = applicantInfo.idDocs?.[0];
        const passportIsValid = idDoc ? new Date(idDoc.validUntil) > new Date() : false;
        
        // Get AML security score
        const amlSecurity = reviewData.reviewResult.reviewAnswer == 'GREEN' ? 2 : reviewData.reviewResult.reviewAnswer == 'YELLOW' ? 1 : 0;
        
        // TODO: get the actual country hash
        const userCountryHash = "0x222222222122222"  //     applicantInfo.nationality || '';
        
        // TODO: get the actual restricted country hashes
        const restrictedCountryHashes = [
            "0x111111111111111", "0x222222222222222", "0x333333333333333",
            "0x444444444444444", "0x555555555555555", "0x666666666666666",
            "0x777777777777777", "0x888888888888888", "0x999999999999999",
            "0xaaaaaaaaaaaaaaa", "0xbbbbbbbbbbbbbbb", "0xccccccccccccccc",
            "0xddddddddddddddd", "0xeeeeeeeeeeeeeee", "0xfffffffffffffff"
        ];
        
        const formattedData = {
            age: age,
            min_age: 18,
            passport_is_valid: passportIsValid,
            passport_should_be_valid: true,
            aml_security: amlSecurity,
            min_aml_security: 1,
            user_country_hash: userCountryHash,
            restricted_country_hashes: restrictedCountryHashes,
        };

        //console.log(formattedData);
        
        return formattedData;
    }
}

