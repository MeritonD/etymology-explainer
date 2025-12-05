export function AdPlaceholder({ className }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center bg-neutral-900/50 border border-neutral-800 rounded-lg p-4 text-center ${className}`}>
            <div className="space-y-1">
                <span className="text-xs uppercase tracking-widest text-neutral-600 font-semibold block">Advertisement</span>
                <div className="w-full h-24 bg-neutral-800 rounded flex items-center justify-center text-neutral-600 text-sm">
                    Ad Space Available
                </div>
            </div>
        </div>
    );
}
