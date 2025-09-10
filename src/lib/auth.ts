import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient, User, Role } from "@prisma/client";
import { SessionUser } from "@/types/auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        // Find user by username
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
        });

        // If no user found or password doesn't match, return null
        if (!user || !await bcrypt.compare(credentials.password, user.password)) {
          return null;
        }

        // For professors, ensure they can only sign in (no signup)
        if (credentials.role === "PROFESSOR" && user.role !== "PROFESSOR") {
          return null;
        }

        // For students, ensure they have the correct role
        if (credentials.role === "STUDENT" && user.role !== "STUDENT") {
          return null;
        }

        // For admin, ensure they have the correct role
        if (credentials.role === "ADMIN" && user.role !== "ADMIN") {
          return null;
        }

        // Return user object without password
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as User).id;
        token.role = (user as User).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // Extend session user with custom properties
        const extendedUser: SessionUser = {
          id: token.id as string,
          role: token.role as Role,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image
        };
        session.user = extendedUser;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);