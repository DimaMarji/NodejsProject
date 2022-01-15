import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Book from '../components/Book'
// import Paginate from '../components/Paginate'
import { listBooks } from '../Actions/bookActions'


function HomeScreen({ history }) {
    

    const dispatch = useDispatch()
    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin
    const bookList = useSelector(state => state.bookList)
    const { books } = bookList
    // const { error, loading, books, page, pages } = bookList
    useEffect(() => {
        if (!userInfo) {
            history.push('/login')
        }
        dispatch(listBooks())
    }, [dispatch,history, userInfo])

    return (
        <div className='mt-5'>            
            <h1>Latest Books</h1>
                    <div>
                        <Row>
                            {books && books.map(book => (
                                <Col key={book.id} sm={12} md={6} lg={4} xl={3}>
                                    <Book book={book} />
                                </Col>
                            ))}
                        </Row>
                     
                    </div>
        </div>
    )
}

export default HomeScreen
