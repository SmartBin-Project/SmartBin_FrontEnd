import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL + '/bins';


export const getAllBins = async () => {
    const response = await axios.get(`${API_URL}/public`);
    return response.data;
}