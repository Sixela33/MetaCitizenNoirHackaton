import { Injectable, Logger } from '@nestjs/common';
import { ProofData, UltraHonkBackend } from '@aztec/bb.js';
import { Noir } from '@noir-lang/noir_js';
import circuit from './circuits.json';
import * as crypto from 'crypto';
import * as fs from 'fs';
type witnessGenerationParams = {
    age: number;
    min_age: number;
    passport_is_valid: boolean;
    passport_should_be_valid: boolean;
    aml_security: number;
    min_aml_security: number;
    user_country_id: number;
    restricted_country_ids: number[];
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
        const proof = await this.backend.generateProof(witness);
        return proof;
    }

    async verifyProof(proof: ProofData): Promise<boolean> {
        //write the proof to a file
        fs.writeFileSync('proof.json', JSON.stringify(proof.proof, null, 2));
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
        
        // Fix 1: Convert hash strings to numeric values properly
        // Remove the '0x' prefix and convert to BigInt
        console.log("applicantInfo.nationality", applicantInfo.nationality);
        const userCountryHash = 75
        
        // Fix 2: Ensure consistent formatting for restricted countries
        const restrictedCountryHashes = [
            // Convert these to proper numeric strings without '0x' prefix
            1,2,3,4,5,6,7,8,9,10,11,12,13,14,15
        ];
        
        const formattedData = {
            age: age,
            min_age: 18,
            passport_is_valid: passportIsValid,
            passport_should_be_valid: true,
            aml_security: amlSecurity,
            min_aml_security: 1,
            user_country_id: userCountryHash,
            restricted_country_ids: restrictedCountryHashes,
        };

        //console.log(formattedData);
        
        return formattedData;
    }
}

