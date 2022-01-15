import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navbar, Nav, Container, Row, NavDropdown } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { logout } from '../Actions/userActions'

function Header() {

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const dispatch = useDispatch()

    const logoutHandler = () => {
        dispatch(logout())
    }

    return (
        <header>
            <Navbar className='py-2 fixed-top' bg="light" variant="light" expand="lg" collapseOnSelect >
                <Container>
                    <LinkContainer to='/'>
                        <Navbar.Brand>Library Management </Navbar.Brand>
                    </LinkContainer>

                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                       
                        <Nav className="ml-auto">

                           

                            {userInfo ? (
                                <NavDropdown title={userInfo.userName} id='username'>
                                    <LinkContainer to='/profile'>
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/myfav'>
                                        <NavDropdown.Item>Favourite books</NavDropdown.Item>
                                    </LinkContainer>


                                    <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>

                                </NavDropdown>
                            ) : (
                                    <LinkContainer to='/login'>
                                        <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                                    </LinkContainer>
                                )}
                                 {userInfo && userInfo.roleId==1 && (
                                <NavDropdown title='Admin' id='adminmenue'>
                                    <LinkContainer to='/authors/add'>
                                        <NavDropdown.Item>Add Author</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/authorlist'>
                                        <NavDropdown.Item>Author List</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/booksadd'>
                                        <NavDropdown.Item>Add Book</NavDropdown.Item>
                                    </LinkContainer>

                                </NavDropdown>
                            )}


                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    )
}

export default Header
