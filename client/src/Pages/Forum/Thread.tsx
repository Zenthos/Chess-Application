import React, { useState } from 'react';
import { Pagination } from 'src/Components';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faShareAlt, faUser, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import placeholder300 from 'src/Assets/placeholder300.png';
import spinner from 'src/Assets/spinner.gif';
import 'src/Styles/ComponentCSS.css';
import axios from 'axios';

export const Thread = () => {
  const { category, thread } = useParams();

  // Pagination
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [posts, setPosts] = useState([
    { 'tets': '3' }, { 't3234': '5' },
    { 'tets': '3' }, { 't3234': '5' },
    { 'tets': '3' }, { 't3234': '5' },
    { 'tets': '3' }, { 't3234': '5' },
    { 'tets': '3' }, { 't3234': '5' },
    { 'tets': '3' }, { 't3234': '5' }
  ]);

  const Post = ({ item }: any) => {
    return (
      <div className="card my-2">
        <div className="row no-gutters d-flex">
          <div className="col-2 py-3 bg-secondary text-dark">
            <img className="img-fluid px-2" src={placeholder300} alt="" />
            <h5 className="pt-2">Username</h5>
            <span>Title</span>
          </div>
          <div className="col-10 bg-primary">
            <div id="header" className="mt-2 mx-2">
              <div className="row">
                <span className="col">{new Date().toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <div className="col">
                  <FontAwesomeIcon icon={faShareAlt} size="1x" />
                  <span className="mx-2">{`#${item.index}`}</span>
                </div>
              </div>
              <hr className="m-0"/>
            </div>
            <div id="body">
              <p className="m-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                  dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                  anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
  };

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
        <FontAwesomeIcon icon={faUser} size="1x"/> Test &#183;
        <FontAwesomeIcon className="mx-2" icon={faClock} size="1x"/>{`${new Date().toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`}
      </span>
      <nav className="row p-0">
        <div className="col">
          <Pagination currentPage={currentPage} postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
        </div>
        <div className="col">
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
  );
};
