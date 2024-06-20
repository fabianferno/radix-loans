import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { coins } from "@cosmjs/stargate";
import { Textarea } from "./ui/textarea";
import WalletLoader from "../components/WalletLoader";
import { calculateFee } from "@cosmjs/stargate";
import { useSigningClient } from "../contexts/cosmwasm";
import { contract } from "../lib/consts";

const Borrow = () => {
  const { walletAddress, signingClient, connectWallet } = useSigningClient();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!signingClient) return;

    signingClient
      .queryContractSmart(contract.address, { collateral: {} })
      .then((response: any) => {
        console.log(`collateral: ${response}`);
      })
      .catch((error: any) => {
        alert(`Error! ${error.message}`);
        console.log(
          "Error signingClient.queryContractSmart() deposit_collateral: ",
          error
        );
      });
  }, [signingClient]);

  const handleDepositCollateral = async (): Promise<void> => {
    if (!signingClient) return;

    signingClient
      ?.execute(
        walletAddress, // sender address
        contract.address, // cw721-base contract
        {
          deposit_collateral: {
            token_id: "asdasda",
            owner: `${walletAddress}`,
          },
        }, // msg
        calculateFee(300_000, "20uconst")
      )
      .then((response: any) => {
        console.log(response);
        // Set states here
        setLoading(false);
        alert("Successfully deposited!");
      })
      .catch((error: any) => {
        setLoading(false);
        alert(`Error! ${error.message}`);
        console.log("Error signingClient?.execute(): ", error);
      });
  };

  return (
    <section className="p=4 mt-4 mx-auto max-w-0.5">
      <div className="text-2xl">Borrow</div>
      <WalletLoader loading={loading}>
        <Textarea className="mt-4" placeholder="Enter NFT Token ID" />
        <Button
          className="block btn btn-outline btn-primary w-full max-w-full truncate"
          onClick={handleDepositCollateral}
        >
          Deposit Collateral
        </Button>
      </WalletLoader>
    </section>
  );
};

export default Borrow;
