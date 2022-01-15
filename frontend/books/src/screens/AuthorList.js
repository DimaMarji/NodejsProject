import React, { useState, useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { listAuthors, deleteAuthor } from '../Actions/authorActions'

function AuthorList({ history }) {

    const dispatch = useDispatch()

    const authorList = useSelector(state => state.authorList)
    const { loading, error, authors } = authorList

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const authorDelete = useSelector(state => state.authorDelete)
    const { success } = authorDelete


    useEffect(() => {
        
            dispatch(listAuthors())
      

    }, [dispatch, history,success, userInfo])


    const deleteHandler = (id) => {

        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteAuthor(id))
        }
    }

    return (
        <div>
  
            <h1>Authors</h1>

                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                        
                                </tr>
                            </thead>

                            <tbody>
                                {authors && authors.map(author => (
                                    <tr key={author.id}>
                                        <td>{author.id}</td>
                                        <td>{author.name}</td>
                                      
                                                             <td>
                                           

                                            <Button variant='danger' className='btn-sm' onClick={() => deleteHandler(author.id)}>
                                                <i className='fas fa-trash'></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    
        </div>
    )
}

export default AuthorList
