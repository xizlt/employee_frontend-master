import axiosInstance from "./axcio";


export class StatusService {

    getStatus() {
        return axiosInstance.get('status/')
            .then(res => res.data);
    }

    postStatus(option) {
        return axiosInstance.post('status/', {
            name: option
        })
            .then(res =>res.data);
    }

    putStatus(option) {
        return axiosInstance.put(`status/${option.id}/`, {
            name: option.name
        }).then(res => res.data);
    }

    deleteStatus(option) {
        return axiosInstance.delete(`status/${option.id}/`, )
            .then(res => res.data);
    }
}
