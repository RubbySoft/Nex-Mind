import React, { useRef } from "react";
import gsap from "gsap";

const FloatingImage = () => {
  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -10;
    const rotateY = ((xPos - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#080808] pt-[2vw] overflow-hidden">
      <p className="font-general text-sm uppercase text-white mb-20">BestFriend</p>

      <div className="absolute z-30 pb-[31vw] pl-[36vw] text-white text-opacity-80">You</div>
      <div className="absolute z-30 pb-[17vw] pr-[30vw] text-white text-opacity-80">NexMind</div>

      <div className="story-img-container relative">
        {/* White Rectangle */}
        <div
          style={{
            position: "absolute",
            top: "5vh",
            left: "70vw",
            width: "10vw",
            height: "8vh",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            zIndex: 2,
            borderRadius: "30px",
            
          }}
        >

          <div className="text-black p-4">Hey NexMind, <br />How You doing?</div>

        </div>

        

        {/* White Rectangle */}

        <div
          style={{
            position: "absolute",
            bottom: "60vh",
            right: "68vw",
            width: "10vw",
            height: "8vh",
            backgroundColor: "rgba(0,0,0, 0.7)",
            zIndex: 2,
            borderRadius: "30px",
            
            
          }}
        >

          <div className="text-White p-4">Hello Suyash, <br />I'm Good</div>

        </div>

        
        
    
        <div className="story-img-mask">
          <div className="story-img-content">
            <img
              ref={frameRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseLeave}
              onMouseEnter={handleMouseLeave}
              src="/img/Bestfriend.jpg"
              alt="entrance.webp"
              className="object-contain"
              style={{ position: "relative", zIndex: 1 ,opacity: 0.5 }}
            />
          </div>
        </div>
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[30vw] rounded-[50px] bg-[#252525] p-2 flex items-center justify-between">
  <input
    type="text"
    placeholder="Message..."
    className="bg-[#252525] text-white placeholder:text-[#] focus:outline-none rounded-full px-4 py-2 flex-grow"
  />
  <button className="bg-[#252525] text-[#999999] px-4 py-2 rounded-full ml-2">Send</button>
</div>




      </div>
    </div>
  );
};
const BestFriend = () => {
  return (
    <div className="bg-black text-white h-screen">
      <FloatingImage /> {/* Floating image with animation */}
    </div>
  );
};

export default BestFriend;