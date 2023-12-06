// import React, { useEffect, useRef } from "react";

// const Overlay = () => {
//   const canvasRef = useRef(null);
//   const blendedVideoRef = useRef(null);
//   const mainVideoRef = useRef(null);
//   const overlayVideoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const updateCanvas = () => {
//       // Draw the main video on the canvas
//       ctx.drawImage(mainVideoRef.current, 0, 0, canvas.width, canvas.height);

//       // Get the overlay video frame
//       ctx.globalAlpha = 1; // Adjust the transparency as needed
//       ctx.drawImage(
//         overlayVideoRef.current,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );
//       ctx.globalAlpha = 1; // Reset the global alpha

//       // Schedule the next frame update
//       requestAnimationFrame(updateCanvas);
//     };

//     // Start updating the canvas
//     updateCanvas();

//     // Create a MediaStream from the canvas
//     const stream = canvas.captureStream();

//     // Set the MediaStream as the source for the blended video element
//     blendedVideoRef.current.srcObject = stream;

//     // Create a MediaRecorder
//     mediaRecorderRef.current = new MediaRecorder(stream);

//     // Handle data available event
//     mediaRecorderRef.current.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunksRef.current.push(event.data);
//       }
//     };

//     // Handle recording stopped event
//     mediaRecorderRef.current.onstop = () => {
//       // Combine all recorded chunks into one Blob
//       const blob = new Blob(recordedChunksRef.current, {
//         type: mediaRecorderRef.current.mimeType,
//       });

//       // Create a download link for the user
//       const downloadLink = document.createElement("a");
//       downloadLink.href = URL.createObjectURL(blob);
//       downloadLink.download = `blended_video.${blob.type.split("/")[1]}`;
//       downloadLink.click();

//       // Clear the recorded chunks array
//       recordedChunksRef.current.length = 0;
//     };

//     // Start recording when the component mounts
//     mediaRecorderRef.current.start();
//   }, [canvasRef]);

//   useEffect(() => {
//     // Stop recording when the component unmounts
//     return () => {
//       if (mediaRecorderRef.current.state === "recording") {
//         mediaRecorderRef.current.stop();
//       }
//     };
//   }, []);

//   const handleMainVideoChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);
//       mainVideoRef.current.src = url;
//     }
//   };

//   const handleOverlayVideoChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);
//       overlayVideoRef.current.src = url;
//     }
//   };

//   const handleSaveClick = () => {
//     // Stop recording
//     mediaRecorderRef.current.stop();
//   };

//   return (
//     <div className="overlay-container">
//       {/* Input for main video */}
//       <input type="file" accept="video/*" onChange={handleMainVideoChange} />

//       {/* Input for overlay video */}
//       <input type="file" accept="video/*" onChange={handleOverlayVideoChange} />

//       {/* Canvas for overlay effect */}
//       <canvas
//         ref={canvasRef}
//         className="overlay-canvas"
//         width="320"
//         height="180"
//       />

//       {/* New video element for the main video */}
//       <video
//         ref={mainVideoRef}
//         controls
//         width="320"
//         height="180"
//         style={{ display: "none" }}
//         autoPlay
//       />

//       {/* New video element for the overlay video */}
//       <video
//         ref={overlayVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "none" }}
//       />

//       {/* New video element for the blended video */}
//       <video
//         ref={blendedVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "block" }}
//       />

//       {/* Save button */}
//       <button onClick={handleSaveClick}>Save</button>
//     </div>
//   );
// };

// export default Overlay;

// import React, { useEffect, useRef } from "react";
// import JSZip from "jszip";

// const Overlay = () => {
//   const canvasRef = useRef(null);
//   const blendedVideoRef = useRef(null);
//   const mainVideoRef = useRef(null);
//   const overlayVideoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const recordedChunksRef = useRef([]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const updateCanvas = () => {
//       // Draw the main video on the canvas
//       ctx.drawImage(
//         mainVideoRef.current,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );

//       // Get the overlay video frame
//       ctx.globalAlpha = 1; // Adjust the transparency as needed
//       ctx.drawImage(
//         overlayVideoRef.current,
//         0,
//         0,
//         canvas.width,
//         canvas.height
//       );
//       ctx.globalAlpha = 1; // Reset the global alpha

//       // Schedule the next frame update
//       requestAnimationFrame(updateCanvas);
//     };

//     // Start updating the canvas
//     updateCanvas();

//     // Create a MediaStream from the canvas
//     const stream = canvas.captureStream();

//     // Set the MediaStream as the source for the blended video element
//     blendedVideoRef.current.srcObject = stream;

//     // Create a MediaRecorder
//     mediaRecorderRef.current = new MediaRecorder(stream);

//     // Handle data available event
//     mediaRecorderRef.current.ondataavailable = (event) => {
//       if (event.data.size > 0) {
//         recordedChunksRef.current.push(event.data);
//       }
//     };

//     // Handle recording stopped event
//     mediaRecorderRef.current.onstop = () => {
//       // Combine all recorded chunks into one Blob
//       const blob = new Blob(recordedChunksRef.current, {
//         type: mediaRecorderRef.current.mimeType,
//       });

