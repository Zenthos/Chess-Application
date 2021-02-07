import React, { useState, useEffect } from 'react';

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
    <div className="mt-5">
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

export default Pagination;