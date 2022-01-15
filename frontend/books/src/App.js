import Header from './components/Header'
import UserListScreen from './screens/UserList'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import ProfileScreen from './screens/ProfileScreen'
import AddAuthor from './screens/AddAuthor'
import AuthorList from './screens/AuthorList'
// import Specs from './screens/Specs'
import { Container } from 'react-bootstrap'
import { HashRouter as Router, Route } from 'react-router-dom'
import AddBook from './screens/AddBook'
import BookScreen from './screens/BookScreen'
import FavScreen from './screens/FavScreen'

function App() {
  return (
    <Router >
     <Header/>
     <main className="py-3">
      
      <Container>
      <Route path='/' component={HomeScreen} exact />
      <Route path='/userlist' component={UserListScreen} />
      <Route path='/authorlist' component={AuthorList} />
      <Route path='/login' component={LoginScreen} />  
      <Route path='/register' component={RegisterScreen} />
      <Route path='/profile' component={ProfileScreen} />
      <Route path='/addbook' component={AddBook} />
      <Route path='/authors/add' component={AddAuthor} />
      <Route path='/books/:id' component={BookScreen} />
      <Route path='/myfav' component={FavScreen} />
      </Container>
      </main>
    </Router>
  );
}

export default App;
