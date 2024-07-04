export default function ErrorValidation(email, password) {
    const errors = {}

    const email_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    const password_pattern = /^[a-zA-Z0-9!@#\$%\^\&*_=+-]{8,12}$/g;

    if(email.email === ""){
        errors.email = "Email is Required";
    } else if(!email_pattern.test(email.email)) {
        errors.email = "Email didn't match"
    }

    if(password.password === ""){
        errors.password = "Password is Required";
    } else if(!password_pattern.test(password.password)) {
        errors.password = "Password didn't match"
    }
}