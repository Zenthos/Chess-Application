import React, { useContext, useState } from 'react';
import { AuthContext } from 'src/Contexts/AuthContext';
import { Link } from 'react-router-dom';

export const Category = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const [threads, setThreads] = useState([
    { id: '532', title: 'Test', last_update_title: 'the big bad wolf', last_update_username: 'test', last_update_date: new Date() }
  ]);

  const titleHandler = (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value);
  const bodyHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => setBody(event.target.value);

  const generateThread = (event: React.FormEvent) => {
    event.preventDefault();

    console.log('Generating Thread...');
  };

  const ListItem = ({ thread }: any) => {
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
    );
  };

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
  );
};
