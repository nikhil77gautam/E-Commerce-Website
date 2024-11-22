import React from "react";
import SlideImg21 from "../../assets/slide-img-21.avif";
import SlideImg23 from "../../assets/slide-img-23.jpg";
import SlideImg24 from "../../assets/slide-img-24.avif";
import SlideImg30 from "../../assets/slider-img-30.webp";
import SlideImg29 from "../../assets/slider-img-29.avif";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const CarouselSlider = () => {
  return (
    <div className="main w-full py-0.5">
      <Carousel showThumbs={false} autoPlay infiniteLoop>
        <div>
          <img
            src={SlideImg29}
            alt="Slide29"
            className="object-fit w-full h-96"
          />
        </div>
        <div>
          <img
            src={SlideImg21}
            alt="Slide21"
            className="object-fit w-full h-96"
          />
        </div>
        <div>
          <img
            src={SlideImg30}
            alt="Slide30"
            className="object-fit w-full h-96"
          />
        </div>
        <div>
          <img
            src={SlideImg23}
            alt="Slide23"
            className="object-fit w-full h-96"
          />
        </div>
        {/* <div>
          <img
            src={SlideImg24}
            alt="Slide24"
            className="object-fitr w-full h-96"
          />
        </div> */}
      </Carousel>
    </div>
  );
};

export default CarouselSlider;
