import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { resetpassword } from "../../utils/ApiRequest";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRegex = /^.{6,}$/; // At least 6 characters

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields!");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      toast.error("Password must be at least 6 characters!");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${resetpassword}/${token}`,
        { newPassword }
      );

      if (data.success) {
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Server error.");
      } else {
        toast.error("Network error. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight: "100vh", background: "#000" }}>
      <Container className="mt-5" style={{ position: "relative", zIndex: 2 }}>
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <h2 className="text-white text-center">Reset Password</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNewPassword" className="mt-3">
                <Form.Label className="text-white">New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mt-3">
                <Form.Label className="text-white">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="text-center mt-4">
                <Button type="submit" className="btnStyle" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default ResetPassword;