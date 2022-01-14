import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

interface Transaction{
    id: number;
    title: string;
    type: string;
    category: string;
    amount: number;
    createdAt: string;
}

//extends campos de Transactione e exclui os campos que passaei como parametro
type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>;

interface TransactionsProviderProps{
    children: ReactNode;
}

interface TransactionContextData{
    transactions: Transaction[];
    createTransaction: (transaction : TransactionInput) => Promise<void>;
}
const TransactionsContext = createContext<TransactionContextData>(
    {} as TransactionContextData
);

export function TransactionProvider(props : TransactionsProviderProps){

    const [ transactions, setTransactions ] = useState<Transaction[]>([]);

    useEffect(() => {
        api.get('transactions')
            .then(response => setTransactions(response.data.transactions))
    },[])

    async function createTransaction( transactionInput : TransactionInput){
        const response = await api.post('/transactions', {
            ...transactionInput,
            createdAt: new Date()
        });
        const { transaction } = response.data;
        setTransactions([
            ...transactions,
            transaction
        ])
    }
    return(
        <TransactionsContext.Provider value={{transactions, createTransaction}}>
            {props.children}
        </TransactionsContext.Provider>
    )
}

export function useTransactions(){
    const context = useContext(TransactionsContext);

    return context;
}