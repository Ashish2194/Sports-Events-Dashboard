export const LOCATORS = {
    LOADER: '[data-testid="loader"]',
    ALL_EVENTS_CONTAINER: 'div.all__events__container > div.selected_events__list__container',
    EMPTY_RESULTS_CONTAINER: 'div.selected__events__container > div.empty-results',
    EVENTS_TILE_CONTAINER: '.events_tile_container',
    SEARCH_BAR: '[data-testid="searchBar"]',
    CATEGORY_CONTAINER: 'div.all__events__container > div.selected_events__list__container > div.events_category_container>div',
    EVENT_BUTTON: '[data-testid="eventButton-1"]',
    EVENT_BUTTON_SWIMMING: '[data-testid="eventButton-3"]',
    EVENT_BUTTON_ATHLETICS: '[data-testid="eventButton-5"]',
    EVENT_BUTTON_BOXING: '[data-testid="eventButton-8"]',
    SELECTED_RESULTS_CONTAINER: 'div.selected__events__container > div.selected_events__list__container',
    EVENT_CONTAINER_DISABLED: 'div.event__container.disabled',
    // Component tests locators
    EVENT_CARD_ABBREVIATION: '.event__type',
    EVENT_CARD_TITLE: '.event__details__title',
    EVENT_CARD_CATEGORY: '.event__details__category',
    EVENT_CARD_TIME: '[data-testid="eventDetailsTime-1"]',
    EMPTY_RESULTS: 'div.empty-results',
    TOAST: '[data-testid="toast"]'
};