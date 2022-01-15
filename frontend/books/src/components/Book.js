import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Book({ book }) {
    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/books/${book.id}`}>
                <Card.Img src={book.image} />
            </Link>

            <Card.Body>
                <Link to={`/books/${book.id}`}>
                    <Card.Title as="div">
                        <strong>{book.title}</strong>
                    </Card.Title>
                </Link>



            </Card.Body>
        </Card>
    )
}

export default Book
