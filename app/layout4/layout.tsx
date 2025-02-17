// app/layout.tsx
import type { Metadata } from 'next';
import '../globals.css'; // Assuming you have global styles
import Navbar from '../components/Navbar';


export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function Layout4({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      
        <Navbar /> {/* Include the Navbar component here */}
        <main>{children}</main>{/*  This is where page.tsx content will be rendered */}
      
    </>
  );
}

