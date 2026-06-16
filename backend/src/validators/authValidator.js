import validator from "validator";

const validateRegister = (name, email, password) =>{
    if(!name || !email || !password) return 'All fields are required';
    if(!validator.isEmail(email)) return 'Invalid email';
    if(password.length < 6) return 'Password must be at least 6 characters long';
    return null;
}

export default validateRegister;