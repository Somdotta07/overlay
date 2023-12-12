import React, { useRef, useEffect } from 'react';
import * as mp from '@mediapipe/selfie_segmentation';

const SegmentationComponent = () => {
  const videoRef = useRef();

  useEffect(() => {
    const runSegmentation = async () => {
      const selfieSegmentation = new mp.SelfieSegmentation({ modelSelection: 1 });
      const video = videoRef.current;

      try {
        video.src = '/path/to/your/video.mp4';

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;

        video.addEventListener('loadeddata', () => {
          selfieSegmentation.setInput(video);
          selfieSegmentation.onResults((results) => {
            // Access segmentation mask from results.segmentationMask
            // You can update the UI or apply the mask to the video frame here
          });

          setInterval(() => {
            selfieSegmentation.send({ image: video });
          }, 100);
        });
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    runSegmentation();
  }, []);

  return <video ref={videoRef} controls />;
};

export default SegmentationComponent;
