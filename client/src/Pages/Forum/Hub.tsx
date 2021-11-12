import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

export const ForumHub = () => {
  const [categories, setCategories] = useState([
    { title: 'Test', last_update_title: 'the big bad wolf', last_update_username: 'test', last_update_date: new Date() }
  ]);

  const ListItem = ({ category }: any) => {
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
    );
  };

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
  );
};
