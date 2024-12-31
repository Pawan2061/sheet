import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto py-20 px-10 text-center space-y-6 max-w-6xl">
      <div>
        <h1 className="text-6xl font-semibold">
          The{" "}
          <span className="inline-block relative">
            simplest
            <img
              className="absolute left-0 top-full w-full"
              src="https://tally.so/images/demo/v2/title-highlight-2.png"
              alt=""
            />
          </span>{" "}
          to make a doc is tipTion
        </h1>
      </div>
      <h1 className="text-2xl font-semibold">Editor cum notion doc</h1>
      <h1 className="text-xl text-[#373725]">
        Make your own forms along with tipTion
      </h1>
      <div>
        <button
          onClick={() => {
            navigate(
              `/${`room.${new Date()
                .getFullYear()
                .toString()
                .slice(
                  -2
                )}${new Date().getMonth() + 1}${new Date().getDate()}-ok`}`
            );
          }}
          className="bg-[#0070D7] hover:bg-blue-600 py-2 text-white rounded-lg px-2"
        >
          Create a free doc
        </button>
      </div>
      <div className="shadow-2xl rounded-lg h-full">
        <div className="flex justify-start border-gray-100 py-6 px-2 border-b-2"></div>
        <div className="relative w-full h-full overflow-hidden">
          <video
            className="rounded-xl"
            muted
            loop
            autoPlay
            height="100%"
            width="100%"
            src="https://tally.so/videos/demo/intro.mp4#t=15&autoplay=1&controls=0"
          ></video>
        </div>
      </div>
    </section>
  );
}
