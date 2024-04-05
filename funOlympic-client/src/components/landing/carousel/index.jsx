import { carouselItems } from "@/constants/data";
import { Carousel } from "flowbite-react";

function HomeCarousel() {
  return (
    <div className="h-56 sm:h-64 md:h-[80vh]">
      <Carousel>
        {carouselItems.map((item) => (
          <img src={item.src} alt={item.alt} />
        ))}
      </Carousel>
    </div>
  );
}

export function StatsSection() {
  return (
    <div className="bg-gray-50 pt-12 sm:pt-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-roboto font-bold tracking-tight text-gray-900 sm:text-4xl">
            Our <span className="italic text-orange-500">Performance</span>: By
            the Numbers
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4 font-roboto">
            A snapshot of our reliability and commitment to providing
            round-the-clock, exceptional service to a growing audience.
          </p>
        </div>
      </div>
      <div className="mt-10 bg-white pb-12 sm:pb-16">
        <div className="relative">
          <div className="absolute inset-0 h-1/2 bg-gray-50" />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <dl className="rounded-lg bg-white shadow-lg sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 font-inter sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 font-intel">
                    Uptime: Uninterrupted Service
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-orange-500 font-inter">
                    100%
                  </dd>
                </div>
                <div className="flex flex-col border-b border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 font-intel">
                    Customer Support: Always Available
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-orange-500 font-inter ">
                    24/7
                  </dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 font-intel sm:border-l">
                  <dt className="order-2 mt-2 text-lg font-medium leading-6 text-gray-500 font-intel">
                    Audience: Strong Community Base
                  </dt>
                  <dd className="order-1 text-5xl font-bold tracking-tight text-orange-500 font-intel">
                    100k
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeCarousel;
