"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import OTPInputBox from "@/components/Otp";

export default function VerifyModal({
  open,
  handleChange,
  email,
  handleResendLink,
  handleVerifyClick,
}) {
  const [otp, setOtp] = useState("");

  const handleOTPChange = (otp) => {
    setOtp(otp);
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => handleChange(false)}
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
          <div className="hidden sm:fixed sm:inset-0 sm:block sm:bg-gray-500 sm:bg-opacity-75 sm:transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-105"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-105"
            >
              <Dialog.Panel className="flex w-full max-w-3xl transform text-left text-base transition sm:my-8">
                <div className="relative flex w-full flex-col overflow-hidden bg-white pb-8 pt-4 sm:rounded-lg sm:pb-6 lg:py-4">
                  <div className="flex items-center justify-between px-4 my-4 sm:px-6 lg:px-8">
                    <h2 className="text-lg font-poppins font-medium text-gray-900">
                      Please check your email
                    </h2>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500"
                      onClick={() => handleChange(false)}
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <section
                    aria-labelledby="summary-heading"
                    className="mt-auto sm:px-6 lg:px-8"
                  >
                    <div className="bg-gray-50 p-4 text-center sm:rounded-lg sm:p-6">
                      <h2 id="summary-heading" className="font-intel">
                        We have sent a 6-digit confirmation code to {email},
                        please enter the code in below box to verify your email.
                      </h2>

                      <div className="flow-root pt-5">
                        <OTPInputBox
                          otp={otp}
                          handleOTPChange={handleOTPChange}
                          noOfInputs={6}
                        />
                      </div>
                    </div>
                  </section>

                  <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
                    {/* <Button onClick={() => handleVerifyClick(otp)}>
                      Verify OTP
                    </Button> */}
                    <button
                      className="btn-primary font-intel"
                      onClick={() => handleVerifyClick(otp)}
                    >
                      Verify OTP
                    </button>
                  </div>
                  <Countdown minute={5} handleResendLink={handleResendLink} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

const Countdown = ({ minute, handleResendLink }) => {
  const initialSeconds =
    localStorage.getItem("countdownSeconds") || minute * 60;
  const [seconds, setSeconds] = useState(Number(initialSeconds));
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    localStorage.setItem("countdownSeconds", seconds.toString());
  }, [seconds]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  useEffect(() => {
    if (seconds <= 0) {
      setExpired(true);
    }
  }, [seconds]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes.toString().padStart(2, "0")} min ${remainingSeconds
      .toString()
      .padStart(2, "0")} sec`;
  };

  const handleResendClick = () => {
    setSeconds(minute * 60);
    setExpired(false);
    localStorage.setItem("countdownSeconds", (minute * 60).toString());
    handleResendLink();
  };

  return (
    <>
      {expired ? (
        <span className="text-center text-gray-700 text-small-regular mt-6">
          Didn&apos;t receive the code?{" "}
          <button className="underline" onClick={handleResendClick}>
            Resend Code
          </button>
        </span>
      ) : (
        <span className="text-center font-intel text-gray-700 text-small-regular mt-6">
          The verification code sent to your email expires in{" "}
          {formatTime(seconds)}
        </span>
      )}
    </>
  );
};
