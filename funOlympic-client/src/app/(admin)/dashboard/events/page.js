"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import Input from "@/components/common/input";
import axios from "@/lib/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import Snackbar from "@/components/common/snackbar";
import { Switch } from "@headlessui/react";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";

export default function EventPage() {
  const [newEvent, setNewEvent] = useState(false);
  const fetchData = async () => {
    const { data } = await axios("/event");
    return data?.payload?.data;
  };
  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchData,
    queryKey: ["fetch-events"],
  });

  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      <div className="flex items-center justify-between ">
        <AddNewEventBox open={newEvent} setOpen={setNewEvent} />
        <div className="sm:flex-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-base font-bold leading-6 text-gray-900">
              All Event List
            </h1>
            <button onClick={() => setNewEvent(true)} className="btn-primary">
              Add Event
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {data && <Event events={data} />}
          {data?.length === 0 && <p>No events available</p>}
        </div>
      </div>
    </div>
  );
}

const Event = ({ events }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {events.map((event) => (
        <div key={event.id} className="group  relative">
          <Link href={`events/${event.id}`}>
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-72">
              <img
                src={event.thumbnail}
                alt={event.eventTitle}
                className="h-full w-full object-contain object-fill lg:h-full lg:w-full"
              />
            </div>
            <div className="mt-4 flex gap-2 justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-700">
                  <p>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {event.eventTitle}
                  </p>
                </h3>
                <p className="mt-1 text-justify text-sm text-gray-500">
                  {event.description.slice(0, 100)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

const AddNewEventBox = ({ open, setOpen }) => {
  const cancelButtonRef = useRef(null);
  const [published, setPublished] = useState(false);
  const [liveChat, setLiveChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm();
  const authAxios = useAxiosAuth();
  const { errors, isSubmitting, isValid } = formState;

  const fetchCategories = async () => {
    const { data } = await authAxios.get("/category");
    return data?.payload.data;
  };

  const { data: categories } = useQuery({
    queryFn: fetchCategories,
    queryKey: ["fetch-categories"],
  });

  const createEvent = async (details) => {
    const { data } = await authAxios.post("/event", details);
    return data?.payload.data;
  };

  const { mutate } = useMutation({
    mutationFn: createEvent,
    mutationKey: ["create-event"],
    onSuccess: () => {
      Snackbar.success("New event created successfully.");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["fetch-events"] });
    },
    onError: (error) => {
      Snackbar.error("Something went wrong, please try again later.");
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!selectedCategory) return Snackbar.error("Please select a category");
    console.log(new Date(data["start-date"]).toISOString());
    mutate({
      title: data.title,
      description: data.description,
      thumbnail: data.thumbnail,
      startDate: new Date(data["start-date"]).toISOString(),
      endDate: new Date(data["end-date"]).toISOString(),
      liveChatEnabled: liveChat,
      published,
      categoryId: `${selectedCategory?.id}`,
      streamLink: data.streamLink,
    });
  });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        initialFocus={cancelButtonRef}
        onClose={() => {
          Snackbar.info("Please click on cancel button to close the dialog");
        }}
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
              <Dialog.Panel
                onSubmit={onSubmit}
                as="form"
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl"
              >
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-bold leading-6 text-gray-900"
                      >
                        Create new event
                      </Dialog.Title>
                      <hr className="mt-2" />
                      <div className="mt-2 space-y-7 w-full">
                        <Input
                          className="input"
                          label="Event Title"
                          id="title"
                          name="title"
                          type="text"
                          autoComplete="title"
                          errors={errors}
                          {...register("title", {
                            required: "Event title is required",
                          })}
                        />
                        <Input
                          className="input"
                          label="Description"
                          id="description"
                          name="description"
                          type="text"
                          autoComplete="description"
                          errors={errors}
                          {...register("description", {
                            required: "Description is required",
                          })}
                        />
                        <CategorySelect
                          categories={categories}
                          selectedPerson={selectedCategory}
                          setSelectedPerson={setSelectedCategory}
                        />

                        <div className="flex items-center gap-x-3 flex-col md:flex-row space-y-6 md:space-y-0 ">
                          <div className="w-full">
                            <Input
                              className="input"
                              label="Event Start Date"
                              id="start-date"
                              name="start-date"
                              type="datetime-local"
                              autoComplete="start-date"
                              errors={errors}
                              {...register("start-date", {
                                required: "Start Date is required",
                              })}
                            />
                          </div>
                          <div className="w-full">
                            <Input
                              className="input"
                              label="Event End Date"
                              id="end-date"
                              name="end-date"
                              type="datetime-local"
                              autoComplete="end-date"
                              errors={errors}
                              {...register("end-date", {
                                required: "End Date is required",
                              })}
                            />
                          </div>
                        </div>
                        <Input
                          className="input"
                          label="Thumbnail Url"
                          id="thumbnail"
                          name="thumbnail"
                          type="text"
                          autoComplete="thumbnail"
                          errors={errors}
                          {...register("thumbnail", {
                            required: "Thumbnail is required",
                          })}
                        />
                        <Input
                          className="input"
                          label="Stream Url"
                          id="streamLink"
                          name="streamLink"
                          type="text"
                          autoComplete="streamLink"
                          errors={errors}
                          {...register("streamLink", {
                            required: "Stream Url is required",
                          })}
                        />
                        <ToggleButton
                          enabled={published}
                          setEnabled={setPublished}
                        >
                          Publish
                        </ToggleButton>
                        <ToggleButton
                          enabled={liveChat}
                          setEnabled={setLiveChat}
                        >
                          Live Chat
                        </ToggleButton>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:gap-3 sm:flex-row-reverse sm:px-6">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-fit"
                    onClick={handleSubmit}
                    disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
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

function ToggleButton({ children, enabled, setEnabled }) {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label
          as="span"
          className="text-sm font-medium leading-6 text-gray-900"
          passive
        >
          {children}
        </Switch.Label>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={clsx(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2",
          {
            "bg-indigo-600": enabled,
            "bg-gray-200": !enabled,
          },
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            {
              "translate-x-5": enabled,
              "translate-x-0": !enabled,
            },
          )}
        />
      </Switch>
    </Switch.Group>
  );
}

export function CategorySelect({
  selectedPerson,
  setSelectedPerson,
  categories,
}) {
  const [query, setQuery] = useState("");
  const filterdCategories =
    query === ""
      ? categories
      : categories.filter((category) => {
          return category.id.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Combobox as="div" value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Label className="block text-sm font-medium leading-6 text-gray-900">
        Category
      </Combobox.Label>
      <div className="relative mt-2">
        <Combobox.Input
          className="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(category) => category?.sport}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filterdCategories.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filterdCategories.map((category) => (
              <Combobox.Option
                key={category.id}
                value={category}
                className={({ active }) =>
                  clsx("relative cursor-default select-none py-2 pl-8 pr-4", {
                    "bg-indigo-600 text-white": active,
                    "text-gray-900": !active,
                  })
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={clsx("block truncate", {
                        "font-semibold": selected,
                      })}
                    >
                      {category.sport}
                    </span>

                    {selected && (
                      <span
                        className={clsx(
                          "absolute inset-y-0 left-0 flex items-center pl-1.5",
                          {
                            "text-white": active,
                            "text-indigo-600": !active,
                          },
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
