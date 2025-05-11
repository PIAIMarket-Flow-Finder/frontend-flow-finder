import {ProcessStep} from "../utils/ProcessStep.tsx";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import ApiClient from "../services/apiClient.tsx";
import {RequestSend} from "../models/RequestSend.tsx";
import {startGlobalTimer, stopAllTimers} from "./timerService.tsx";
import {AppDispatch} from "./store.tsx";

interface Task {
    created_at: string,
    updated_at: string,
    data_in: unknown,
    data_out: unknown,
    status: string,
    service_id: string,
    pipeline_execution_id: string,
    id: string,
}

const SERVICE_IDS = {
    SCRAPER: "241d5f27-a593-4821-a7ef-4d4b1ca3bd72",
    VECTORIZER: "25d0bc2f-5801-4499-bddd-02affd3a3eeb",
    SORTING: "sorting-pipeline",
    result: "result-pipeline",
};

interface StepStatus {
    tasksId: string | null;
    step: string;
    status: ProcessStep;
    elapsedTime: number;
}

interface PipelineState {
    executionId: string | null;
    pipelineStatus: ProcessStep;
    currentTaskNumber: number;
    tasksStatus: StepStatus[];
    results: File | null;
}

interface File {
    id: string;
    data: string;
}

const initialState: PipelineState = {
    executionId: null,
    pipelineStatus: ProcessStep.None,
    currentTaskNumber: 0,
    tasksStatus: [
        {tasksId: null, step: 'Submitted', status: ProcessStep.None, elapsedTime: 0},
        {tasksId: null, step: 'Scraping', status: ProcessStep.None, elapsedTime: 0},
        {tasksId: null, step: 'Vectorizing', status: ProcessStep.None, elapsedTime: 0},
        // { tasksId: null,step: 'Reporting', status: ProcessStep.None, elapsedTime: 0 },
        // { tasksId: null,step: 'Done', status: ProcessStep.None, elapsedTime: 0 }
    ],
    results: null,
};

export const startPipeline = createAsyncThunk<
    Partial<PipelineState>,
    RequestSend,
    { dispatch: AppDispatch }
>(
    'pipeline/start',
    async (request: RequestSend, {dispatch}) => {
        dispatch(changePipelineStatus(ProcessStep.Processing));

        const jsonBlob = new Blob([JSON.stringify(request)], {type: 'application/json'});
        const file = new File([jsonBlob], 'input.json', {type: 'application/json'});

        const formData = new FormData();
        formData.append('input_name', file);

        startGlobalTimer(dispatch);

        const response = await ApiClient.post('/flow-finder-2', formData);

        const taskMap = new Map<string, Task>(
            response.data.tasks.map((task: Task) => [task.service_id, task])
        );

        const scraperTask = taskMap.get(SERVICE_IDS.SCRAPER);
        const vectorizingTask = taskMap.get(SERVICE_IDS.VECTORIZER);

        const state: Partial<PipelineState> = {
            executionId: response.data.id,
            pipelineStatus: ProcessStep.Processing,
            tasksStatus: [
                {tasksId: null, step: 'Submitted', status: ProcessStep.Completed, elapsedTime: 0},
                {tasksId: scraperTask?.id ?? null, step: 'Scraping', status: ProcessStep.Processing, elapsedTime: 0},
                {tasksId: vectorizingTask?.id ?? null, step: 'Vectorizing', status: ProcessStep.None, elapsedTime: 0},
                // { tasksId: response.data.tasks[2].id, step: 'Reporting', status: ProcessStep.None, elapsedTime: 0 },
                // { tasksId: response.data.tasks[3].id, step: 'Done', status: ProcessStep.None, elapsedTime: 0 }
            ],
            currentTaskNumber: 0,
        };

        return state;
    }
);

export const fetchPipelineStatus = createAsyncThunk<
    void,
    void,
    { state: { pipeline: PipelineState }, dispatch: AppDispatch }
