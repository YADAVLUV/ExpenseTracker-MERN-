//const host = "https://expense-tracker-app-knl1.onrender.com";
//const host = "https://expensetracker-mern-zdny.onrender.com";
//const host = "http://localhost:3000";
// Automatically detect environment
const host = 
  process.env.NODE_ENV === "production"
    ? "https://expensetracker-mern-zdny.onrender.com"
    : "http://localhost:3000";

console.log("🌐 API Host:", host);

export const setAvatarAPI = `${host}/api/auth/setAvatar`;
export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;
export const addTransaction = `${host}/api/v1/addTransaction`;
export const getTransactions = `${host}/api/v1/getTransaction`;
export const editTransactions = `${host}/api/v1/updateTransaction`;
export const deleteTransactions = `${host}/api/v1/deleteTransaction`;
export const forgetpassword = `${host}/api/auth/forgotPassword`;
export const resetpassword = `${host}/api/auth/resetpassword`;