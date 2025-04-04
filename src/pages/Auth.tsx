import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome to Arl</h1>
            <p className="text-muted-foreground mt-2">
              Your journey to better habits starts here
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-border p-6 sm:p-8">
            <AuthForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
