"use client";

import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, useEffect, useRef, useState } from "react";
import Snackbar from "@/components/common/snackbar";
import { useMutation } from "@tanstack/react-query";
import { Transition, Dialog } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/20/solid";

export default function PasswordReset() {
  const axios = useAxiosAuth();
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => {
      setOpen(false);
      setSelectedUserId(null);
    };
  }, []);

  const fetchUsers = async () => {
    const { data } = await axios.get("/auth/reset-request");
    return data.payload.data.users;
  };

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["reset-request"],
    queryFn: fetchUsers,
  });
  const handleUpdate = (id) => {
    setSelectedUserId(id);
    setOpen(true);
  };

  if (isLoading) return <p className="font-roboto text-sm">Loading...</p>;

  return (
    <>
      <h1 className="text-[20px] font-semibold font-roboto mb-2">
        Password reset request
      </h1>
      <PasswordChangeModal
        userId={selectedUserId}
        open={open}
        setOpen={setOpen}
      />
      <hr />
      {users && users.length === 0 && <EmptyState />}

      {/* users && (
        <ul role="list" className="divide-y divide-gray-100">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between gap-x-6 py-5"
            >
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {user.name}
                  </p>
                  <p
                    className={
                      "rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset"
                    }
                  >
                    Pending
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                  <p className="whitespace-nowrap">
                    Requested on{" "}
                    <time dateTime={user.updatedAt}>
                      {new Date(user.updatedAt).toDateString()}
                    </time>
                  </p>
                  <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
                    <circle cx={1} cy={1} r={1} />
                  </svg>
                  <p className="truncate">By {user.email}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <button
                  onClick={() => handleUpdate(user.id)}
                  className="btn-primary"
                >
                  Change password<span className="sr-only">, {user.name}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) */}

      {users && (
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            {users.length > 0 && (
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell"
                  >
                    Requested on
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
            )}
            <tbody className="divide-y font-roboto divide-gray-200 bg-white">
              {users &&
                users.map((user) => {
                  return (
                    <tr key={user.id} className="">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {user.name}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {user.email}
                      </td>
                      <td className="hidden whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:table-cell">
                        {new Date(user.updatedAt).toDateString()}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="btn-primary "
                        >
                          Update password
                          <span className="sr-only">, {"dipesh"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function EmptyState() {
  return (
    <div className="text-center min-h-[60vh] flex items-center justify-center">
      <div className="">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          No password reset request
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          You can view the list of users when they start requesting...
        </p>
      </div>
    </div>
  );
}

function PasswordChangeModal({ open, setOpen, userId }) {
  const cancelButtonRef = useRef(null);
  const axios = useAxiosAuth();
  const [newPassword, setNewPassword] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      setNewPassword("");
    };
  }, []);

  const changePassword = async (details) => {
    const res = await axios.post("/auth/reset-password", details);
    return res.data.payload;
  };

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: (data) => changePassword(data),
    mutationKey: ["change-password"],
    onSuccess: () => {
      Snackbar.success(`Password updated successfully! `);
      queryClient.invalidateQueries({
        queryKey: ["reset-request"],
      });

      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      Snackbar.error(
        error.response?.data?.details[0]?.message ||
          error.message ||
          "Something went wrong!",
      );
    },
  });
  const handlePasswordChange = (id) => {
    if (newPassword === "") {
      Snackbar.info("Please enter your email address");

      return;
    }
    if (newPassword.length < 8) {
      Snackbar.info("Password must be of 8 character");
      return;
    }
    mutate({
      id: `${id}`,
      password: newPassword,
    });
  };

  const handleChange = (e) => {
    setNewPassword(e.target.value);
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
                        className="text-base font-roboto font-semibold leading-6 text-gray-900"
                      >
                        Update Password
                      </Dialog.Title>
                      <div className="mt-2 w-full">
                        <InputWithError handleChange={handleChange} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 gap-6 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => handlePasswordChange(userId)}
                    disabled={isPending}
                  >
                    {isPending ? "Updating..." : "Update now"}
                  </button>
                  <button
                    type="button"
                    className="btn-normal"
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
        htmlFor="password"
        className="block capitalize text-left text-sm font-medium leading-6 text-gray-900 "
      >
        Password
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          name="password"
          id="password"
          type="text"
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 pr-10 text-blue-900 ring-1 ring-inset ring-blue-300 placeholder:text-gray-300 focus:ring-2 
          focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          aria-invalid="true"
          placeholder="new password"
        />
      </div>
    </div>
  );
};
