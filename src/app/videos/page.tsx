"use client";
import React, { useEffect, useState } from "react";
import { GET } from "@/app/api/videos/route";
import VideoItem from "@/components/video-item";

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await GET();
      const json = await res.json();
      setVideos(json);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  useEffect(() => {}, [loading]);

  return (
    <>
      <h1>Videos</h1>
      {videos.map((item, idx) => {
        return <VideoItem video={item} key={idx} />;
      })}
    </>
  );
}
