
import axiosInstance from "./axcio";

export class SpecialService {

    getSpecial() {
        return axiosInstance.get('special/')
            .then(res => res.data);
    }

    patchSpecial(id, option) {
        return axiosInstance.patch( `special/${id}/`, option
        ).then(res => res.data);
    }
    postSpecial(option) {
        return axiosInstance.post('special/', option)
            .then(res =>res.data);
    }

    putSpecial(id, option) {
        return axiosInstance.put(`special/${id}/`, option).then(res => res.data);
    }

    deleteSpecial(id) {
        return axiosInstance.delete(`special/${id}/`, )
            .then(res => res.data);
    }
}
