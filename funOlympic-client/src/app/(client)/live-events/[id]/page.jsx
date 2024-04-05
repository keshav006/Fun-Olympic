"use client";

import { useParams } from "next/navigation";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ReactPlayer from "react-player";
import Snackbar from "@/components/common/snackbar";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Avatar from "boring-avatars";
import ChatComponent from "@/components/livechat";

function EventDetails() {
  const { id } = useParams();
  const axios = useAxiosAuth();

  const fetchData = async () => {
    const { data } = await axios.get(`/event/${id}`);
    return data?.payload.data;
  };
  const {
    data: eventDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [`event-${id}`],
    queryFn: fetchData,
  });

  if (isError) {
    Snackbar.error(
      "Something went wrong, Please check your internet connection"
    );
    return;
  }
  const fetchEventData = async () => {
    const { data } = await axios("/event");
    return data?.payload?.data;
  };

  const { data } = useQuery({
    queryFn: fetchEventData,
    queryKey: ["fetch-events"],
  });

  //   const filteredData = data?.filter((event) => event.published);
  const filteredData = data;
  const commentMessages = eventDetail?.comments[0]?.message || null;

  const CommentSection = () => (
    <div>
      <CommentBox
        commentId={
          eventDetail?.comments?.length > 0 ? eventDetail.comments[0].id : null
        }
        eventId={id}
      />
      <br />
      {commentMessages && <Comment comments={commentMessages} />}
    </div>
  );

  const VideoDetails = () => (
    <>
      <ReactPlayer
        // playing={true}
        controls={true}
        url={eventDetail?.streamLink}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="flex justify-between bg-gray-100 rounded-2xl px-3 py-2 my-3">
        <h1 className="text-lg md:text-[20px] my-5 font-roboto font-bold leading-10 text-gray-900">
          {eventDetail?.eventTitle}
        </h1>
        <div className="px-3 py-2 my-5 w-fit h-fit text-sm font-roboto text-white bg-blue-500 rounded-full">
          {eventDetail?.category?.sport}
        </div>
      </div>
      <hr />
      {/* description */}
      <div className="my-2 font-roboto bg-gray-100 rounded-2xl px-3 py-2">
        <p className="my-2">
          <strong>Published At: </strong>
          {new Date(eventDetail?.updatedAt).toDateString()}
        </p>
        <p className="font-bold mb-1">Description: </p>
        {eventDetail?.description}
      </div>
    </>
  );

  const VideoSection = () => (
    <div className="w-fit ">
      <VideoDetails />

      {/* Comments sections */}
      <h3 className="mt-5 mb-2 font-roboto font-bold text-[20px]">
        {eventDetail.comments[0]?.message?.length || 0} Comments
      </h3>

      <hr />
      <CommentSection />
    </div>
  );

  const LoadingSection = () => (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <div className="flex gap-5">
        <div className="w-1/2 animate-pulse space-y-3">
          <div className="w-full h-80 bg-gray-200"></div>
          <div className="w-2/4 h-5 bg-gray-200"></div>
          <div className="w-3/4 h-5 bg-gray-200"></div>
          <div className="w-full h-5 bg-gray-200"></div>
          <div className="w-full h-5 bg-gray-200"></div>
          <div className="w-full h-5 bg-gray-200"></div>
          <br />
          <div className="w-2/4 h-5 bg-gray-200"></div>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200"></div>
            <div className="w-full h-52 bg-gray-200"></div>
          </div>
        </div>
        {/* right section */}
        <div className="w-1/2 space-y-3">
          <div className="w-80 h-6 animate-pulse bg-gray-200"></div>
          <div className="w-full h-96 animate-pulse bg-gray-200"></div>
          <br />
          <div className="w-80 h-6 animate-pulse bg-gray-200"></div>
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="animate-plus w-full h-72 bg-gray-200"></div>
            <div className="animate-plus w-full h-72 bg-gray-200"></div>
            <div className="animate-plus w-full h-72 bg-gray-200"></div>
            <div className="animate-plus w-full h-72 bg-gray-200"></div>
          </div>
        </div>
      </div>
      {/* <div className="font-sans text-2xl">Loading...</div> */}
    </div>
  );

  if (isLoading || isError) return <LoadingSection />;

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="flex flex-col lg:flex-row gap-5">
            {/* left side view */}
            <VideoSection />

            {/* right side view */}
            <div>
              <h2 className=" text-xl mb-3 font-intel font-bold leading-6 text-gray-900">
                Similar events
              </h2>
              <hr />
              {filteredData && <EventCard events={filteredData} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const EventCard = ({ events }) => {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-1 xl:grid-cols-1 xl:gap-x-8">
      {events.map((event) => (
        <div key={event.id} className="group relative">
          <Link
            className="flex gap-4 rounded-sm px-2 py-2 hover:bg-orange-100"
            href={`/live-events/${event.id}`}
          >
            <div className="aspect-h-1 aspect-w-1 w-1/2 overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-32">
              <img
                src={event.thumbnail}
                alt={event.eventTitle}
                className="h-full w-full object-fill lg:h-full lg:w-full"
              />
            </div>
            <div className="mt-4 flex gap-2 justify-between">
              <div>
                <h3 className="text-sm font-roboto font-bold text-gray-700">
                  <p>
                    <span aria-hidden="true" className="absolute inset-0" />
                    {event.eventTitle}
                  </p>
                </h3>
                <p className="mt-1 text-sm font-roboto text-gray-500">
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

function CommentBox({ eventId, commentId }) {
  const [comment, setComment] = useState("");
  const { data, status } = useSession();
  const queryClient = useQueryClient();

  const axios = useAxiosAuth();

  const postComment = async (comment) => {
    const { data } = axios.post("/message", comment);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: postComment,
    mutationKey: ["post-comment"],
    onSuccess: () => {
      setComment("");
      Snackbar.success("Comment posted successfully");
      queryClient.invalidateQueries([`event-${eventId}`]);
    },
    onError: (error) => {
      Snackbar.error("Failed to post comment");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment === "") {
      Snackbar.info("Cannot post an empty comment");
      return;
    }
    if (status !== "authenticated") {
      Snackbar.error("You need to be logged in to post a comment");
      return;
    }
    const body = {
      body: comment,
      eventId,
      type: "COMMENT",
      userId: data.user.id,
      commentId: commentId || "",
    };
    mutate(body);
  };
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="h-10 w-10">
          <Avatar
            size={48}
            name="Mary Harris"
            variant="beam"
            colors={["#92A1C6", "#146A7C", "#F0AB3D", "#C271B4", "#C20D90"]}
          />
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <form action="#" onSubmit={handleSubmit} className="relative">
          <div className="overflow-hidden font-roboto rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none font-roboto border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              onChange={(e) => setComment(e.target.value)}
              defaultValue={comment}
              value={comment}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5"></div>
            <div
              className="flex
             
            -shrink-0"
            >
              <button
                type="submit"
                className="inline-flex items-center font-roboto
                 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline 
                 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {isPending ? "Posting.." : "Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Comment({ comments }) {
  return (
    <div className="my-6">
      <h3 className="sr-only">Recent comments</h3>

      <div className="flow-root">
        <div
          className="-my-12 divide-y font-inter
         divide-gray-200"
        >
          {comments.map((comment) => (
            <div key={comment.id} className="py-10">
              <div className="flex font-roboto items-center">
                <div className="h-12 w-12">
                  <Avatar
                    size={48}
                    name="Margaret Brent"
                    variant="beam"
                    colors={[
                      "#92A1C6",
                      "#146A7C",
                      "#F0AB3D",
                      "#C271B4",
                      "#C20D90",
                    ]}
                  />
                </div>
                <div className="ml-4">
                  <h4 className="text-[13px] font-bold text-gray-900">
                    {comment.user.name}
                  </h4>
                  <div className="mt-1 flex items-center">
                    <p className="font-roboto text-xs">2 Days ago</p>
                  </div>
                </div>
              </div>
              <div
                className="mt-4 space-y-6 text-base italic text-gray-600"
                dangerouslySetInnerHTML={{ __html: comment.body }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
