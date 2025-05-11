import ResultsHeader from "./ResultsHeader.tsx";
import { FaDownload } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../hooks/store.tsx"; // Add AppDispatch type
import { useEffect, useState } from "react";
import { fetchFileData } from "../../hooks/pipelineSlice.tsx";

function Results() {
    const dispatch = useDispatch<AppDispatch>();

    const pipelineState = useSelector((state: RootState) => state.pipeline);
    const pipelineResults = pipelineState.results;
    const executionId = pipelineState.executionId;
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        // Only fetch if we have an executionId and don't have results yet
        if (executionId && !pipelineResults) {
            dispatch(fetchFileData({ pipeline_execution_id: executionId }));
        }
    }, [executionId, pipelineResults, dispatch]);

    const downloadFile = () => {
        try {
            if (!pipelineResults || isDownloading) return;

            setIsDownloading(true);

            // Create a URL for the blob
            const blob = new Blob([JSON.stringify(pipelineResults.data)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);

            // Create a download link
            const link = document.createElement('a');
            link.href = url;
            link.download = pipelineResults.id;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setIsDownloading(false);
        } catch (err) {
            console.error("Error downloading file:", err);
            setIsDownloading(false);
        }
    }

    return (
        <>
            {pipelineResults ? (
                <>
                    <ResultsHeader />
                    <div
                        className={`flex justify-end py-4 select-none`}
                        onClick={downloadFile}
                    >
                        <div className={`flex flex-row p-3 gap-4 rounded-md bg-gray-900 ${isDownloading ? 'opacity-70' : 'hover:cursor-pointer'}`} title={pipelineResults.id}>
                            <FaDownload className={`size-6 text-white ${isDownloading ? 'animate-pulse' : ''}`} />
                            <div className="text-white">
                                {isDownloading ? 'Downloading...' : 'Export Results'}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex justify-center items-center py-10">
                    <p className="text-gray-500">Loading results...</p>
                </div>
            )}
        </>
    );
}

export default Results;