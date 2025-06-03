import {fetchPipelineStatus, updateStepElapseTime} from './pipelineSlice';
import {AppDispatch} from "./store.tsx";

let globalTimerId: ReturnType<typeof setInterval> | null = null;
let stepTimers: Record<string, { timerId: ReturnType<typeof setInterval>, elapsedTime: number }> = {};

export const startGlobalTimer = (dispatch: AppDispatch) => {
    if (globalTimerId) {
        clearInterval(globalTimerId);
    }

    globalTimerId = setInterval(() => {
        dispatch(fetchPipelineStatus());
    }, 200);
};

export const startStepTimer = (stepId: string, dispatch: AppDispatch, existingElapsedTime: number = 0) => {
    // Clear previous timer if exists
    if (stepTimers[stepId]) {
        clearInterval(stepTimers[stepId].timerId);
    }

    // Record the start time to calculate elapsed time more accurately
    const startTime = Date.now();
    const initialElapsedTime = existingElapsedTime; // Use existing elapsed time if provided

    // Initialize the step timer
    stepTimers[stepId] = {
        timerId: setInterval(() => {
            // Calculate elapsed time based on actual time difference
            // This is more accurate than incrementing by fixed amounts
            const currentElapsedTime = initialElapsedTime + (Date.now() - startTime);

            // Store the calculated time
            stepTimers[stepId].elapsedTime = currentElapsedTime;

            // Dispatch the thunk with the correct parameters
            dispatch(updateStepElapseTime({
                taskId: stepId,
                elapsedTime: currentElapsedTime
            }));
        }, 100), // Update display every 100ms (10 updates per second)
        elapsedTime: initialElapsedTime
    };

    return stepId;
};

export const stopStepTimer = (stepName: string) => {
    if (stepTimers[stepName]) {
        clearInterval(stepTimers[stepName].timerId);
    }
};

// Stop all timers
export const stopAllTimers = () => {
    if (globalTimerId) {
        clearInterval(globalTimerId);
        globalTimerId = null;
    }

    Object.keys(stepTimers).forEach(stepName => {
        clearInterval(stepTimers[stepName].timerId);
    });

    stepTimers = {};
};

// Format seconds to display as MM:SS
export const formatTime = (seconds: number | null): string => {
    if (seconds === null) return '00:00';

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};