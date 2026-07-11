import axios from "axios";

const api=axios.create({
    baseURL:import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

api.interceptors.request.use((config)=>{
    try{
        const userInfo=JSON.parse(localStorage.getItem("userInfo"));
        if(userInfo?.token){
            config.headers.Authorization=`Bearer ${userInfo.token}`;
        }
    }catch{
        localStorage.removeItem("userInfo");
    }
    return config;
});

api.interceptors.response.use(
    (response)=>response,
    (error)=>{
        if(error.response?.status===401){
            localStorage.removeItem("userInfo");
        }
        return Promise.reject(error);
    }
);

export default api;
