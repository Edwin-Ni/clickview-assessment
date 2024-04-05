"use client";
import { GET as GetVideos } from "@/app/api/videos/route";
import { GET as GetPlaylists } from "@/app/api/playlists/route";
import React, { useEffect, useState } from "react";
import VideoItem from "@/components/video-item";
import { Playlist } from "@/interfaces/playlist";
import { Video } from "@/interfaces/video";

export default function PlaylistIdPage({ params }: { params: { id: string } }) {
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [vLoading, setVLoading] = useState(true);
  const [ploading, setPLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await GetVideos();
      const json = await res.json();
      setVideos(json);
      setVLoading(false);
    };
    const fetchPlaylists = async () => {
      const res = await GetPlaylists();
      const json = await res.json();
      for (const item in json) {
        if (json[item].id === parseInt(params.id)) {
          setPlaylist(json[item]);
          break;
        }
      }
      setPLoading(false);
    };
    fetchVideos();
    fetchPlaylists();
  }, []);

  return (
    <>
      <h1>{playlist?.name}</h1>
      <h3>{playlist?.description}</h3>

      {videos.map((item: Video, idx) => {
        if (playlist?.videoIds.includes(item.id)) {
          return <VideoItem video={item} key={idx} />;
        }
      })}
    </>
  );
}
