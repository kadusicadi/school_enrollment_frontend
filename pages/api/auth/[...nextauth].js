import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import parseJwt from '../../../src/lib/parseJwt';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const res = await fetch("http://51.15.114.199:3534/api/login/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const response = await res.json();
        const jwt = response.access;
        const { user_id } = parseJwt(jwt)
        let user = {};

        try {
          const userResp = await fetch('http://51.15.114.199:3534/api/teacher/' + user_id + '/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          })
          user = await userResp.json();
        } catch (e) {
          console.log(e)
        }
        user.token = jwt;
        if(user.is_superuser){
          user.role = "admin"
        } else {
          user.role = "user"
        }
        if (res.ok && user) {
          return user;
        } else return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);