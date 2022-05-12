import axiosInstance from "./axcio";

export class ActionService {

    getPassword(len_pass, rule) {
        let options = {
            len: len_pass,
            ti: false,
            tl: false,
            tp: false
        }
        rule.map(item => options[item]=true)

        return axiosInstance.get('create_password',
            {params: options}
        )
            .then(res => res.data);
    }

    getCSVEmail(option) {
        return axiosInstance.get(`get_csv/temp/${option}`, {responseType: 'blob'})
    }

}
