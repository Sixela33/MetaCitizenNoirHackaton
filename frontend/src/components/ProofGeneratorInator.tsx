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

    {proof && console.log(Object.keys(proof.proof))}
    {proof && console.log("proof", JSON.stringify(proof.proof.proof))}
    {proof && console.log("publicInputs", proof.proof.publicInputs)}

    function copyProof() {
        navigator.clipboard.writeText(JSON.stringify(proof.proof.proof));
    }

    return (
        <div>
            <button onClick={generateProof}>Generate Proof!</button>
            
            {proof && <div>
                <button onClick={copyProof}>copy proof</button>
            
                {JSON.stringify(proof)}
            </div>}
        </div>
    )
}
