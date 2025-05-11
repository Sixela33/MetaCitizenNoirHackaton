import { useState } from 'react'
import axiosInstance from '../utils/axios';
import { Button } from './ui/button';

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
        navigator.clipboard.writeText(JSON.stringify(proof.proof));
    }

    function copyPublicInputs() {
        navigator.clipboard.writeText(JSON.stringify(proof.publicInputs));
    }

    return (
        <div>
            <Button onClick={generateProof}>Generate Proof!</Button>
            
            {proof && <div>
                <p className='text-green-500'>Proof Generated Successfully!</p>
                <div className='flex space-x-2'>
                    <Button onClick={copyProof}>Copy proof</Button>
                    <Button onClick={copyPublicInputs}>Copy public inputs</Button>  
                </div>
            </div>}
        </div>
    )
}
