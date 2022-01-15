import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Button,
  Card,
  Form,
} from "react-bootstrap";

import { listBookDetails,addToFav,listMyBooks } from "../Actions/bookActions";


function BookScreen({ match, history }) {
  const dispatch = useDispatch();
  const bookDetails = useSelector((state) => state.bookDetails);
  const { loading, error, book } = bookDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(listBookDetails(match.params.id));
  }, [dispatch, match]);

  const addToFavHandler = () => {
    dispatch(addToFav(match.params.id));
    
    history.push(`/myfav`);
   
  };
  return (
    <div className='mt-5'>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      <div>
        <Row>
          <Col md={5}>
            <Image src={book.image} alt={book.title} fluid />
          </Col>

          <Col md={5}>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>{book.title}</h2>
              </ListGroup.Item>

              <ListGroup.Item><strong>ISBN</strong> : {book.ISBN}</ListGroup.Item>

              <ListGroup.Item><strong> Author : </strong>  {book.author}</ListGroup.Item>
            </ListGroup>
            <div className='mt-5'>
            <Button
                    onClick={addToFavHandler}
                    className="btn-block"
                    type="button"
                  >
                    Add to Favorite
                  </Button>
                  </div>
          </Col>

          <Col md={5}>
            <Card>
              <ListGroup variant="flush">
                               <ListGroup.Item>
                 
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default BookScreen;
