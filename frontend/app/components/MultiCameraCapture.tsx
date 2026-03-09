"use client";

import React, { useRef, useEffect, useState } from "react";
import { Camera } from "lucide-react";

interface MultiCameraCaptureProps {
    onCapture: (images: string[]) => void;
    requiredPhotos?: number;
}

export default function MultiCameraCapture({
    onCapture,
    requiredPhotos = 5,
}: MultiCameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let currentStream: MediaStream | null = null;
        const startCamera = async () => {
            try {
                currentStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false,
                });
                setStream(currentStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = currentStream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setHasError(true);
            }
        };

        startCamera();

        return () => {
            if (currentStream) {
                currentStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current && images.length < requiredPhotos) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

                const newImages = [...images, dataUrl];
                setImages(newImages);

                if (newImages.length === requiredPhotos) {
                    onCapture(newImages);
                }
            }
        }
    };

    const removePhoto = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
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
        <div className="flex flex-col space-y-4">
            <div className="relative w-full max-w-2xl mx-auto overflow-hidden bg-black rounded-lg aspect-video">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${images.length >= requiredPhotos ? 'opacity-50' : ''}`}
                ></video>
                <canvas ref={canvasRef} className="hidden"></canvas>

                {images.length < requiredPhotos && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                        <button
                            onClick={capturePhoto}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                        >
                            <Camera className="w-5 h-5" />
                            Capture Photo ({images.length} / {requiredPhotos})
                        </button>
                    </div>
                )}
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border-2 border-green-400 aspect-[3/4]">
                            <img src={img} alt={`Capture ${idx + 1}`} className="w-full h-full object-cover" />
                            <button
                                onClick={() => removePhoto(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    {[...Array(requiredPhotos - images.length)].map((_, idx) => (
                        <div key={`empty-${idx}`} className="bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 aspect-[3/4] flex items-center justify-center">
                            <Camera className="w-6 h-6 text-slate-300" />
                        </div>
                    ))}
                </div>
            )}

            {images.length === requiredPhotos && (
                <div className="text-center p-4 bg-green-50 text-green-700 rounded-lg">
                    <p className="font-semibold">All {requiredPhotos} photos captured successfully!</p>
                    <p className="text-sm">Processing registration...</p>
                </div>
            )}
        </div>
    );
}
