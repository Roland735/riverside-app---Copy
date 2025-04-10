import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB, disconnectDB } from "@/configs/dbConfig";
import { userModel } from "@/models/userModel";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        // regNumber: {}, // Add registration number
      },
      async authorize(credentials, req) {
        console.log("hi");
        try {
          console.log("hi");

          await connectDB();
          console.log("Credentials:", credentials);
          const existingUser = await userModel.findOne({
            email: credentials.email,
          });
          console.log("Existing User:", existingUser);

          if (!existingUser) {
            return null;
          }

          const isMatch = await existingUser.matchPassword(credentials.password);
          console.log("Is Match:", isMatch);
          if (!isMatch) {
            return null;
          }

          // If the role is 'parent', check if the student with the given regNumber exists



          const user = {
            id: existingUser._id,
            firstname: existingUser.firstname,
            lastname: existingUser.lastname,
            email: existingUser.email,
            role: existingUser.role,
            regNumber: existingUser.regNumber,
            profileUrl: existingUser.profilePicture,
            active: existingUser.active,

          };
          console.log("User:", user);

          return user;
        } finally {
          await disconnectDB();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = user;
      }
      return Promise.resolve(token);
    },
    async session({ session, token }) {
      session.user = token;
      return Promise.resolve(session);
    },
  },
});

export { handler as GET, handler as POST };
