"use client";
import React, { useEffect, useState } from "react";
import { GET } from "@/app/api/playlists/route";
import { PlaylistItem } from "@/components/playlist-item";
import { useRouter } from "next/navigation";
import { Playlist } from "@/interfaces/playlist";
import Link from "next/link";

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const res = await GET();
      const json = await res.json();
      setPlaylists(json);
      setLoading(false);
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {}, [loading]);

  return (
    <>
      <h1>Playlists</h1>
      {loading && <p>Loading...</p>}
      {playlists.map((item: Playlist, idx) => {
        return (
          <Link
            href={"/playlists/" + item.id}
            className="link-underline link-underline-opacity-0 text-black"
            key={idx}
          >
            <PlaylistItem playlist={item} />
          </Link>
        );
      })}
    </>
  );
}
