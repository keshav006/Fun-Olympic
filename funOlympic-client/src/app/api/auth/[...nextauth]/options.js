import axios from "@/lib/utils/axios";
import CredentialsProvider from "next-auth/providers/credentials";

// import { CredentialsProvider } from "next-auth/providers";
export const options = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { data } = await axios.post("/auth/signin", {
          email: credentials.email,
          password: credentials.password,
        });
        if (data) {
          return { ...data.payload.data, fetchedData: false };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = { ...token, ...user };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session = { ...session, ...token };
      }
      return session;
    },
  },
};
