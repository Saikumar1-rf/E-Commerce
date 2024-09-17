import React, { useState, useEffect } from "react";
import { ImCross } from "react-icons/im";
import { FaCheck, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Forgotpass = () => {
  const [inputValue, setInputValue] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(false); // Controls OTP display
  const [timer, setTimer] = useState(60); // Timer for OTP resend
  const [canResendOtp, setCanResendOtp] = useState(false); // Controls Resend OTP button
  const [otpValue, setOtpValue] = useState(""); // Value of OTP input
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); // Success popup visibility

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowCreatePassword(!showCreatePassword);
    // setShowConfirmPassword(!showConfirmPassword);
  };

  const togglePassword = () => {
    // setShowCreatePassword(!showCreatePassword);
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Timer countdown effect
  useEffect(() => {
    let countdown;
    if (otp && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
      setCanResendOtp(true);
    }
    return () => clearInterval(countdown);
  }, [otp, timer]);

  // const validateEmail = (email) => {
  //   email = email.toLowerCase();
    // const emailRegex = /^[a-z]+[^\s@]*@(gmail\.com|yahoo\.com|outlook\.com)$/;
    // const emailRegex=/^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*[a-zA-Z0-9]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    // const emailRegex=/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   const emailRegex=/^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //   return emailRegex.test(email);
  // };
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._%+-]*@[a-zA-Z][a-zA-Z.-]*\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && !/\s/.test(email); // Ensure no spaces are present
  };
  
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value.replace(/\s+/g, "").toLowerCase();
    setInputValue(value);
  };

  const validatePasswordStrength = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      Symbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const validatePasswords = () => {
    let passwordErrors = {};
    if (createPassword.length < 8) {
      passwordErrors.createPassword =
        "Password must be at least 8 characters long";
    } else if (!/[A-Z]/.test(createPassword) || !/\d/.test(createPassword)) {
      passwordErrors.createPassword =
        "Password must include uppercase, lowercase letters, and numbers";
    }
    if (createPassword !== confirmPassword) {
      passwordErrors.confirmPassword = "Passwords do not match";
    }
    return passwordErrors;
  };

  // Navigate to SuccessPage
  // const handleClick = () => {
  //   navigate("/SuccessPage");
  // };

  // const handleKeyDown=(e)=>{
  //   if(e.key === '  '){
  //     e.preventDefault();
  //   }
  // }

  const handleVerify = () => {
    if (!validateEmail(inputValue) && !validatePhoneNumber(inputValue)) {
      setErrors({
        email: "Please enter a valid email address or a 10-digit phone number",
      });
    } else {
      setErrors({});
      console.log("Verified: ", inputValue);
      setOtp(true); // Simulate OTP being sent and display OTP fields
      setTimer(60); // Start the 60-second timer
      setCanResendOtp(false); // Disable resend option until timer runs out
    }
  };

  const handleResendOtp = () => {
    console.log("OTP resent to: ", inputValue);
    setTimer(60); // Reset the timer to 60 seconds
    setCanResendOtp(false); // Disable resend button until timer runs out again
  };

  const handleOtpChange = (e) => {
    // Only allow numeric input
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 6) {
      setOtpValue(value);
    }
  };
  const determineMaxLength = () => {
    if (validatePhoneNumber(inputValue)) {
      return 10; //phone numbers
    } else {
      return 30; //email Address
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const passwordErrors = validatePasswords();

    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
    } else if (!validateEmail(inputValue) && !validatePhoneNumber(inputValue)) {
      setErrors({
        email: "Please enter a valid email address or a 10-digit phone number",
      });
    } else {
      setErrors({});
      // Show success popup
      setShowSuccessPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      <div className=" bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-500">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email or Phone Number
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Email id or number"
                value={inputValue}
                maxLength={determineMaxLength(30)}
                //  or maxLength={determineMaxLength(30)}  // maxLength={validatePhoneNumber(inputValue) ? 10 : 30} {/* Max length for phone numbers and emails */}
                onChange={handleEmailChange}
                // onChange={(e) => setInputValue(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                required
                // autoCapitalize="off" // This turns off capitalization
                // autoCorrect="off" // Optionally turn off auto-correct
              />
              <button
                type="button"
                onClick={handleVerify}
                className="bg-green-500 text-white py-2 px-4 rounded-2xl h-[40px] w-[70px] hover:bg-green-400 focus:outline-none"
                disabled={otp && !canResendOtp} // Disable during OTP verification
              >
                Verify
              </button>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* OTP Input (only displayed if OTP is triggered) */}
          {otp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OTP
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={otpValue}
                  onChange={handleOtpChange}
                  maxLength="6"
                  className="w-[50%] h-[50px] outline-none rounded-xl bg-green-500 text-white text-center"
                />
              </div>
              {/* Timer display */}
              {timer > 0 ? (
                <p className="text-sm text-green-500 mt-2">
                  Resend OTP in {timer} seconds
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-slate-50 hover:underline mt-2 rounded-lg p-2 bg-yellow-500"
                  disabled={!canResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </div>
          )}

          {/* Password Creation Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Create Password
            </label>
            <div className="relative">
              {/* Password Input without type="password" */}
              <input
                type="text" // Always type="text", removing the "password" type entirely
                placeholder="Create a new password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                maxLength={8}
                className="mt-1 w-[100%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                style={{
                  WebkitTextSecurity: showCreatePassword ? "none" : "disc",
                  // "disc" hides text with dots (like a password) without using "password" type
                }}
              />

              {/* Button for toggling password visibility */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-5 top-[25px] transform -translate-y-1/2 text-gray-600"
              >
                {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.createPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.createPassword}
                </p>
              )}
            </div>
            {createPassword && (
              <span className="text-green-500 space-y-2">
                {/* Password Strength */}
                <div className="flex items-center">
                  {createPassword.length >= 8 &&
                  /[A-Z]/.test(createPassword) &&
                  /\d/.test(createPassword) &&
                  /[!@#$%^&*(),.?":{}|<>]/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-gray-300" />
                  )}
                  <p>
                    Password strength:
                    {createPassword.length < 8 ||
                    !/[A-Z]/.test(createPassword) ||
                    !/\d/.test(createPassword) ||
                    !/[!@#$%^&*(),.?":{}|<>]/.test(createPassword)
                      ? " weak"
                      : " strong"}
                  </p>
                </div>
                {/* Length Validation */}
                <div className="flex items-center">
                  {createPassword.length >= 8 ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-red-500" />
                  )}
                  <p>Password must be at least 8 characters long</p>
                </div>

                {/* Uppercase Letter Validation */}
                <div className="flex items-center">
                  {/[A-Z]/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-red-500" />
                  )}
                  <p>
                    Contain both uppercase and lowercase alphabetic
                    character(e.g.A-Z,a-z);
                  </p>
                </div>

                {/* Number Validation */}
                <div className="flex items-center">
                  {/\d/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-red-500" />
                  )}
                  <p>Have at least one numerical character(e.g.0-9)</p>
                </div>

                {/* Symbol Validation */}
                <div className="flex items-center">
                  {/[!@#$%^&*(),.?":{}|<>]/.test(createPassword) ? (
                    <FaCheck className="mr-2" />
                  ) : (
                    <ImCross className="mr-2 text-red-00" />
                  )}
                  <p>
                    Have at least one special character(e.g.~!@#$%^&*()_-+=)-it
                    should be mandatory field
                  </p>
                </div>
              </span>
            )}
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <input
                // type={showConfirmPassword ? "text" : "password"}
                type="text"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={8}
                className="mt-1 w-[100%] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                style={{
                  WebkitTextSecurity: showConfirmPassword ? "none" : "disc",
                }}
                onPaste={(e) => {
                  e.preventDefault(); //in that pasting into confirm password field
                }}
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-5 top-[17px] transform-translate-y/2 text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-4 w-[100%] ml-[-2px] rounded-lg hover:bg-green-400 focus:outline-none leading-7 "
            >
              Reset
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <p>
              Back To
              <button className="text-green-500 texpy-2 px-4 rounded-lg focus:outline-none underline">
                <Link to="/login">Login</Link>
              </button>
            </p>
          </div>
        </form>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <div className="flex justify-end">
                <button
                  onClick={handleClosePopup}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <ImCross />
                </button>
              </div>
              <h2 className="text-lg font-bold text-center text-green-500">
                Success
              </h2>
              <p className="text-center mt-4">
                Your password has been successfully reset.
              </p>
              {/* <div className="flex justify-center mt-4">
                <p>Back To<button
                  className="text-green-500 texpy-2 px-4 rounded-lg focus:outline-none"
                >
                  Login
                </button>
                </p>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forgotpass;
