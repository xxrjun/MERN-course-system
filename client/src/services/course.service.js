import axios from "axios";
const API_URL = "http://localhost:8080/api/courses";

class CourseService {
  #getTokenFromLocalStorage() {
    let token;
    if (localStorage.getItem("user")) {
      token = JSON.parse(localStorage.getItem("user")).token;
    } else {
      token = "";
    }
    return token;
  }

  post(title, description, price) {
    let token = this.#getTokenFromLocalStorage();

    // axios.post(url, body, headers)
    return axios.post(
      API_URL,
      { title, description, price },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }

  getEnrolledCourses(_id) {
    let token = this.#getTokenFromLocalStorage();

    // axios.get(url, headers)
    return axios.get(API_URL + "/student/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  getCourseByName(name) {
    let token = this.#getTokenFromLocalStorage();

    return axios.get(API_URL + "/findByName/" + name, {
      headers: {
        Authorization: token,
      },
    });
  }

  get(_id) {
    let token = this.#getTokenFromLocalStorage();
    return axios.get(API_URL + "/instructor/" + _id, {
      headers: {
        Authorization: token,
      },
    });
  }

  enroll(_id, user_id) {
    let token = this.#getTokenFromLocalStorage();

    return axios.post(
      API_URL + "/enrollCourse/" + _id,
      { user_id },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  }
}

export default new CourseService();
