import React, { useState } from 'react';
import { FaUserAlt, FaEnvelope, FaPhoneAlt, FaLock, FaTimes, FaCheck } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    userType: 'customer', 
    shopName: '',
    area: '',
    website: '',
    vendorPhoneNumber: '',
    agreedToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecialChar: false,
    minLength: false,
  });

  const checkPasswordRequirements = (password) => {
    setPasswordRequirements({
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      minLength: password.length >= 6,
    });
  };

  // -----------Password Visibility---------------------
  // const [createPassword, setCreatePassword] = useState("");
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  // const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Toggle password visibility
    const toggleCreatePasswordVisibility = () => {
      setShowCreatePassword(!showCreatePassword);
    };
  
    const toggleConfirmPasswordVisibility = () => {
      setShowConfirmPassword(!showConfirmPassword);
    };



  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value.trimStart();

    if(name === 'email') {
      newValue = value.replace(/\s+/g, ''); 
      newValue =newValue.toLowerCase();
    }

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : newValue,
    });

    if (name === 'password') {
      checkPasswordStrength(value);
      checkPasswordRequirements(value);
    }
  };

  const checkPasswordStrength = (password) => {
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length >= 8 && hasLower && hasUpper && hasNumber && hasSpecialChar) {
      setPasswordStrength('strong');
    } else if (password.length >= 8 && ((hasLower && hasNumber) || (hasUpper && hasNumber) || (hasLower && hasSpecialChar))) {
      setPasswordStrength('medium');
    } else {
      setPasswordStrength('weak');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    // Check if the passwords match
  if (formData.password !== formData.confirmPassword) {
    setErrors({ confirmPassword: 'Passwords do not match' });
    return; // Stop the form from submitting if passwords don't match
  }
  
  // Run the general validation logic
  const validationErrors = validate();
  
  if (Object.keys(validationErrors).length === 0) {
    // If no validation errors, submit the form
    console.log('Form submitted successfully', formData);
    setIsSuccessModalVisible(true); // Show success modal
  } else {
    // Set validation errors
    setErrors(validationErrors);
  }

  };

  const handleInput=(e)=>{
    const {name,value}=e.target;
    if(name === 'email'){
      e.target.value=value.replace(/\s+/g, '');
    }
  }

    // Validate Full Name
    const handleNameChar = (e) => {
        const key = e.key;
        const value = e.target.value;
        
        // Define the regex to ensure the name starts with a character
        const nameRegex = /^[A-Za-z]/;
      
        // Initialize newError object if not already defined
        let newError = {};
      
        // Prevent space as the first character and ensure only alphabets and spaces are allowed
        if ((value === "" && key === " ") || !/[a-zA-Z\s]/.test(key)) {
          e.preventDefault();
        } 
        // Check if the organization name doesn't start with a character
        else if (!nameRegex.test(value)) {
          newError.Organizationname = "Must start with a Character";
        }
      };
      

  const validate = () => {
    const newErrors = {};

      // Full Name validation
  if (!formData.fullName.trim()) {
    newErrors.fullName = 'Full Name is required';
  } else if (formData.fullName.length < 4) {
    newErrors.fullName = 'Full Name must be at least 4 characters';
  }

    // Validate Email
    const emailRegex = /^[a-zA-Z0-9]+[a-zA-Z0-9._%+-]*[a-zA-Z0-9]+@(gmail\.com|yahoo\.com|outlook\.com)$/;
    // const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|net|org)$/; 
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate Terms Agreement
    if (!formData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    // Vendor-specific validations
    if (formData.userType === 'vendor') {
      if (!formData.shopName.trim()) {
        newErrors.shopName = 'Shop name is required for vendors';
      }

      if (!formData.area.trim()) {
        newErrors.area = 'Shop Area is required for vendors'
      }

      // if (!formData.vendorPhoneNumber) {
      //   newErrors.vendorPhoneNumber = 'Vendor phone number is required';
      // } else if (!phoneRegex.test(formData.vendorPhoneNumber)) {
      //   newErrors.vendorPhoneNumber = 'Vendor phone number must be 10 digits';
      // }
    }

       // Validate Phone Number
       const phoneRegex = /^[6-9]\d{9}$/; 
       if (!formData.phoneNumber) {
         newErrors.phoneNumber = 'Phone number is required';
       } else if (!phoneRegex.test(formData.phoneNumber)) {
         newErrors.phoneNumber = 'Phone number must be 10 digits and start with 6-9';
       } 

    if(formData.userType === 'vendor') {
      if(!formData.vendorPhoneNumber) {
        newErrors.vendorPhoneNumber = 'Vendor phone number is required';
      } else if(!phoneRegex.test(formData.vendorPhoneNumber)){
        newErrors.vendorPhoneNumber = 'vendor phone number must be 10 digits and start with 6-9';
      }
    }

    return newErrors;
  };

  return (

    <div className='max-w-lg mx-auto mt-10 p-8 bg-white border border-gray-300 rounded-lg'>
      <h2 className='text-2xl font-bold text-center text-green-600 mb-6'>
        Register An Account
      </h2>
      <form onSubmit={handleSubmit}>
        {/* {/ Full Name /} */}
        <div className='mb-4 relative'>
          <label className='block mb-2 text-sm font-medium text-gray-700 float-start'>
            Full Name
          </label>
          <span className='absolute py-4 px-2'>
            <FaUserAlt className='text-gray-400 h-3 w-3' />
          </span>
          <input
            type='text'
            id='fullName'
            minLength={4}
            maxLength={20}
            name='fullName'
            onKeyDown={handleNameChar}
            value={formData.fullName}
            onChange={handleChange}
            placeholder='Enter Your Full Name'
            className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && (
            <span className='text-red-500 text-sm'>{errors.fullName}</span>
          )}
        </div>

        {/* {/ Email /} */}
        <div className='mb-4 relative'>
          <label className='block mb-2 text-sm font-medium text-gray-700 float-start'>
            Email ID
          </label>
          <span className='absolute py-4 px-2'>
            <FaEnvelope className='text-gray-400 h-3 w-3' />
          </span>
          <input 
           type='email'
           id='email'
           name='email'
           maxLength={30}
            value={formData.email}
            onChange={handleChange}
            // onInput={handleInput}
            placeholder='Enter Your Mail Id'
            className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <span className='text-red-500 text-sm'>{errors.email}</span>
          )}
        </div>

        {/* {/ Phone Number /} */}
        <div className='mb-4 relative'>
          <label className='block mb-2 text-sm font-medium text-gray-700 float-start'>
            Phone Number
          </label>
          <span className='absolute py-4 px-2'>
          <FaPhoneAlt className='text-gray-400 h-3 w-3' />
          </span>
          <input
            type='text'
            id='phoneNumber'
            maxLength={10}
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            onInput={(e) => {
              e.target.value = e.target.value.replace(/[^0-9]/g, '');
              if(e.target.value && !/^[6-9]/.test(e.target.value)) {
                e.target.value = '';
              }
            }}
            placeholder='Enter Your Phone'
            className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.phoneNumber ? 'border-red-500' : ''}`}
          />
          {errors.phoneNumber && (
            <span className='text-red-500 text-sm'>{errors.phoneNumber}</span>
          )}
        </div>

        {/* {/ Password /} */}
        <div className='mb-4 relative'>
          <label className='block mb-2 text-sm font-medium text-gray-700 float-start'>
            Create Password
          </label>
          <span className='absolute py-4 px-2'>
            <FaLock className='text-gray-400 h-3 w-3' />
          </span>
          <input
            type='text'
            name='password'
            value={formData.password}
            onChange={(e) => {
              handleChange(e);
            //   setCreatePassword(e.target.value);
              checkPasswordStrength(e.target.value);
              checkPasswordRequirements(e.target.value);
            }}
            maxLength={8}
            placeholder='Enter Your Password'
            style={{WebkitTextSecurity: showCreatePassword ? "none" : "disc",}}
            className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.password ? 'border-red-500' : ''}`}
          />
          <button
            type="button"
            onClick={toggleCreatePasswordVisibility}
            className="absolute right-3 top-[49px] transform -translate-y-1/2 text-gray-600"  
          >
            {showCreatePassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        
          {errors.password && (
            <span className='text-red-500 text-sm'>{errors.password}</span>
          )}
          {formData.password && (
            <span className={`text-sm ${passwordStrength === 'strong' ? 'text-green-500' : passwordStrength === 'medium' ? 'text-yellow-500' : 'text-red-500'}`}>
              Password strength: {passwordStrength}
            </span>
          )}
          {formData.password && (
          <div className='mb-4'>
            <ul className='list-none'>
              <li className='flex items-center'>
                {passwordRequirements.hasLower ? (
                  <FaCheck className='text-green-500 mr-2' />
                ) : (
                  <FaTimes className='text-red-500 mr-2' />
                )}
                Contains a lowercase letter (a-z)
              </li>
              <li className='flex items-center'>
                {passwordRequirements.hasUpper ? (
                  <FaCheck className='text-green-500 mr-2' />
                ) : (
                  <FaTimes className='text-red-500 mr-2' />
                )}
                Contains an uppercase letter (A-Z)
              </li>
              <li className='flex items-center'>
                {passwordRequirements.hasNumber ? (
                  <FaCheck className='text-green-500 mr-2' />
                ) : (
                  <FaTimes className='text-red-500 mr-2' />
                )}
                Contains a number (0-9)
              </li>
              <li className='flex items-center'>
                {passwordRequirements.hasSpecialChar ? (
                  <FaCheck className='text-green-500 mr-2' />
                ) : (
                  <FaTimes className='text-red-500 mr-2' />
                )}
                Contains a special character (!@#$%^&*)
              </li>
              <li className='flex items-center'>
                {passwordRequirements.minLength ? (
                  <FaCheck className='text-green-500 mr-2' />
                ) : (
                  <FaTimes className='text-red-500 mr-2' />
                )}
                Minimum 8 characters long
              </li>
            </ul>
          </div>
        )}
        </div>
        

        {/* {/ Confirm Password /} */}

        <div className='mb-4 relative'>
          <label className='block mb-2 text-sm font-medium text-gray-700 float-start'>
            Confirm Password
          </label>
          <span className='absolute py-4 px-2'>
            <FaLock className='text-gray-400 h-3 w-3' />
          </span>
          <input
            type='text'
            name='confirmPassword'
            value={formData.confirmPassword}
            onChange={handleChange}
            maxLength={8}
            style={{
              WebkitTextSecurity: showConfirmPassword ? "none" : "disc",
            }}
            placeholder='Confirm Your Password'
            className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.confirmPassword ? 'border-red-500' : ''}`}
          />
          <button
          type="button"
          onClick={toggleConfirmPasswordVisibility}
          className="absolute right-3 top-[49px] transform -translate-y-1/2 text-gray-600"
        >
          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
        </button>

          {errors.confirmPassword && (
            <span className='text-red-500 text-sm'>
              {errors.confirmPassword}
            </span>
          )}
        </div>

        {/* {/ User Type Selection /} */}
        <div className='mb-4'>
          <label className='block text-sm font-medium text-gray-700'>
            Register As
          </label>
          <div className='float  flex gap-10 space-x-4 mt-2'>
            <label className='flex items-center'>
              <input
                type='radio'
                name='userType'
                value='customer'
                checked={formData.userType === 'customer'}
                onChange={handleChange}
                className='h-4 w-4 text-green-500'
              />
              <span className='ml-2 text-gray-700'>I am a Customer</span>
            </label>

            <label className='flex items-center'>
              <input
                type='radio'
                name='userType'
                value='vendor'
                checked={formData.userType === 'vendor'}
                onChange={handleChange}
                className='form-radio h-4 w-4 text-green-500'
              />
              <span className='ml-2 text-gray-700'>I am a Vendor</span>
            </label>
          </div>
        </div>

        {/* {/ Conditional Fields for Vendor /} */}
        {formData.userType === 'vendor' && (
          <>
          {/* {/ ---------shop name-------------- /} */}
            <div className='mb-4'>
              <label className='block mb-2 text-sm float-start font-medium text-gray-700'>
                Shop Name
              </label>
              <input
                type='text'
                name='shopName'
                minLength={4}
                maxLength={20}
                onKeyDown={handleNameChar}
                value={formData.shopName}
                onChange={handleChange}
                placeholder='Enter Shop Name'
                className={`w-full px-4 py-2 border border-gray-500 outline-none rounded-md ${errors.shopName ? 'border-red-500' : ''}`}
              />
              {errors.shopName && (
                <span className='text-red-500 text-sm'>{errors.shopName}</span>
              )}
            </div>
            {/* {/ ---------shop Area--------------  /} */}
            <div className='mb-4'>
              <label className='block mb-2 text-sm float-start font-medium text-gray-700'>
                Area
              </label>
              <input
                type='text'
                name='area'
                value={formData.area}
                onChange={handleChange}
                placeholder='Enter Area'
                className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.area ? 'border-red-500' : ''}`}
              />
              {errors.area && (
                <span className='text-red-500 text-sm'>
                  {errors.area}
                </span>
              )}
            </div>
            {/* {/ ---------shop website--------------  /} */}
            <div className='mb-4'>
              <label className='block mb-2 text-sm float-start font-medium text-gray-700'>
                Website (optional)
              </label>
              <input
                type='text'
                name='website'
                value={formData.website}
                onChange={handleChange}
                placeholder='Enter URL'
                className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.area ? 'border-red-500' : ''}`}
              />
    
            </div>
            {/* {/ ---------vendor number--------------  /} */}
            <div className='mb-4'>
              <label className='block mb-2 text-sm float-start font-medium text-gray-700'>
                Vendor Phone Number
              </label>
              <input
                type='text'
                name='vendorPhoneNumber'
                value={formData.vendorPhoneNumber}
                maxLength={10}
                onChange={handleChange}
                onInput={(e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
                if(e.target.value && !/^[6-9]/.test(e.target.value)) {
                  e.target.value = '';
                }
                }}
                placeholder='Enter Vendor Phone Number'
                className={`w-full px-6 py-2 border border-gray-500 outline-none rounded-md ${errors.vendorPhoneNumber ? 'border-red-500' : ''}`}
              />
              {errors.vendorPhoneNumber && (
                <span className='text-red-500 text-sm'>
                  {errors.vendorPhoneNumber}
                </span>
              )}
            </div>
          </>
        )}

        {/* {/ Terms and Conditions /} */}
        <div className='mb-4 float-start'>
          <label className='block items-center'>
            <input
              type='checkbox'
              name='agreedToTerms'
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className='form-checkbox h-4 w-4 text-green-500'
            />
            <span className='ml-2  text-gray-700'>
              I agree to the terms and conditions
            </span>
          </label>
          {errors.agreedToTerms && (
            <span className='text-red-500 text-sm'>
              {errors.agreedToTerms}
            </span>
          )}
        </div>

        {/* {/ Submit Button /} */}
        <button
          type='submit'
          className='w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:bg-green-600'
        >
          Register
        </button>

        {/* {/ -----------Footer------------- /} */}

        <div className='text-center mt-4 font-semibold'>
          Already Have An Account? <Link to='/login'  className='text-green-600 hover:underline ml-1'>Login</Link>
        </div>

      </form>

     {/* {/ Success Modal /}. */}
     {isSuccessModalVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
            <p className="mt-4">Thank you for registering.</p>
            <button
              onClick={() => setIsSuccessModalVisible(false)}
              className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;