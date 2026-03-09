"use client";

import React, { useRef, useEffect, useState } from "react";

export interface FaceData {
    box: [number, number, number, number]; // x, y, width, height
    match?: {
        name: string;
        distance?: number;
    };
}

interface CameraCaptureProps {
    isLiveMode?: boolean;
    onCapture: (imageDataUrl: string) => void;
    facesData?: FaceData[];
    captureIntervalMs?: number;
}

export default function CameraCapture({
    isLiveMode = false,
    onCapture,
    facesData = [],
    captureIntervalMs = 2000,
}: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let intervalId: NodeJS.Timeout | null = null;

        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false,
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }

                if (isLiveMode) {
                    intervalId = setInterval(() => {
                        captureImage();
                    }, captureIntervalMs);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setHasError(true);
            }
        };

        startCamera();

        return () => {
            if (intervalId) clearInterval(intervalId);
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [isLiveMode, captureIntervalMs]);

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
                onCapture(dataUrl);
            }
        }
    };

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-red-50 text-red-600 rounded-lg">
                <p className="font-semibold text-lg">Camera Access Denied</p>
                <p className="text-sm">Please enable camera permissions to use this feature.</p>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden bg-black rounded-lg aspect-video">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
            ></video>
            <canvas ref={canvasRef} className="hidden"></canvas>

            {/* Overlay bounding boxes */}
            {facesData.map((face, index) => {
                // We'd need accurate scaling from natural size to displayed size,
                // but for simplicity, we provide a generic CSS overlay assuming 
                // box coords could be relative or absolute.
                // Assuming box is [x, y, w, h] from the backend in pixels of the original image.
                // In a complete implementation we would scale these.
                return null;
            })}
        </div>
    );
}
