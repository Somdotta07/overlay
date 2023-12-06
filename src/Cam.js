import React, { useEffect, useRef, useState } from "react";
import overlay from "./assets/background.webm";
import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

const Cam = () => {
  const canvasRef = useRef(null);
  const blendedVideoRef = useRef(null);
  const overlayVideoRef = useRef(null);
  const [webcamActive, setWebcamActive] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameras, setCameras] = useState([]);
  const selfieSegmentationRef = useRef();

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

  useEffect(() => {
    selfieSegmentationRef.current = new SelfieSegmentation({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
      },
    });
  }, []);

  const toggleWebcam = async () => {
    try {
      if (!webcamActive && selectedCamera) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedCamera.deviceId },
        });
        blendedVideoRef.current.srcObject = stream;

        // Run segmentation on the webcam stream
        selfieSegmentationRef.current.setOptions({
          input: { width: 640, height: 480 },
          selfieMode: false,
          modelSelection: 1,
        });

        selfieSegmentationRef.current.onRuntimeInitialized = () => {
          selfieSegmentationRef.current.setInputSize(640, 480);
          selfieSegmentationRef.current.setVideoElement(blendedVideoRef.current);
        };

        selfieSegmentationRef.current.send({ image: blendedVideoRef.current });
      } else {
        const srcObject = blendedVideoRef.current.srcObject;
        if (srcObject) {
          const tracks = srcObject.getTracks();
          tracks.forEach((track) => track.stop());
        }
      }

      setWebcamActive(!webcamActive);
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const addOverlay = () => {
    const defaultOverlayURL = overlay;
    overlayVideoRef.current.src = defaultOverlayURL;
  };

  const handleCameraChange = (event) => {
    const selectedDeviceId = event.target.value;
    const selectedCamera = cameras.find(
      (camera) => camera.deviceId === selectedDeviceId
    );
    setSelectedCamera(selectedCamera);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    // Start updating the canvas
    const updateCanvas = () => {
      if (webcamActive) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
  
        // Draw the segmentation mask on the canvas
        const segmentationResults = selfieSegmentationRef.current?.results;
        console.log(segmentationResults)
        if (segmentationResults && segmentationResults.segmentationMask) {
          const segmentationMask = segmentationResults.segmentationMask;
          console.log(segmentationMask)
          ctx.drawImage(segmentationMask, 0, 0, canvas.width, canvas.height);
        }
  
        // Draw the blended video on the canvas
        ctx.globalAlpha = 0.7; // Adjust the transparency as needed
        ctx.drawImage(
          blendedVideoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
        ctx.globalAlpha = 1;
  
        // Get the overlay video frame
        ctx.drawImage(
          overlayVideoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }
  
      // Schedule the next frame update
      requestAnimationFrame(updateCanvas);
    };
  
    // Start updating the canvas
    updateCanvas();
  }, [canvasRef, webcamActive, selfieSegmentationRef]);

  return (
    <div className="overlay-container">
      {/* Dropdown for selecting the webcam */}
      <select onChange={handleCameraChange}>
        <option value="">Select Camera</option>
        {cameras.map((camera) => (
          <option key={camera.deviceId} value={camera.deviceId}>
            {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
          </option>
        ))}
      </select>

      {/* Button to toggle the webcam */}
      {selectedCamera && (
        <div>
          <button onClick={toggleWebcam}>
            {webcamActive ? "Turn Off Webcam" : "Turn On Webcam"}
          </button>
          <button onClick={addOverlay}>Add Overlay</button>
        </div>
      )}

      {/* Canvas for overlay effect */}
      <canvas
        ref={canvasRef}
        className="overlay-canvas"
        width="480"
        height="280"
      />

      {/* New video element for the blended video (webcam stream) */}
      <video
        ref={blendedVideoRef}
        controls
        width="320"
        height="180"
        autoPlay
        style={{ display: "none" }}
      />

      {/* New video element for the overlay video */}
      <video
        ref={overlayVideoRef}
        controls
        width="320"
        height="180"
        autoPlay
        style={{ display: "none" }}
      />
    </div>
  );
};

export default Cam;

