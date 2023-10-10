import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import type { TransactionSignature } from '@solana/web3.js';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import { message } from 'antd';

const SendTransaction: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        let signature: TransactionSignature | undefined = undefined;
        try {
            if (!publicKey) throw new Error('Wallet not connected!');

            const {
                context: { slot: minContextSlot },
                value: { blockhash, lastValidBlockHeight },
            } = await connection.getLatestBlockhashAndContext();

            const transaction = new Transaction({
                feePayer: publicKey,
                recentBlockhash: blockhash,
            }).add(
                new TransactionInstruction({
                    data: Buffer.from('Hello, from the Solana Wallet Adapter example app!'),
                    keys: [],
                    programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
                })
            );

            signature = await sendTransaction(transaction, connection, { minContextSlot });

            await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });
            message.success(signature);
        } catch (error: any) {
            message.error(error?.message);
        }
    }, [publicKey, connection, sendTransaction]);

    return (
        <button onClick={onClick} disabled={!publicKey}>
            Send Transaction (devnet)
        </button>
    );
};
export default SendTransaction;