import React, { useEffect, useRef } from 'react';
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import overlayVideo from "./assets/background.webm";

const WebcamSegmentation = () => {
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  let selfieSegmentation;

  const startCamera = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const setupSelfieSegmentation = async () => {
    try {
      selfieSegmentation = new SelfieSegmentation({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
      });
      selfieSegmentation.setOptions({
        modelSelection: 0,
      });

      const ctx = canvasRef.current.getContext('2d');

      await selfieSegmentation.initialize();
      console.log('SelfieSegmentation model initialized successfully');

      // Set canvas size based on video dimensions
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      // Ensure overlay video is loaded
      overlayRef.current.src = overlayVideo;
      overlayRef.current.play();

      selfieSegmentation.onResults((results) => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
        // Draw the original image (camera stream)
        ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
        // Draw the segmentation mask with 'source-over' composite operation
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(results.segmentationMask, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
        // Draw the overlay video
        ctx.drawImage(overlayRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      });
      /*-------------------------------------- No Segmentationmask ------------------------------------*/
      // selfieSegmentation.onResults((results) => {
      //   const ctx = canvasRef.current.getContext('2d');
      //   ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      //   // Draw the original image (camera stream)
      //   ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      //   // Draw the overlay video
      //   ctx.drawImage(overlayRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      // });
    } catch (error) {
      console.error('Error initializing SelfieSegmentation:', error);
    }
  };

  const segmentFrame = async () => {
    try {
      if (videoRef.current) {
        const videoElement = videoRef.current;

        // Draw the current frame onto the canvas
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Send the canvas as an image to SelfieSegmentation
        const image = new Image();
        image.width = canvasRef.current.width;
        image.height = canvasRef.current.height;
        image.src = canvasRef.current.toDataURL('image/png');

        await selfieSegmentation.send({ image });
      } else {
        console.error('No video element found');
      }
    } catch (error) {
      console.error('Error segmenting frame:', error);
    }
  };

  useEffect(() => {
    const setup = async () => {
      await startCamera();
      await setupSelfieSegmentation();
      videoRef.current.play();

      // Play overlay video when the camera stream is ready
      videoRef.current.addEventListener('play', () => {
        overlayRef.current.play();
      });

      const intervalId = setInterval(segmentFrame, 1000 / 30); // Update segmentation every 30 frames (adjust as needed)

      // Cleanup function
      return () => {
        clearInterval(intervalId);
        if (selfieSegmentation) {
          selfieSegmentation.close();
        }
      };
    };

    setup();
  }, []);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline muted style={{ display: "none"}}></video>
      <video ref={overlayRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
     
    </div>
  );
};

export default WebcamSegmentation;









