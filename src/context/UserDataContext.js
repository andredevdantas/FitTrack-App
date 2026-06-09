import React, { createContext, useState, useEffect } from 'react';
import * as db from '../utilites/globalFunctions.js';

export const UserDataContext = createContext();

export const UserDataProvider = ({ children }) => {
    const [idade, setIdade] = useState(null);
    const [peso, setPeso] = useState(null);
    const [altura, setAltura] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const idadeStorage = await db.getData('idade');
            const pesoStorage = await db.getData('peso');
            const alturaStorage = await db.getData('altura');
            setIdade(idadeStorage);
            setPeso(pesoStorage);
            setAltura(alturaStorage);
        };

        fetchUserData();
    }, []);

    return (
        <UserDataContext.Provider value={{
            idade, setIdade,
            peso, setPeso,
            altura, setAltura
        }}>
            {children}
        </UserDataContext.Provider>
    );
};
