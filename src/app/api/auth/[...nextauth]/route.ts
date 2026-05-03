import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { supabase } from '@/lib/supabase';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      const { email, name, image } = user;
      const provider = account?.provider;
      const providerId = account?.providerAccountId;
      console.log('LOGIN USER:', user);
      console.log('PROVIDER USER:', provider);
      console.log('PROVIDER ID USER:', providerId);

      if (!provider || !providerId) return false;

      // 1. buscar account
      const { data: existingAccount, error } = await supabase
        .from('accounts')
        .select('*')
        .eq('provider', provider)
        .eq('provider_id', providerId)
        .maybeSingle();

      console.log('EXISTING USER:', existingAccount);
      console.log('ERROR:', error);

      if (error) {
        console.error(error);
        return false;
      }

      if (existingAccount) {
        return true;
      }

      // 2. crear user
      const { data: newUser, error: userError } = await supabase
        .from('users')
        .insert([
          {
            email,
            name,
            image,
          },
        ])
        .select()
        .single();

      if (userError) {
        console.error(userError);
        return false;
      }

      console.log('INSERT RESULT:', newUser);
      console.log('INSERT ERROR:', userError);

      // 3. crear account
      const { error: accountError } = await supabase.from('accounts').insert([
        {
          user_id: newUser.id,
          provider,
          provider_id: providerId,
        },
      ]);

      if (accountError) {
        console.error(accountError);

        // borrar el usuario
        await supabase.from('users').delete().eq('id', newUser.id);

        return false;
      }

      return true;
    },

    async jwt({ token, account }) {
      if (account) {
        const provider = account.provider;
        const providerId = account.providerAccountId;

        const { data } = await supabase.from('accounts').select('user_id').eq('provider', provider).eq('provider_id', providerId).single();

        token.userId = data?.user_id;
      }

      return token;
    },

    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
