import axiosInstance from "./axcio";

export class AccountTypeService {

    getAccountType() {
        return axiosInstance.get('account_type/')
            .then(res => res.data);
    }

    postAccountType(option) {
        return axiosInstance.post('account_type/', {
            name: option
        })
            .then(res =>res.data);
    }

    putAccountType(option) {
        return axiosInstance.put(`account_type/${option.id}/`, {
            name: option.name
        }).then(res => res.data);
    }

    deleteAccountType(option) {
        return axiosInstance.delete(`account_type/${option.id}/`, )
            .then(res => res.data);
    }
}
