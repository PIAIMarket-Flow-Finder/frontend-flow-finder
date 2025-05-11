import {useSelector} from "react-redux";
import {RootState} from "../../hooks/store.tsx";

const LoadingSpinner = () => {
    const executionId = useSelector((state:RootState) => state.pipeline.executionId);
    return (
        <div className="flex flex-col justify-center items-center gap-4 w-full h-full p-4">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin">
            </div>
            <div>
                The pipeline is processing your request
            </div>
            <div>
                { executionId }
            </div>
        </div>
    );
};

export default LoadingSpinner;
