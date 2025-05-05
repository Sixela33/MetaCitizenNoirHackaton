import axios from 'axios';
import * as crypto from 'crypto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SumsubService {
    sumsubClient: any
    private sumsubSecretKey: string;
    private sumsubPublicKey: string;

    constructor() {}

    async onModuleInit() {
        this.sumsubSecretKey = process.env.SUMSUB_SECRET_KEY;
        this.sumsubPublicKey = process.env.SUMSUB_PUBLIC_KEY;

        if (!this.sumsubSecretKey || !this.sumsubPublicKey) {
            throw new Error('SUMSUB_SECRET_KEY and SUMSUB_PUBLIC_KEY must be set');
        }

        this.sumsubClient = axios.create({
            baseURL: 'https://api.sumsub.com',
            headers: {
                'Content-Type': 'application/json',
                'X-App-Token': this.sumsubPublicKey
            }
        });

        // Add request interceptor to sign all requests
        this.sumsubClient.interceptors.request.use(this.createSignature.bind(this));
    }

    /**
     * Creates a signature for the request and adds hashed timestamp and signature to the request headers
     * following the SumSub API documentation
     * @param config 
     * @returns 
     */
    private createSignature(config) {
        try {
            const ts = Math.floor(Date.now() / 1000);
            const signature = crypto.createHmac('sha256', this.sumsubSecretKey);
            
            signature.update(ts + config.method.toUpperCase() + config.url);
            
            if (config.data) {
                signature.update(JSON.stringify(config.data));
            }
            
            config.headers['X-App-Access-Ts'] = ts;
            config.headers['X-App-Access-Sig'] = signature.digest('hex');
            
            return config;
        } catch (error) {
            throw new Error('Failed to create signature');
        }
    }

    /**
     * Generates an access token for the user
     * @param userId 
     * @param levelName 
     * @param ttlInSecs 
     * @returns 
     */
    async generateAccessToken(userId: string, levelName: string, ttlInSecs: number = 600) {
        try {
            const response = await this.sumsubClient.post('/resources/accessTokens/sdk', {
                userId,
                levelName,
                ttlInSecs
            });
            return response.data;
            
        } catch (error) {
            console.log(error)
            throw new Error('error generatin access token' + error.data)
        }
      
    }

    async getApplicantData(applicantId: string) {
        try {
            const response = await this.sumsubClient.get(`/resources/applicants/-;externalUserId=${applicantId}`);
            return response.data;
        } catch (error) {
            console.log("error getting applicant data \n", error);
            throw new Error('error getting applicant data ' + error.data)
        }
    }
    
}

