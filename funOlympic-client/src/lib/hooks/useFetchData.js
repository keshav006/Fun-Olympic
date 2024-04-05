import axios from "../utils/axios";

const useFetchData = (queryKey, url) => {
  return useQuery([queryKey], async () => {
    const { data } = await axios.get(url);
    return data;
  });
};

export default useFetchData;
