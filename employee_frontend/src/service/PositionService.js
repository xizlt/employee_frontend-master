import axiosInstance from "./axcio";

export class PositionService {

    getPosition() {
        return axiosInstance.get('position/')
            .then(res => res.data);
    }

    postPosition(option) {
        return axiosInstance.post('position/', {
            name: option
        })
            .then(res =>res.data);
    }

    putPosition(option) {
        return axiosInstance.put(`position/${option.id}/`, {
            name: option.name
        }).then(res => res.data);
    }

    deletePosition(option) {
        return axiosInstance.delete(`position/${option.id}/`, )
            .then(res => res.data);
    }
}
