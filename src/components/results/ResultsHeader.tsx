import { ReactNode } from "react";
import { FaPuzzlePiece, FaBoltLightning, FaShield } from "react-icons/fa6";

interface ResultsHeaderProps {
    title: string;
    children: ReactNode;
}

function ResultsHeader({ title, children }: ResultsHeaderProps) {
    const icons = [
        <FaPuzzlePiece className="size-6 text-gray-900" key="ico1" />,
        <FaBoltLightning className="size-6 text-gray-900" key="ico2" />,
        <FaShield className="size-6 text-gray-900" key="ico3" />,
    ];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    return (
        <div className="flex flex-col gap-8 w-full border-gray-200 border bg-white p-8 rounded shadow">
            <div className="flex flex-row justify-between">
                <div className="text-xl font-bold">{title}</div>
                <div>{randomIcon}</div>
            </div>
            <div className="flex flex-col gap-2 p-2">{children}</div>
        </div>
    );
}

export default ResultsHeader;