//       // Create a download link for the user
//       const downloadLink = document.createElement("a");
//       downloadLink.href = URL.createObjectURL(blob);
//       downloadLink.download = `blended_video.${blob.type.split("/")[1]}`;
//       downloadLink.click();

//       // Clear the recorded chunks array
//       recordedChunksRef.current.length = 0;
//     };

//     // Start recording when the component mounts
//     // mediaRecorderRef.current.start();
//   }, [canvasRef]);

//   useEffect(() => {
//     // Stop recording when the component unmounts
//     return () => {
//       if (mediaRecorderRef.current.state === "recording") {
//         mediaRecorderRef.current.stop();
//       }
//     };
//   }, []);

//   const handleMainVideoChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);
//       mainVideoRef.current.src = url;
//     }
//   };

//   const handleOverlayVideoChange = async (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);

//       // Handle zip file
//       if (file.type === "application/zip") {
//         const zip = new JSZip();

//         // Read the zip file
//         const zipData = await zip.loadAsync(file);

//         // Extract frames from the zip file and load them into the overlay video
//         const frameUrls = [];
//         zipData.forEach((relativePath, file) => {
//           const frameUrl = URL.createObjectURL(
//             new Blob([file.asArrayBuffer()], { type: file._data.mimeType })
//           );
//           frameUrls.push(frameUrl);
//         });

//         // Start loading frames into the overlay video
//         loadFramesToOverlay(frameUrls);
//       } else {
//         // Regular video file
//         overlayVideoRef.current.src = url;
//       }
//     }
//   };

//   const loadFramesToOverlay = (frameUrls) => {
//     let currentFrameIndex = 0;

//     const loadNextFrame = () => {
//       if (currentFrameIndex < frameUrls.length) {
//         overlayVideoRef.current.src = frameUrls[currentFrameIndex];
//         currentFrameIndex++;

//         // Load the next frame after a short delay (adjust as needed)
//         setTimeout(loadNextFrame, 100);
//       }
//     };

//     // Start loading frames
//     loadNextFrame();
//   };

//   return (
//     <div className="overlay-container">
//       {/* Input for main video */}
//       <input
//         type="file"
//         accept="video/*"
//         onChange={handleMainVideoChange}
//       />

//       {/* Input for overlay video */}
//       <input
//         type="file"
//         accept="video/*,application/zip"
//         onChange={handleOverlayVideoChange}
//       />

//       {/* Canvas for overlay effect */}
//       <canvas
//         ref={canvasRef}
//         className="overlay-canvas"
//         width="320"
//         height="180"
//       />

//       {/* New video element for the main video */}
//       <video
//         ref={mainVideoRef}
//         controls
//         width="320"
//         height="180"
//         style={{ display: "none" }}
//         autoPlay
//       />

//       {/* New video element for the overlay video */}
//       <video
//         ref={overlayVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "none" }}
//       />

//       {/* New video element for the blended video */}
//       <video
//         ref={blendedVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "block" }}
//       />
//     </div>
//   );
// };

// export default Overlay;
/*--------------------------------------------------------------Setting Webcam-----------------------------------*/


// import React, { useEffect, useRef } from "react";
// import { SelfieSegmentation } from "@mediapipe/selfie_segmentation";

// const Overlay = () => {
//   const canvasRef = useRef(null);
//   const blendedVideoRef = useRef(null);
//   const overlayVideoRef = useRef(null);
//   const selfieSegmentationRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const startWebcam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//         // Set the webcam stream as the source for the blended video element
//         blendedVideoRef.current.srcObject = stream;

//         // Initialize the SelfieSegmentation model
//         selfieSegmentationRef.current = new SelfieSegmentation({
//           locateFile: (file) => {
//             return `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`;
//           },
//         });

//         // Run the segmentation on each frame
//         blendedVideoRef.current.addEventListener("loadeddata", () => {
//           requestAnimationFrame(processWebcamStream);
//         });
//       } catch (error) {
//         console.error("Error accessing webcam:", error);
//       }
//     };

//     // Process each frame of the webcam stream
//     const processWebcamStream = async () => {
//       const video = blendedVideoRef.current;

//       if (video.readyState === video.HAVE_ENOUGH_DATA) {
//         // Ensure the video dimensions match the canvas dimensions
//         canvas.width = video.videoWidth;
//         canvas.height = video.videoHeight;

//         // Run the SelfieSegmentation model
//         const segmentation = await selfieSegmentationRef.current.send({
//           image: video,
//         });

//         // Draw the original video on the canvas
//         ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//         // Draw the segmented mask on the canvas
//         ctx.globalCompositeOperation = "source-in";
//         ctx.drawImage(segmentation, 0, 0, canvas.width, canvas.height);
//         ctx.globalCompositeOperation = "source-over";

//         // Schedule the next frame update
//         requestAnimationFrame(processWebcamStream);
//       }
//     };

//     // Start the webcam stream and processing
//     startWebcam();
//   }, [canvasRef]);

//   useEffect(() => {
//     // Stop the webcam stream and close the SelfieSegmentation model when the component unmounts
//     return () => {
//       const srcObject = blendedVideoRef.current.srcObject;

