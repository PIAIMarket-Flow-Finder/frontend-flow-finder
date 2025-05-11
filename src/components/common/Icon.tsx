import { FaCheck } from "react-icons/fa6";
import {useDispatch, useSelector} from "react-redux";
import { RootState } from "../../hooks/store.tsx";
import { ProcessStep } from "../../utils/ProcessStep.tsx";
import React, {useEffect} from "react";
import {startStepTimer, stopStepTimer} from "../../hooks/timerService.tsx";

function Icon({ children, title, tasks_id }: { children: React.ReactNode, title: string, tasks_id: number }) {
    const dispatch = useDispatch();
    const tasksStatus = useSelector((state: RootState) => state.pipeline.tasksStatus[tasks_id]);

    useEffect(() => {
        if (!tasksStatus.tasksId || tasks_id === 0 || tasks_id === 4) return;

        // Convert tasks_id to string if needed
        const taskIdString = tasksStatus.tasksId;

        // Get existing elapsed time if available
        const existingTime = tasksStatus.elapsedTime ?
            (typeof tasksStatus.elapsedTime === 'number' ?
                tasksStatus.elapsedTime :
                parseInt(tasksStatus.elapsedTime, 10) || 0) :
            0;

        // Start timer if task is processing
        if (tasksStatus.status === ProcessStep.Processing) {
            startStepTimer(taskIdString, dispatch, existingTime);
        }
        // Stop timer if task is completed
        else if (tasksStatus.status === ProcessStep.Completed) {
            stopStepTimer(taskIdString);
        }

        // Cleanup function to stop timer when component unmounts
        return () => {
            stopStepTimer(taskIdString);
        };
    }, [tasksStatus.status, tasks_id, dispatch, tasksStatus.tasksId, tasksStatus.elapsedTime]);

    const formatElapsedTime = (timeInMs: number | string | undefined) => {
        if (!timeInMs) return "0.0s";

        // Convert to number if it's a string
        const ms = typeof timeInMs === 'number' ? timeInMs : parseInt(timeInMs, 10) || 0;

        // Convert milliseconds to seconds with one decimal point precision
        const totalSeconds = ms / 1000;
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Format to one decimal place
        const secondsFormatted = seconds.toFixed(1);

        // Show as "1.2s" if less than a minute, or "1m2.3s" if 1 minute or more
        if (minutes > 0) {
            return `${minutes}m${secondsFormatted}s`;
        } else {
            return `${secondsFormatted}s`;
        }
    };

    return (
        <div className={"flex flex-col p-4 gap-2 justify-center min-w-36 select-none"}>
            <div className={"flex justify-center"}>
                {tasksStatus.status === ProcessStep.Completed
                    ?
                    <div className={"bg-black rounded-full w-12 h-12 content-center"}>
                        <FaCheck className={"size-6 mx-auto text-white"}/>
                    </div>
                    :
                    <div className={"bg-gray-300 rounded-full w-12 h-12 content-center"}>
                        {children}
                    </div>
                }
            </div>
            <div className={"flex flex-col justify-center font-bold text-xl text-center"}>
                {title}
            </div>
            { tasks_id !== 0 && tasks_id !== 4
                ?
                <div className={"flex flex-col justify-center font-semibold text-sm text-center"}>
                    { formatElapsedTime(tasksStatus.elapsedTime) }
                </div>
                : null
            }
        </div>
    );
}

export default Icon;