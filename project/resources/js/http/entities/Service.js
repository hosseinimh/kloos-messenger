import { SERVICES_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Service extends Entity {
    constructor() {
        super();
    }

    async getPagination(title, page = 1) {
        return await this.handlePost(API_URLS.FETCH_SERVICES, {
            title: title,
            page: page,
        });
    }

    async getAll() {
        return await this.handlePost(API_URLS.FETCH_ALL_SERVICES);
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_SERVICE + "/" + id);
    }

    async store(parentId, title, image) {
        let data = new FormData();

        data.append("parent_id", parentId);
        data.append("title", title);
        data.append("image", image);

        return await this.handlePostFile(API_URLS.STORE_SERVICE, data);
    }

    async update(id, title, image) {
        let data = new FormData();

        data.append("title", title);
        data.append("image", image);

        return await this.handlePostFile(
            API_URLS.UPDATE_SERVICE + "/" + id,
            data
        );
    }

    async remove(id) {
        return await this.handlePost(API_URLS.REMOVE_SERVICE + "/" + id);
    }

    async upPriority(id) {
        return await this.handlePost(API_URLS.UP_PRIORITY_SERVICE + "/" + id);
    }

    async downPriority(id) {
        return await this.handlePost(API_URLS.DOWN_PRIORITY_SERVICE + "/" + id);
    }

    async setParent(id, parentId) {
        return await this.handlePost(API_URLS.SET_PARENT_SERVICE + "/" + id, {
            parent_id: parentId,
        });
    }
}