//       if (srcObject) {
//         const tracks = srcObject.getTracks();
//         tracks.forEach((track) => track.stop());
//       }

//       // Close the SelfieSegmentation model
//       if (selfieSegmentationRef.current) {
//         selfieSegmentationRef.current.close();
//       }
//     };
//   }, []);

//   const handleOverlayVideoChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);
//       overlayVideoRef.current.src = url;
//     }
//   };

//   return (
//     <div className="overlay-container">
//       {/* Input for overlay video */}
//       <input type="file" accept="video/*" onChange={handleOverlayVideoChange} />

//       {/* Canvas for overlay effect */}
//       <canvas ref={canvasRef} className="overlay-canvas" />

//       {/* New video element for the overlay video */}
//       <video
//         ref={overlayVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "none" }}
//       />

//       {/* New video element for the blended video (webcam stream) */}
//       <video
//         ref={blendedVideoRef}
//         controls
//         width="500"
//         height="380"
//         autoPlay
//         style={{ display: "flex",justifyContent:"center", alignItems:"center" }}
//       />
//     </div>
//   );
// };

// export default Overlay;
/*----------------------------------------------Using Tensorflow Library-----------------*/



// import React, { useEffect, useRef } from "react";
// import * as bodyPix from "@tensorflow-models/body-pix";

// const Overlay = () => {
//   const canvasRef = useRef(null);
//   const blendedVideoRef = useRef(null);
//   const foregroundOverlayVideoRef = useRef(null);
//   const backgroundOverlayVideoRef = useRef(null);
//   const mediaRecorderRef = useRef(null);
//   const bodyPixNetRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     // Function to handle the webcam stream
//     const startWebcam = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });

//         // Set the webcam stream as the source for the main video element
//         blendedVideoRef.current.srcObject = stream;

//         // Create a MediaRecorder

//         // Initialize BodyPix
//         bodyPixNetRef.current = await bodyPix.load();
//       } catch (error) {
//         console.error("Error accessing webcam:", error);
//       }
//     };

//     // Start the webcam stream
//     startWebcam();

//     // Start updating the canvas
//     const updateCanvas = async () => {
//       // Get the webcam video frame
//       ctx.drawImage(blendedVideoRef.current, 0, 0, canvas.width, canvas.height);

//       // Perform selfie segmentation
//       const segmentation = await bodyPixNetRef.current.segmentPerson(blendedVideoRef.current);

//       // Draw the background overlay video behind the person
//       ctx.save();
//       ctx.globalCompositeOperation = "destination-over";
//       ctx.drawImage(backgroundOverlayVideoRef.current, 0, 0, canvas.width, canvas.height);
//       ctx.restore();

//       // Draw the foreground overlay video on top of the person
//       ctx.globalAlpha = 1; // Adjust the transparency as needed
//       ctx.drawImage(foregroundOverlayVideoRef.current, 0, 0, canvas.width, canvas.height);
//       ctx.globalAlpha = 1; // Reset the global alpha

//       // Draw the person on top
//       ctx.save();
//       ctx.globalCompositeOperation = "source-over";
//       ctx.drawImage(segmentation, 0, 0, canvas.width, canvas.height);
//       ctx.restore();

//       // Schedule the next frame update
//       requestAnimationFrame(updateCanvas);
//     };

//     // Start updating the canvas
//     updateCanvas();
//   }, [canvasRef]);

//   useEffect(() => {
//     // Stop recording and close the webcam stream when the component unmounts
//     return () => {
//       if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
//         mediaRecorderRef.current.stop();
//       }

//       const srcObject = blendedVideoRef.current.srcObject;

//       if (srcObject) {
//         const tracks = srcObject.getTracks();
//         tracks.forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const handleForegroundOverlayVideoChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);
//       foregroundOverlayVideoRef.current.src = url;
//     }
//   };

//   const handleBackgroundOverlayVideoChange = (event) => {
//     const file = event.target.files[0];

//     if (file) {
//       const url = URL.createObjectURL(file);
//       backgroundOverlayVideoRef.current.src = url;
//     }
//   };

//   return (
//     <div className="overlay-container">
//       {/* Input for foreground overlay video */}
//       <input type="file" accept="video/*" onChange={handleForegroundOverlayVideoChange} />

//       {/* Input for background overlay video */}
//       <input type="file" accept="video/*" onChange={handleBackgroundOverlayVideoChange} />

//       {/* Canvas for overlay effect */}
//       <canvas ref={canvasRef} className="overlay-canvas" width="320" height="180" />

//       {/* New video element for the foreground overlay video */}
//       <video
//         ref={foregroundOverlayVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "none" }}
//       />

//       {/* New video element for the background overlay video */}
//       <video
//         ref={backgroundOverlayVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "none" }}
//       />

//       {/* New video element for the blended video (webcam stream) */}
//       <video
//         ref={blendedVideoRef}
//         controls
//         width="320"
//         height="180"
//         autoPlay
//         style={{ display: "block" }}
//       />
//     </div>
//   );
// };

// export default Overlay;

