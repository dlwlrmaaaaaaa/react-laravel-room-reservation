import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../axios";

const stateContext = createContext({});

export const ContextProvider = ({ children }) => {
 
  
  const [errors, setErrors] = useState({_Html: ''});
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate()
  
  const getAuth = () => {
    return localStorage.getItem("auth");
  };

  const getRole = () => {
    return localStorage.getItem("roles");
  };

  const getUser = () => {
    return localStorage.getItem("user");
  };
  const [roles, setRoles] = useState(getRole());

  const [auth, isAuth] = useState(getAuth());

  const [user, setUser] = useState(getUser());
  const setUsers = (data) => {
    setUser(data);
  };
  const setAuth = (data) => {
    isAuth(data);
  };
  const setRole = (data) => {
    setRoles(data);
  };

  const register = ({ ...data }) => {
    setLoading(true);
    axiosClient.get("/sanctum/csrf-cookie");
    return axiosClient
      .post("/register", { ...data })
      .then((res) => {
        return res.data;
      })
      .then((res) => {
        return res.data;
      })
      .then(({ name, email, role }) => {
        setRole(role);
        setUser({ name: name, email: email });
        setAuth(true);
        localStorage.setItem(
          "user",
          JSON.stringify({ name: name, email: email })
        );
        localStorage.setItem("roles", role);
        localStorage.setItem("auth", true);
        setLoading(false);
        navigate("/email/verify");
      })
      .catch((error) => {
        const response = error.response;
        if (response) {
          // Email is already taken
          setLoading(false);
          setErrors({
            ...errors,
            _Html: response.data.message,
          });
          setTimeout(() => {
            setErrors({ _Html: "" });
          }, 2500);
        } else {
          console.log("Error during signup:", error);
        }
      });
  };

  const login = ({ ...data }) => {
    setLoading(true);
    axiosClient.get("/sanctum/csrf-cookie");
    return axiosClient
      .post("/login", { ...data })
      .then(({ data }) => {
        return data.data;
      })
      .then((res) => {
        setLoading(false);
        setAuth(true);
        setRole(res.role);
        localStorage.setItem("roles", res.role);
        localStorage.setItem("auth", true);
        if (res.role === "admin") {
          localStorage.setItem("user", JSON.stringify(res.user));
          setUsers({ name: res.name, email: res.email });
          navigate("/dashboard");
        } else if (res.role === "user") {
          localStorage.setItem("user", JSON.stringify(res.user));
          setUsers({
            name: res.user.name,
            email: res.user.email,
            email_verified_at: res.user.email_verified_at,
          });
          if (res.user.email_verified_at) {
            navigate("/home");
          } else {
            axiosClient.post("/re-send-pin");
            navigate("/email/verify");
          }
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        // Assuming the API responds with a status code of 401 or similar for unauthorized access
        setLoading(false);
        if (err.response && err.response.status === 403) {
          setErrors({
            _Html: err.response.data.message,
          });
        } else {
          // For any other error, you might want to display a generic error message
          setErrors({ _Html: "An error occurred. Please try again later." });
          setTimeout(() => {
            setErrors({ _Html: "" });
          }, 2500);
        }
      });
  };

  const email_verify = ({ ...email_and_pin }) => {
    setLoading(true);
    return axiosClient
      .post("/email/verify", { ...email_and_pin })
      .then(() => {
        navigate("/home");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 403) {
          setErrors({
            _Html: err.response.data.message,
          });
        } else {
          // For any other error, you might want to display a generic error message
          setErrors({ _Html: "An error occurred. Please try again later." });
          setTimeout(() => {
            setErrors({ _Html: "" });
          }, 2500);
        }
      });
  };

  const resend_pin = () => {
    axiosClient.post("/re-send-pin");
  };
  const logout = (api) => {
    axiosClient
      .post(api)
      .then(() => {
        setUser({});
        isAuth(false);
        localStorage.removeItem("user");
        localStorage.removeItem("auth");
        localStorage.removeItem("roles");
        localStorage.removeItem("room");
        navigate("/login");
      })
      .catch(() => {
        navigate("/login");
      });
  };
  //
  return (
    <stateContext.Provider
      value={{
        user,
        auth,
        roles,
        errors,
        loading,
        login,
        logout,
        setUsers,
        setAuth,
        register,
        setRoles,
        setErrors,
        email_verify,
        resend_pin,
      }}
    >
      {children}
    </stateContext.Provider>
  );
};
export const useStateContext = () => useContext(stateContext);
