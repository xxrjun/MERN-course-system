import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

const EnrollCourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [query, setQuery] = useState("");
  let [queryResult, setQueryResult] = useState(null);

  const navigate = useNavigate();
  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleChangeInput = (e) => {
    setQuery(e.target.value);
  };

  const handleClickSearch = () => {
    CourseService.getCourseByName(query)
      .then((courses) => {
        console.log(courses);
        setQueryResult(courses.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.target.id, currentUser.user._id)
      .then(() => {
        window.alert("Done Enrollment.");
        navigate("/courses");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ padding: "3rem" }}>
      {!currentUser && (
        <div>
          <p>You must login first before searching for courses.</p>
          <button class="btn btn-primary btn-lg" onClick={handleTakeToLogin}>
            Take me to login page.
          </button>
        </div>
      )}
      {currentUser && currentUser.user.role === "instructor" && (
        <div>
          <h1>Only students can enroll in courses.</h1>
        </div>
      )}
      {currentUser && currentUser.user.role === "student" && (
        <div className="search input-group mb-3">
          <input
            onChange={handleChangeInput}
            type="text"
            class="form-control"
          />
          <button onClick={handleClickSearch} className="btn btn-primary">
            Search
          </button>
        </div>
      )}
      {currentUser && queryResult && queryResult.length !== 0 && (
        <div>
          <p>Data we got back from API.</p>
          {queryResult.map((course) => (
            <div key={course._id} className="card" style={{ width: "18rem" }}>
              <div className="card-body">
                <h5 className="card-title">{course.title}</h5>
                <p className="card-text">{course.description}</p>
                <p>Price: {course.price}</p>
                <p>Student: {course.students.length}</p>
                <Link
                  to="#"
                  onClick={handleEnroll}
                  // className="card-text"
                  className="btn btn-primary"
                  id={course._id}
                >
                  Enroll
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnrollCourseComponent;
