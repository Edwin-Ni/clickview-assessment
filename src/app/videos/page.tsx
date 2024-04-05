"use client";
import React, { useEffect, useState } from "react";
import { GET } from "@/app/api/videos/route";
import VideoItem from "@/components/video-item";
import { Spinner } from "react-bootstrap";

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

  // TODO: Add ability to add to playlist via dropdown with on hover effect

  return (
    <>
      <h1>Videos</h1>
      {loading && <Spinner />}
      {videos.map((item, idx) => {
        return <VideoItem video={item} key={idx} />;
      })}
    </>
  );
}
