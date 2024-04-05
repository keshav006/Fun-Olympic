"use client";

import clsx from "clsx";
import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useParams, useRouter } from "next/navigation";
import { Switch } from "@headlessui/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategorySelect } from "../page";
import { useQueryClient } from "@tanstack/react-query";
import Snackbar from "@/components/common/snackbar";
import Link from "next/link";

function EventDetails() {
  const { id } = useParams();
  const [updateState, setUpdateState] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [selectedKey, setSelectedKey] = useState("thumbnail");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [data, setData] = useState({});
  const [published, setPublished] = useState(true);
  const [liveChat, setLiveChat] = useState(true);
  const axios = useAxiosAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const fetchData = async () => {
    const { data } = await axios.get(`/event/${id}`);
    return data?.payload.data;
  };

  const updateDetails = async (data) => {
    const res = await axios.patch(`/event/${id}`, data);
    return res?.data?.payload.data;
  };

  const deleteEvent = async () => {
    const res = await axios.delete(`/event/${id}`);
    return res?.data?.payload.data;
  };

  const fetchCategories = async () => {
    const { data } = await axios.get("/category");
    return data?.payload.data;
  };

  const { data: categories } = useQuery({
    queryFn: fetchCategories,
    queryKey: ["fetch-categories"],
  });

  const {
    data: eventDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: fetchData,
  });

  const { isPending, mutate } = useMutation({
    mutationFn: updateDetails,
    mutationKey: ["update-event"],
    onSuccess: () => {
      Snackbar.success("Event updated successfully");
      queryClient.invalidateQueries([`event-${id}`]);
      router.push("/dashboard/events");
    },
    onError: () => {
      Snackbar.error(
        "Something went wrong, Please check your internet connection",
      );
    },
  });

  const { mutate: deleteEventMutation, isPending: deleteLoading } = useMutation(
    {
      mutationFn: deleteEvent,
      mutationKey: ["delete-event"],
      onSuccess: () => {
        Snackbar.success("Event deleted successfully");
        queryClient.invalidateQueries(["fetch-events"]);
      },
      onError: () => {
        Snackbar.error(
          "Something went wrong, Please check your internet connection",
        );
      },
    },
  );

  if (isError) {
    Snackbar.error(
      "Something went wrong, Please check your internet connection",
    );
    return;
  }

  useEffect(() => {
    if (eventDetail === undefined || eventDetail === null) return;
    setData({
      category: eventDetail.category.sport,
      title: eventDetail.eventTitle,
      description: eventDetail.description,
      thumbnail: eventDetail.thumbnail,
      "stream link": eventDetail.streamLink,
      "start date": eventDetail.startDate,
      "end date": eventDetail.endDate,
    });
    setPublished(eventDetail.published);
    setLiveChat(eventDetail.liveChatEnabled);
    setSelectedCategory(eventDetail.category);
  }, [eventDetail]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      category: selectedCategory?.sport,
    }));
  }, [selectedCategory]);

  const handleSubmit = async () => {
    if (Object.keys(updatedData).length < 1) {
      Snackbar.info("No changes made");
      return;
    }
    mutate({
      title: updatedData.title || data.eventTitle,
      description: updatedData.description || data.description,
      thumbnail: updatedData.thumbnail || data.thumbnail,
      streamLink: updatedData["stream link"] || data["streamLink"],
      startDate: updateDetails["start date"]
        ? new Date(updatedData["start date"]).toISOString()
        : data.startDate,
      endDate: updateDetails["end date"]
        ? new Date(updatedData["end date"]).toISOString()
        : data.endDate,
      published,
      liveChatEnabled: liveChat,
      category:
        selectedCategory?.id.toString() || eventDetail.category.id.toString(),
    });
  };

  const handleUpdateState = (key) => {
    setSelectedKey(key);
    setUpdateState(true);
  };

  const EventHeading = () => {
    return (
      <>
        <h2 className="text-lg font-bold leading-6 font-mono text-gray-900">
          Update event details
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500 font-intel">
          This information will be displayed publicly so be careful what you
          share.
        </p>
      </>
    );
  };

  const ButtonGroup = () => {
    return (
      <div className="flex items-center justify-between">
        <Link href="/dashboard/events" className="btn-normal">
          Cancel
        </Link>
        <button className="btn-primary" onClick={() => handleSubmit()}>
          {isPending ? "Saving changes..." : "Save changes"}
        </button>
      </div>
    );
  };
  if (isLoading) return <div className="font-sans text-2xl">Loading...</div>;
  return (
    <>
      <main className=" lg:flex-auto">
        <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
          <div>
            <div className="flex items-center justify-between">
              <EventHeading />
              <button
                onClick={() => deleteEventMutation()}
                className="btn-danger"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
            {eventDetail && categories && (
              <EventUpdate
                open={updateState}
                setOpen={setUpdateState}
                selectedKey={selectedKey}
                data={data}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                updatedData={updatedData}
                setUpdatedData={setUpdatedData}
              />
            )}

            {eventDetail && (
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm font-intel leading-6">
                {Object.keys(data).map((key) => {
                  if (key === "thumbnail") {
                    return (
                      <div key={key} className="pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 capitalize">
                          {key}
                        </dt>
                        <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                          {/* <div className="text-gray-900">Watch live match now</div> */}
                          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                            <img
                              className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                              src={`${data[key]}`}
                              alt={"Event thumbnail"}
                            />
                          </div>
                          <button
                            onClick={() => handleUpdateState(key)}
                            type="button"
                            className="font-semibold text-indigo-600 hover:text-indigo-500"
                          >
                            Update
                          </button>
                        </dd>
                      </div>
                    );
                  }
                  return (
                    <div key={key} className="pt-6 sm:flex">
                      <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6 capitalize">
                        {key}
                      </dt>
                      <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto ">
                        <div className="text-gray-900 ">
                          {updatedData[key] || data[key]}
                        </div>
                        <button
                          onClick={() => handleUpdateState(key)}
                          type="button"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Update
                        </button>
                      </dd>
                    </div>
                  );
                })}
              </dl>
            )}
          </div>

          {eventDetail && (
            <div>
              <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6 font-intel">
                <ToggleSwitch enabled={published} setEnabled={setPublished}>
                  Published
                </ToggleSwitch>
                <ToggleSwitch enabled={liveChat} setEnabled={setLiveChat}>
                  Live Chat
                </ToggleSwitch>
              </dl>
            </div>
          )}
          <ButtonGroup />
        </div>
      </main>
    </>
  );
}
const ToggleSwitch = ({ enabled, setEnabled, children }) => {
  return (
    <Switch.Group as="div" className="flex pt-6">
      <Switch.Label
        as="dt"
        className="w-64 flex-none pr-6 font-medium text-gray-900 capitalize"
        passive
      >
        {children}
      </Switch.Label>
      <dd className="flex flex-auto items-center justify-end">
        <Switch
          checked={enabled}
          onChange={setEnabled}
          className={clsx(
            "flex w-8 cursor-pointer rounded-full p-px ring-1 ring-inset ring-gray-900/5 transition-colors duration-200 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
            {
              "bg-indigo-600": enabled,
              "bg-gray-200": !enabled,
            },
          )}
        >
          <span
            aria-hidden="true"
            className={clsx(
              "h-4 w-4 transform rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 transition duration-200 ease-in-out",
              {
                "translate-x-3.5": enabled,
                "translate-x-0": !enabled,
              },
            )}
          />
        </Switch>
      </dd>
    </Switch.Group>
  );
};

