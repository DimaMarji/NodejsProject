import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import {
    userLoginReducer,
    userRegisterReducer,
    userDetailsReducer,
    userUpdateProfileReducer,
    userListReducer,
    userDeleteReducer,
} from './reducers/userReducer'
import {
    bookListReducer,
    bookListMyReducer,
    bookDetailsReducer,
    bookDeleteReducer,
    bookCreateReducer   
    
} from './reducers/bookReducers'
import {
  authorAddReducer,
  authorListReducer,
  authorDeleteReducer
} from './reducers/authorReducers'

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,

    authorAdd:authorAddReducer,
    authorList:authorListReducer,
    authorList: authorListReducer,
    authorDelete:authorDeleteReducer,

    bookList: bookListReducer,
    bookListMy:bookListMyReducer,
    bookDetails: bookDetailsReducer,
    bookDelete: bookDeleteReducer,
    bookCreate: bookCreateReducer,
   
})

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null


const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(applyMiddleware(...middleware)))

export default store