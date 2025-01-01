import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const mutation = useMutation({
  mutationFn: async (prompt: string) => {
    try {
      const response = await axios.post("http://localhost:8080/api/v1/ask", {
        prompt,
      });
      console.log(response, "is here");
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
});
