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
    user_country: number;
    restricted_countries: number[];
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
        
        // Get AML security score (this is an example, adjust based on your actual data)
        const amlSecurity = reviewData.reviewResult.reviewAnswer == 'GREEN' ? 2 : reviewData.reviewResult.reviewAnswer == 'YELLOW' ? 1 : 0;
        
        // Get user country
        const userCountry = 5 // applicantInfo.nationality || '';
        
        const formattedData = {
            age: age,
            min_age: 18,
            passport_is_valid: passportIsValid,
            passport_should_be_valid: true,
            aml_security: amlSecurity,
            min_aml_security: 1,
            user_country: userCountry,
            restricted_countries: [0,1,2,3,4,3,6,7,8,9,10,11,12,13,14],
        };

        //console.log(formattedData);
        
        return formattedData;

    }
}

