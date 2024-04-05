"use client";

import { useState } from "react";
import axios from "@/lib/utils/axios";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import Link from "next/link";
import Snackbar from "@/components/common/snackbar";

export default function EventPage() {
  const fetchData = async () => {
    const { data } = await axios("/event");
    return data?.payload?.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryFn: fetchData,
    queryKey: ["fetch-events"],
  });

  const filteredData = data?.filter((event) => event.published);

  if (isError) return <p>Error: {error.message}</p>;
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="px-4 sm:px-6 lg:px-8 ">
          <div className="flex items-center justify-between ">
            <div className="sm:flex-auto">
              <h1 className="text-[20px] py-3 font-intel font-bold leading-6 text-gray-900">
                Upcoming events
              </h1>
              <hr />
              {isLoading && <p>Loading...</p>}
              {filteredData && <Event events={filteredData} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Event = ({ events }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {events.map((event) => (
        <div key={event.id} className="group relative">
          <Link href={`live-events/${event.id}`}>
            <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
              <img
                src={event.thumbnail}
                alt={event.eventTitle}
                className="h-full w-full object-fill lg:h-full lg:w-full"
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
                <p className="mt-1 text-sm text-gray-500">
                  {event.description.slice(0, 80)}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};
