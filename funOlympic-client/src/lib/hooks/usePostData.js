import { useMutation } from "@tanstack/react-query";
import axios from "../utils/axios";

const usePostData = () => {
  return (url, values) => {
    return useMutation({
      mutationFn: (values) => {
        return axios.post(url, values);
      },
    });
  };
};

export default usePostData;
