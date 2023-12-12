import React, { useState, useEffect, useRef } from 'react';
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import overlayVideo from "./assets/background.webm";

const WebcamSegmentation = () => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  let selfieSegmentation;

  const startCamera = async () => {
    try {
      const constraints = { video: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      videoRef.current.srcObject = stream;
      setIsCameraOn(true);
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    videoRef.current.srcObject = null;
    setIsCameraOn(false);
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

      // Ensure overlay video is loaded before playing
      overlayRef.current.addEventListener('loadeddata', () => {
        overlayRef.current.play();
      });

      overlayRef.current.src = overlayVideo;
      selfieSegmentation.onResults((results) => {
        // Create an off-screen canvas
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvas.width = canvasRef.current.width;
        offscreenCanvas.height = canvasRef.current.height;

        // Draw the segmentation mask without any blending mode A
        offscreenCtx.drawImage(results.segmentationMask, 0, 0, canvasRef.current.width, canvasRef.current.height);

        offscreenCtx.save();
        //Camera Stream
        const imageDataMask = offscreenCtx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataMask = imageDataMask.data;

        offscreenCtx.globalCompositeOperation = "source-over";

        // Draw the original image (camera stream)
        offscreenCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);



        const imageDataOrg = offscreenCtx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
        const dataOrg = imageDataOrg.data;


        // Draw the Overlay(camera stream)

        offscreenCtx.drawImage(overlayRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);


        offscreenCtx.restore();

        // Get the image data of the entire canvas
        const imageData = offscreenCtx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Access the pixel data
        const data = imageData.data;

        // Define the RGB values for the red color you want to make transparent
        const red = 0;
        const green = 0;
        const blue = 0;

        // Loop through each pixel and set the alpha value to 0 for the red color
        for (let i = 0; i < dataMask.length; i += 4) {
          if (dataMask[i] > red && dataMask[i + 1] === green && dataMask[i + 2] === blue) {

            data[i] = dataOrg[i]; data[i + 1] = dataOrg[i + 1]; data[i + 2] = dataOrg[i + 2];
          }
        }

        // Put the modified image data back onto the canvas
        offscreenCtx.putImageData(imageData, 0, 0);

        ctx.drawImage(offscreenCanvas, 0, 0);


      });
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
      if (isCameraOn) {
        await setupSelfieSegmentation();
        videoRef.current.play();

        const intervalId = setInterval(segmentFrame, 1000 / 30);

        // Cleanup function
        return () => {
          clearInterval(intervalId);

          if (selfieSegmentation) {
            selfieSegmentation.close();
          }
        };
      }
    };

    setup();
  }, [isCameraOn]);

  return (
    <div>
      <video ref={videoRef} width="640" height="480" autoPlay playsInline muted style={{ display: 'none' }}></video>
      <video ref={overlayRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} width="640" height="480"></canvas>

      {!isCameraOn && (
        <button onClick={startCamera}>Play overlay</button>
      )}

      {isCameraOn && (
        <button onClick={stopCamera}>Stop overlay</button>
      )}
    </div>
  );
};

export default WebcamSegmentation;
