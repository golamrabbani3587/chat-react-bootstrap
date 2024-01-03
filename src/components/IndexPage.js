import React, { useState } from 'react';
import '../App.css';
import axios from 'axios';

// Functional component
const HomePage = () => {
    const [loginTrue, setLoginTrue] = useState(true);
    // Function to handle the Signup button click
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loginTrue) {
            try {
                const response = await axios.post('http://localhost:3001/login', formData);
                if (response.data) {
                    const token = response.data.resObj.token;
                    const user = {
                        username: response.data.resObj.username, id: response.data.resObj.id
                    }
                    console.log('Server response:', response.data.resObj);
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '/dashboard'
                }
                // Reset form fields after successful submission
                setFormData({
                    username: '',
                    password: '',
                });
            } catch (error) {
                console.error('Error during form submission:', error.message);
            }
        }

        else {
            try {
                const response = await axios.post('http://localhost:3001/register', formData);

                console.log('Server response:', response.data);

                // Reset form fields after successful submission
                setFormData({
                    username: '',
                    password: '',
                });
            } catch (error) {
                console.error('Error during form submission:', error.message);
            }
        }
        console.log(loginTrue, 'Form submitted:', formData);
        setFormData({
            username: '',
            password: '',
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignupClick = () => {
        setLoginTrue(false);
    };
    const handleSignupClick2 = () => {
        setLoginTrue(true);
    };
    return (
        <div>
            <div class="container">
                <div class="row">
                    <div class="col-md-3"></div>
                    <div class="col-md-6 mainContent">
                        {loginTrue ? (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <h2>Login</h2>
                                    <div class="mb-3">
                                        <label for="exampleInputEmail1" class="form-label">Username address</label>
                                        <input type="text" class="form-control" id="exampleInputEmail1" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="exampleInputPassword1" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" />
                                    </div>
                                    <div className="inputBx">
                                    <button type="submit" class="btn btn-primary">Login</button>
                                    </div>
                                    <p onClick={handleSignupClick} >Register Here..</p>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <form onSubmit={handleSubmit}>
                                    <h2>Register</h2>
                                    <div class="mb-3">
                                        <label for="exampleInputEmail1" class="form-label">Username address</label>
                                        <input type="text" class="form-control" id="exampleInputEmail1" name="username" value={formData.username} onChange={handleInputChange} placeholder="Username" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="exampleInputPassword1" class="form-label">Password</label>
                                        <input type="password" class="form-control" id="exampleInputPassword1" name="password" value={formData.password} onChange={handleInputChange} placeholder="Password" />
                                    </div>
                                    <button type="submit" class="btn btn-primary buttonDesign">Register</button>
                                    <p onClick={handleSignupClick2} >Login Here..</p>
                                </form>
                            </div>
                        )}

                    </div>
                    <div class="col-md-3"></div>
                </div>
            </div>
        </div>
    );
};

// Export the component
export default HomePage;