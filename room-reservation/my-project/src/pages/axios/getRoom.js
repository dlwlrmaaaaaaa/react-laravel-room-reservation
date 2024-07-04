import axiosClient from "../../axios";

const getRooms = () => {
    return axiosClient.get('/rooms')
}
export default getRooms;