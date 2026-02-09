import { Client, Account, ID } from 'appwrite';

// Appwrite configuration
const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;

if (!appwriteEndpoint || !appwriteProjectId) {
  throw new Error('Missing Appwrite environment variables. Please check your .env.local file.');
}

// Initialize Appwrite client
const client = new Client()
  .setEndpoint(appwriteEndpoint)
  .setProject(appwriteProjectId);

// Initialize Account service
export const account = new Account(client);

// Auth helper functions
export const authHelpers = {
  // Sign up with email and password
  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    try {
      const name = metadata?.full_name || email.split('@')[0];
      const response = await account.create(ID.unique(), email, password, name);

      // Optionally auto-login after signup
      // const session = await account.createEmailPasswordSession(email, password);

      return {
        data: {
          user: {
            id: response.$id,
            email: response.email,
            name: response.name,
          }
        },
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to create account' }
      };
    }
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      return {
        data: {
          user: {
            id: user.$id,
            email: user.email,
            name: user.name,
          },
          session: {
            $id: session.$id,
            userId: session.userId,
            expire: session.expire,
          }
        },
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Invalid credentials' }
      };
    }
  },

  // Sign in with OAuth provider (Google, GitHub, etc.)
  async signInWithOAuth(provider: 'google' | 'github' | 'facebook' | 'apple') {
    try {
      // Appwrite OAuth - redirects to provider
      await account.createOAuth2Session(
        provider,
        `${window.location.origin}/auth/callback`,
        `${window.location.origin}/auth/failure`
      );
      return { data: { url: 'redirecting...' }, error: null };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'OAuth failed' }
      };
    }
  },

  // Sign out
  async signOut() {
    try {
      await account.deleteSession('current');
      return { error: null };
    } catch (error: any) {
      return { error: { message: error.message || 'Sign out failed' } };
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const user = await account.get();
      return {
        user: {
          id: user.$id,
          email: user.email,
          name: user.name,
        },
        error: null
      };
    } catch (error: any) {
      // User not logged in
      return { user: null, error: null };
    }
  },

  // Get current session
  async getSession() {
    try {
      const session = await account.getSession('current');
      const user = await account.get();

      return {
        session: {
          $id: session.$id,
          userId: session.userId,
          expire: session.expire,
          user: {
            id: user.$id,
            email: user.email,
            name: user.name,
          }
        },
        error: null
      };
    } catch (error: any) {
      return { session: null, error: null };
    }
  },

  // Reset password
  async resetPassword(email: string) {
    try {
      await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
      return {
        data: { message: 'Recovery email sent' },
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to send recovery email' }
      };
    }
  },

  // Update password (requires userId and secret from recovery email)
  async updatePassword(newPassword: string, userId?: string, secret?: string) {
    try {
      if (userId && secret) {
        // Complete password recovery
        await account.updateRecovery(userId, secret, newPassword);
      } else {
        // Update password for logged-in user
        await account.updatePassword(newPassword);
      }
      return {
        data: { message: 'Password updated' },
        error: null
      };
    } catch (error: any) {
      return {
        data: null,
        error: { message: error.message || 'Failed to update password' }
      };
    }
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    // Appwrite doesn't have built-in listeners, so we simulate it

    // Check initial auth state
    this.getSession().then(({ session }) => {
      if (session) {
        callback('SIGNED_IN', session);
      } else {
        callback('SIGNED_OUT', null);
      }
    });

    // Return a mock subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            // Cleanup if needed
          },
        },
      },
    };
  },
};

// Export client for advanced usage
export const appwriteClient = client;