>(
    'pipeline/fetchStatus',
    async (_, {getState, dispatch}) => {
        const state = getState() as { pipeline: PipelineState };

        for (const task of state.pipeline.tasksStatus) {
            if (task.tasksId === null || task.status === ProcessStep.Completed) continue;

            try {
                const response = await ApiClient.get(`/tasks/${task.tasksId}/status`);

                const status = response.data;

                const taskStatus: Partial<StepStatus> = {
                    tasksId: task.tasksId,
                }

                if (status === "finished") {
                    taskStatus.status = ProcessStep.Completed;
                } else if (status === "processing") {
                    taskStatus.status = ProcessStep.Processing;
                } else {
                    taskStatus.status = ProcessStep.None;
                }

                dispatch(updateTasksStatus(taskStatus));
            } catch (error) {
                console.error('Failed to fetch pipeline status', error);
            }
        }
    }
);

export const updateStepElapseTime = createAsyncThunk<
    { taskId: string; elapsedTime: number } | undefined, // Return type
    { taskId: string; elapsedTime: number }, // Parameter type
    { state: { pipeline: PipelineState } } // ThunkAPI configuration
>(
    'pipeline/updateElapseTime',
    async (payload) => {
        return payload;
    }
);

export const fetchFileData = createAsyncThunk<
    File | null,
    {pipeline_execution_id: string},
    { state: { pipeline: PipelineState } }
>(
    'pipeline/fetchFileData',
    async ({pipeline_execution_id}) => {
        try {
            const responseFileName = await ApiClient.get(`/pipeline-executions/${pipeline_execution_id}`);

            const name = responseFileName.data.tasks[responseFileName.data.tasks.length-1].data_out;

            const response = await ApiClient.get(`/storage/${name}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            return {
                id: name,
                data: response.data,
            };
        } catch (error) {
            console.error('Failed to fetch pipeline status', error);
            // Use rejectWithValue to properly handle errors in the reducer
            return null;
        }
    }
);

export const pipelineSlice = createSlice({
    name: 'pipeline',
    initialState,
    reducers: {
        updateTasksStatus: (state, action: PayloadAction<Partial<StepStatus>>) => {
            if (!action.payload.tasksId) return;

            const taskIndex = state.tasksStatus.findIndex(
                (task) => task.tasksId === action.payload.tasksId
            );

            if (taskIndex < 0 || !action.payload.status) return;

            state.tasksStatus[taskIndex].status = action.payload.status;


            if (state.tasksStatus[taskIndex].status === ProcessStep.Completed) {
                state.currentTaskNumber = taskIndex;
            }
        },
        changePipelineStatus: (state, action: PayloadAction<ProcessStep>) => {
            state.pipelineStatus = action.payload;
        },
        resetPipeline: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(startPipeline.fulfilled, (state, action) => {
                if (action.payload) {
                    state.executionId = action.payload.executionId || state.executionId;
                    state.pipelineStatus = action.payload.pipelineStatus || state.pipelineStatus;
                    state.currentTaskNumber = action.payload.currentTaskNumber || state.currentTaskNumber;
                    if (action.payload.tasksStatus) {
                        state.tasksStatus = action.payload.tasksStatus;
                    }
                }
            })
            .addCase(fetchPipelineStatus.fulfilled, (state) => {
                const isFinished = state.tasksStatus.every((task) => {
                    return task.status == ProcessStep.Completed;
                });

                if (isFinished) {
                    stopAllTimers();
                    state.pipelineStatus = ProcessStep.Completed;
                }
            })
            .addCase(fetchFileData.fulfilled, (state, action) => {
                state.results = action.payload;
            })
            .addCase(updateStepElapseTime.fulfilled, (state, action) => {
                // Check if payload exists
                if (!action.payload) return;

                const { taskId, elapsedTime } = action.payload;

                const taskIndex = state.tasksStatus.findIndex(
                    (task) => task.tasksId === taskId
                );

                if (taskIndex === -1) return;

                state.tasksStatus[taskIndex].elapsedTime = elapsedTime;
            });
    }
});

export const {
    changePipelineStatus,
    updateTasksStatus,
    resetPipeline,
} = pipelineSlice.actions;