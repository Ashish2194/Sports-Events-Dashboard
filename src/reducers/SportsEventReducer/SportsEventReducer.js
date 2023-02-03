import { initialState } from "../../App";
import { ACTION_TYPES } from "./actionTypes";

const SportsEventReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.UPDATE_EVENTS:
            return {
                ...state,
                events: action.payload.events
            };
        case ACTION_TYPES.UPDATE_FILTERED_EVENTS:
            return {
                ...state,
                filteredEvents: action.payload.filteredEvents
            };
        case ACTION_TYPES.UPDATE_SELECTED_EVENTS:
            return {
                ...state,
                selectedEvents: action.payload.selectedEvents
            };
        case ACTION_TYPES.UPDATE_SELECTED_ID_MAP:
            return {
                ...state,
                selectedIdMap: action.payload.selectedIdMap
            };
        case ACTION_TYPES.UPDATE_EVENT_COUNT:
            return {
                ...state,
                count: action.payload.count
            };
        case ACTION_TYPES.TOGGLE_LOADING:
            return {
                ...state,
                loading: action.payload.loading
            };
        case ACTION_TYPES.SHOW_TOAST:
            return {
                ...state,
                showToast: action.payload.showToast
            };
        default:
            return state;
    }
}

export default SportsEventReducer;