const serverConfig = require("../../../server-config.json");
const { baseUrl } = serverConfig;

export const SERVER_URL = `${baseUrl}/api`;

export const DASHBOARD_API_URLS = {
    FETCH_REVIEW: `${SERVER_URL}/dashboard/review`,
};

export const USERS_API_URLS = {
    LOGIN: `${SERVER_URL}/users/login`,
    LOGOUT: `${SERVER_URL}/users/logout`,
    FETCH_USER: `${SERVER_URL}/users/show`,
    FETCH_USERS: `${SERVER_URL}/users`,
    UPDATE_USER: `${SERVER_URL}/users/update`,
    CHANGE_PASSWORD: `${SERVER_URL}/users/change_password`,
};

export const POSITIONS_API_URLS = {
    FETCH_POSITION: `${SERVER_URL}/positions/show`,
    FETCH_POSITIONS: `${SERVER_URL}/positions`,
    FETCH_ALL_POSITIONS: `${SERVER_URL}/positions/all`,
    STORE_POSITION: `${SERVER_URL}/positions/store`,
    UPDATE_POSITION: `${SERVER_URL}/positions/update`,
    REMOVE_POSITION: `${SERVER_URL}/positions/remove`,
    UP_PRIORITY_POSITION: `${SERVER_URL}/positions/up_priority`,
    DOWN_PRIORITY_POSITION: `${SERVER_URL}/positions/down_priority`,
    SET_PARENT_POSITION: `${SERVER_URL}/positions/set_parent`,
};

export const SERVICES_API_URLS = {
    FETCH_SERVICE: `${SERVER_URL}/services/show`,
    FETCH_SERVICES: `${SERVER_URL}/services`,
    FETCH_ALL_SERVICES: `${SERVER_URL}/services/all`,
    STORE_SERVICE: `${SERVER_URL}/services/store`,
    UPDATE_SERVICE: `${SERVER_URL}/services/update`,
    REMOVE_SERVICE: `${SERVER_URL}/services/remove`,
    UP_PRIORITY_SERVICE: `${SERVER_URL}/services/up_priority`,
    DOWN_PRIORITY_SERVICE: `${SERVER_URL}/services/down_priority`,
    SET_PARENT_SERVICE: `${SERVER_URL}/services/set_parent`,
};

export const POSTS_API_URLS = {
    FETCH_POST: `${SERVER_URL}/posts/show`,
    FETCH_POSTS: `${SERVER_URL}/posts`,
    STORE_POST: `${SERVER_URL}/posts/store`,
    UPDATE_POST: `${SERVER_URL}/posts/update`,
    REMOVE_POST: `${SERVER_URL}/posts/remove`,
};
