import React from "react";
import Head from "next/head";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = "EventHub" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link href="/">
                  <h1 className="text-2xl font-bold text-blue-600 cursor-pointer">
                    EventHub
                  </h1>
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <div className="text-gray-700 hover:text-blue-600">
                    Create Event
                  </div>
                </Link>
                <Link href="/admin/status">
                  <div className="text-gray-700 hover:text-blue-600">
                    Admin Status
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
