import identityRegistryAbi from '../abis/IdentityRegistry.json';
import { useAccount } from 'wagmi';
import { useWalletClient } from 'wagmi';
import { waitForTransactionReceipt, writeContract } from 'viem/actions';

export default function ContractInteractor({proof}: any) {
    const identityRegistryAddress = import.meta.env.PUBLIC_VITE_IDENTITY_REGISTRY_CONTRACT_ADDRESS;
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

      try {
        const transaction_hash = await writeContract(walletClient, {
          address: identityRegistryAddress,
          abi: identityRegistryAbi.abi,
          functionName: "registerIdentity",
          args: [proof],
        });

        console.log(transaction_hash);

        const response = await waitForTransactionReceipt(walletClient, {hash: transaction_hash});
        console.log(response);
      } catch (error) {
        console.error("Error validating identity:", error);
      }
    };

  return (
    <button onClick={validateIdentity}>Validate Identity</button>
  );
}
