import React, { useContext, useEffect, useState } from 'react';
import { FadeIn, Pagination } from '../Components';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faComments, faShareAlt, faUser, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import placeholder300 from '../assets/placeholder300.png';
import spinner from '../assets/spinner.gif';
import "../styles/ComponentCSS.css";
import axios from 'axios';

const Home = () => {
  const [categories, setCategories] = useState([
    { title: 'Test', last_update_title: 'the big bad wolf', last_update_username: 'test', last_update_date: new Date() }
  ]);

  const ListItem = ({ category }) => {
    return (
      <div className="list-group-item bg-gray">
        <div className="row">
          <div className="col-sm d-flex">
            <h3 className="m-0 justify-content-center align-self-center">
              <Link to={`/forum/${category.title}`} className="text-decoration-none">
                <FontAwesomeIcon icon={faComments} /><span> </span>
                { category.title }
              </Link>
            </h3>
          </div>
          <div className="col-sm">
            <h5 className="text-right">
              <Link to={`/profile/${category.last_update_username}`} className="mb-0">
                { category.last_update_username }
              </Link>
            </h5>  
            <p className="text-right mb-0">
              { category.last_update_date.toLocaleString() }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container align-center">
      <h1 className="text-center">Forum</h1>
      
      <div className="card">
        <h1 className="mt-4 mx-5">Sections</h1>
        <div className="list-group mx-5 mb-5">
          <div className="row no-gutters">
            <div className="col-sm">
              <div className="list-group-item disabled border-0 text-secondary">Title</div>
            </div>
            <div className="col-sm">
              <div className="list-group-item disabled border-0 text-secondary text-right">Last Updated By</div>
            </div>
          </div>
          <div>
            {categories.map((item, index) => <ListItem key={index} category={item} />)}
          </div>
        </div>
      </div>
    </div>
  )
}

const Category = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [threads, setThreads] = useState([
    { id: '532', title: 'Test', last_update_title: 'the big bad wolf', last_update_username: 'test', last_update_date: new Date() }
  ]);

  const titleHandler = (event) => setTitle(event.target.value);
  const bodyHandler = (event) => setBody(event.target.value);

  const generateThread = (event) => {
    event.preventDefault();

    console.log('Generating Thread...');
  }

  useEffect(() => {

  }, []);

  const ListItem = ({ thread }) => {
    return (
      <div className="list-group-item bg-gray">
        <div className="row">
          <div className="col-sm">
            <h5>
              <Link to={`/forum/${thread.title}/${thread.id}`} className="mb-0">
                { thread.title }
              </Link>
            </h5>
            <p className="mb-0"> Last Updated By: <span> </span>  
              <Link to={`/forum/${thread.last_update_title}`} className="mb-0">
                { thread.last_update_title }
              </Link>
            </p>
          </div>
          <div className="col-sm">
            <h5 className="text-right">
              <Link to={`/profile/${thread.last_update_username}`} className="mb-0">
                { thread.last_update_username }
              </Link>
            </h5>  
            <p className="text-right mb-0">
              { thread.last_update_date.toLocaleString() }
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container align-center">
      <h1 className="text-center">Forum</h1>
      
      <div className="card">
        <h1 className="mt-4 mx-5">Threads</h1>
        <div className="list-group mx-5 mb-5">
          <div className="row no-gutters">
            <div className="col-sm">
              <div className="list-group-item disabled border-0 text-secondary">Title</div>
            </div>
            <div className="col-sm">
              <div className="list-group-item disabled border-0 text-secondary text-right">Last Updated By</div>
            </div>
          </div>
          <div>
            {threads.map((item, index) => <ListItem key={index} thread={item} />)}
          </div>
        </div>
      </div>

      { isAuthenticated ?
        <div className="card my-4">
          <form className="my-5 mx-5" onSubmit={generateThread}>
            <div className="form-group">
              <label htmlFor="title">Thread Post</label>
              <input className="form-control my-2" placeholder="Title" autoComplete="off" value={title} onChange={titleHandler} />
              <textarea className="form-control my-2" placeholder="Post Body" autoComplete="off" value={body} onChange={bodyHandler}></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Generate Thread</button>
          </form>
        </div>
        :
        null
      }
    </div>
  )
}

const Thread = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const { category, thread } = useParams();

  // Pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const dateFormat = { year: 'numeric', month: 'long', day: 'numeric' };
  const [posts, setPosts] = useState([
    {'tets': '3'}, {'t3234': '5'},
    {'tets': '3'}, {'t3234': '5'},
    {'tets': '3'}, {'t3234': '5'},
    {'tets': '3'}, {'t3234': '5'},
    {'tets': '3'}, {'t3234': '5'},
    {'tets': '3'}, {'t3234': '5'}
  ]);

  const Post = ({ item }) => {
    return (
      <div className="card my-2">
        <div className="row no-gutters d-flex">
          <div className="col-2 py-3 bg-secondary text-dark" align="center">
            <img className="img-fluid px-2" src={placeholder300} alt="" />
            <h5 className="pt-2">Username</h5>
            <span>Title</span>
          </div>
          <div className="col-10 bg-primary">
            <div id="header" className="mt-2 mx-2">
              <div className="row">  
                <span className="col">{new Date().toLocaleString(undefined, dateFormat)}</span>
                <div className="col" align="right">
                  <FontAwesomeIcon icon={faShareAlt} size="1x" />
                  <span className="mx-2">{`#${item.index}`}</span>
                </div>
              </div>
              <hr className="m-0"/>
            </div>
            <div id="body">
              <p className="m-2">
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                  dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                  anim id est laborum."
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const createPostHandler = () => {
    axios({
      method: 'post',
      url: `/forum/${category}/${thread}`,
      data: JSON.stringify({ category, thread }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then((res) => {
      console.log(res.data);
    }, (err) => {
      console.log(err);
    });
  }

  return (
    <div className="container align-center">
      <h1>Thread Title</h1>
      <span>
        <Link to="/forum">Forum</Link>
        <FontAwesomeIcon className="mx-1" icon={faChevronRight}/>
        <Link to={`/forum/${category}`}>{category}</Link>
        <FontAwesomeIcon className="mx-1" icon={faChevronRight}/>
        <span className="text-white">{thread}</span>
        <FontAwesomeIcon className="mx-1" icon={faChevronRight}/>
        <br />
      </span>
      <hr />
      <span>
        <FontAwesomeIcon icon={faUser} size="1x"/> {currentPosts[0].tets} &#183;   
        <FontAwesomeIcon className="mx-2" icon={faClock} size="1x"/>{`${new Date().toLocaleString(undefined, dateFormat)}`}
      </span>
      <nav className="row p-0">
        <div className="col">
          <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
        </div>
        <div className="col" align="right">
          <Link className="btn btn-primary mx-2" to={`/forum/${category}`}>Go Back</Link>
          <button className="btn btn-primary" onClick={createPostHandler}>Generate Random Post</button>
        </div>
      </nav>
      <div>
        {
          !loading ?
            posts.length > 0 ?
            currentPosts.map((item, index) => <Post key={index} item={item} />)
            :
            <h1 className="card text-center p-5">No Results Found</h1>
          :
          <img className="card col-sm-2 offset-5 p-5" src={spinner} alt="" />
        }
      </div>
      <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
      <hr />
      <span>
        <Link to="/forum">Forum</Link>
        <FontAwesomeIcon className="mx-1" icon={faChevronRight}/>
        <Link to={`/forum/${category}`}>{category}</Link>
        <FontAwesomeIcon className="mx-1" icon={faChevronRight}/>
        <span className="text-white">{thread}</span>
        <FontAwesomeIcon className="mx-1" icon={faChevronRight}/>
        <br />
      </span>
    </div>
  )
}

export default { Home, Category, Thread };