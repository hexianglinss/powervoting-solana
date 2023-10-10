import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  TransactionMessage,
  VersionedTransaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@project-serum/anchor';
import {NFTStorage, Blob} from 'nft.storage';
import {
  NFT_STORAGE_KEY,
} from "../common/consts";


/**
 * Reads an image file from `imagePath` and stores an NFT with the given name and description.
 * @param {object} params for the NFT
 */
const storeIpfs = (params: object) => {
  const json = JSON.stringify(params);
  const data = new Blob([json]);

  const nftStorage = new NFTStorage({token: NFT_STORAGE_KEY});

  return nftStorage.storeBlob(data);
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 *
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
export const getIpfsId = async (props: any) => {
  const result = await storeIpfs(props);
  return result;
}

export const useDynamicContract = () => {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const sourceKey = new PublicKey('3XKoxvhWnkNbtkdMNQR85yiiuscgYiEDVRML9XmY6YEF');
  const programId = new PublicKey('7L49xLdTLLF3HL41PUpXsCbmuS7hUFvErF8FHNoVgxoK');

  const createVotingInstruction = async () => {
    const keys = [
      { pubkey: sourceKey, isSigner: false, isWritable: true },
      { pubkey: sourceKey, isSigner: false, isWritable: true },
      { pubkey: publicKey, isSigner:true, isWritable: false}
    ];

    const data = Buffer.from([]);

    // @ts-ignore
    return new TransactionInstruction({ keys, programId, data });
  }

  const createVotingApi = async () => {
    const txInstructions = [
      await createVotingInstruction()
    ];

    const {
      context: { slot: minContextSlot },
      value: { blockhash },
    } = await connection.getLatestBlockhashAndContext();


    if (publicKey) {
      const messageV0 = new TransactionMessage({
        payerKey: publicKey,
        recentBlockhash: blockhash,
        instructions: txInstructions,
      }).compileToV0Message();

      const trx = new VersionedTransaction(messageV0);
      const signature = await sendTransaction(trx, connection, {
        minContextSlot,
      });
      console.log(signature);
      console.log("signature:", signature);
    }
  };

  const cancelVotingApi = async () => {
    // 构造交易事务
    // const tx = await program.CancelProposal().rpc();

    //console.log('交易已发送，签名：', tx);
  }

  const votingApi = async (vote_info: string) => {
    // 构造交易事务
    // const tx = await program.Vote(vote_info).rpc();

    // console.log('交易已发送，签名：', tx);
  }

  return {
    createVotingApi,
    cancelVotingApi,
    votingApi
  }
}