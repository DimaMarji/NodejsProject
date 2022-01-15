import axios from 'axios'
import {
    BOOK_LIST_REQUEST,
    BOOK_LIST_SUCCESS,
    BOOK_LIST_FAIL,

    BOOK_LIST_MY_REQUEST,
    BOOK_LIST_MY_SUCCESS,
    BOOK_LIST_MY_FAIL,

    BOOK_DETAILS_REQUEST,
    BOOK_DETAILS_SUCCESS,
    BOOK_DETAILS_FAIL,

    BOOK_DELETE_REQUEST,
    BOOK_DELETE_SUCCESS,
    BOOK_DELETE_FAIL,

    BOOK_CREATE_REQUEST,
    BOOK_CREATE_SUCCESS,
    BOOK_CREATE_FAIL,

    BOOK_UPDATE_REQUEST,
    BOOK_UPDATE_SUCCESS,
    BOOK_UPDATE_FAIL,
    BOOK_FAV_REQUEST,
    BOOK_FAV_SUCCESS,
    BOOK_FAV_FAIL


} from '../constants/bookConstants'


export const listBooks = () => async (dispatch) => {
    try {
        dispatch({ type: BOOK_LIST_REQUEST })

        const { data } = await axios.get('/api/books')

        dispatch({
            type: BOOK_LIST_SUCCESS,
            payload: data
        })
    
    } catch (error) {
        dispatch({
            type: BOOK_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listMyBooks = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: BOOK_LIST_MY_REQUEST
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

        const { data } = await axios.get(
            `/api/users/fav`,
            config
        )

        dispatch({
            type: BOOK_LIST_MY_SUCCESS,
            payload: data
        })


    } catch (error) {
        dispatch({
            type: BOOK_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listBookDetails = (id) => async (dispatch,getState) => {
    try {
        dispatch({ type: BOOK_DETAILS_REQUEST })
        const {
            userLogin: { userInfo },
        } = getState()

        const config = {
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const { data } = await axios.get(`/api/books/${id}`,
        config)

        dispatch({
            type: BOOK_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: BOOK_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}


export const deleteBook = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: BOOK_DELETE_REQUEST
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
            `/api/books/delete/${id}/`,
            config
        )

        dispatch({
            type: BOOK_DELETE_SUCCESS,
        })


    } catch (error) {
        dispatch({
            type: BOOK_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}




export const createBook = (bookTitle,bookISBN,bookAuthor,bookImage) => async (dispatch, getState) => {
    try {
        dispatch({
            type: BOOK_CREATE_REQUEST
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
            `/api/books`,
            { 'title': bookTitle, 'ISBN': bookISBN, 'authorId': bookAuthor,'image': bookImage },
            config
        )
        dispatch({
            type: BOOK_CREATE_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: BOOK_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const addToFav = (bookId) => async (dispatch, getState) => {
    try {
        dispatch({
            type: BOOK_LIST_MY_REQUEST
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
            `/api/books/fav`,
            { 'bookId': bookId},
            config
        )
        dispatch({
            type: BOOK_LIST_MY_SUCCESS,
            payload: data,
        })


    } catch (error) {
        dispatch({
            type: BOOK_LIST_MY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}