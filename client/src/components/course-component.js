import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const CourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [courseData, setCourseData] = useState(null);

  let navigate = useNavigate();
  useEffect(() => {
    // get user id
    console.log("Using Effect in course component.");
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
    } else {
      _id = "";
    }

    // check user role
    if (currentUser.user.role === "instructor") {
      // get course data from server
      CourseService.get(_id)
        .then((courses) => {
          console.log(courses);
          setCourseData(courses.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (currentUser.user.role === "student") {
      // get course data for student
      CourseService.getEnrolledCourses(_id)
        .then((courses) => {
          console.log(courses);
          setCourseData(courses.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login before seening your course.</p>
          <button onClick={handleTakeToLogin} className="btn btn-primary">
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>Welcome to the instructor's page</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div>
          <h1>Welcome to the student's page</h1>
        </div>
      )}
      {currentUser && courseData && courseData.length !== 0 && (
        <div>
          <p>Here's data we got back from server</p>
          {courseData.map((course) => {
            return (
              <div className="card" style={{ width: "18rem" }}>
                <div className="card-body">
                  <h5 className="card-title">{course.title}</h5>
                  <p className="card-text">{course.description}</p>
                  <p>Students: {course.students.length}</p>
                  <button className="btn btn-primary">{course.price}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseComponent;
