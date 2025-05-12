import { useState } from 'react'
import axiosInstance from '../utils/axios';
import { Button } from './ui/button';
import { toHex } from 'viem';

type props = {
    proof: any,
    setProof: (proof: any) => void
}   

export default function ProofGeneratorInator({proof, setProof}: props) {


    const generateProof = async () => {
        try {
            const response = await axiosInstance.get('/noir/generate-proof');
            setProof(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    function copyProof() {
        // Convert the proof to a proper bytes format
        // First ensure we have a Uint8Array

        const proofBytes = new Uint8Array(Object.values(proof.proof));
      


        // Convert to hex string with 0x prefix
        const proofHex = toHex(proofBytes);
        
        navigator.clipboard.writeText(proofBytes.toString());
    }

    function copyPublicInputs() {
        navigator.clipboard.writeText(JSON.stringify(proof.publicInputs));
    }

    return (
        <div>
            <Button onClick={generateProof}>Generate Proof!</Button>
            
            {proof && <div>
                <p className='text-green-500 mx-auto'>Proof Generated Successfully!</p>
                <div className='flex space-x-2'>
                    <Button onClick={copyProof}>Copy proof</Button>
                    <Button onClick={copyPublicInputs}>Copy public inputs</Button>  
                </div>
            </div>}
        </div>
    )
}
