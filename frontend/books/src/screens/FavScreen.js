import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";
import { addToFav, listMyBooks } from "../Actions/bookActions";

function FavScreen({}) {
  const dispatch = useDispatch()
  const bookListMy = useSelector(state => state.bookListMy);
  const { books } = bookListMy;
  useEffect(() => {
    dispatch(listMyBooks());
  }, [dispatch]);


  return (
      <div>
    <Row className="mt-5">
      <Col md={8}>
        <h3>Favourite Books</h3>
        <div>
          <ListGroup variant="flush" className="mt-5">
            {books && books.map((book) => (
              <ListGroup.Item key={book.id}>
                <Row>
                  <Col md={2}>
                    <Image src={book.image} alt={book.title} fluid rounded />
                  </Col>
                  <Col md={6}>
                    <Link to={`/books/${book.bookId}`}><h5>{book.title}</h5></Link>
                  </Col>

                  <Col md={3}>
                    <Form.Check
                    defaultChecked={book.isRead.data==1}
                      type="checkbox"
                      label="Is Read"
                      value={book.isRead}
                    />
                  </Col>

                  <Col md={1}>
                    <Button
                      type="button"
                      variant="light"
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )
        </div>
      </Col>

      <Col md={4}></Col>
    </Row>
    </div>
  );
}

export default FavScreen;
