import React, { useEffect, useState } from 'react';
import { Pagination } from '../Components';
import '../styles/ComponentCSS.css';
import spinner from '../assets/spinner.gif';
import axios from 'axios';

const generateRows = (arr: any[], itemsPerRow: number) => {
  const rows = [...Array( Math.ceil(arr.length / itemsPerRow) )];

  // chunk the products into the array of rows
  const productRows = rows.map( (row, idx) => arr.slice(idx * itemsPerRow, idx * itemsPerRow + itemsPerRow) );

  return productRows;
};

const Item = ({ product }: any) => {
  return (
    <div key={product.id} className="card col-sm-4 p-3">
      <h4>{ product.title }</h4>
      <p><small>{ product.body }</small></p>
      <div className="mt-auto">
        <button className="btn-sm btn-secondary">Add to Cart</button>
        <span>{`  $${ product.userId }`}</span>
      </div>
    </div>
  );
};

const NumberOnlyInput = ({ placeholder, value, setValue }: any) => {
  return (
    <input
      value={value}
      className="form-control-sm col-sm-5 mr-3"
      placeholder={placeholder}
      onChange={event => setValue(event.target.value.replace(/\D/,''))}
    />
  );
};

const Shop = () => {
  // Pagination
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);

  // Filters
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async function() {
    setLoading(true);
    const res = await axios.get('https://jsonplaceholder.typicode.com/posts');
    setPosts(res.data);
    setLoading(false);
  };

  const onFilterPress = function(event: React.MouseEvent) {
    event.preventDefault();

    fetchPosts()
      .then(() => {
        let filteredPosts = [...posts];

        if (min || max) {
          if (min)
            filteredPosts = filteredPosts.filter((post: any) => post.userId >= min);
          if (max)
            filteredPosts = filteredPosts.filter((post: any) => post.userId <= max);

          setPosts(filteredPosts);
        } else {
          fetchPosts();
        }

        setCurrentPage(1);
      })
      .catch(err => console.log(err));
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container-fluid">
      <h1 className="text-center">Sample Shopping Page</h1>
      <div className="row no-gutters">
        <div className="col-sm-2">
          <h1>Filters</h1>
          <hr className="border border-secondary" />

          <h3>Price</h3>
          <div className="row container-fluid">
            <NumberOnlyInput placeholder={'min'} value={min} setValue={setMin} />
            <NumberOnlyInput placeholder={'max'} value={max} setValue={setMax} />
            <button className="btn-sm btn-secondary my-3" onClick={onFilterPress}>Apply</button>
          </div>
          <hr className="border border-secondary" />
        </div>
        <div className="col-sm-10">
          {
            !loading ?
              posts.length > 0 ?
                generateRows(currentPosts, 3).map((row, index) => {
                  return (
                    <div className="row no-gutters" key={index}>
                      {row.map((product, index) => <Item key={index} product={product} loading={loading} /> )}
                    </div>
                  );
                })
                :
                <h1 className="card text-center p-5">No Results Found</h1>
              :
              <img className="card col-sm-2 offset-5 p-5" src={spinner} alt="" />
          }

          <Pagination
            currentPage={currentPage}
            postsPerPage={postsPerPage}
            totalPosts={posts.length}
            paginate={paginate}
          />
        </div>
      </div>
    </div>
  );
};

export default Shop;
