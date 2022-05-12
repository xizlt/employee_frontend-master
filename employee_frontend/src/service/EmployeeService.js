import axiosInstance from "./axcio";

export class EmployeeService {

    getEmployee() {
        return axiosInstance.get('employee/')
            .then(res => res.data);
    }
    getParamEmployee(param) {
        return axiosInstance.get(`employee/?search=${param}`)
            .then(res => res.data);
    }
    itemEmployee(id) {
        return axiosInstance.get(`employee/${id}/`
        ).then(res => res.data);
    }

    postEmployee(option) {
        return axiosInstance.post('employee/', option)
            .then(res =>res.data);
    }

    putEmployee(id, option) {
        return axiosInstance.put(`employee/${id}/`, option
        ).then(res => res.data);
    }

    patchEmployee(id, option) {
        return axiosInstance.patch(`employee/${id}/`, option
        ).then(res => res.data);
    }

    deleteEmployee(option) {
        return axiosInstance.delete(`employee/${option.id}/`, )
            .then(res => res.data);
    }
}
