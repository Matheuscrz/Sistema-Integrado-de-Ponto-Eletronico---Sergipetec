const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

const userDataParagraph = document.getElementById("userData");
userDataParagraph.textContent = `UserID: ${userId}, Token: ${token}`;
