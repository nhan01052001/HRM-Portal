import ListTask from './ListTask';
// quan ly task task
export const TaskIsRuning = {
    listTaskRunning: {}
};

export const resetTaskRunning = () => {
    TaskIsRuning.listTaskRunning = {};
};

export const startTask = action => {
    if (action.keyTask) {
        if (
            ListTask[action.keyTask] &&
            typeof ListTask[action.keyTask] === 'function' &&
            !TaskIsRuning.listTaskRunning[action.keyTask]
        ) {
            TaskIsRuning.listTaskRunning[action.keyTask] = true;
            ListTask[action.keyTask](action);
        }
    }
    // switch (action.keyTask) {
    //     case EnumTask.Workday_GetDataWorkdayPortalNewApp:
    //         ListTask[EnumTask.Workday_GetDataWorkdayPortalNewApp](action)
    //         break;
    //     default:
    //         break;
    // }
};
