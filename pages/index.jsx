import { useRouter } from "next/router";
import { useEffect, useContext } from "react";
import { toast } from 'react-toastify';
import Layout from '../src/components/layout/Layout';
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";


export default function Home() {
  const { status, data } = useSession();
  const router = useRouter();

  return (
    <Layout>
      <div>
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <div className="px-4 py-6 sm:px-0">
          <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
            <button
              onClick={() => {
                signIn();
              }}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </Layout>

  )
}
