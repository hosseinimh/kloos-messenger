import { POSTS_API_URLS as API_URLS } from "../../constants";
import Entity from "./Entity";

export class Post extends Entity {
    constructor() {
        super();
    }

    async getPagination(serviceId, page = 1) {
        return await this.handlePost(API_URLS.FETCH_POSTS + "/" + serviceId, {
            page: page,
        });
    }

    async get(id) {
        return await this.handlePost(API_URLS.FETCH_POST + "/" + id);
    }

    async store(serviceId, title, summary, body, thumbnail, image) {
        let data = new FormData();

        data.append("title", title);
        data.append("summary", summary);
        data.append("body", body);
        data.append("thumbnail", thumbnail);
        data.append("image", image);

        return await this.handlePostFile(
            API_URLS.STORE_POST + "/" + serviceId,
            data
        );
    }

    async update(id, title, summary, body, thumbnail, image) {
        let data = new FormData();

        data.append("title", title);
        data.append("summary", summary);
        data.append("body", body);
        data.append("thumbnail", thumbnail);
        data.append("image", image);

        return await this.handlePostFile(API_URLS.UPDATE_POST + "/" + id, data);
    }

    async remove(id) {
        return await this.handlePost(API_URLS.REMOVE_POST + "/" + id);
    }
}
