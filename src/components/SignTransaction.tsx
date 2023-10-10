import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import bs58 from 'bs58';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { message } from 'antd';

const SignTransaction: FC = () => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();

    const onClick = useCallback(async () => {
        try {
            if (!publicKey) throw new Error('Wallet not connected!');
            if (!signTransaction) throw new Error('Wallet does not support transaction signing!');

            const { blockhash } = await connection.getLatestBlockhash();

            let transaction = new Transaction({
                feePayer: publicKey,
                recentBlockhash: blockhash,
            }).add(
                new TransactionInstruction({
                    data: Buffer.from('Hello, from the Solana Wallet Adapter example app!'),
                    keys: [],
                    programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                })
            );

            transaction = await signTransaction(transaction);
            if (!transaction.signature) throw new Error('Transaction not signed!');
            const signature = bs58.encode(transaction.signature);
            if (!transaction.verifySignatures()) throw new Error(`Transaction signature invalid! ${signature}`);
            message.success(`Transaction signature valid! ${signature}`);
        } catch (error: any) {
            message.error(`Transaction signature valid! ${error?.message}`);
        }
    }, [publicKey, signTransaction, connection]);

    return (
        <button onClick={onClick} disabled={!publicKey || !signTransaction}>
            Sign Transaction
        </button>
    );
};

export default SignTransaction;