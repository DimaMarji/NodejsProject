import axios from 'axios'
import {
    AUTHOR_LIST_REQUEST,
    AUTHOR_LIST_SUCCESS,
    AUTHOR_LIST_FAIL,

    AUTHOR_DELETE_REQUEST,
    AUTHOR_DELETE_SUCCESS,
    AUTHOR_DELETE_FAIL,

    AUTHOR_CREATE_REQUEST,
    AUTHOR_CREATE_SUCCESS,
    AUTHOR_CREATE_FAIL,
    AUTHOR_CREATE_RESET,

    AUTHOR_UPDATE_REQUEST,
    AUTHOR_UPDATE_SUCCESS,
    AUTHOR_UPDATE_FAIL,
    AUTHOR_UPDATE_RESET,
} from '../constants/authorConstants'

export const addAuthor = (name) => async (dispatch,getState) => {
    try {
        dispatch({
            type: AUTHOR_CREATE_REQUEST
        })
        const {
            userLogin: { userInfo },
        } = getState()
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.post(
            '/api/author/',
            { 'name': name},
            config
        )

        dispatch({
            type: AUTHOR_CREATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: AUTHOR_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listAuthors = () => async (dispatch,getState) => {
    try {
        dispatch({ type: AUTHOR_LIST_REQUEST })
        const {
            userLogin: { userInfo },
        } = getState()
        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }
        const { data } = await axios.get('/api/author',config)

        dispatch({
            type: AUTHOR_LIST_SUCCESS,
            payload: data
        })
    
    } catch (error) {
        dispatch({
            type: AUTHOR_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteAuthor = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: AUTHOR_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.delete(
            `/api/author/${id}`,
            config
        )

        dispatch({
            type: AUTHOR_DELETE_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: AUTHOR_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


