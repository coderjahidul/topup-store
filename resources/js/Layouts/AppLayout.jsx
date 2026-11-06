import FloatingSupport from '@/Components/FloatingSupport';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import Toast from '@/Components/Toast';
import { Head, usePage } from '@inertiajs/react';

export default function AppLayout({ title, children }) {
    const { appName } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col bg-navy-950 text-slate-100">
            <Head title={title ? `${title} - ${appName}` : appName} />
            <Navbar />
            <Toast />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingSupport />
        </div>
    );
}
