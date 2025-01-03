import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, sheetState } from "../recoil/store";
import { useEffect, useRef, useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [sheetId, setSheetId] = useState("");
  const [sheet, setSheet] = useRecoilState(sheetState);
  const wrapperRef = useRef(null);
  const authdata = useRecoilValue(authState);

  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-expect-error
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleClick() {
    setShow(!show);
  }

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
      <div className="flex justify-center space-x-6">
        <button
          onClick={() => {
            navigate(
              `/${`room.${new Date().getFullYear().toString().slice(-2)}${new Date().getMonth() + 1}${new Date().getDate()}-ok`}`
            );
          }}
          className="bg-[#0070D7] hover:bg-blue-600 py-2 text-white rounded-lg px-2"
        >
          Create
        </button>
        <span className="text-xl text-[#373725]">&lt; A doc &gt;</span>
        <div className="relative" ref={wrapperRef}>
          <button
            onClick={handleClick}
            className="bg-[#0070D7] hover:bg-blue-600 py-2 text-white rounded-lg px-2"
          >
            Collab
          </button>
          {show && (
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-lg p-4 z-50">
              <h2 className="text-lg font-semibold mb-4">Enter Sheet ID</h2>
              <input
                type="text"
                placeholder="Sheet ID"
                value={sheetId}
                onChange={(e) => setSheetId(e.target.value)}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (sheetId && authdata.isAuthenticated) {
                    console.log(sheetId, "sheeid and auth data is", authdata);
                    localStorage.setItem("sheet", sheetId);
                    setSheet({
                      sheetName: sheetId,
                    });

                    navigate(`/collab/${sheetId}`);

                    setShow(false);
                  } else {
                    console.log("here mostly");

                    navigate("/join");
                  }
                }}
                className="w-full bg-[#0070D7] hover:bg-blue-600 py-2 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          )}
        </div>
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
