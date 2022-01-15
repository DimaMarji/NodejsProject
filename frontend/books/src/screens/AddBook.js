import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { createBook } from "../Actions/bookActions";
import { listAuthors } from "../Actions/authorActions";

function AddBook({ location, history }) {
  const [bookTitle, setTitle] = useState("");
  const [bookISBN, setISBN] = useState("");
  const [bookAuthor, setAuthor] = useState("");
  const [bookImage, setImage] = useState("");
  const authorList = useSelector(state => state.authorList)
  const { authors } = authorList
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(listAuthors())
}, [dispatch])

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(createBook(bookTitle, bookISBN, bookAuthor, bookImage));
  };
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    console.log(file)
  }

  return (
    <FormContainer>
      <h1 className="mt-5"> Add New Book</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Enter Book Title</Form.Label>
          <Form.Control
            required
            type="name"
            placeholder="Enter name"
            value={bookTitle}
            onChange={(e) => setTitle(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="name">
          <Form.Label>Enter Book ISBN</Form.Label>
          <Form.Control
            required
            type="name"
            placeholder="Enter ISBN"
            value={bookISBN}
            onChange={(e) => setISBN(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Label>Enter Book author</Form.Label>
        <Form.Control
          as="select"
          value={bookAuthor}
          onChange={(e) =>
            dispatch()
          }
        >
          { [...Array(authors).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </Form.Control>          
          <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Image</Form.Label>
        </Form.Group>

        <Button type="submit" variant="primary">
          Add Author
        </Button>
      </Form>
    </FormContainer>
  );
}

export default AddBook;
