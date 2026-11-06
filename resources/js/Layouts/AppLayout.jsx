import FloatingSupport from '@/Components/FloatingSupport';
import Footer from '@/Components/Footer';
import Navbar from '@/Components/Navbar';
import SeoHead from '@/Components/SeoHead';
import Toast from '@/Components/Toast';

export default function AppLayout({ title, description, image, path, children }) {
    return (
        <div className="flex min-h-screen flex-col bg-navy-950 text-slate-100">
            <SeoHead title={title} description={description} image={image} path={path} />
            <Navbar />
            <Toast />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingSupport />
        </div>
    );
}
