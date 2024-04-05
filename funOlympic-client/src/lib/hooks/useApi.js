"use client";
import { useCallback, useState } from "react";
import axios from "../utils/axios";

/**
 * @description A custom hook to handle API requests
 *
 * @returns {Object} - An object containing the following properties:
 * - loading: A boolean indicating if the request is still loading
 * - data: The data returned from the request
 * - error: A string containing the error message
 * - fetchData: A function to fetch data from the API
 * - post: A function to post data to the API
 * - update: A function to update data in the API
 * - remove: A function to remove data from the API
 * - patch: A function to patch data in the API
 *
 */
const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const fetchData = useCallback(async (url) => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setData(response.data);
      setError("");
      return response?.data;
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  const post = async (url, newData) => {
    try {
      setLoading(true);
      const res = await axios.post(url, newData);
      console.log("response", res);
      setData(res?.data);
      //      return res.data;
    } catch (err) {
      throw new Error(
        err?.response?.data?.details[0]?.message || err.message || err,
      );
    } finally {
      setLoading(false);
    }
  };

  const patch = async (url, id, newData) => {
    console.log(error.message);
    console.log(error.message);
    try {
      setLoading(true);
      const res = await axios.patch(`${url}/${id}`, newData);
      setError("");
      return res.data;
    } catch (err) {
      setError("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  const update = async (url, id, newData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${url}/${id}`, newData);
      setError("");
      return res.data;
    } catch (err) {
      setError("Error updating data");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (url, id) => {
    try {
      setLoading(true);
      const res = await axios.delete(`${url}/${id}`);
      setError("");
      return res.data;
    } catch (err) {
      setError("Error deleting data");
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, error, fetchData, post, update, remove, patch };
};

export default useApi;
