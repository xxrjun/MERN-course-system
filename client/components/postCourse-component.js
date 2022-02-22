import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  let [courseData, setCourseData] = useState(null);
  let { currentUser, setCurrentUser } = props;
  const history = useHistory();
  const handleTakeToLogin = () => {
    history.push("/login");
  };
  useEffect(() => {
    console.log("using effect");
    console.log(currentUser);
    let _id = currentUser.user._id;
    console.log(currentUser.user.role);
    if (currentUser.user.role == "instructor") {
      CourseService.get(_id)
        .then((data) => {
          console.log(data.data);
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (currentUser.user.role == "student") {
      CourseService.getEnrolled(_id)
        .then((data) => {
          console.log(data.data);
          setCourseData(data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before seeing posts.</p>
          <button class="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role == "instructor" && (
        <div>
          <h1>Welcome to instructor's Course Page.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role == "student" && (
        <div>
          <h1>Welcome to Student's Course Page.</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length != 0 && (
        <div>
          <p>Data we got back from API.</p>
          {courseData.map((course) => (
            <div className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>Price: {course.price}</p>
                <p>Student: {course.students.length}</p>
                <a href="#" className="card-text" className="btn btn-primary">
                  See Course
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
