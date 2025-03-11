import React, { useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Link } from "react-router-dom";
import {forgetpassword} from "../../utils/ApiRequest"

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async () => {}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailRegex.test(email)) {
    //   alert("Invalid email format. Please enter a valid email.");
      toast.error("Invalid email format!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(forgetpassword, { email });

      if (data.success) {
        alert("Password reset link sent! Check your email.");
        toast.success("Password reset link sent!");
      } else {
        alert(data.message || "Something went wrong. Try again.");
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      if (error.response) {
        // alert(error.response.data.message || "Server error. Try again.");
        toast.error(error.response.data.message || "Server error.");
      } else {
        // alert("Network error. Please check your connection.");
        toast.error("Network error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      {/* Particles Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
            life: { duration: { sync: false, value: 3 }, count: 0, delay: { random: { enable: true, minimumValue: 0.5 }, value: 1 } },
          },
          detectRetina: true,
        }}
        style={{ position: "absolute", zIndex: -1, top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Forget Password Form */}
      <Container className="mt-5" style={{ position: "relative", zIndex: 2 }}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h2 className="text-white text-center">Forgot Password</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mt-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="btnStyle" disabled={loading}>
                  {loading ? "Sending..." : "Reset Password"}
                </Button>

                <p className="mt-3" style={{ color: "#9d9494" }}>
                  Remembered your password?{" "}
                  <Link to="/login" className="text-white lnk">
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default ForgetPassword;
