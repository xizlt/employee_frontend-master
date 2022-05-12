import axiosInstance from "./axcio";


export class FilialService {

    getFilial() {
        return axiosInstance.get( 'filial/')
            .then(res => res.data);
    }

    postFilial(option) {
        return axiosInstance.post('filial/', {
            name: option
        })
            .then(res =>res.data);
    }

    putFilial(option) {
        return axiosInstance.put(`filial/${option.id}/`, {
            name: option.name
        }).then(res => res.data);
    }

    deleteFilial(option) {
        return axiosInstance.delete(`filial/${option.id}/`, )
            .then(res => res.data);
    }
}
