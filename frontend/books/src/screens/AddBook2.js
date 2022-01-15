import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {createBook} from '../Actions/bookActions'

function AddBook() {

    const [bookTitle, setTitle] = useState('')
    const [bookISBN, setISBN] = useState('')
    const [bookAuthor, setAuthor] = useState('')
    const [bookImage, setImage] = useState('')
    
    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()

            dispatch(createBook(bookTitle,bookISBN,bookAuthor,bookImage))
        }


    return (
        <FormContainer >
            <h1 className='mt-5'>Add Book</h1>
            <Form onSubmit={submitHandler}>

                <Form.Group controlId='title'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Enter book title'
                        value={bookTitle}
                        onChange={(e) => setTitle(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId='title'>
                    <Form.Label>ISBN</Form.Label>
                    <Form.Control
                        required
                        type='name'
                        placeholder='Enter book ISBN'
                        value={bookISBN}
                        onChange={(e) => setISBN(e.target.value)}
                    >
                    </Form.Control>
                </Form.Group>
                {/* <Form.Control
                                                                as="select"
                                                                value={qty}
                                                                onChange={(e) => setQty(e.target.value)}
                                                            > */}
                <Form.Group controlId='image'>
                                <Form.Label>Image</Form.Label>
                             <Form.File
                                    id='image-file'
                                    label='Choose File'
                                    custom
                                    onChange={(e) => setImage(e.target.files[0])}
                                >

                                </Form.File>

                            </Form.Group>

                <Button type='submit' variant='primary'>
                    ADD
                </Button>

            </Form>

          
        </FormContainer >
    )
}

export default AddBook
