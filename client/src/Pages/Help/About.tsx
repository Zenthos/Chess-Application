import React, { useContext, useState } from 'react';
import { AuthContext } from 'src/Contexts/AuthContext';
import { FadeIn, Alert } from 'src/Components';
import { Carousel } from 'react-bootstrap';
import ga from 'src/Assets/ga.png';
import 'src/Styles/ComponentCSS.css';

export const About = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const { isSubmitting, setIsSubmitting } = useContext(AuthContext);

  const emailHandler = (event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value);
  const subjectHandler = (event: React.ChangeEvent<HTMLInputElement>) => setSubject(event.target.value);
  const messageHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value);

  const submitHandler = (event: any) => {
    event.preventDefault();
    setShowAlert(true);

    // No Purpose, delete later, just here to remove warnings
    setIsSubmitting(false);
    const data = `${email}\n${subject}\n${message}`;
    data.slice(0, data.length);
  };

  const Caption = React.forwardRef(({ children, text, subtext }: any, ref: any) => (
    <div className={'mt-1'} ref={ref} >
      <h3>{text}</h3>
      <p>{subtext}</p>
      {children}
    </div>
  ));

  Caption.displayName = 'Caption';

  return (
    <>
      <div className="text-center text-white mast-container">
        <div className="mast d-flex h-100 p-5 mx-auto flex-column">
          <div className="mt-auto">
            <h1>Alex Nguyen</h1>
            <p className="lead">Junior Software Engineer & Full-Stack Developer.</p>
            <p className="lead">
              <a className="btn btn-lg btn-secondary m-2" href="#learnmore" >Learn more about Alex</a>
              <a className="btn btn-lg btn-secondary m-2" href="#futureplans" >See planned updates</a>
            </p>
          </div>
        </div>
      </div>

      <div className="container my-3">
        <div className="row mb-3" id="learnmore">
          <div className="col-sm">
            <h1>Who is Alex?</h1>
            <p className="text-large">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>

          <div className="col-sm">
            <h1>Skills</h1>
            <p className="text-large">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </div>

        <div className="row mb-3" id="futureplans">
          <div className="col-sm">
            <h1>Planned Updates</h1>
            <ul className="list-group mb-3">
              <li className="list-group-item list-group-item-success">&#x2713; Implement Login/Register System</li>
              <li className="list-group-item list-group-item-success">&#x2713; Create Chess AI</li>
              <li className="list-group-item list-group-item-success">&#x2713; Finish Chat Interface</li>
              <li className="list-group-item list-group-item-warning">... Design and Implement User Profiles</li>
              <li className="list-group-item list-group-item-danger">&#x2613; Implement Friend System</li>
              <li className="list-group-item list-group-item-danger">&#x2613; Implement User Settings</li>
              <li className="list-group-item list-group-item-danger">&#x2613; Complete the Tutorial Page</li>
              <li className="list-group-item list-group-item-danger">&#x2613; Complete the About Page</li>
            </ul>
          </div>

          <div className="col-sm">
            <h1>About this App</h1>
            <p className="text-large">
              This Chess Application was built using the MERN (MongoDB, Express, React, Node.js) Full-Stack Framework.
              In addition, communication between the server and clients, happen through the Socket.IO library.
            </p>
            <p className="text-large">
              All work has been done by one person, the sole contributor of this project, Alex. Criticisms and Issues are always welcome,
              as I am always looking to improve my programming and make every single line of code of write, the most efficient one.
            </p>
            <p className="text-large">
              To the left is everything I plan to add to the website. I dont have a deadline, so each item will be added at some point
              in the future.
            </p>
          </div>
        </div>

        <div>
          <h1><u>Other Projects</u></h1>
          <Carousel controls={false} indicators={false} interval={null} slide={false} wrap={true}>
            <Carousel.Item>
              <FadeIn>
                <img src={ga} className="img-fluid" alt="first slide"/>
                <Carousel.Caption as={Caption} text={'Genetic Algorithm Implementation'} />
              </FadeIn>
            </Carousel.Item>
          </Carousel>
        </div>

        <div id="contact-us" className="row m-0">
          <div className="col-md-10 offset-md-1 text-center">
            <h1 className="mt-3">Contact</h1>
            <form className="form-group" onSubmit={submitHandler}>
              <input type="email" className="form-control mb-2" disabled={isSubmitting} onChange={emailHandler} placeholder="name@example.com" />
              <input type="text" className="form-control mb-2" disabled={isSubmitting} onChange={subjectHandler} placeholder="Subject" />
              <textarea className="form-control mb-3" disabled={isSubmitting} onChange={messageHandler} rows={3} placeholder="Write your message here..." />
              { showAlert ? <Alert status={'warning'} message={'Feature Currently in Development! No Message Sent.'}/>: '' }
              <button type="submit" className="btn btn-primary mb-3" disabled={isSubmitting}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
