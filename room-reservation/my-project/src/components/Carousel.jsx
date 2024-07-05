import { useState } from "react";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import image1 from "../assets/images/room1.jpeg";
import image2 from "../assets/images/room2.jpeg";
import image3 from "../assets/images/room3.jpeg";
import image4 from "../assets/images/room4.jpeg";
import image5 from "../assets/images/room5.jpeg";
import image6 from "../assets/images/room6.jpeg";
import image7 from "../assets/images/room7.jpeg";
import image8 from "../assets/images/room8.jpeg";
import image9 from "../assets/images/room9.jpeg";
import image10 from "../assets/images/room10.jpeg";
import image11 from "../assets/images/room11.jpeg";
import image12 from "../assets/images/room12.jpeg";

export default function Carousel() {
  const imagesList = [
    {
      id: 1,
      src: image1,
      alt: "Image 1",
    },
    {
      id: 2,
      src: image2,
      alt: "Image 2",
    },
    {
      id: 3,
      src: image3,
      alt: "Image 3",
    },
    {
      id: 4,
      src: image4,
      alt: "Image 4",
    },
    {
      id: 5,
      src: image5,
      alt: "Image 5",
    },
    {
      id: 6,
      src: image6,
      alt: "Image 6",
    },
    {
      id: 7,
      src: image7,
      alt: "Image 7",
    },
    {
      id: 8,
      src: image8,
      alt: "Image 8",
    },
    {
      id: 9,
      src: image9,
      alt: "Image 9",
    },
    {
      id: 10,
      src: image10,
      alt: "Image 10",
    },
    {
      id: 11,
      src: image11,
      alt: "Image 11",
    },
    {
      id: 12,
      src: image12,
      alt: "Image 12",
    },
  ];
  const [current, setCurrent] = useState(0);

  const previousSlide = () => {
    if (current === 0) setCurrent(imagesList.length - 1);
    else setCurrent(current - 1);
  };

  const nextSlide = () => {
    if (current === imagesList.length - 1) setCurrent(0);
    else setCurrent(current + 1);
  };

  return (
    <div className="overflow-hidden relative">
      {/* image */}
      <div
        className="flex transition ease-out duration-40 w-full h-[550px]"
        style={{
          transform: `translateX(-${current * 100}%)`,
        }}
      >
        {imagesList.map((s) => {
          return (
            <img
              key={s.id}
              src={s.src}
              className="object-cover w-full"
            />
          );
        })}
        {/* <div key={s.id}>
        <img
          
          {imagesList.map((s) => {
            return (
              <img
                key={s.id}
                src={s.src}
                className="object-cover w-full"
              />
            );
          })}
          className="object-cover w-full"
          
        ></img>
        </div> */}
      </div>

      {/* Buttons */}
      <div className="absolute top-0 h-full w-full justify-between items-center flex text-white px-10 text-3xl">
        <button onClick={previousSlide}>
          <BsFillArrowLeftCircleFill />
        </button>
        <button onClick={nextSlide}>
          <BsFillArrowRightCircleFill />
        </button>
      </div>

      {/* Navigation Circles */}
      <div className="absolute bottom-0 py-5 flex justify-center gap-4 w-full">
        {imagesList.map((s, i) => {
          return (
            <div
              onClick={() => {
                setCurrent(i);
              }}
              key={"circle" + i}
              className={`rounded-full h-4 w-4 cursor-pointer ${
                i === current ? "bg-white" : "bg-gray-500"
              } `}
            ></div>
          );
        })}
        ;
      </div>
    </div>
  );
}
