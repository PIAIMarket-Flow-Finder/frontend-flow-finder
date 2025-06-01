import { FaCircleInfo } from "react-icons/fa6";

interface ResultsCardProps {
    text: string;
}

function ResultsCard({ text }: ResultsCardProps) {
    return (
        <div className="flex flex-row p-2 gap-4 w-full">
            <div>
                <FaCircleInfo className="size-6 text-gray-900" />
            </div>
            <div className="text-gray-500 font-semibold">{text}</div>
        </div>
    );
}

export default ResultsCard;
