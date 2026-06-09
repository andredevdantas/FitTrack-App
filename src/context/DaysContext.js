import React, { createContext, useState } from 'react';

export const DaysContext = createContext();

export const DaysProvider = ({ children }) => {
    const [selectedDays, setSelectedDays] = useState({
        segunda: true,
        terca: true,
        quarta: true,
        quinta: true,
        sexta: true,
    });

    return (
        <DaysContext.Provider value={{ selectedDays, setSelectedDays }}>
            {children}
        </DaysContext.Provider>
    );
};