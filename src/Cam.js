import React, { useEffect, useRef, useState, useCallback } from "react";
import overlayVideo from "./assets/background.webm";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";
import "./App.css";


const WebcamPopup = ({ onClose, stream, streamVideoRef }) => {
 console.log( streamVideoRef)
  const [isCameraOn, setIsCameraOn] = useState(false);
  const overlayRef = useRef(null);
  const canvasRef = useRef(null);
  let selfieSegmentation;

  useEffect(() => {
    if (stream) {
      streamVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  const startCamera = async () => {
    try {
      streamVideoRef.current.srcObject = stream;
      streamVideoRef.current.style.display = 'none';
          setIsCameraOn(true);
            overlayRef.current.play();
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
      canvasRef.current.width = streamVideoRef.current.videoWidth;
      canvasRef.current.height = streamVideoRef.current.videoHeight;

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
      if (streamVideoRef.current) {
        const videoElement = streamVideoRef.current;

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
        streamVideoRef.current.play();
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
    <div className="webcam-popup-container">
      <div className="webcam-popup">
        <video
          ref={streamVideoRef}
          autoPlay
          muted
          playsInline
          width="640" height="480"
          className="webcam-popup-video"
        />
        <button onClick={startCamera}>Play overlay</button>
        <button onClick={onClose}>X</button>
        <video ref={overlayRef} width="640" height="480" className="webcam-popup-overlay" style={{ display: 'none' }} />
        <canvas ref={canvasRef} width="640" height="480" className="webcam-popup-canvas" />
      </div>
    </div>
  );

};


const Cam = () => {
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [webcamActive, setWebcamActive] = useState(false);
  const [webcamStream, setWebcamStream] = useState(null);
  const [showWebcamPopup, setShowWebcamPopup] = useState(false);
  const streamVideoRef = useRef(null);

  useEffect(() => {
    // Fetch the list of available cameras when the component mounts
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const toggleWebcam = async () => {
    try {
      if (!webcamActive && selectedCamera) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedCamera.deviceId },
        });
        console.log(stream)
        setWebcamStream(stream);
        setShowWebcamPopup(true);
      } else {
        if (webcamStream) {
          const tracks = webcamStream.getTracks();
          tracks.forEach((track) => track.stop());
        }
        setShowWebcamPopup(false);
      }
      setWebcamActive(!webcamActive);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const handleCameraChange = (event) => {
    const selectedDeviceId = event.target.value;
    const selectedCamera = cameras.find(
      (camera) => camera.deviceId === selectedDeviceId
    );
    setSelectedCamera(selectedCamera);
  };

  const handleCloseWebcamPopup = () => {
    if (webcamStream) {
      const tracks = webcamStream.getTracks();
      tracks.forEach((track) => track.stop());
      setWebcamStream(null);
    }
    setShowWebcamPopup(false);
  };




  return (
    <div className="overlay-container">
      <select onChange={handleCameraChange}>
        <option value="">Select Camera</option>
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
          </option>
        ))}
      </select>

      {selectedCamera && (
        <div>
          <button onClick={toggleWebcam}>
            Camera Preview
          </button>
          {/* Ensure showWebcamPopup is set to true when you want to display the popup */}
          {showWebcamPopup && (
            <WebcamPopup
              onClose={handleCloseWebcamPopup}
              stream={webcamStream}
              streamVideoRef={streamVideoRef}
            />
          )}
        </div>
      )}
    </div>
  );

};

export default Cam;




