import React, { useState } from "react";
import { SigningArchwayClient } from "@archwayhq/arch3.js";
import { Button } from "@/components/ui/button";
import { coins } from "@cosmjs/stargate";
import { Textarea } from "./ui/textarea";

interface Props {
  signer: any;
}

const Borrow = ({ signer }: Props) => {
  const [recipients, setRecipients] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [feedback, setFeedback] = useState("");

  const executeBorrow = async () => {
    try {
      const client = await SigningArchwayClient.connectWithSigner(
        "https://rpc.mainnet.archway.io",
        signer
      );

      const accounts = await signer.getAccounts();
      const accountAddress = accounts[0].address;

      // Check if the account has enough funds
      const balance = await client.getBalance(accountAddress, tokenAddress);
      if (
        parseInt(balance.amount) <
        parseInt(tokenAmount) * recipients.split(",").length
      ) {
        setFeedback(
          "Account does not have enough funds. Please fund your account."
        );
        return;
      }

      const recipientList = recipients.split(",").map((addr) => addr.trim());
      const messages: any = recipientList.map((recipient) => ({
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: accountAddress,
          to_address: recipient,
          amount: coins(tokenAmount, tokenAddress),
        },
      }));

      // Estimate the gas fee
      const feeEstimate: any = await client.simulate(
        accountAddress,
        messages,
        ""
      );
      const gasLimit = feeEstimate.gas_used;
      const gasPrice = 0.025; // Assuming gas price is 0.025 uarch per gas unit
      const fee = {
        amount: coins(gasLimit * gasPrice, "uarch"),
        gas: gasLimit.toString(),
      };

      const result = await client.signAndBroadcast(
        accountAddress,
        messages,
        fee
      );
      console.log(result);
      setFeedback("Borrow executed successfully!");
    } catch (error) {
      console.error("Failed to execute Borrow", error);
      setFeedback("Failed to execute Borrow.");
    }
  };

  return (
    <section className="p=4 mt-4 mx-auto max-w-0.5">
      <div className="text-2xl">Borrow</div>
      <form noValidate autoComplete="off">
        <label htmlFor="">Recipient Addresses (comma separated)</label>
        <Textarea
          value={recipients}
          onChange={(e: any) => setRecipients(e.target.value)}
        />
        <label htmlFor="">Token Amount per Recipient</label>
        <Textarea
          value={tokenAmount}
          onChange={(e: any) => setTokenAmount(e.target.value)}
        />
        <label htmlFor="">Token Address</label>
        <Textarea
          value={tokenAddress}
          onChange={(e: any) => setTokenAddress(e.target.value)}
        />
        <Button color="primary" onClick={executeBorrow} className="mt-2">
          Execute Borrow
        </Button>
        {feedback && <div className="mt-2">{feedback}</div>}
      </form>
    </section>
  );
};

export default Borrow;
