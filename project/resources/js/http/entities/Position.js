import { POSITIONS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Position extends Entity {
    constructor() {
        super();
    }

    async getPagination(title, _pn = 1, _pi = 10) {
        return await this.handlePost(API_URLS.FETCH_POSITIONS, {
            title: title,
            _pn,
            _pi,
        });
    }

    async getAll(parentId = 0) {
        return await this.handlePost(API_URLS.FETCH_ALL_POSITIONS, {
            parent_id: parentId,
        });
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_POSITION + "/" + id);
    }

    async store(parentId, title) {
        return await this.handlePost(API_URLS.STORE_POSITION, {
            parent_id: parentId,
            title: title,
        });
    }

    async update(id, title) {
        return await this.handlePost(API_URLS.UPDATE_POSITION + "/" + id, {
            title: title,
        });
    }

    async remove(id) {
        return await this.handlePost(API_URLS.REMOVE_POSITION + "/" + id);
    }

    async upPriority(id) {
        return await this.handlePost(API_URLS.UP_PRIORITY_POSITION + "/" + id);
    }

    async downPriority(id) {
        return await this.handlePost(
            API_URLS.DOWN_PRIORITY_POSITION + "/" + id
        );
    }

    async setParent(id, parentId) {
        return await this.handlePost(API_URLS.SET_PARENT_POSITION + "/" + id, {
            parent_id: parentId,
        });
    }
}
