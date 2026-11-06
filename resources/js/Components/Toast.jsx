import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function Toast() {
    const { flash } = usePage().props;
    const [message, setMessage] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setMessage({ type: 'success', text: flash.success });
        } else if (flash?.error) {
            setMessage({ type: 'error', text: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        if (!message) {
            return undefined;
        }

        const id = setTimeout(() => setMessage(null), 4500);
        return () => clearTimeout(id);
    }, [message]);

    if (!message) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
            <div
                className={`max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg ${
                    message.type === 'success'
                        ? 'border-cyan-400/30 bg-navy-900 text-cyan-100'
                        : 'border-red-400/30 bg-navy-900 text-red-200'
                }`}
            >
                {message.text}
            </div>
        </div>
    );
}
