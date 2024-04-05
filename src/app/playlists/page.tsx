"use client";
import React, { useEffect, useState } from "react";
import { GET } from "@/app/api/playlists/route";
import { PlaylistItem } from "@/components/playlist-item";
import { Playlist } from "@/interfaces/playlist";
import Link from "next/link";
import { Button, Container, Spinner } from "react-bootstrap";

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

  // TODO: Add a modal with form to create a playlist, add dropdowns for playlists

  return (
    <>
      <h1>Playlists</h1>
      {loading && <Spinner />}
      {!loading && (
        <Container style={{ marginBottom: "2rem", padding: "0" }}>
          <Button variant="warning" onClick={() => {}} className="mt-2">
            Add a playlist
          </Button>
        </Container>
      )}

      {playlists.map((item: Playlist, idx) => {
        return (
          <Container key={idx}>
            <Link
              href={"/playlists/" + item.id}
              className="link-underline link-underline-opacity-0 text-black"
            >
              <PlaylistItem playlist={item} />
            </Link>
          </Container>
        );
      })}
    </>
  );
}
