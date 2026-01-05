import React, { createContext, useContext, useState, ReactNode } from 'react';

type TransitionContextType = {
    isAnimating: boolean;
    startTransition: (path: string) => void;
    endTransition: () => void;
    nextPath: string | null;
};

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export const TransitionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [nextPath, setNextPath] = useState<string | null>(null);

    const startTransition = (path: string) => {
        setNextPath(path);
        setIsAnimating(true);
    };

    const endTransition = () => {
        setIsAnimating(false);
        setNextPath(null);
    };

    return (
        <TransitionContext.Provider value={{ isAnimating, startTransition, endTransition, nextPath }}>
            {children}
        </TransitionContext.Provider>
    );
};

export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (context === undefined) {
        throw new Error('useTransition must be used within a TransitionProvider');
    }
    return context;
};
