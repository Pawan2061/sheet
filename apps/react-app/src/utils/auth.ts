import axios from "axios";
export async function signup({ username, password }: any) {
  try {
    console.log("inside signup");

    const response = await axios.post("http://localhost:3001/api/v1/signup", {
      username,
      password,
    });
    console.log(response, "response isher");

    const data = await response.data;
    console.log(data, "data is here");

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

export async function login({ username, password }: any) {
  try {
    const response = await axios.post("http://localhost:3001/api/v1/signin", {
      username,
      password,
    });

    const data = await response.data;
    console.log(data, "data is hers");

    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}
