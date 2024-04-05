"use client";

import Snackbar from '@/components/common/snackbar';
import axios from '@/lib/utils/axios';
import Link  from "next/link"
import { useQuery } from "@tanstack/react-query";
import { TrophyIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';


const Sports = () => {
  
  const fetchSports = async () => {
  const { data } = await axios.get("/category");
    return data?.payload.data
  }

const {data, isLoading, isError, error} = useQuery({
  queryKey: ["fetch-sports"],
  queryFn: fetchSports
})

if (isError) {
  Snackbar.error(error.response?.data?.message || error.message);
}

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data && data.map((sport) => (
        <li key={sport.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          
            <Link href={`/sports/${sport.id}`}>
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">{sport.sport}</h3>
                <span className="inline-flex flex-shrink-0 items-center rounded-full bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                  Watch Live
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">{sport.description}</p>
            </div>

            <img className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300" src={sport.imageUrl} alt="" />
          </div>
          </Link>
          
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <a href={`/sports/${sport.id}`} className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                  >
                  <CalendarDaysIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  Event Schedule
                </a>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={`/sports/${sport.id}`}
                  className=" relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  <TrophyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  See results
                </a>
              </div>
            </div>
          </div> 
        </li>
      ))}
      
    </ul>
    </div>
  );
}

export default Sports;