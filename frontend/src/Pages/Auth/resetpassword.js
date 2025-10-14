import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import {resetpassword} from "../../utils/ApiRequest.js"

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            // const response = await fetch(`${resetpassword}/${token}`, {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ newPassword }),
            // });
            // const data = await response.json();
            const response = await axios.post(`${resetpassword}/${token}`, { newPassword });

            if (response.ok) {
                setMessage("Password reset successful! Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setError(data.message || "Failed to reset password. Please try again.");
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
        setLoading(false);
    };

    return (
        <div style={{ position: "relative", overflow: "hidden" }}>
            <Particles
                id="tsparticles"
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
            <Container className="mt-5" style={{ position: "relative", zIndex: "2 !important" }}>
                <Row>
                    <Col md={{ span: 6, offset: 3 }}>
                        <h2 className="text-white text-center">Reset Password</h2>
                        {message && <p className="text-success text-center">{message}</p>}
                        {error && <p className="text-danger text-center">{error}</p>}
                        <Form onSubmit={handleReset}>
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
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className="text-center mt-4">
                                <Button type="submit" className="btnStyle" disabled={loading}>
                                    {loading ? "Resetting..." : "Reset Password"}
                                </Button>
                                {/* <p className="mt-3" style={{ color: "#9d9494" }}>
                                    Remembered your password? {" "}
                                    <Link to="/login" className="text-white lnk">
                                        Login
                                    </Link>
                                </p> */}
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ResetPassword;