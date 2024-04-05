"use client";

import { Fragment, useRef } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Snackbar from "@/components/common/snackbar";
import Input from "@/components/common/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoLink } from "@/constants/data";
import VerifyModal from "@/components/verifyOpt";
import { useMutation } from "@tanstack/react-query";
import { Transition, Dialog } from "@headlessui/react";
import axios from "@/lib/utils/axios";
import ReCAPTCHA from "react-google-recaptcha";
import { verifyCaptcha } from "@/action";
function LoginSection() {
  const { register, handleSubmit, formState } = useForm();
  const { errors, isSubmitting, isValid } = formState;
  const [error, setError] = useState("");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [credential, setCredential] = useState({});
  const recaptchaRef = useRef(null);
  const [isVerified, setIsverified] = useState(false);

  async function handleCaptchaSubmission(token) {
    // Server function to verify captcha
    await verifyCaptcha(token)
      .then(() => setIsverified(true))
      .catch(() => setIsverified(false));
  }

  const handleChange = (val) => {
    setOtpModal(val);
  };

  const handleResendClick = async () => {
    try {
      const res = await axios.post("/auth/send-reset-otp", {
        email: credential.email,
      });
      if (res?.status === 200) {
        Snackbar.success(
          "Complete Verification Process by entering OTP sent to your email"
        );
        setCredential({
          email,
        });
        return;
      }
    } catch {
      Snackbar.error("Something went wrong, Please try again later");
    }
  };

  const onSubmit = handleSubmit(async (credential) => {
    try {
      const res = await signIn("credentials", {
        email: credential.email,
        password: credential.password,
        redirect: false,
        callbackUrl: "/",
      });

      if (res?.error) {
        setError("Invalid Email or Password");
        Snackbar.error("Invalid Email or Password");
        return;
      }
      if (res?.ok) {
        Snackbar.success("Login Successful");
        router.push("/");
        router.refresh();
        return;
      }
    } catch (error) {
      Snackbar.error(
        "Something went wrong, Please check your internet connection"
      );
    }
  });

  const handleVerifyClick = async (otp) => {
    try {
      const payloadData = {
        email: credential.email,
        token: otp,
      };

      const res = await axios.post("/auth/verify-reset-otp", {
        ...payloadData,
      });
      if (res?.status === 200) {
        Snackbar.success("Password reset request send successfully!");
        localStorage.removeItem("countdownSeconds");
        setOpen(false);
        setOtpModal(false);
      }
    } catch (err) {
      if (err?.response?.status === 400) {
        Snackbar.error(
          "The provided verification code is either expired or invalid. Please try again!"
        );
        return;
      }
      Snackbar.error("Something went wrong, Please try again later");
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 relative flex-col justify-center px-6 py-12 lg:py-0 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <VerifyModal
            handleChange={handleChange}
            open={otpModal}
            email={credential?.email ?? ""}
            handleResendLink={handleResendClick}
            handleVerifyClick={handleVerifyClick}
          />
          <ResetModal
            setCredential={setCredential}
            setOtpModal={setOtpModal}
            setOpen={setOpen}
            open={open}
          />
          <img
            className="mx-auto h-20 w-auto"
            src={logoLink}
            alt="Fun-Olympic Logo"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
          {error && (
            <p className="text-red-500 absolute w-full m-auto left-0 right-0 text-sm text-center mt-4">
              {error}
            </p>
          )}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit} method="POST">
            <Input
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              errors={errors}
              {...register("email", { required: "Email is required" })}
            />

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => setOpen(true)}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                // required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                errors={errors}
                {...register(
                  "password",
                  {
                    required: "Password is required",
                  },
                  { minLength: 6 }
                )}
              />
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                ref={recaptchaRef}
                onChange={handleCaptchaSubmission}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={!(isValid && isVerified)}
                className="btn-primary"
              >
                {isSubmitting ? "Loading.." : "Sign in"}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              href="/register"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

function ResetModal({ setOpen, open, setCredential, setOtpModal }) {
  const cancelButtonRef = useRef(null);
  const [email, setEmail] = useState("");

  const sendOpt = async (email) => {
    const res = await axios.post("/auth/send-reset-otp", {
      email,
    });
    return res.data.payload;
  };

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: (data) => sendOpt(data),
    mutationKey: ["send-reset-otp"],
    onSuccess: () => {
      Snackbar.success(
        `Complete Verification Process by entering OTP sent to your email`
      );

      setCredential({
        email,
      });
      setOpen(false);
      setOtpModal(true);
    },
    onError: (error) => {
      Snackbar.error(error.response?.data?.message || error.message);
    },
  });

  const handleOptSend = (email) => {
    if (email === "") {
      Snackbar.info("Please enter your email address");

      return;
    }
    mutate(email);
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base mb-2 font-roboto font-semibold leading-6 text-gray-900"
                      >
                        Reset your account
                      </Dialog.Title>
                      <hr />
                      <div className="mt-2 w-full">
                        <InputWithError handleChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 gap-5 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handleOptSend(email)}
                    disabled={isPending}
                  >
                    {isPending ? "Sending..." : "Send Otp"}
                  </button>
                  <button
                    className="btn-normal"
                    type="button"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const InputWithError = ({ handleChange }) => {
  return (
    <div className="z-50">
      <label
        htmlFor="email"
        className="block capitalize text-left text-sm font-roboto font-medium leading-6 text-gray-900 "
      >
        Email
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          name="email"
          id="email"
          type="email"
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 pr-10 font-roboto text-blue-900 ring-1 ring-inset ring-blue-300 placeholder:text-gray-300 focus:ring-2 
          focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          aria-invalid="true"
          placeholder="example@gmail.com"
        />
      </div>
    </div>
  );
};

export default function Login() {
  return <LoginSection />;
}
