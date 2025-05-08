import identityRegistryAbi from '../abis/IdentityRegistry.json';
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from 'viem/actions';
import { toHex } from 'viem';
import { Button } from './ui/button';
export default function ContractInteractor({proof}: any) {
    const identityRegistryAddress = import.meta.env.VITE_IDENTITY_REGISTRY_CONTRACT_ADDRESS;
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();

    const validateIdentity = async () => {
      if (!address) {
        console.log("No address found")
        return
      }

      if (!walletClient) {
        console.log("No wallet client found");
        return;
      }

      // Convert the proof to a proper bytes format
      // First ensure we have a Uint8Array
      const proofBytes = new Uint8Array(Object.values(proof.proof));
      
      // Convert to hex string with 0x prefix
      const proofHex = toHex(proofBytes);

      console.log(proofHex.length)
      try {
        const transaction_hash = await writeContract(walletClient, {
          address: identityRegistryAddress,
          abi: identityRegistryAbi.abi,
          functionName: "registerIdentity",
          args: [proofHex],
        });

        console.log(transaction_hash);

        const response = await waitForTransactionReceipt(walletClient, {hash: transaction_hash});
        console.log(response);
      } catch (error) {
        console.error("Error validating identity:", error);
      }
    };

  return (
    <Button onClick={validateIdentity}>Validate Identity</Button>
  );
}
