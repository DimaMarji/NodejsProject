import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { addAuthor } from '../Actions/authorActions'
function AddAuthor({history}) {
    const [name, setName] = useState('')
    const dispatch = useDispatch()
    const submitHandler = (e) => {
        e.preventDefault()
            dispatch(addAuthor(name))
            history.push('/authorlist')
        }

    return (
        <FormContainer >
        <h1 className='mt-5'> add New Author</h1>
        <Form onSubmit={submitHandler}>

            <Form.Group controlId='name'>
                <Form.Label>Enter Author Name</Form.Label>
                <Form.Control
                    required
                    type='name'
                    placeholder='Enter name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                >
                </Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary'>
                Add Author
            </Button>

        </Form>
    </FormContainer >
    )
}

export default AddAuthor
