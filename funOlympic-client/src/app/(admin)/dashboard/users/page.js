"use client";

import { Fragment, useRef, useState } from "react";
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";
import { Dialog, Transition } from "@headlessui/react";
import {
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Snackbar from "@/components/common/snackbar";
import Avatar from "boring-avatars";

export default function UserPage() {
  const axios = useAxiosAuth();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [userId, setUserId] = useState(null);

  const fetchUsers = async () => {
    const { data } = await axios.get("/user");
    return data?.payload.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["fetch-users"],
    queryFn: fetchUsers,
  });

  if (isError) {
    Snackbar.error(error.response?.data?.message || error.message);
  }

  const handleDeleteProcess = (id) => {
    setUserId(id);
    setConfirmDelete(true);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <DeleteDialog
        open={confirmDelete}
        setOpen={setConfirmDelete}
        userId={userId}
      />

      <UserHeading />

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {(isLoading || isError) && <LoadingTable />}
            {data && (
              <UserTable data={data} handleDelete={handleDeleteProcess} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const UserHeading = () => {
  return (
    <div className="flex items-center justify-between ">
      <div className="sm:flex-auto">
        <h1 className="text-base font-bold leading-6 text-gray-900">
          List of Users
        </h1>
      </div>
    </div>
  );
};

const UserTable = ({ data, handleDelete }) => {
  const cols = ["Contact", "Country", "Role"];
  /*
  return (
    <table className="min-w-full divide-y divide-gray-300 w-full">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Full Name
          </th>
          {cols.map((col) => (
            <th
              scope="col"
              className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
              key={col}
            >
              {col}
            </th>
          ))}

          <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
            <button className="sr-only">Delete</button>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((person) => (
          <UserTableItem
            key={person.id}
            handleDelete={handleDelete}
            person={person}
          />
        ))}
      </tbody>
    </table>
  );
    */

  return (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full"
    >
      {data.map((person) => (
        <li
          key={person.id}
          className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <div className="flex items-center flex-1 flex-col p-8">
            <Avatar
              size={90}
              name="Maya Angelou"
              variant="beam"
              colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
            />
            <h3 className="mt-6 text-sm font-medium text-gray-900">
              {person.name}
            </h3>
            <dl className="mt-1 flex flex-grow flex-col justify-between">
              <dt className="sr-only">Title</dt>
              <dd className="text-sm text-gray-500">{person.email}</dd>
              <dt className="sr-only">Role</dt>
              <dd className="mt-3">
                <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                  {person.roles}
                </span>
              </dd>
            </dl>
          </div>
          <div>
            <div className="-mt-px flex gap-2 divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <button className="btn-normal w-full !flex !items-center !justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  Make Admin
                </button>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <button
                  onClick={() => handleDelete(person.id)}
                  className="btn-primary !flex !items-center !justify-center gap-2 w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

const UserTableItem = ({ person, handleDelete }) => {
  const { id, name, email, phone, country, roles } = person;
  return (
    <tr>
      <td className="whitespace-nowrap py-5 pl-4 pr-3 text-sm sm:pl-0">
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            <img
              className="h-11 w-11 rounded-full"
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt={name}
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{name}</div>
            <div className="mt-1 text-gray-500">{email}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        <div className="text-gray-900">{phone}</div>
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {country}
      </td>
      <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500">
        {roles}
      </td>
      <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <button
          href="#"
          onClick={() => handleDelete(id)}
          className="block rounded-md bg-rose-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Remove<span className="sr-only">, {name}</span>
        </button>
      </td>
    </tr>
  );
};

const LoadingTable = () => {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex items-center gap-4">
        {Array.from({ length: 4 }).map((_, i) => {
          return <div key={i} className="bg-gray-500 h-5 w-full rounded"></div>;
        })}
      </div>

      {Array.from({ length: 4 }).map((_, i) => {
        return (
          <div key={i} className="flex items-center gap-4">
            {Array.from({ length: 4 }).map((_, i) => {
              return (
                <div
                  key={i}
                  className="bg-gray-400 h-3 w-full rounded-md"
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

const DeleteDialog = ({ open, setOpen, userId }) => {
  const axios = useAxiosAuth();
  const queryClient = useQueryClient();
  const cancelButtonRef = useRef(null);

  const deleteUser = async (id) => {
    const { data } = await axios.delete(`/user/${id}`);
    return data?.payload?.data;
  };

  const { isPending, isError, error, mutate } = useMutation({
    mutationFn: (id) => deleteUser(id),
    mutationKey: ["delete-user"],
    onSuccess: () => {
      Snackbar.success(`User deleted successfully`);
      queryClient.invalidateQueries({ queryKey: ["fetch-users"] });
    },
  });

  const handleDelete = (id) => {
    mutate(id);
    setOpen(false);
  };

  if (isError) {
    Snackbar.error(error.response?.data?.message || error.message);
  }

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
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Delete account
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Are you sure you want to delete account? All of your
                          data will be permanently removed. This action cannot
                          be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                    onClick={() => handleDelete(userId)}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
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
};
