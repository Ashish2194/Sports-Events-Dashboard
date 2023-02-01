const CONSTANTS = {
    API_URL: "https://run.mocky.io/v3/2744c231-8991-4ae8-bc45-1f645437585a",
    BUTTON_TYPES: {
        SELECT: "Select",
        REMOVE: "Remove"
    },
    TOAST_TYPE : {
        SUCCESS: "success",
        ERROR: "error"
    },
    TOAST_ERROR_MESSAGE: "Can't select more than 3 events",
    SPORTS_CATEGORY: {
        SWIMMING: {
            NAME: "Swimming",
            ABBREVIATION: "S"
        },
        ATHLETICS: {
            NAME: "Athletics",
            ABBREVIATION: "A"
        },
        BOXING: {
            NAME: "Boxing",
            ABBREVIATION: "B"
        }
    },
    SEARCH_PLACEHOLDER: "Search by event names...",
    HEADER: {
        ALL_EVENTS: "All Events",
        SELECTED_EVENTS: "Selected Events"
    },
    MAX_SELECTION_CAP: 3,
    FALLBACK_UI_MESSAGE: "Something really went wrong and we are on it...."
};

export default CONSTANTS;