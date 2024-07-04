import React from 'react'
import axiosClient from '../axios'

export const deleteRoom = (room_id) => {
    return axiosClient.delete(`/admin/room/${room_id}`)
}
