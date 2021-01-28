import React, { useEffect, useState } from 'react';
import "../styles/ComponentCSS.css";
import axios from 'axios';

const generateRows = (arr, itemsPerRow) => {
  const rows = [...Array( Math.ceil(arr.length / itemsPerRow) )];

  // chunk the products into the array of rows
  const productRows = rows.map( (row, idx) => arr.slice(idx * itemsPerRow, idx * itemsPerRow + itemsPerRow) );

  return productRows;
}

const Item = ({ product }) => {
  return (
    <div key={product.id} className="card col-sm-4">
      <h3>{ product.title }</h3>
      <p>{ product.body }</p>
      <p>${ product.userId }</p>
      <p className="mt-auto">
        <button className="btn-sm btn-secondary">Add to Cart</button>
      </p>
    </div>
  )
}

const NumberOnlyInput = ({ placeholder, value, setValue }) => {
  return (
    <input 
    value={value} 
    className="form-control-sm col-sm-6 m-0" 
    placeholder={placeholder} 
    onChange={event => setValue(event.target.value.replace(/\D/,''))}
    />
  )
}

const Pagination = ({ currentPage, postsPerPage, totalPosts, paginate }) => {
  const [pageNumbers, setPageNumbers] = useState([]);

  useEffect(() => {
    let nums = [];
    for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
      nums.push(i);
    }

    setPageNumbers(nums.filter((value) => value < currentPage + 3 && value > currentPage - 3));
  }, [currentPage, totalPosts, postsPerPage]);

  const clickHandler = function(event, number) {
    event.preventDefault();
    paginate(number);
  }

  return (
    <div className="my-2">
      <ul className='pagination justify-content-center'>
        <li className={`page-item ${currentPage === 1 ? 'disabled':''}`}>
          <button onClick={() => paginate(1)} className='page-link'>&#x00AB;</button>
        </li>
        <li className={`page-item ${currentPage === 1 ? 'disabled':''}`}>
          <button onClick={() => paginate(currentPage - 1)} className='page-link'>&#x2039;</button>
        </li>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active':''}`}>
            <button onClick={(event) => clickHandler(event, number)} className='page-link'>
              {number}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === Math.ceil(totalPosts / postsPerPage) ? 'disabled':''}`}>
          <button onClick={() => paginate(currentPage + 1)} className='page-link'>&#x203A;</button>
        </li>
        <li className={`page-item ${currentPage === Math.ceil(totalPosts / postsPerPage) ? 'disabled':''}`}>
          <button onClick={() => paginate(Math.ceil(totalPosts / postsPerPage))} className='page-link'>&#x00BB;</button>
        </li>
      </ul>
    </div>
  );
};

const Shop = () => {
  // Basic
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(6);

  // Filters
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  useEffect(() => fetchPosts(), []);

  const fetchPosts = async function() {
    setLoading(true);
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    setPosts(res.data);
    setLoading(false);
  }

  const onFilterPress = function(event) {
    event.preventDefault();

    fetchPosts()
    .then(() => {
      let filteredPosts = [...posts];
  
      if (min || max) {
        if (min)
          filteredPosts = filteredPosts.filter((post) => post.userId >= min);
        if (max)
          filteredPosts = filteredPosts.filter((post) => post.userId <= max);
  
        setPosts(filteredPosts);
      } else {
        fetchPosts();
      }
  
      setCurrentPage(1);
    })
    .catch(err => console.log(err));
  }

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      <h1 className="text-center">Sample Shopping Page</h1>
      <div className="row no-gutters m-2">
        <div className="col-sm-2">
          <h1>Filters</h1>
          <hr className="border border-secondary mr-4" />

          <h3>Price</h3>
          <div className="row container-fluid">
            <NumberOnlyInput placeholder={'min'} value={min} setValue={setMin} />
            <NumberOnlyInput placeholder={'max'} value={max} setValue={setMax} />
            <button className="btn-sm btn-secondary my-3" onClick={onFilterPress}>Apply</button>
          </div>
          <hr className="border border-secondary mr-4" />
        </div>
        <div className="col-sm-10">
          {generateRows(currentPosts, 3).map((row, index) => {
            return (
              <div className="row" key={index}>
                {row.map((product, index) => <Item key={index} product={product} loading={loading} /> )}
              </div>
            )
          })}

          <Pagination 
            currentPage={currentPage} 
            postsPerPage={postsPerPage} 
            totalPosts={posts.length} 
            paginate={paginate} 
          />
        </div>
      </div>
    </div>
  )
}

export default Shop;