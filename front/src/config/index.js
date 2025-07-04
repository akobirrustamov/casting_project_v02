import axios from "axios";
export let baseUrl;
<<<<<<< HEAD
// baseUrl ="http://localhost:8080";
=======
// baseUrl ="http://localhost:8082";
>>>>>>> 26e79044c8f6dca1cf9b5a050814d9d2c6763e9c
// baseUrl ="https://qabul-new.buxpxti.uz";
baseUrl ="";
export default function (url, method, data, param) {
    let token = localStorage.getItem("access_token");
    // console.log(param)
    return axios({
        url:  baseUrl+ url,
        method: method,
        data: data,
        headers: {
            "Authorization": token
        },
        params: param
    }).then((res) => {
        if (res.data) {
            // console.log(res.data)
            return {
                error: false,
                data: res.data
            };
        }
    }).catch((err) => {
        if (err.response.status === 401) {
            if (localStorage.getItem("refresh_token") === null) {
                return {
                    error: true,
                    data: err.response.status
                };
            }
        }
    });
}
