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
    SCRAPER: "6454d086-3dab-4c8d-8be4-5919461f8816",
    VECTORIZER: "b9527b6c-961e-48fd-9110-41a8f6d7d15b",
    SORTER: "2e02a51a-dfee-42aa-bd29-9ed70b72a37e",
    CATEGORIZER: "d86c257e-e2c9-4a0f-a8a3-f8473635e187",
    SUMMARIZER: "e1bb82a5-2377-4ba3-8cf9-24b8d6329d82",
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
        {tasksId: null, step: 'Sorting', status: ProcessStep.None, elapsedTime: 0 },
        {tasksId: null, step: 'Categorizing', status: ProcessStep.None, elapsedTime: 0 },
        {tasksId: null, step: 'Summarizing', status: ProcessStep.None, elapsedTime: 0 }
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
        dispatch(resetPipeline())

        dispatch(changePipelineStatus(ProcessStep.Processing));

        const jsonBlob = new Blob([JSON.stringify(request)], {type: 'application/json'});
        const file = new File([jsonBlob], 'input.json', {type: 'application/json'});

        const formData = new FormData();
        formData.append('input_name', file);

        startGlobalTimer(dispatch);

        const response = await ApiClient.post('/flow-finder-dev', formData);

        const taskMap = new Map<string, Task>(
            response.data.tasks.map((task: Task) => [task.service_id, task])
        );

        const scraperTask = taskMap.get(SERVICE_IDS.SCRAPER);
        const vectorizerTask = taskMap.get(SERVICE_IDS.VECTORIZER);
        const sorterTask = taskMap.get(SERVICE_IDS.SORTER);
        const categorizerTask = taskMap.get(SERVICE_IDS.CATEGORIZER);
        const summarizerTask = taskMap.get(SERVICE_IDS.SUMMARIZER);

        const state: Partial<PipelineState> = {
            executionId: response.data.id,
            pipelineStatus: ProcessStep.Processing,
            tasksStatus: [
                {tasksId: null, step: 'Submitted', status: ProcessStep.Completed, elapsedTime: 0},
                {tasksId: scraperTask?.id ?? null, step: 'Scraping', status: ProcessStep.Processing, elapsedTime: 0},
                {tasksId: vectorizerTask?.id ?? null, step: 'Vectorizing', status: ProcessStep.None, elapsedTime: 0},
                {tasksId: sorterTask?.id ?? null, step: 'Sorting', status: ProcessStep.None, elapsedTime: 0 },
                {tasksId: categorizerTask?.id ?? null, step: 'Categorizing', status: ProcessStep.None, elapsedTime: 0 },
                {tasksId: summarizerTask?.id ?? null, step: 'Summarizing', status: ProcessStep.None, elapsedTime: 0 }
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
    { taskId: string; elapsedTime: number } | undefined,
    { taskId: string; elapsedTime: number },
    { state: { pipeline: PipelineState } }
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

            const tasks = responseFileName.data.tasks;

            let name = "";

            for (const task of tasks) {
                if (task.service_id != SERVICE_IDS.SUMMARIZER) continue;
                name = task.data_out;
                break;
            }

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
        resetPipeline: () => {
            stopAllTimers();
            return initialState;
        }
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