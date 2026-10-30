import { Scale } from 'lucide-react';

export default function AppLogo({ position }: { position?: 'left' | 'right' }) {
    return (
        <div className={`w-full flex items-center gap-2.5 ${position === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className="bg-[#0f5348] text-white flex aspect-square size-8 items-center justify-center rounded-xl shadow-xs">
                <Scale className="size-4.5 text-white" />
            </div>
            <div className={`flex flex-col text-start`}>
                <span className="text-base font-extrabold text-gray-900 dark:text-white leading-tight">ميزان</span>
                <span className="text-[10px] font-bold text-[#0f5348] dark:text-emerald-400 leading-tight">نظام إدارة المحاماة</span>
            </div>
        </div>
    );
}