const EventUpdate = ({
  open,
  setOpen,
  data,
  updatedData,
  setUpdatedData,
  selectedKey,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => {
  const cancelButtonRef = useRef(null);
  const [changedData, setChangedData] = useState("");
  useEffect(() => {
    return () => {
      setChangedData("");
    };
  }, []);

  const handelSubmit = () => {
    if (changedData !== data[selectedKey]) {
      setUpdatedData((prev) => ({
        ...prev,
        [selectedKey]: changedData,
      }));
    }
    if (updatedData[selectedKey] && updatedData[selectedKey] !== changedData) {
      setUpdatedData((prev) => ({
        ...prev,
        [selectedKey]: changedData,
      }));
    }
    setOpen(false);
  };

  const handleUpdate = (e) => {
    setChangedData(e.target.value);
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

        <div className="fixed inset-0 z-10 overflow-y-auto">
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:max-h-72">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-900"
                    >
                      Update {selectedKey}
                    </Dialog.Title>
                    <div className="mt-2">
                      {selectedKey === "category" ? (
                        <CategorySelect
                          categories={categories}
                          selectedPerson={selectedCategory}
                          setSelectedPerson={setSelectedCategory}
                        />
                      ) : (
                        <InputWithError
                          data={data}
                          updatedData={updatedData}
                          selectedKey={selectedKey}
                          handleChange={handleUpdate}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    onClick={() => handelSubmit()}
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
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

const InputWithError = ({ data, selectedKey, updatedData, handleChange }) => {
  return (
    <div className="z-50">
      <label
        htmlFor={selectedKey}
        className="block capitalize text-left text-sm font-medium leading-6 text-gray-900 "
      >
        {selectedKey}
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          name={selectedKey}
          id={selectedKey}
          type={
            selectedKey.toLocaleLowerCase() === "start date" ||
            selectedKey.toLocaleLowerCase() === "end date"
              ? "datetime-local"
              : "text"
          }
          onChange={handleChange}
          className="block w-full rounded-md border-0 py-1.5 pr-10 text-blue-900 ring-1 ring-inset ring-blue-300 placeholder:text-blue-300 focus:ring-2 
          focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6"
          defaultValue={updatedData[selectedKey] || data[selectedKey]}
          aria-invalid="true"
        />
      </div>
    </div>
  );
};

export default EventDetails;
