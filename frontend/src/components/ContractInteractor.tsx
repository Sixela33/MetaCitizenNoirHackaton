import identityRegistryAbi from '../abis/IdentityRegistry.json';
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from 'viem/actions';
import { toHex } from 'viem';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function ContractInteractor({proof}: {proof: any}) {
    const identityRegistryAddress = import.meta.env.VITE_IDENTITY_REGISTRY_CONTRACT_ADDRESS;
    const { address } = useAccount();
    const { data: walletClient } = useWalletClient();

    const validateIdentity = async () => {
      if (!address) {
        toast.error("Please connect your wallet first");
        return;
      }

      if (!walletClient) {
        toast.error("Wallet client not available");
        return;
      }

      if (!proof || !proof.proof) {
        toast.error("No proof available to submit");
        return;
      }

      console.log('proof', proof.proof);

      const proofHex = toHex(Uint8Array.from(Object.values(proof.proof)));

      try {
        const transaction_hash = await writeContract(walletClient, {
          address: identityRegistryAddress,
          abi: identityRegistryAbi.abi,
          functionName: "registerIdentity",
          args: [proofHex],
        });

        toast.loading(`Transaction submitted: ${transaction_hash.slice(0, 10)}...`);

        const receipt = await waitForTransactionReceipt(walletClient, {
          hash: transaction_hash
        });
        
        if (receipt.status === 'success') {
          toast.success("Identity successfully validated!");
        } else {
          toast.error("Transaction failed");
        }
      } catch (error: any) {
        console.error("Error validating identity:", error);
        toast.error(error.message || "Failed to validate identity");
      }
    };

  return (
    <div>
      <ConnectButton/>
      <Button 
        onClick={validateIdentity} 
        className="w-full md:w-auto"
        size="lg"
        >
        Validate Identity
      </Button>
      </div>
  );
}
