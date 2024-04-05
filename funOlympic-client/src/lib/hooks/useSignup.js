"use client";

import { axiosAuth } from "../utils/axios";
import { useMutation } from "@tanstack/react-query";

const useSignup = () => {
  const { mutate, data, isError, error, isPending, isSuccess } = useMutation({
    mutationFn: (values) => {
      return signUp(values);
    },
  });

  const signUp = async ({ email, password, name, country, contact, sport }) => {
    const { data } = await axiosAuth.post("/auth/signup", {
      email,
      password,
      name,
      country,
      contact,
      sport,
    });
    return data;
  };

  return { mutate, data, isSuccess, isError, error, isPending };
};

export default useSignup;
