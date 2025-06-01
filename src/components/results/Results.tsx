import { FaDownload, FaChevronDown, FaChevronRight } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../hooks/store.tsx";
import { useEffect, useState } from "react";
import { fetchFileData } from "../../hooks/pipelineSlice.tsx";

interface CategoryData {
    category: number;
    description: string;
    top_points: string[];
}

function Results() {
    const dispatch = useDispatch<AppDispatch>();

    const pipelineState = useSelector((state: RootState) => state.pipeline);
    const pipelineResults = pipelineState.results;
    const executionId = pipelineState.executionId;
    const [isDownloading, setIsDownloading] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());

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

    const toggleCategory = (categoryIndex: number) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryIndex)) {
            newExpanded.delete(categoryIndex);
        } else {
            newExpanded.add(categoryIndex);
        }
        setExpandedCategories(newExpanded);
    };

    const getCategoryIcon = (category: number) => {
        const icons: { [key: number]: string } = {
            0: "🐛", // Bugs
            1: "✨", // Features
            2: "🎨", // Design
            3: "⚡", // Performance
            5: "📋"  // Other
        };
        return icons[category] || "📄";
    };

    const getCategoryColor = (category: number) => {
        const colors: { [key: number]: string } = {
            0: "border-red-500 bg-red-50",
            1: "border-blue-500 bg-blue-50",
            2: "border-purple-500 bg-purple-50",
            3: "border-yellow-500 bg-yellow-50",
            5: "border-gray-500 bg-gray-50"
        };
        return colors[category] || "border-gray-500 bg-gray-50";
    };

    const renderJsonData = (data: any) => {
        try {
            let parsedData = data;

            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data);
                } catch {
                    parsedData = data;
                }
            }

            if (parsedData?.summary && Array.isArray(parsedData.summary)) {
                return (
                    <div className="space-y-4">
                        {parsedData.summary.map((category: CategoryData, index: number) => (
                            <div
                                key={index}
                                className={`border-l-4 rounded-lg shadow-sm overflow-hidden ${getCategoryColor(category.category)}`}
                            >
                                <div
                                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() => toggleCategory(index)}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getCategoryIcon(category.category)}</span>
                                        <div>
                                            <h3 className="font-semibold text-lg">{category.description}</h3>
                                            <p className="text-sm text-gray-600">
                                                {category.top_points.length} points •
                                                {category.top_points.reduce((acc, point) => {
                                                    const match = point.match(/\((\d+) mentions\)/);
                                                    return acc + (match ? parseInt(match[1]) : 0);
                                                }, 0)} mentions totales
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-gray-400">
                                        {expandedCategories.has(index) ?
                                            <FaChevronDown className="size-5" /> :
                                            <FaChevronRight className="size-5" />
                                        }
                                    </div>
                                </div>

                                {expandedCategories.has(index) && (
                                    <div className="border-t border-gray-200 bg-white p-4">
                                        <ul className="space-y-3">
                                            {category.top_points.map((point: string, pointIndex: number) => {
                                                const mentionsMatch = point.match(/\((\d+) mentions\)$/);
                                                const mentions = mentionsMatch ? mentionsMatch[1] : "0";
                                                const cleanPoint = point.replace(/\(\d+ mentions\)$/, '').trim();

                                                return (
                                                    <li key={pointIndex} className="flex items-start gap-3">
                                                        <span className="text-gray-400 mt-1">•</span>
                                                        <div className="flex-1">
                                                            <p className="text-gray-700">{cleanPoint}</p>
                                                            <span className="text-sm text-gray-500 font-medium">
                                                                {mentions} mentions
                                                            </span>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }

            // Fallback for other JSON structures
            return (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
                    <code className="text-sm">{JSON.stringify(parsedData, null, 2)}</code>
                </pre>
            );
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                    <p className="font-semibold">Erreur lors de l'affichage des données</p>
                    <p className="text-sm mt-1">Les données ne sont pas au format attendu.</p>
                </div>
            );
        }
    };

    return (
        <>
            {pipelineResults ? (
                <>
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-2xl font-bold mb-6">Résultats de l'analyse</h2>
                        {renderJsonData(pipelineResults.data)}
                    </div>
                    <div className="flex justify-end py-4 select-none">
                        <div
                            className={`flex flex-row p-3 gap-4 rounded-md bg-gray-900 ${
                                isDownloading ? "opacity-70" : "hover:cursor-pointer"
                            }`}
                            title={pipelineResults.id}
                            onClick={downloadFile}
                        >
                            <FaDownload
                                className={`size-6 text-white ${isDownloading ? "animate-pulse" : ""}`}
                            />
                            <div className="text-white">
                                {isDownloading ? "Downloading..." : "Export Results"}
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