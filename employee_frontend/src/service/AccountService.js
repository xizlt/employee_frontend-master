import axiosInstance from "./axcio";

export class AccountService {

    getAccount() {
        return axiosInstance.get('account/')
            .then(res => res.data);
    }

    postAccount(option) {
        return axiosInstance.post('account/', option)
            .then(res =>res.data);
    }

    putAccount(id, option) {
        return axiosInstance.put(`account/${id}/`, option)
            .then(res => res.data);
    }

    deleteAccount(id) {
        return axiosInstance.delete(`account/${id}/`)
            .then(res => res.data);
    }
}
