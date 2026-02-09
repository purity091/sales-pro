import { useState, useEffect } from 'react';
import { authHelpers } from '../lib/supabase';

interface AuthState {
    user: any | null;
    session: any | null;
    loading: boolean;
    authenticated: boolean;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        authenticated: false,
    });

    useEffect(() => {
        let isMounted = true;

        // Check active session - optimized to single call
        const checkSession = async () => {
            try {
                const { session } = await authHelpers.getSession();

                if (!isMounted) return;

                setAuthState({
                    user: session?.user || null,
                    session: session || null,
                    loading: false,
                    authenticated: !!session?.user,
                });
            } catch (error) {
                if (!isMounted) return;

                setAuthState({
                    user: null,
                    session: null,
                    loading: false,
                    authenticated: false,
                });
            }
        };

        checkSession();

        // Listen to auth changes
        const { data: { subscription } } = authHelpers.onAuthStateChange(
            async (event, session) => {
                if (!isMounted) return;

                setAuthState({
                    user: session?.user || null,
                    session: session || null,
                    loading: false,
                    authenticated: !!session?.user,
                });
            }
        );

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const signOut = async () => {
        await authHelpers.signOut();
        setAuthState({
            user: null,
            session: null,
            loading: false,
            authenticated: false,
        });
    };

    return {
        ...authState,
        signOut,
    };
};
