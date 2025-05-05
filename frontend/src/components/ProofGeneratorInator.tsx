import { useState } from 'react'
import axiosInstance from '../utils/axios';

export default function ProofGeneratorInator() {

    const [proof, setProof] = useState<any>(null);

    const generateProof = async () => {
        try {
            const response = await axiosInstance.get('/noir/generate-proof');
            setProof(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <button onClick={generateProof}>Generate Proof!</button>
            {proof && <div>{JSON.stringify(proof)}</div>}
        </div>
    )
}
