import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faComments } from '@fortawesome/free-solid-svg-icons';
import "../styles/ComponentCSS.css";

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
            {categories.map((item, index) => <ListItem category={item} key={index} />)}
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
            {threads.map((item, index) => <ListItem thread={item} key={index} />)}
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
  let { user, isAuthenticated } = useContext(AuthContext);
  let { category, thread } = useParams();

  return (
    <div className="container align-center">
      <h1>Forum Board Page - {category} - {thread}</h1>
    </div>
  )
}

export default { Home, Category, Thread };